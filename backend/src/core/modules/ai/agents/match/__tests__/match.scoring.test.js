import { geoScore, atMatchScore, skillScore, expScore, hybridScore } from '../match.scoring';

describe('AI Matching - Scoring Logic', () => {
    describe('geoScore', () => {
        it('should return 1 for distance < 10km', () => {
            expect(geoScore(10.762622, 106.660172, 10.772622, 106.670172)).toBe(1);
        });
        it('should return 0.1 for very far distance', () => {
            expect(geoScore(10.762622, 106.660172, 21.028511, 105.804817)).toBe(0.1);
        });
        it('should return 0 if coordinates are missing', () => {
            expect(geoScore(null, null, 1, 1)).toBe(0);
        });
    });

    describe('atMatchScore', () => {
        it('should boost score for screen_reader matched in environment', () => {
            const job = { work_environment: 'Support NVDA', accessibility_level: 'AA' };
            const score = atMatchScore(['screen_reader'], job);
            expect(score).toBe(0.6); // 0.5 + 0.1
        });
        it('should give safety floor 0.3 if needs exist but no match', () => {
            const job = { work_environment: 'Normal office', accessibility_level: 'A' };
            const score = atMatchScore(['screen_reader'], job);
            expect(score).toBe(0.3);
        });
    });

    describe('skillScore', () => {
        it('should score exactly 1 if all skills match', () => {
            expect(skillScore(['React', 'NodeJS'], ['react', 'nodejs'], 0)).toBe(1);
        });
        it('should include semantic_score boost', () => {
            expect(skillScore(['Vue'], ['React'], 0.5)).toBe(0.15); // 0 + 0.5 * 0.3
        });
    });

    describe('hybridScore', () => {
        it('should calculate final score based on weights', () => {
            const profile = {
                skills: ['React'],
                experiences: ['Job 1', 'Job 2', 'Job 3'], // expScore = 1
                accessibility_needs: [],
                latitude: 10, longitude: 106
            };
            const job = {
                skills: ['React'], // skillScore = 1
                latitude: 10, longitude: 106, // geoScore = 1
                work_environment: ''
            };
            const weights = { skill: 0.5, exp: 0.2, at: 0.1, geo: 0.1, culture_fit: 0.1 };
            const semantic = 0.8;
            
            // Expected: 0.5(1) + 0.2(1) + 0.1(0) + 0.1(1) + 0.1(0.8) = 0.5 + 0.2 + 0 + 0.1 + 0.08 = 0.88 -> 88
            const score = hybridScore(profile, job, semantic, weights);
            expect(score).toBe(88);
        });
    });
});
