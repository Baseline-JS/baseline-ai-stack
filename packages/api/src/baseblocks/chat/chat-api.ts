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

const app = createApp();
export const handler = createAuthenticatedHandler(app);

app.post('/chat/prompt', [
  async (req: RequestContext, res: Response) => {
    try {
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
        region: 'ap-southeast-2',
      });
      const input: ConverseStreamCommandInput = {
        modelId: 'mistral.mistral-7b-instruct-v0:2', //ModelIdentifiers.MISTRAL_MISTRAL_7B_INSTRUCT_V0,
        messages,
      };

      const command = new ConverseCommand(input);
      const converseResponse = await runtimeClient.send(command);
      console.log(JSON.stringify(converseResponse, null, 2));
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
