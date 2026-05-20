import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import knex from '../../../../database/index';

const WeightSchema = z.object({
    skill: z.number().min(0).max(1),
    exp: z.number().min(0).max(1),
    at: z.number().min(0).max(1),
    geo: z.number().min(0).max(1),
    culture_fit: z.number().min(0).max(1),
});

const DEFAULTS = { skill: 0.40, exp: 0.20, at: 0.25, geo: 0.15, culture_fit: 0 };
const weightCache = new Map();

const normalizeWeights = raw => {
    const parsed = WeightSchema.safeParse(raw);
    if (!parsed.success) return null;

    const total = Object.values(parsed.data).reduce((sum, value) => sum + value, 0);
    if (total <= 0) return null;

    return Object.fromEntries(Object.entries(parsed.data).map(([key, value]) => [key, value / total]));
};

// Initialize the Google Gen AI SDK
let ai = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.warn('Google Gen AI SDK initialization failed:', e);
}

export const inferWeights = async job => {
    if (job.id && weightCache.has(job.id)) return weightCache.get(job.id);

    if (job.weights_json) {
        try {
            const parsedWeights = typeof job.weights_json === 'string' ? JSON.parse(job.weights_json) : job.weights_json;
            const normalized = normalizeWeights(parsedWeights);
            if (normalized) {
                if (job.id) weightCache.set(job.id, normalized);
                return normalized;
            }
        } catch (error) {
            return DEFAULTS;
        }

        return DEFAULTS;
    }

    if (!ai) return DEFAULTS;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Bạn là chuyên gia tuyển dụng. Phân tích JD sau và trả về trọng số chấm điểm (tổng = 1.0).\n\n' +
      `JD: "${(job.description || job.title || '').slice(0, 800)}"\n\n` +
      '- skill: mức độ yêu cầu kỹ năng kỹ thuật cụ thể\n' +
      '- exp: mức độ yêu cầu kinh nghiệm năm tháng\n' +
      '- at: mức độ quan trọng của hỗ trợ accessibility\n' +
      '- geo: mức độ quan trọng của vị trí địa lý\n' +
      '- culture_fit: mức độ quan trọng của văn hóa, thái độ, soft skills ẩn',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        skill: { type: 'NUMBER' },
                        exp: { type: 'NUMBER' },
                        at: { type: 'NUMBER' },
                        geo: { type: 'NUMBER' },
                        culture_fit: { type: 'NUMBER' }
                    },
                    required: ['skill', 'exp', 'at', 'geo', 'culture_fit']
                }
            }
        });

        const raw = JSON.parse(response.text());
        const w = normalizeWeights(raw) || DEFAULTS;

        if (job.id) {
            knex('jobs').where({ id: job.id }).update({ weights_json: JSON.stringify(w) }).catch(() => {});
        }

        if (job.id) weightCache.set(job.id, w);
        return w;
    } catch (err) {
        console.error('Gemini inference failed:', err);
        return DEFAULTS;
    }
};
