import request from 'supertest';
import { app } from '../../src/app';
import { quizzes } from '../../src/models/quizModel';

describe('Quiz Controller - Create Quiz', () => {
  it('POST /quizzes should create a new quiz', async () => {
    const quizData = {
      title: 'New Quiz',
      questions: [
        {
          text: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctOption: 1 // Correct option as a number
        }
      ]
    };

    const response = await request(app)
      .post('/quizzes')
      .send(quizData)
      .expect(201); // Expecting a 201 Created response

    expect(response.body.title).toBe('New Quiz');
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].correctOption).toBe(1); // Correct option as number
  });
});

describe('Quiz Controller', () => {
  it('GET /quizzes/:id - should fetch a quiz by ID', async () => {
    // Create a quiz first to test fetching
    const quizData = {
      title: 'Fetch Quiz Test',
      questions: [
        {
          text: 'What is 2 + 2?',
          options: ['3', '4', '5'],
          correctOption: 1,
        },
      ],
    };

    const createResponse = await request(app)
      .post('/quizzes')
      .send(quizData)
      .expect(201);

    const quizId = createResponse.body.id;

    const response = await request(app)
      .get(`/quizzes/${quizId}`)
      .expect(200);

    expect(response.body.title).toBe('Fetch Quiz Test');
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].text).toBe('What is 2 + 2?');
  });
});

it('should return a quiz by ID', async () => {
  // Create a quiz first
  const quizData = {
    title: 'Sample Quiz',
    questions: [
      {
        text: 'Sample Question',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctOption: 1,
      },
    ],
  };

  const createResponse = await request(app)
    .post('/quizzes')
    .send(quizData)
    .expect(201);

  const quizId = createResponse.body.id;

  // Fetch the created quiz by ID
  const response = await request(app)
    .get(`/quizzes/${quizId}`)
    .expect(200);

  expect(response.body).toHaveProperty('id', quizId);
  expect(response.body).toHaveProperty('title', quizData.title);
  expect(response.body.questions.length).toBe(quizData.questions.length);
  expect(response.body.questions[0].text).toBe(quizData.questions[0].text);
});


it('should return a quiz by ID', async () => {
  // Step 1: Create a new quiz to fetch later
  const quizData = {
      title: 'Sample Quiz',
      questions: [
          {
              text: 'What is the capital of France?',
              options: ['Paris', 'London', 'Rome'],
              correctOption: 0,
          },
      ],
  };

  const createResponse = await request(app)
      .post('/quizzes')
      .send(quizData)
      .expect(201);

  const quizId = createResponse.body.id; // Extract the created quiz ID

  // Step 2: Fetch the created quiz by its ID
  const fetchResponse = await request(app)
      .get(`/quizzes/${quizId}`)
      .expect(200);

  // Step 3: Validate the response
  expect(fetchResponse.body.title).toBe(quizData.title);
  expect(fetchResponse.body.questions.length).toBe(quizData.questions.length);
  expect(fetchResponse.body.questions[0].text).toBe(quizData.questions[0].text);
});

it('should return 400 Bad Request if missing quizId, questionId, or selectedOption', async () => {
  const invalidData = [
    { quizId: '', questionId: 'question-1', selectedOption: 1 }, // Missing quizId
    { quizId: 'quiz-1', questionId: '', selectedOption: 1 }, // Missing questionId
    { quizId: 'quiz-1', questionId: 'question-1', selectedOption: null }, // Missing selectedOption
    { quizId: 'quiz-1', questionId: 'question-1', selectedOption: 'invalid' }, // Invalid selectedOption (not an integer)
  ];

  for (const data of invalidData) {
    const response = await request(app)
      .post(`/quizzes/quiz-1/questions/question-1/submit`)
      .send(data);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad request'); // Adjust as per your response message
  }
});

describe('Submit Answer Endpoint', () => {
  it('should return 200 with success message when the answer is correct', async () => {
    // Create a quiz with the correct options type (numbers)
    const quiz = {
      id: 'quiz-1',
      title: 'Sample Quiz',
      questions: [
        {
          id: 'question-1',
          text: 'What is 2+2?',
          correctOption: 1, // correctOption should be a number
          options: ['1', '2', '3'], // options remain as strings
        },
      ],
    };

    // Add this quiz to the mock data
    quizzes.push(quiz); // Assuming quizzes is the array storing quizzes

    const data = {
      quizId: 'quiz-1',
      questionId: 'question-1',
      selectedOption: 1, // Convert selectedOption to a number to match correctOption
    };

    const response = await request(app)
      .post(`/quizzes/${data.quizId}/questions/${data.questionId}/submit`)
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Correct answer!');
  });
});


describe('Submit Answer Endpoint', () => {
  it('should return 200 with incorrect answer message and correct answer when the answer is wrong', async () => {
    // Create a quiz with the correct options type (numbers)
    const quiz = {
      id: 'quiz-1',
      title: 'Sample Quiz',
      questions: [
        {
          id: 'question-1',
          text: 'What is 2+2?',
          correctOption: 1, // correctOption should be a number
          options: ['1', '2', '3'], // options remain as strings
        },
      ],
    };

    // Add this quiz to the mock data
    quizzes.push(quiz); // Assuming quizzes is the array storing quizzes

    const data = {
      quizId: 'quiz-1',
      questionId: 'question-1',
      selectedOption: 2, // Incorrect answer
    };

    const response = await request(app)
      .post(`/quizzes/${data.quizId}/questions/${data.questionId}/submit`)
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Incorrect answer');
    expect(response.body.correctAnswer).toBe(1); // The correct answer should be 1
  });
});

describe('Submit Answer Endpoint', () => {
  it('should return 404 when the question is not found', async () => {
    // Create a quiz with a sample question
    const quiz = {
      id: 'quiz-1',
      title: 'Sample Quiz',
      questions: [
        {
          id: 'question-1',
          text: 'What is 2+2?',
          correctOption: 1, // correctOption should be a number
          options: ['1', '2', '3'], // options remain as strings
        },
      ],
    };

    // Add this quiz to the mock data
    quizzes.push(quiz); // Assuming quizzes is the array storing quizzes

    const data = {
      quizId: 'quiz-1',
      questionId: 'question-999', // Invalid question ID
      selectedOption: 1,
    };

    const response = await request(app)
      .post(`/quizzes/${data.quizId}/questions/${data.questionId}/submit`)
      .send(data);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Question not found');
  });
});

describe('Submit Answer Endpoint', () => {
  it('should return 404 when the quiz is not found', async () => {
    // Create a quiz with a sample question
    const quiz = {
      id: 'quiz-1',
      title: 'Sample Quiz',
      questions: [
        {
          id: 'question-1',
          text: 'What is 2+2?',
          correctOption: 1, // correctOption should be a number
          options: ['1', '2', '3'], // options remain as strings
        },
      ],
    };

    // Add this quiz to the mock data
    quizzes.push(quiz); // Assuming quizzes is the array storing quizzes

    const data = {
      quizId: 'quiz-999', // Invalid quiz ID
      questionId: 'question-1',
      selectedOption: 1,
    };

    const response = await request(app)
      .post(`/quizzes/${data.quizId}/questions/${data.questionId}/submit`)
      .send(data);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Quiz not found');
  });
});
