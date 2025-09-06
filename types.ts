
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export type ActiveView = 'summary' | 'plan' | 'quiz' | null;
