import { Response } from 'express';
import { RequestContext } from '../../util/request-context.type';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommandInput,
  Message,
} from '@aws-sdk/client-bedrock-runtime';
import { updateUsage, usageService } from '../usage/usage.service';
import { ModelIdentifiers } from './models';

const MODEL_REGION = 'ap-southeast-2';
const MODEL_ID = ModelIdentifiers.MISTRAL_MISTRAL_7B_INSTRUCT_V0;
const MAX_INPUT_TOKENS = 100000;
const MAX_OUTPUT_TOKENS = 100000;
const MAX_COMPUTE_MS = 1000000;
const MAX_TOTAL_TOKENS = 0; // No limit
const GLOBAL_MAX_INPUT_TOKENS = 1000000;
const GLOBAL_MAX_OUTPUT_TOKENS = 1000000;
const GLOBAL_MAX_COMPUTE_MS = 10000000;
const GLOBAL_MAX_TOTAL_TOKENS = 0; // No limit

const app = createApp();
export const handler = createAuthenticatedHandler(app);

app.post('/chat/prompt', [
  async (req: RequestContext, res: Response) => {
    try {
      const dateString = new Date().toISOString().split('T')[0].slice(0, 7);
      const globalUsageId = `GLOBAL#${dateString}`;
      let globalUsage = await usageService.get(globalUsageId);
      if (!globalUsage) {
        globalUsage = await usageService.create({
          usageId: globalUsageId,
          createdAt: new Date().toISOString(),
          updatedAt: '',
          usedInputTokens: 0,
          usedOutputTokens: 0,
          usedComputeMs: 0,
          usedTotalTokens: 0,
          maxInputTokens: GLOBAL_MAX_INPUT_TOKENS,
          maxOutputTokens: GLOBAL_MAX_OUTPUT_TOKENS,
          maxTotalTokens: GLOBAL_MAX_TOTAL_TOKENS,
          maxComputeMs: GLOBAL_MAX_COMPUTE_MS,
        });
      }
      console.log(JSON.stringify(globalUsage, null, 2));

      if (!globalUsage) {
        console.log('Failed to create global usage');
        res.status(400).json({
          error: 'Failed to create global usage',
        });
        return;
      }

      if (
        globalUsage.maxTotalTokens &&
        (globalUsage.usedTotalTokens || 0) >= globalUsage.maxTotalTokens
      ) {
        console.log('Global usage limit exceeded on total tokens');
        res.status(400).json({
          error: 'Global usage limit exceeded on total tokens',
        });
        return;
      }

      if (
        globalUsage.maxInputTokens &&
        (globalUsage.usedInputTokens || 0) >= globalUsage.maxInputTokens
      ) {
        console.log('Global usage limit exceeded on input tokens');
        res.status(400).json({
          error: 'Global usage limit exceeded on input tokens',
        });
        return;
      }

      if (
        globalUsage.maxOutputTokens &&
        (globalUsage.usedOutputTokens || 0) >= globalUsage.maxOutputTokens
      ) {
        console.log('Global usage limit exceeded on output tokens');
        res.status(400).json({
          error: 'Global usage limit exceeded on output tokens',
        });
        return;
      }

      if (
        globalUsage.maxComputeMs &&
        (globalUsage.usedComputeMs || 0) >= globalUsage.maxComputeMs
      ) {
        console.log('Global usage limit exceeded on compute ms');
        res.status(400).json({
          error: 'Global usage limit exceeded on compute ms',
        });
        return;
      }

      const userSub = req.currentUserSub;
      const usageId = `USER#${userSub}#${dateString}`;
      let usage = await usageService.get(usageId);
      if (!usage) {
        usage = await usageService.create({
          usageId,
          createdAt: new Date().toISOString(),
          updatedAt: '',
          usedInputTokens: 0,
          usedOutputTokens: 0,
          usedComputeMs: 0,
          usedTotalTokens: 0,
          maxInputTokens: MAX_INPUT_TOKENS,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          maxTotalTokens: MAX_TOTAL_TOKENS,
          maxComputeMs: MAX_COMPUTE_MS,
        });
      }

      console.log(JSON.stringify(usage, null, 2));

      if (!usage) {
        console.log('Failed to create usage');
        res.status(400).json({
          error: 'Failed to create usage',
        });
        return;
      }

      if (
        usage.maxTotalTokens &&
        (usage.usedTotalTokens || 0) >= usage.maxTotalTokens
      ) {
        console.log('Usage limit exceeded on total tokens');
        res.status(400).json({
          error: 'Usage limit exceeded on total tokens',
        });
        return;
      }

      if (
        usage.maxInputTokens &&
        (usage.usedInputTokens || 0) >= usage.maxInputTokens
      ) {
        console.log('Usage limit exceeded on input tokens');
        res.status(400).json({
          error: 'Usage limit exceeded on input tokens',
        });
        return;
      }

      if (
        usage.maxOutputTokens &&
        (usage.usedOutputTokens || 0) >= usage.maxOutputTokens
      ) {
        console.log('Usage limit exceeded on output tokens');
        res.status(400).json({
          error: 'Usage limit exceeded on output tokens',
        });
        return;
      }

      if (
        usage.maxComputeMs &&
        (usage.usedComputeMs || 0) >= usage.maxComputeMs
      ) {
        console.log('Usage limit exceeded on compute ms');
        res.status(400).json({
          error: 'Usage limit exceeded on compute ms',
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const text = req?.body?.text as string;
      const messages: Message[] = [
        {
          content: [
            {
              text: text,
            },
          ],
          role: 'user',
        },
      ];
      const runtimeClient = new BedrockRuntimeClient({
        region: MODEL_REGION,
      });

      const input: ConverseStreamCommandInput = {
        modelId: MODEL_ID,
        messages,
      };

      const command = new ConverseCommand(input);
      const converseResponse = await runtimeClient.send(command);
      console.log(JSON.stringify(converseResponse, null, 2));
      const updatedGlobalUsage = await updateUsage({
        usageId: globalUsageId,
        usedInputTokens: converseResponse.usage?.inputTokens || 0,
        usedOutputTokens: converseResponse.usage?.outputTokens || 0,
        usedComputeMs: converseResponse.metrics?.latencyMs || 0,
        usedTotalTokens: converseResponse.usage?.totalTokens || 0,
      });
      console.log(JSON.stringify(updatedGlobalUsage, null, 2));
      const updatedUsage = await updateUsage({
        usageId,
        usedInputTokens: converseResponse.usage?.inputTokens || 0,
        usedOutputTokens: converseResponse.usage?.outputTokens || 0,
        usedComputeMs: converseResponse.metrics?.latencyMs || 0,
        usedTotalTokens: converseResponse.usage?.totalTokens || 0,
      });
      console.log(JSON.stringify(updatedUsage, null, 2));
      res.json(converseResponse);
      res.status(200);
      res.send();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get response: ${message}`);
      res.status(400).json({
        error: 'Failed to get response',
      });
    }
  },
]);
