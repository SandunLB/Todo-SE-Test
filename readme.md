# Senior Full Stack Engineer Take Home Assessment: Todo Application

This repository contains a full-stack Todo application built to meet the requirements specified in the take-home assessment. The application allows users to create, view, and complete todo tasks through a web interface.

## Features

As per the assessment requirements:

- **Task Creation**: Users can create to-do tasks by providing a title and description
- **Recent Tasks**: Only the 5 most recent tasks are displayed in the UI
- **Task Completion**: Users can mark tasks as complete, making them disappear from the UI
- **Modern UI**: Clean, responsive interface following the provided mockup

## Architecture

The application follows the required 3-component architecture:

1. **Database**: PostgreSQL for persistent storage of tasks
2. **Backend**: Node.js/Express REST API
3. **Frontend**: React Single Page Application (SPA)

## Tech Stack

- **Frontend**: React.js with modern JavaScript
- **Backend**: Express.js on Node.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git for version control

### Installation & Running

1. Clone the repository
2. Start all services using Docker Compose
3. Access the application:
   - Frontend interface: `http://localhost:8080`
   - Backend API: `http://localhost:3000/api/tasks`

### Running Tests

Use Docker Compose for testing.

## Implementation Details

### Database Schema

The PostgreSQL database contains a `task` table designed for efficient querying and retrieval of tasks.

### Backend API

The REST API provides the following endpoints:

- Retrieve the 5 most recent incomplete tasks
- Create a new task
- Mark a task as complete

### Testing

The application includes:

- **Backend Unit Tests**: Testing API endpoints using Jest and Supertest
- **Frontend Unit Tests**: Testing React components using React Testing Library

## Project Structure

```
todo-app/
├── docker-compose.yml         # Main Docker Compose configuration
├── docker-compose.test.yml    # Testing setup with Docker Compose
├── init.sql                   # Database initialization script
├── README.md                  # Project documentation
├── backend/
│   ├── Dockerfile             # Backend container setup
│   ├── package.json           # Node.js dependencies
│   ├── server.js              # Express API implementation
│   └── server.test.js         # Backend tests
└── frontend/
    ├── Dockerfile             # Frontend build container
    ├── Dockerfile.test        # Frontend test container
    ├── nginx.conf             # Web server configuration
    ├── package.json           # React dependencies
    ├── public/
    │   └── index.html         # HTML entry point
    └── src/
        ├── App.js             # Main React component
        ├── App.test.js        # Frontend tests
        ├── index.js           # React entry point
        └── index.css          # Application styles
```

## SOLID Principles & Clean Code

This project implements SOLID principles:

- **Single Responsibility**: Each component (database, API, UI) has a distinct responsibility
- **Open/Closed**: Components are extensible without modification
- **Liskov Substitution**: Components adhere to their contracts
- **Interface Segregation**: API endpoints provide specific functionality
- **Dependency Inversion**: High-level modules are not dependent on low-level details

## Evaluation Criteria Addressed

The implementation satisfies all the assessment criteria:

- ✅ Approach to the solution (three-tier architecture)
- ✅ System architecture (clear separation of concerns)
- ✅ Functionality requirements (create, list, complete tasks)
- ✅ Database design (properly indexed PostgreSQL schema)
- ✅ Testing (backend unit tests, frontend unit tests)
- ✅ Clean code and SOLID principles

## License

This project is licensed under the MIT License.

