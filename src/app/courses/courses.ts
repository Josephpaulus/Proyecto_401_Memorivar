export interface course {
  id: number;
  user_id: number;
  name: string;
  description: string;
  image: string;
  words: Words[];
  status: number;
}

export interface Words {
  id?: number;
  concept: string;
  answer: string;
  deleted?: boolean;
}

export interface ListCourses extends course {
  conceptsLearned: number;
  totalConcepts: number;
  progress: number;
  reviewTime: number;
}
