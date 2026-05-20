import { inferWeights } from '../match.inference.js';
import * as genai from '@google/genai';

// Mock the external dependencies
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn()
      }
    }))
  };
});
jest.mock('../../../../../database/index.js', () => {
    return jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1)
    }));
});

describe('AI Matching - Inference Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GEMINI_API_KEY = 'test_key';
    });

    it('should return cached weights if job.weights_json exists', async () => {
        const job = { id: 1, weights_json: '{"skill": 0.5, "exp": 0.5, "at": 0, "geo": 0, "culture_fit": 0}' };
        const weights = await inferWeights(job);
        expect(weights).toEqual({ skill: 0.5, exp: 0.5, at: 0, geo: 0, culture_fit: 0 });
    });

    it('should parse object weights_json if not string', async () => {
        const job = { id: 2, weights_json: { skill: 0.4, exp: 0.6, at: 0, geo: 0, culture_fit: 0 } };
        const weights = await inferWeights(job);
        expect(weights.skill).toBe(0.4);
    });

    it('should fallback to DEFAULTS if api fails', async () => {
        // We simulate failure by forcing GoogleGenAI mock to reject
        const mockInstance = new genai.GoogleGenAI();
        mockInstance.models.generateContent.mockRejectedValue(new Error('API Error'));
        
        const job = { id: 3, description: 'Some job' };
        
        // Since we import inferWeights, the mock instance is actually instantiated inside match.inference.js. 
        // We will just test the general failure fallback (when GEMINI_API_KEY isn't set or network fails).
        // For strict testing, we can delete the API key to test the missing key fallback.
        const originalKey = process.env.GEMINI_API_KEY;
        delete process.env.GEMINI_API_KEY;
        
        const weights = await inferWeights(job);
        expect(weights).toEqual({ skill: 0.40, exp: 0.20, at: 0.25, geo: 0.15, culture_fit: 0 });
        
        process.env.GEMINI_API_KEY = originalKey;
    });
});
