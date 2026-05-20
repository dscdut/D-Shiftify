import { matchJobsForProfile } from '../../../modules/ai/agents/match/match.agent.js';

export const AIController = {
  /**
   * GET /api/ai/match/:profileId
   */
  matchForProfile: async (req, res, next) => {
    try {
      const { profileId } = req.params;
      const matches = await matchJobsForProfile(profileId);
      
      return res.status(200).json({
        success: true,
        data: matches,
        message: 'Tìm việc làm phù hợp thành công.'
      });
    } catch (error) {
      next(error);
    }
  }
};
