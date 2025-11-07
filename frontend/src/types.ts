export enum Role {
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR',
}

export interface User {
  id: string;
  username: string;
  role: Role;
}

export enum QuestionType {
  MCQ = 'MCQ',
  ShortAnswer = 'ShortAnswer',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
  source: 'Manual' | 'LLM';
}

export interface Topic {
  id: string;
  name: string;
  mastery: number; // 0-100
  prerequisites: string[];
}

export interface StudentProgress {
  userId: string;
  topicMastery: { [topicId: string]: number };
  attemptHistory: any[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
