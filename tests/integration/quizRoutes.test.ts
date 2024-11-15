import request from 'supertest';
import { app } from '../../src/app';

describe('GET /api/quizzes/:id', () => {
  it('should return 404 for non-existent quiz', async () => {
    const response = await request(app).get('/quizzes/12345');
    expect(response.status).toBe(404);
  });
});
