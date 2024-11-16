import request from 'supertest';
import { app } from '../../src/app';
import { quizzes } from '../../src/models/quizModel';

describe('GET /api/quizzes/:id', () => {
  it('should return 404 for non-existent quiz', async () => {
    const response = await request(app).get('/quizzes/12345'); // Assuming quiz ID 12345 doesn't exist
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Quiz not found');
  });
});

describe('GET /api/quizzes/:id', () => {
  let existingQuizId: string;

  // This will run before all tests in this describe block
  beforeAll(async () => {
    // Mock or create a quiz that can be used for this test
    // Assuming you are pushing this quiz into a mock data array (e.g., quizzes)
    existingQuizId = 'existing-quiz-id';  // Set the quiz ID you will test with
    const quiz = {
      id: existingQuizId,
      title: 'Sample Quiz',
      questions: [
        { id: 'q1', text: 'What is 2 + 2?', correct_option: 4, options: ['3', '4', '5'] },
        { id: 'q2', text: 'What is 5 + 3?', correct_option: 8, options: ['6', '7', '8'] },
      ],
    };
    // Assuming you have a function to add quizzes to your mock data
    quizzes.push(quiz);  // Add this quiz to the mock quizzes
  });

  it('should return the quiz data for an existing quiz', async () => {
    const response = await request(app).get(`/quizzes/${existingQuizId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', existingQuizId);
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('questions');
    expect(Array.isArray(response.body.questions)).toBe(true);
  });
});
