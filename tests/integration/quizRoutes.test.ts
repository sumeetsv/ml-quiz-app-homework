import request from 'supertest';
import { app } from '../../src/app';
import { results } from '../../src/models/quizResultModel';

describe('POST /quizzes', () => {
    it('should create a new quiz successfully', async () => {
        const newQuiz = {
            title: 'Science Quiz',
            questions: [
                {
                    text: 'What is the capital of France?',
                    options: ['Paris', 'London', 'Berlin'],
                    correctOption: 0,
                },
            ],
        };

        const response = await request(app).post('/quizzes').send(newQuiz);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newQuiz.title);
        expect(response.body.questions.length).toBe(newQuiz.questions.length);
        expect(response.body.questions[0].text).toBe(newQuiz.questions[0].text);
    });
});

describe('GET /quizzes/:id', () => {
  let quizId: string;

  // This will run before all tests in this describe block
  beforeAll(async () => {
      const newQuiz = {
          title: 'Math Quiz',
          questions: [
              {
                  text: 'What is 2 + 2?',
                  options: ['3', '4', '5'],
                  correctOption: 1,  // Correct option is the index of the correct answer
              },
          ],
      };

      const response = await request(app).post('/quizzes').send(newQuiz);
      quizId = response.body.id;  // Save the ID of the newly created quiz
  });

  it('should return the quiz data for an existing quiz without the correctOption', async () => {
      const response = await request(app).get(`/quizzes/${quizId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', quizId);
      expect(response.body).toHaveProperty('title');
      expect(response.body.title).toBe('Math Quiz');
      expect(response.body.questions.length).toBe(1);
      expect(response.body.questions[0].text).toBe('What is 2 + 2?');
      expect(response.body.questions[0]).not.toHaveProperty('correctOption'); // Ensure `correctOption` is not in the response
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  let quizId: string;
  let questionId: string;

  beforeAll(async () => {
      // Create a new quiz
      const newQuiz = {
          title: 'Math Quiz',
          questions: [
              {
                  text: 'What is 2 + 2?',
                  options: ['3', '4', '5'],
                  correctOption: 1,  // Correct answer is index 1 (which is '4')
              },
          ],
      };

      const response = await request(app).post('/quizzes').send(newQuiz);
      quizId = response.body.id;  // Save the quiz ID
      questionId = response.body.questions[0].id;  // Save the question ID
  });

  it('should return a "Correct answer!" message when the correct option is selected', async () => {
      const response = await request(app)
          .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
          .send({
              userId: 'user-123',
              selectedOption: 1,  // The correct option (index 1 corresponds to '4')
          });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Correct answer!');
  });

  it('should return an "Incorrect answer" message with the correct answer when the wrong option is selected', async () => {
      const response = await request(app)
          .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
          .send({
              userId: 'user-123',
              selectedOption: 0,  // Incorrect option (index 0 corresponds to '3')
          });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Incorrect answer');
      expect(response.body.correctAnswer).toBe(1);  // The correct answer is index 1 (which is '4')
  });

  it('should create or update the user\'s result in the results database', async () => {
      // Make sure the result is created or updated after submission
      await request(app)
          .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
          .send({
              userId: 'user-123',
              selectedOption: 1,  // Correct option
          });

      // Check if the result is in the results database
      const result = results.find(
          (r) => r.quizId === quizId && r.userId === 'user-123'
      );

      expect(result).toBeDefined();
      expect(result?.score).toBe(1);  // User should have 1 point
      expect(result?.answers.length).toBe(1);  // User should have 1 answer in the answers array
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  it('should return 404 if quiz is not found', async () => {
    const invalidQuizId = 'non-existent-quiz-id';
    const questionId = 'existing-question-id';  // A question ID that exists
    const userId = 'test-user-id';
    const selectedOption = 1;  // A valid option index

    const response = await request(app)
      .post(`/quizzes/${invalidQuizId}/questions/${questionId}/submit`)
      .send({ userId, selectedOption });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Quiz not found');
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  it('should return 404 if question is not found', async () => {
    // Create a quiz with one question
    const quiz = {
      title: 'Sample Quiz',
      questions: [
        { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const invalidQuestionId = 'non-existent-question-id';  // Invalid question ID
    const userId = 'test-user-id';
    const selectedOption = 1;  // A valid option index

    const response = await request(app)
      .post(`/quizzes/${quizId}/questions/${invalidQuestionId}/submit`)
      .send({ userId, selectedOption });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Question not found');
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  it('should return "Correct answer!" if the selected option is correct', async () => {
    // Create a quiz with one question
    const quiz = {
      title: 'Sample Quiz',
      questions: [
        { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const questionId = createResponse.body.questions[0].id; // Get the ID of the created question
    const userId = 'test-user-id';
    const selectedOption = 1;  // The correct option (index 1 corresponds to '4')

    const response = await request(app)
      .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
      .send({ userId, selectedOption });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Correct answer!');
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  it('should return the correct answer if the selected option is incorrect', async () => {
    // Create a quiz with one question
    const quiz = {
      title: 'Sample Quiz',
      questions: [
        { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const questionId = createResponse.body.questions[0].id; // Get the ID of the created question
    const userId = 'test-user-id';
    const selectedOption = 0;  // Incorrect option (index 0 corresponds to '3')

    const response = await request(app)
      .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
      .send({ userId, selectedOption });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Incorrect answer');
    expect(response.body.correctAnswer).toBe(1); // The correct option is 1 ("4")
  });
});

describe('POST /quizzes/:quizId/questions/:questionId/submit', () => {
  it('should create or update the user\'s result in the results database when the answer is correct', async () => {
    // Create a quiz with one question
    const quiz = {
      title: 'Sample Quiz',
      questions: [
        { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const questionId = createResponse.body.questions[0].id; // Get the ID of the created question
    const userId = 'test-user-id';
    const selectedOption = 1;  // Correct option (index 1 corresponds to '4')

    // Submit the correct answer
    const response = await request(app)
      .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
      .send({ userId, selectedOption });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Correct answer!');

    // Now fetch the user's results to confirm the result is stored
    const resultResponse = await request(app)
      .get(`/quizzes/${quizId}/results/${userId}`);

    expect(resultResponse.status).toBe(200);
    expect(resultResponse.body.score).toBe(1); // The score should be 1 for this correct answer
    expect(resultResponse.body.answers).toHaveLength(1);
    expect(resultResponse.body.answers[0].questionId).toBe(questionId);
    expect(resultResponse.body.answers[0].selectedOption).toBe(selectedOption);
    expect(resultResponse.body.answers[0].isCorrect).toBe(true);
  });
});

describe('GET /quizzes/:quizId/results/:userId', () => {
  it('should return the results for the user for a given quiz', async () => {
    // Step 1: Create a quiz with one question
    const quiz = {
      title: 'Math Quiz',
      questions: [
        { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const questionId = createResponse.body.questions[0].id; // Get the ID of the created question
    const userId = 'test-user-id';
    const selectedOption = 1;  // Correct option (index 1 corresponds to '4')

    // Step 2: Submit the correct answer for the user
    await request(app)
      .post(`/quizzes/${quizId}/questions/${questionId}/submit`)
      .send({ userId, selectedOption });

    // Step 3: Fetch the user's results
    const resultResponse = await request(app)
      .get(`/quizzes/${quizId}/results/${userId}`);

    // Step 4: Assertions
    expect(resultResponse.status).toBe(200);
    expect(resultResponse.body.score).toBe(1); // User should have a score of 1 for this correct answer
    expect(resultResponse.body.answers).toHaveLength(1); // There should be one answer recorded
    expect(resultResponse.body.answers[0].questionId).toBe(questionId);
    expect(resultResponse.body.answers[0].selectedOption).toBe(selectedOption);
    expect(resultResponse.body.answers[0].isCorrect).toBe(true);
  });

  it('should return 404 if the user has not answered any questions', async () => {
    // Step 1: Create a quiz with one question
    const quiz = {
      title: 'Science Quiz',
      questions: [
        { text: 'What is the boiling point of water?', options: ['90°C', '100°C', '110°C'], correctOption: 1 }
      ]
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quiz);

    const quizId = createResponse.body.id;  // Get the ID of the created quiz
    const userId = 'new-user-id'; // New user who hasn't answered any questions

    // Step 2: Fetch results for the user who has not answered any questions
    const resultResponse = await request(app)
      .get(`/quizzes/${quizId}/results/${userId}`);

    // Step 3: Assertions
    expect(resultResponse.status).toBe(404);
    expect(resultResponse.body.message).toBe('Results not found for the given quiz and user');
  });
});
