import { Request, Response } from 'express';
import { quizzes, Quiz } from '../models/quizModel';
import { results } from "../models/quizResultModel";
import { Question } from "../models/questionModel";
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger/logger';
import { Answer } from '../models/answerModel';

// Create a new quiz
export const createQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, questions } = req.body;
        logger.info('Creating a new quiz');

        const quiz: Quiz = {
            id: uuidv4(),
            title,
            questions: questions.map((q: any) => ({
                id: uuidv4(),
                text: q.text,
                options: q.options,
                correctOption: q.correctOption
            }))
        };

        quizzes.push(quiz);
        logger.info(`Quiz created successfully with ID: ${quiz.id}`);
        res.status(201).json(quiz); // Send quiz object as response
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Failed to create quiz: ${error.message}`);
        } else {
            logger.error(`Failed to create quiz: unknown error`);
        }
        res.status(500).json({ error: 'Failed to create quiz' });
    }
};

// Get a quiz by ID
export const getQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const quizId = req.params.id;
        logger.info(`Fetching quiz with ID: ${quizId}`);

        const quiz = quizzes.find((q) => q.id === quizId);

        if (!quiz) {
            logger.warn(`Quiz with ID ${quizId} not found`);
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        const quizWithoutAnswers = {
            ...quiz,
            questions: quiz.questions.map((question: Question) => {
                const { correctOption, ...rest } = question;
                return rest;
            }),
        };

        logger.info(`Quiz with ID: ${quizId} fetched successfully`);
        res.status(200).json(quizWithoutAnswers); // Send the quiz without answers
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error fetching quiz with ID ${req.params.id}: ${error.message}`);
        } else {
            logger.error(`Error fetching quiz with ID ${req.params.id}: unknown error`);
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// Submit an answer for a specific question in a quiz
export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId, questionId } = req.params;
        const { userId, selectedOption } = req.body;

        logger.info(`Submitting answer for Quiz ID: ${quizId}, Question ID: ${questionId}, User ID: ${userId}, Selected Option: ${selectedOption}`);

        const quiz = quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            logger.warn(`Quiz with ID ${quizId} not found`);
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        const question = quiz.questions.find((q) => q.id === questionId);
        if (!question) {
            logger.warn(`Question with ID ${questionId} not found`);
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        const isCorrect = question.correctOption === selectedOption;

        // Try to find the user's results for this quiz
        let quizResult = results.find((r) => r.quizId === quizId && r.userId === userId);

        // If the user's result doesn't exist, create a new one
        if (!quizResult) {
            quizResult = {
                quizId,
                userId,
                score: 0,
                answers: [],
            };
            results.push(quizResult); // Add new result to the results array
        }

        // Add the user's answer to the answers array
        const newAnswer: Answer = {
            questionId,
            selectedOption,
            isCorrect,
        };

        quizResult.answers.push(newAnswer);

        // Update the score
        quizResult.score = quizResult.answers.reduce((totalScore, answer) => {
            if (answer.isCorrect) {
                totalScore += 1; // Add to score if the answer is correct
            }
            return totalScore;
        }, 0);

        if (isCorrect) {
            logger.info('Correct answer submitted');
            res.json({ message: 'Correct answer!' });
        } else {
            logger.info(`Incorrect answer submitted. Correct option: ${question.correctOption}`);
            res.json({ message: 'Incorrect answer', correctAnswer: question.correctOption });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error submitting answer for Quiz ID: ${req.body.quizId}, Question ID: ${req.body.questionId}: ${error.message}`);
        } else {
            logger.error(`Error submitting answer for Quiz ID: ${req.body.quizId}, Question ID: ${req.body.questionId}: unknown error`);
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get quiz results for a specific user
export const getResults = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId, userId } = req.params;

        logger.info(`Fetching results for User ID: ${userId}, Quiz ID: ${quizId}`);

        const result = results.find(
            (r) => r.quizId === quizId && r.userId === userId
        );

        if (!result) {
            logger.warn(`Results not found for User ID: ${userId}, Quiz ID: ${quizId}`);
            res.status(404).json({ message: 'Results not found for the given quiz and user' });
            return;
        }

        logger.info(`Results fetched successfully for User ID: ${userId}, Quiz ID: ${quizId}`);
        res.json({
            score: result.score,
            answers: result.answers.map((answer) => ({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect: answer.isCorrect,
            })),
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error fetching results for User ID: ${req.params.userId}, Quiz ID: ${req.params.quizId}: ${error.message}`);
        } else {
            logger.error(`Error fetching results for User ID: ${req.params.userId}, Quiz ID: ${req.params.quizId}: unknown error`);
        }
        res.status(500).json({ message: 'Server error', error });
    }
};
