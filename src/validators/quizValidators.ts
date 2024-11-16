import Joi from 'joi';

export const createQuizSchema = Joi.object({
  title: Joi.string().required().max(255),
  questions: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        correctOption: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});


export const submitAnswerSchema = Joi.object({
  userId: Joi.string().required(),
  selectedOption: Joi.number().integer().min(0).max(3).required() // Selected option must be a non-negative integer
});

// Define the Joi schema for getQuiz URL parameters
export const getQuizUrlParamsSchema = Joi.object({
  id: Joi.string().required(),
});

// Define the Joi schema for submitAnswer URL parameters
export const submitAnswerUrlParamsSchema = Joi.object({
  quizId: Joi.string().required(),
  questionId: Joi.string().required(),
});

// Define the Joi schema for getResults URL parameters
export const getResultsUrlParamsSchema = Joi.object({
  quizId: Joi.string().required(),
  userId: Joi.string().required(),
});
