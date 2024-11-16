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
    cd ml-quiz-app
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

- `src/`: Contains all source code files.
- `dist/`: Contains the compiled JavaScript files after building the project.
- `tests/`: Contains unit and integration test files.

## Technologies Used

- **Node.js** - JavaScript runtime used for the server.
- **Express.js** - Web framework for building the API.
- **Jest** - Testing framework for unit and integration tests.
- **TypeScript** - Superset of JavaScript for type safety.
- **Joi** - Validation library for request validation.
- **Supertest** - Testing library for HTTP assertions.

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
