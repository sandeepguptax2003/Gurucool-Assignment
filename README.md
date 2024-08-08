# Quiz Application Backend

Quiz Application Backend is a backend application built using Node.js, Express.js, and MongoDB. It provides a RESTful API for creating, managing, and participating in timed quizzes.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Quiz Management](#quiz-management)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- Users can create timed quizzes with questions, options, and correct answers.
- The application automatically manages the status of quizzes (inactive, active, finished).
- Users can retrieve the currently active quiz.
- Users can retrieve the result of a quiz after 5 minutes of the quiz's end time.
- Users can retrieve a list of all quizzes (including inactive and finished).
- Secure access to the API endpoints using JWT-based authentication.
- Rate limiting to prevent abuse of the API.

## Technologies Used
- Node.js: A JavaScript runtime environment for server-side development.
- Express.js: A web application framework for Node.js, used for building the RESTful API.
- MongoDB: A NoSQL database, used for storing quiz and user data.
- Mongoose: An Object Document Mapping (ODM) library, used for interacting with MongoDB.
- Bcryptjs: A library for hashing passwords.
- JsonWebToken (JWT): A library for generating and verifying JSON Web Tokens for authentication.
- Express Rate Limit: A middleware that limits repeated requests to public APIs and endpoints.
- Node Cron: A library for scheduling tasks (used for updating quiz statuses).

## API Endpoints
# Authentication
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Login and receive a JWT token.
# Quiz Management
- POST /api/quizzes: Create a new quiz.
- GET /api/quizzes/active: Retrieve the currently active quiz.
- GET /api/quizzes/:id/result: Retrieve the result of a quiz.
- GET /api/quizzes/all: Retrieve a list of all quizzes.
- For detailed information about the request and response formats, please refer to the API Documentation:

## Installation

1. Clone the repository:
   git clone 

2. Change into the project directory:
cd Gurucool-Assignment
Install the dependencies:
npm install

3. Set up the environment variables:
Create a .env file in the root directory.
Add the following variables:
env
PORT=3800
MONGODB_URI=your-mongodb-url
JWT_SECRET=your_jwt_secret_here

4. Start the server:
nodemon server.js
The server will start running on the specified port (default is 3800)

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
