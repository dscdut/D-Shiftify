import { GoogleGenAI } from '@google/genai';
import { inferWeights } from './match.inference.js';
import { hybridScore } from './match.scoring.js';
import knex from '../../../../database/index.js'; // Ensure this path points to knex instance

const MIN_SCORE = parseInt(process.env.MATCH_MIN_SCORE || '40', 10);
const TOP_K = parseInt(process.env.MATCH_TOP_K || '3', 10);

let ai = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {}

const explainMatch = async (profile, job, score, weights) => {
  if (!ai) return 'Phù hợp tốt với hồ sơ của bạn.';
  
  const dominantDimension = Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
  const dimensionLabel = {
    skill: 'kỹ năng chuyên môn', exp: 'kinh nghiệm', at: 'hỗ trợ tiếp cận',
    geo: 'vị trí địa lý', culture_fit: 'văn hóa và phong cách làm việc',
  }[dominantDimension] || 'hồ sơ';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Giải thích ngắn gọn (2 câu, thân thiện) tại sao ứng viên hợp với công việc.\n` +
      `Nhấn mạnh yếu tố: ${dimensionLabel}.\n` +
      `KHÔNG dùng số liệu kỹ thuật.\n\n` +
      `Công việc: ${job.title}\n` +
      `Kỹ năng ứng viên: ${(profile.skills || []).slice(0, 5).join(', ')}\n` +
      `Kỹ năng yêu cầu: ${(job.skills || []).slice(0, 5).join(', ')}`
    });
    return response.text();
  } catch (err) {
    return 'Phù hợp tốt với hồ sơ của bạn dựa trên kỹ năng và kinh nghiệm.';
  }
};

export const matchJobsForProfile = async (profileId) => {
  // 1. Fetch profile
  const profileRecord = await knex('profiles').where({ id: profileId }).first();
  if (!profileRecord || !profileRecord.narrative_embedding) {
    throw new Error('Profile not found or missing narrative_embedding');
  }
  const cvRecord = await knex('cvs').where({ profile_id: profileId }).first() || {};

  const profile = {
    ...profileRecord,
    skills: cvRecord.skills || [],
    experiences: cvRecord.experiences || []
  };

  // 2. Vector Search (ANN using pgvector)
  // Assumes jobs table has `embedding` column of type vector
  const candidates = await knex.raw(`
    SELECT *, 1 - (embedding <=> ?) AS semantic_score
    FROM jobs
    ORDER BY embedding <=> ?
    LIMIT ?
  `, [profile.narrative_embedding, profile.narrative_embedding, TOP_K * 5]);
  
  const jobList = candidates.rows || [];

  // 3. Dynamic Inference & Scoring
  const weightsMap = Object.fromEntries(
    await Promise.all(jobList.map(async (job) => [job.id, await inferWeights(job)]))
  );

  const scored = jobList
    .map((job) => {
      const semantic_score = parseFloat(job.semantic_score || 0);
      const weights = weightsMap[job.id];
      return {
        ...job,
        final_score: hybridScore(profile, job, semantic_score, weights),
        weights
      };
    })
    .filter((job) => job.final_score >= MIN_SCORE)
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, TOP_K);

  // 4. AI Explanation for top results
  const matches = await Promise.all(
    scored.map(async (job) => ({
      id: job.id,
      title: job.title,
      final_score: job.final_score,
      explanation: await explainMatch(profile, job, job.final_score, job.weights)
    }))
  );

  return matches;
};
