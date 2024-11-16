import Joi from 'joi';

export const createQuizSchema = Joi.object({
  title: Joi.string().required().max(255),
  questions: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        correct_option: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});


export const submitAnswerSchema = Joi.object({
  quizId: Joi.string().required(), // Quiz ID must be a string
  questionId: Joi.string().required(), // Question ID must be a string
  selectedOption: Joi.number().integer().min(0).required(), // Selected option must be a non-negative integer
});


export const getResultsSchema = Joi.object({
  userId: Joi.string().required(),
});
