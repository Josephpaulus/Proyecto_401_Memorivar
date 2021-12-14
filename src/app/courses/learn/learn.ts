export interface Concept {
  id: number;
  course_id: number;
  concept: string;
  answer: string;
}

export interface LearnedConcept {
  concept: Concept;
  user_id: number;
  correct_answers: number;
  learned?: boolean;
  attempts: number;
  time_spent: number;
  time_review?: number;
}

export enum View {
  init,
  answer,
  input,
  error,
  results,
}

export enum Answer {
  none = -1,
  wrong,
  answered,
}

export enum Action {
  next = 'Siguiente',
  seeAnswer = 'Ver respuesta',
  CheckAnswer = 'Checar respuesta',
  finish = 'Terminar',
}