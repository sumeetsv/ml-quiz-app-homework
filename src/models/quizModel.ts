import { Question } from "./questionModel";

export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
}

// In-memory storage for quizzes and results
export const quizzes: Quiz[] = [];

