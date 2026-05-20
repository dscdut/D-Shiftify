import { matchJobsForProfile } from '../match.agent.js';
import * as inference from '../match.inference.js';
import * as scoring from '../match.scoring.js';
import knex from '../../../../../database/index.js';

jest.mock('../match.inference.js');
jest.mock('../match.scoring.js');
const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
};

jest.mock('../../../../../database/index.js', () => {
    const fn = jest.fn(() => mockQueryBuilder);
    fn.raw = jest.fn();
    return fn;
});

describe('AI Matching - Agent/Orchestrator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error if profile not found', async () => {
        mockQueryBuilder.first.mockResolvedValue(null);
        await expect(matchJobsForProfile('user1')).rejects.toThrow('Profile not found or missing narrative_embedding');
    });

    it('should throw error if profile missing narrative_embedding', async () => {
        mockQueryBuilder.first.mockResolvedValue({ id: 'user1' }); // missing narrative_embedding
        await expect(matchJobsForProfile('user1')).rejects.toThrow('Profile not found or missing narrative_embedding');
    });

    it('should fetch jobs, calculate scores, and return top matches', async () => {
        const mockProfile = { id: 'user1', narrative_embedding: '[0.1, 0.2]' };
        mockQueryBuilder.first.mockResolvedValue(mockProfile);
        
        // Mock knex.raw for vector search
        knex.raw = jest.fn().mockResolvedValue({
            rows: [
                { id: 'job1', title: 'Frontend Developer', semantic_score: 0.9 },
                { id: 'job2', title: 'Backend Developer', semantic_score: 0.7 }
            ]
        });

        // Mock inference weights
        inference.inferWeights.mockResolvedValue({ skill: 0.5, exp: 0.5, at: 0, geo: 0, culture_fit: 0 });
        
        // Mock hybrid scoring
        scoring.hybridScore
            .mockReturnValueOnce(85) // for job1
            .mockReturnValueOnce(30); // for job2

        const matches = await matchJobsForProfile('user1');

        expect(knex.raw).toHaveBeenCalled();
        expect(inference.inferWeights).toHaveBeenCalledTimes(2);
        expect(scoring.hybridScore).toHaveBeenCalledTimes(2);
        
        // Only job1 should be returned because job2 score (30) < MIN_SCORE (40)
        expect(matches).toHaveLength(1);
        expect(matches[0].id).toBe('job1');
        expect(matches[0].final_score).toBe(85);
        expect(matches[0].explanation).toBeDefined();
    });
});
