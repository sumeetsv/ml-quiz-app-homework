import { Answer } from "./answerModel";

export interface QuizResult {
    quizId: string;
    userId: string;
    score: number;
    answers: Answer[];
}

export const results: QuizResult[] = [];

