# ML Quiz App

## Description

A quiz application that allows users to answer multiple-choice questions and receive feedback on their performance.

## Getting Started

### Prerequisites

Make sure you have `Node.js` and `npm` installed on your machine. If not, download and install it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sumeetsv/ml-quiz-app-homework.git
    ```
2. Navigate to the project directory:
    ```bash
    cd ml-quiz-app-homework
    ```
3. Create a .env file at the root of the project. You can copy the sample below:
    ```bash
    PORT=3000
    ```
4. Install the dependencies:
    ```bash
    npm install
    ```

### Running the Project

To run the project in development mode with `nodemon`:

```bash
npm run devStart
```

### Building the Project

To compile the TypeScript code into JavaScript:

```bash
npm run build
```

### Running Tests

To run the tests using Jest:

```bash
npm test
```

### Starting the Application

After building the project, you can start the application using:

```bash
npm start
```

## Folder Structure

-   `src/`: Contains all source code files.
-   `dist/`: Contains the compiled JavaScript files after building the project.
-   `tests/`: Contains unit and integration test files.

## Technologies Used

-   **Node.js** - JavaScript runtime used for the server.
-   **Express.js** - Web framework for building the API.
-   **Jest** - Testing framework for unit and integration tests.
-   **TypeScript** - Superset of JavaScript for type safety.
-   **Joi** - Validation library for request validation.
-   **Supertest** - Testing library for HTTP assertions.

## Dependencies

-   **express**: Web framework for Node.js
-   **dotenv**: Loads environment variables from `.env` files
-   **joi**: Object schema validation
-   **uuid**: Simple UUID generation
-   **winston**: Logger

## Development Dependencies

-   **jest**: Testing framework
-   **ts-jest**: TypeScript preprocessor for Jest
-   **nodemon**: Automatically restarts the server during development
-   **typescript**: TypeScript language support
-   **supertest**: HTTP assertions for testing APIs

## Summary of Data Models

### `Question` Model

```
{
  "id": "1",
  "text": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correct_option": 3
}
```

### `Quiz` Model

```
{
  "id": "12345",
  "title": "Sample Quiz",
  "questions": [
    {
      "id": "1",
      "text": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"],
      "correct_option": 3
    },
    {
      "id": "2",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_option": 2
    }
  ]
}
```

### `Answer` Model

```
{
  "question_id": "1",
  "selected_option": 3,
  "is_correct": true
}
```

### `QuizResult` Model

```
{
  "quiz_id": "12345",
  "user_id": "user123",
  "score": 1,
  "answers": [
    {
      "question_id": "1",
      "selected_option": 3,
      "is_correct": true
    },
    {
      "question_id": "2",
      "selected_option": 4,
      "is_correct": false
    }
  ]
}
```
