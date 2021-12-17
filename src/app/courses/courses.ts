export interface course {
  id: number;
  user_id: number;
  name: string;
  description: string;
  image: string;
  words: Words[];
  status: number;
  users?: number;
  concepts?: number;
  owner?: string;
}

export interface Words {
  id?: number;
  concept: string;
  answer: string;
  deleted?: boolean;
  timeReview?: number;
}

export interface ListCourses extends course {
  conceptsLearned: number;
  totalConcepts: number;
  progress: number;
  reviewTime: number;
}
