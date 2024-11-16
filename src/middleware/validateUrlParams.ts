import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

// Define the validateUrlParams middleware
export const validateUrlParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      // Send a 400 Bad Request response with validation error details
      res.status(400).json({
        status: 'error',
        message: 'Invalid URL parameters',
        details: error.details.map((err) => err.message),
      });
      return;
    }

    // If validation passes, pass control to the route handler
    next();
  };
};
