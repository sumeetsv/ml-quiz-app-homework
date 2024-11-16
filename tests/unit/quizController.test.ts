import request from 'supertest';
import { app } from '../../src/app';
import { Quiz, quizzes } from '../../src/models/quizModel';
import { results } from '../../src/models/quizResultModel';

// Mock data setup
const mockQuiz: Quiz = {
    id: '1',
    title: 'Sample Quiz',
    questions: [
        {
            id: 'q1',
            text: 'What is 2+2?',
            options: ['1', '2', '3', '4'],
            correctOption: 3,
        },
    ],
};

const mockResult = {
    quizId: '1',
    userId: 'user1',
    score: 1,
    answers: [{ questionId: 'q1', selectedOption: 3, isCorrect: true }],
};

// Test Suite
describe('Quiz API', () => {
    
    beforeEach(() => {
        // Clear previous data before each test
        quizzes.length = 0;
        results.length = 0;
    });

    it('should create a new quiz (POST /quizzes)', async () => {
        const quizData = {
            title: 'Math Quiz',
            questions: [
                {
                    text: 'What is 2+2?',
                    options: ['1', '2', '3', '4'],
                    correctOption: 3,
                },
            ],
        };

        const response = await request(app).post('/quizzes').send(quizData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(quizData.title);
        expect(response.body.questions.length).toBe(1);
    });

    it('should return a quiz by ID (GET /quizzes/:id)', async () => {
        quizzes.push(mockQuiz);

        const response = await request(app).get(`/quizzes/${mockQuiz.id}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(mockQuiz.id);
        expect(response.body.title).toBe(mockQuiz.title);
        expect(response.body.questions.length).toBe(1);
    });

    it('should return 404 if quiz is not found (GET /quizzes/:id)', async () => {
        const response = await request(app).get('/quizzes/invalid-id');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Quiz not found');
    });

    it('should submit an answer (POST /quizzes/:quizId/questions/:questionId/submit)', async () => {
        quizzes.push(mockQuiz);

        const answerData = {
            userId: 'user1',
            selectedOption: 3,
        };

        const response = await request(app)
            .post(`/quizzes/${mockQuiz.id}/questions/${mockQuiz.questions[0].id}/submit`)
            .send(answerData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Correct answer!');
    });

    it('should return incorrect answer with the correct option (POST /quizzes/:quizId/questions/:questionId/submit)', async () => {
        quizzes.push(mockQuiz);

        const answerData = {
            userId: 'user2',
            selectedOption: 2, // Incorrect answer
        };

        const response = await request(app)
            .post(`/quizzes/${mockQuiz.id}/questions/${mockQuiz.questions[0].id}/submit`)
            .send(answerData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Incorrect answer');
        expect(response.body.correctAnswer).toBe(3); // Correct answer is option 3
    });

    it('should return results for a user (GET /quizzes/:quizId/results/:userId)', async () => {
        results.push(mockResult);

        const response = await request(app).get(`/quizzes/${mockQuiz.id}/results/user1`);
        expect(response.status).toBe(200);
        expect(response.body.score).toBe(mockResult.score);
        expect(response.body.answers.length).toBe(mockResult.answers.length);
    });

    it('should return 404 if results are not found (GET /quizzes/:quizId/results/:userId)', async () => {
        const response = await request(app).get(`/quizzes/invalid-id/results/user1`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Results not found for the given quiz and user');
    });

    it('should not create a quiz if no questions are provided (POST /quizzes)', async () => {
      const quizData = {
          title: 'Empty Quiz',
          questions: [], // No questions
      };

      const response = await request(app).post('/quizzes').send(quizData);
      expect(response.status).toBe(400); // Expecting a Bad Request response
      expect(response.body.message).toBe('Bad request');
  });

  it('should return 400 for invalid answer submission (POST /quizzes/:quizId/questions/:questionId/submit)', async () => {
    quizzes.push(mockQuiz);

    const invalidAnswerData = {
        userId: 'user3',
        selectedOption: 5, // Invalid option (out of range)
    };

    const response = await request(app)
        .post(`/quizzes/${mockQuiz.id}/questions/${mockQuiz.questions[0].id}/submit`)
        .send(invalidAnswerData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad request');
  });


});
