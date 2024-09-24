import { Usage } from '@baseline/types/usage';
import { getDynamodbConnection } from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { getErrorMessage } from '../../util/error-message';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const usageService = new ServiceObject<Usage>({
  dynamoDb: dynamoDb,
  objectName: 'Usage',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-usage`,
  primaryKey: 'usageId',
});

export const updateUsage = async (args: {
  usageId: string;
  usedInputTokens: number;
  usedOutputTokens: number;
  usedComputeMs: number;
  usedTotalTokens: number;
}): Promise<Usage> => {
  try {
    const {
      usageId,
      usedInputTokens,
      usedOutputTokens,
      usedComputeMs,
      usedTotalTokens,
    } = args;
    const params: UpdateCommandInput = {
      TableName: `${process.env.APP_NAME}-${process.env.NODE_ENV}-usage`,
      Key: { usageId: usageId },
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeNames: {
        '#uit': 'usedInputTokens',
        '#uot': 'usedOutputTokens',
        '#ucm': 'usedComputeMs',
        '#utt': 'usedTotalTokens',
        '#updated': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':uit': usedInputTokens,
        ':uot': usedOutputTokens,
        ':ucm': usedComputeMs,
        ':utt': usedTotalTokens,
        ':updated': new Date().toISOString(),
      },
      UpdateExpression:
        'SET #updated = :updated ADD #uit :uit, #uot :uot, #ucm :ucm, #utt :utt',
    };
    const output = await dynamoDb.update(params);
    return output.Attributes as Usage;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to update usage: ${JSON.stringify(args)}`);
    throw new Error(message);
  }
};
