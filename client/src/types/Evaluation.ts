export interface EvaluationFormData {
  roomID: string;
  completedAt: Date;
  ratings: {
    communication: number;
    technical: number;
    cultureFit: number;
  };
  notes: string;
  recommendation: "hire" | "hold" | "reject";
}

export type RatingCategory = "communication" | "technical" | "cultureFit";

export interface RatingLabels {
  communication: string;
  technical: string;
  cultureFit: string;
}

export interface FormErrors {
  ratings?: {
    communication?: string;
    technical?: string;
    cultureFit?: string;
  };
  notes?: string;
  recommendation?: string;
  submit?: string;
}
