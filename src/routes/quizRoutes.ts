import { Router } from 'express';
import { createQuiz, getQuiz, submitAnswer, getResults } from '../controllers/quizController';

const router = Router();

router.post('/quizzes', createQuiz);
router.get('/quizzes/:id', getQuiz);
router.post('/quizzes/:quizId/questions/:questionId/submit', submitAnswer);
router.get('/quizzes/:quizId/results/:userId', getResults);

export default router;
