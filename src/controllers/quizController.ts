import { Request, Response } from 'express';
import { quizzes, Quiz } from '../models/quizModel';
import { results } from "../models/quizResultModel";
import { Question } from "../models/questionModel";
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger/logger';

// Create a new quiz
export const createQuiz = async (req: Request, res: Response) => {
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
                correct_option: q.correct_option
            }))
        };

        quizzes.push(quiz);
        logger.info(`Quiz created successfully with ID: ${quiz.id}`);
        res.status(201).json(quiz);
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
        logger.info(`Fetching quiz with ID: ${quizId}`); // Log quiz fetching

        const quiz = quizzes.find((q) => q.id === quizId);

        if (!quiz) {
            logger.warn(`Quiz with ID ${quizId} not found`); // Log warning if quiz not found
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        // Explicitly type 'question' as 'Question'
        const quizWithoutAnswers = {
            ...quiz,
            questions: quiz.questions.map((question: Question) => {
                const { correct_option, ...rest } = question;
                return rest;
            }),
        };

        logger.info(`Quiz with ID: ${quizId} fetched successfully`);
        res.status(200).json(quizWithoutAnswers);
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
        const { quizId, questionId, selectedOption } = req.body;

        logger.info(`Submitting answer for Quiz ID: ${quizId}, Question ID: ${questionId}, Selected Option: ${selectedOption}`);

        // Find the quiz
        const quiz = quizzes.find((q) => q.id === quizId);
        if (!quiz) {
            logger.warn(`Quiz with ID ${quizId} not found`);
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        // Find the question
        const question = quiz.questions.find((q) => q.id === questionId);
        if (!question) {
            logger.warn(`Question with ID ${questionId} not found`);
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        // Check if the answer is correct
        const isCorrect = question.correct_option === selectedOption;

        // Send feedback
        if (isCorrect) {
            logger.info('Correct answer submitted');
            res.json({ message: 'Correct answer!' });
        } else {
            logger.info(`Incorrect answer submitted. Correct option: ${question.correct_option}`);
            res.json({ message: 'Incorrect answer', correctAnswer: question.correct_option });
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


        // Find the user's results for the quiz
        const result = results.find(
            (r) => r.quiz_id === quizId && r.user_id === userId
        );

        if (!result) {
            logger.warn(`Results not found for User ID: ${userId}, Quiz ID: ${quizId}`);
            res.status(404).json({ message: 'Results not found for the given quiz and user' });
            return;
        }

        // Return the result details
        logger.info(`Results fetched successfully for User ID: ${userId}, Quiz ID: ${quizId}`);
        res.json({
            score: result.score,
            answers: result.answers.map((answer) => ({
                question_id: answer.question_id,
                selected_option: answer.selected_option,
                is_correct: answer.is_correct,
            })),
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error fetching results for User ID: ${req.params.userId}, Quiz ID: ${req.params.quizId}: ${error.message}`);
        } else {
            logger.error(`Error fetching results for User ID: ${req.params.userId}, Quiz ID: ${req.params.quizId}: uknown error`);
        }
        res.status(500).json({ message: 'Server error', error });
    }
};
