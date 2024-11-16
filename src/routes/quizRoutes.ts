import { Router } from 'express';
import { createQuiz, getQuiz, submitAnswer, getResults } from '../controllers/quizController';
import { validateRequest } from '../middleware/validateRequest';
import { createQuizSchema, submitAnswerSchema, getResultsSchema } from '../validators/quizValidators';

const router = Router();

router.post('/quizzes', validateRequest(createQuizSchema), createQuiz);
router.get('/quizzes/:id', getQuiz);
router.post('/quizzes/:quizId/questions/:questionId/submit', validateRequest(submitAnswerSchema), submitAnswer);
router.get('/quizzes/:quizId/results/:userId', validateRequest(getResultsSchema), getResults);

export default router;
