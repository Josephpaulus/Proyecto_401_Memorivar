export interface Words {
  id?: number;
  concept: string;
  answer: string;
  deleted?: boolean;
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

export interface course {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  image: string;
  words: Words[];
  status: number;
}
