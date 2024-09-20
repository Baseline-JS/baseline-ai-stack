import { Chat } from '@baseline/types/chat';
import { RequestHandler } from './request-handler';

interface ChatPromptResponse {
  output: {
    message: {
      content: [
        {
          text: string;
        },
      ];
    };
  };
}

export const chatPrompt = async (
  requestHandler: RequestHandler,
  data: { text: string },
): Promise<ChatPromptResponse> => {
  const response = await requestHandler.request<Chat>({
    method: 'POST',
    url: `chat/prompt`,
    hasAuthentication: true,
    data,
  });
  if ('data' in response) {
    return response.data as unknown as ChatPromptResponse;
  }
  throw response;
};
