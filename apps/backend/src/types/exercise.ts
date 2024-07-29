type ExercisesDescription = {
  uniqueSelection?: {
    description: string;
    quantity: number;
  }[];
  development?: {
    description: string;
    quantity: number;
  }[];
  trueOrFalse?: {
    description: string;
    quantity: number;
  }[];
};

type ExercisesLatex = {
  uniqueSelection?: {
    question: string;
    answers: string[];
  }[];
  development?: {
    question: string;
    answer: string;
  }[];
  trueOrFalse?: {
    question: string;
    answer: boolean;
  }[];
};

export { ExercisesDescription, ExercisesLatex };
