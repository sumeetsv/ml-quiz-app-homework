import { Answer } from "./answerModel";

export interface QuizResult {
    quiz_id: string;
    user_id: string;
    score: number;
    answers: Answer[];
}

export const results: QuizResult[] = [];

