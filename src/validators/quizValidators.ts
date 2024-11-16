import Joi from 'joi';

export const createQuizSchema = Joi.object({
  title: Joi.string().required().max(255),
  questions: Joi.array()
    .items(
      Joi.object({
        questionText: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        correctAnswer: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

export const submitAnswerSchema = Joi.object({
  answer: Joi.string().required(),
  userId: Joi.string().required(),
});

export const getResultsSchema = Joi.object({
  userId: Joi.string().required(),
});
