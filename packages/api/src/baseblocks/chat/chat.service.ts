// import { Chat } from '@baseline/types/chat';
// import { getErrorMessage } from '../../util/error-message';
// import { getDynamodbConnection } from '@baselinejs/dynamodb';
// import { ServiceObject } from '../../util/service-object';

// const dynamoDb = getDynamodbConnection({
//   region: `${process.env.API_REGION}`,
// });

// export const chatService = new ServiceObject<Chat>({
//   dynamoDb: dynamoDb,
//   objectName: 'Chat',
//   table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-chat`,
//   primaryKey: 'userSub',
// });

// export const isChatSub = async (userSub: string): Promise<boolean> => {
//   console.log(`Is ${userSub} Chat`);
//   try {
//     const chat = await chatService.get(userSub);
//     return !!chat?.userSub;
//   } catch (error) {
//     const message = getErrorMessage(error);
//     console.error(`Failed to check if chat: ${message}`);
//     return false;
//   }
// };
