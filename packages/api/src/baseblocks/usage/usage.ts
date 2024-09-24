import { Usage } from '@baseline/types/usage';

export const usageMapper = (data: Usage): Usage => {
  const usage: Usage = {
    usageId: data?.usageId,
    ownerId: data?.ownerId,
    apiRequests: data?.apiRequests,
    usedInputTokens: data?.usedInputTokens,
    usedOutputTokens: data?.usedOutputTokens,
    usedComputeMs: data?.usedComputeMs,
    usedTotalTokens: data?.usedTotalTokens,
    maxInputTokens: data?.maxInputTokens,
    maxOutputTokens: data?.maxOutputTokens,
    maxTotalTokens: data?.maxTotalTokens,
    maxComputeMs: data?.maxComputeMs,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
  return usage;
};
