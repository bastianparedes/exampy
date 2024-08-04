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

type Subject =
  | 'languageAndCommunication'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'naturalSciences'
  | 'geographyAndSocialSciences'
  | 'physicalEducation'
  | 'visualArts'
  | 'music'
  | 'technology';

export { ExercisesDescription, ExercisesLatex, Subject };
