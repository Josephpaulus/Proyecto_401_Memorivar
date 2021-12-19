import { Concept } from '../learn/learn';

export interface Challenge {
  courseId: number;
  userId: number;
  opponentId: number;
  creationTime: number;
  concepts: Concept[];
}
