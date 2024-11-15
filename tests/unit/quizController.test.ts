import request from 'supertest';
import { app } from '../../src/app';  // Import your app instance

describe('Quiz Controller', () => {

  // Test POST /quizzes - Should create a new quiz
  describe('POST /quizzes', () => {
    it('should create a new quiz', async () => {
      const quizData = {
        title: 'New Quiz',
        questions: [
          { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
        ]
      };

      const response = await request(app)
        .post('/quizzes')  // Correct endpoint
        .send(quizData)
        .expect(201);  // Expecting a 201 Created response

      expect(response.body.title).toBe('New Quiz');
      expect(response.body.questions.length).toBe(1);
    });
  });

  // Test GET /quizzes/:id - Should return a quiz by ID
  describe('GET /quizzes/:id', () => {
    it('should return a quiz by ID', async () => {
      const quizData = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
        ]
      };

      // Create a quiz first to test the GET request
      const createResponse = await request(app)
        .post('/quizzes')
        .send(quizData)
        .expect(201);

      const quizId = createResponse.body.id; // Assuming the response contains the quiz ID

      // Now GET the quiz by ID
      const response = await request(app)
        .get(`/quizzes/${quizId}`)  // Correct endpoint
        .expect(200);  // Expecting a 200 OK response

      expect(response.body.id).toBe(quizId);
      expect(response.body.title).toBe('Sample Quiz');
    });
  });

  // Test POST /quizzes/:quizId/questions/:questionId/submit - Should submit an answer
  describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
    it('should submit an answer and return results', async () => {
      const quizData = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
        ]
      };

      // Create a quiz first
      const createResponse = await request(app)
        .post('/quizzes')
        .send(quizData)
        .expect(201);

      const quizId = createResponse.body.id; // Get the quiz ID
      const questionId = createResponse.body.questions[0].id; // Get the question ID

      const answerData = { userId: '123', answer: '4' };

      // Submit the answer
      const response = await request(app)
        .post(`/quizzes/${quizId}/questions/${questionId}/submit`)  // Correct endpoint
        .send(answerData)
        .expect(200);  // Expecting a 200 OK response

      expect(response.body.score).toBe(1);  // Assuming the score is returned
      expect(response.body.userId).toBe('123');
    });
  });

  // Test GET /quizzes/:quizId/results/:userId - Should get results for a user
  describe('GET /quizzes/:quizId/results/:userId', () => {
    it('should get the results for a specific user', async () => {
      const quizData = {
        title: 'Sample Quiz',
        questions: [
          { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
        ]
      };

      // Create a quiz first
      const createResponse = await request(app)
        .post('/quizzes')
        .send(quizData)
        .expect(201);

      const quizId = createResponse.body.id; // Get the quiz ID

      // Submit an answer for a user (assuming userId is '123')
      const questionId = createResponse.body.questions[0].id; // Get the question ID
      const answerData = { userId: '123', answer: '4' };

      await request(app)
        .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
        .send(answerData)
        .expect(200);  // Answer submission

      // Get results for the user
      const response = await request(app)
        .get(`/quizzes/${quizId}/results/123`)  // Correct endpoint
        .expect(200);  // Expecting a 200 OK response

      expect(response.body.userId).toBe('123');
      expect(response.body.score).toBe(1);  // Assuming the score is returned
    });
  });

});
