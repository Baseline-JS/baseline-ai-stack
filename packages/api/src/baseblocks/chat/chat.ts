import { Chat } from '@baseline/types/chat';

export const ChatMapper = (data: Chat): Chat => {
  const chat: Chat = {
    userSub: data?.userSub,
    userEmail: data?.userEmail,
  };
  return chat;
};
