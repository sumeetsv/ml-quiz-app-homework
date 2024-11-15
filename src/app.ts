import express from 'express';
import quizRoutes from './routes/quizRoutes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/', quizRoutes);

// Global error handler
app.use(errorHandler); 

export { app };
