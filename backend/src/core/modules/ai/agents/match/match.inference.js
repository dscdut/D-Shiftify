import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import knex from '../../../../database/index.js'; // Adjust path if needed

const WeightSchema = z.object({
  skill: z.number().min(0).max(1),
  exp: z.number().min(0).max(1),
  at: z.number().min(0).max(1),
  geo: z.number().min(0).max(1),
  culture_fit: z.number().min(0).max(1),
});

const DEFAULTS = { skill: 0.40, exp: 0.20, at: 0.25, geo: 0.15, culture_fit: 0 };
const weightCache = new Map();

// Initialize the Google Gen AI SDK
let ai = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.warn('Google Gen AI SDK initialization failed:', e);
}

export const inferWeights = async (job) => {
  if (weightCache.has(job.id)) return weightCache.get(job.id);

  if (job.weights_json) {
    const w = typeof job.weights_json === 'string' ? JSON.parse(job.weights_json) : job.weights_json;
    weightCache.set(job.id, w);
    return w;
  }

  if (!ai) return DEFAULTS;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Bạn là chuyên gia tuyển dụng. Phân tích JD sau và trả về trọng số chấm điểm (tổng = 1.0).\n\n` +
      `JD: "${(job.description || job.title || '').slice(0, 800)}"\n\n` +
      `- skill: mức độ yêu cầu kỹ năng kỹ thuật cụ thể\n` +
      `- exp: mức độ yêu cầu kinh nghiệm năm tháng\n` +
      `- at: mức độ quan trọng của hỗ trợ accessibility\n` +
      `- geo: mức độ quan trọng của vị trí địa lý\n` +
      `- culture_fit: mức độ quan trọng của văn hóa, thái độ, soft skills ẩn`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            skill: { type: "NUMBER" },
            exp: { type: "NUMBER" },
            at: { type: "NUMBER" },
            geo: { type: "NUMBER" },
            culture_fit: { type: "NUMBER" }
          },
          required: ["skill", "exp", "at", "geo", "culture_fit"]
        }
      }
    });

    const raw = JSON.parse(response.text());
    
    // Validate with Zod just to be safe
    const validated = WeightSchema.parse(raw);
    const total = Object.values(validated).reduce((s, v) => s + v, 0) || 1;
    const w = Object.fromEntries(Object.entries(validated).map(([k, v]) => [k, v / total]));

    if (job.id) {
        // Fire-and-forget update to DB if id exists
        knex('jobs').where({ id: job.id }).update({ weights_json: JSON.stringify(w) }).catch(() => {});
    }

    weightCache.set(job.id, w);
    return w;
  } catch (err) {
    console.error('Gemini inference failed:', err);
    return DEFAULTS;
  }
};
