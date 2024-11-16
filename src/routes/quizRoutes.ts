import { Router } from 'express';
import { createQuiz, getQuiz, submitAnswer, getResults } from '../controllers/quizController';
import { validateRequest } from '../middleware/validateRequest';
import { validateUrlParams } from '../middleware/validateUrlParams';
import { createQuizSchema, submitAnswerSchema, submitAnswerUrlParamsSchema, getQuizUrlParamsSchema, getResultsUrlParamsSchema } from '../validators/quizValidators';

const router = Router();

router.post('/quizzes', validateRequest(createQuizSchema), createQuiz);
router.get('/quizzes/:id', validateUrlParams(getQuizUrlParamsSchema), getQuiz);
router.post('/quizzes/:quizId/questions/:questionId/submit', validateUrlParams(submitAnswerUrlParamsSchema), validateRequest(submitAnswerSchema), submitAnswer);
router.get('/quizzes/:quizId/results/:userId', validateUrlParams(getResultsUrlParamsSchema), getResults);

export default router;
