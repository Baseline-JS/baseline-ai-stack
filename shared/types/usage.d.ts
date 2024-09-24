export interface Usage {
  usageId: string;
  ownerId?: string;
  apiRequests?: number;
  usedInputTokens?: number;
  usedOutputTokens?: number;
  usedComputeMs?: number;
  usedTotalTokens?: number;
  maxInputTokens?: number;
  maxOutputTokens?: number;
  maxTotalTokens?: number;
  maxComputeMs?: number;
  createdAt?: string;
  updatedAt?: string;
}
