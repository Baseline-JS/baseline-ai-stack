import { Response } from 'express';
import { usageMapper } from './usage';
import { RequestContext } from '../../util/request-context.type';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import { usageService } from './usage.service';

const app = createApp();
export const handler = createAuthenticatedHandler(app);

app.get('/usage/me', [
  async (req: RequestContext, res: Response) => {
    try {
      const userSub = req.currentUserSub;
      const dateString = new Date().toISOString().split('T')[0].slice(0, 7);
      const usageId = `USER#${userSub}#${dateString}`;
      const usage = await usageService.get(usageId);
      res.json(usageMapper(usage));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get usage: ${message}`);
      res.status(400).json({
        error: 'Failed to get usage',
      });
    }
  },
]);
