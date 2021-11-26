export interface Words {
  concept: string;
  answer: string;
}

export interface AddCourse {
  name: string;
  description: string;
  image: string;
  words: Words[];
  courseStatus: number;
}

export interface ListCourses {
  name: string;
  image: string;
  wordsLearned: number;
  totalWords: number;
  progress: number;
  reviewIn: number;
}
