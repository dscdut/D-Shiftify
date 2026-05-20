import { Router } from 'express';
import { AIController } from './ai.controller.js';

export const AIResolver = {
  /**
   * @param {Router} router
   */
  resolve: (router) => {
    const aiRouter = Router();

    /**
     * @swagger
     * /ai/match/{profileId}:
     *   get:
     *     tags: [AI]
     *     summary: Lấy danh sách việc làm phù hợp với profile
     *     parameters:
     *       - in: path
     *         name: profileId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Thành công
     */
    aiRouter.get('/match/:profileId', AIController.matchForProfile);

    router.use('/ai', aiRouter);
  }
};
