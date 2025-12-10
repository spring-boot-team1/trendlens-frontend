import type { Gender } from "./Gender";

export type BodyAnalysisResponse = {
  seqAccount: number;
  imageUrl: string;
  meshUrl: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  shoulderWidthCm: number;
  armLengthCm: number;
  legLengthCm: number;
  torsoLengthCm: number;
  gender: Gender;
  seqBodyAnalysis?: number;
  seqBodyMetrics?: number;
  promptUsed?: string | null;
  aiResult?: string | null;
};
