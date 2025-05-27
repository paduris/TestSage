# TestSage - AI Test Optimizer for TLM

TestSage is an AI-powered test optimization platform designed to help development teams identify high-risk areas in their code and generate targeted test suggestions. By leveraging AI to analyze code changes, TestSage helps improve software quality, reduce testing time, and prevent bugs from reaching production.

## Features

- **Repository Management**: Add, update, and manage Git repositories for analysis
- **Code Analysis**: Analyze code changes to identify risk areas and calculate risk scores
- **Risk Area Configuration**: Define custom patterns for identifying high-risk code areas
- **AI-Powered Test Generation**: Generate test suggestions based on identified risk areas
- **Dashboard & Visualization**: Track risk scores and testing progress across repositories

## Technology Stack

### Backend
- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **AI Integration**: Spring AI with OpenAI
- **Git Integration**: JGit

### Frontend
- **Framework**: React
- **State Management**: React Query
- **UI Components**: Custom components with CSS
- **Visualization**: Recharts

## Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL
- OpenAI API Key

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/testsage.git
cd testsage
```

2. Set up environment variables:
```bash
export OPENAI_API_KEY=your_openai_api_key
```

3. Start the PostgreSQL database:
```bash
docker-compose up -d db
```

### Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

The backend will be available at http://localhost:8080

### Running the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Usage Guide

### Adding a Repository

1. Navigate to the Repositories page
2. Click "Add Repository"
3. Enter repository details:
   - Name: A descriptive name for the repository
   - Git URL: The URL to the Git repository
   - Branch: The branch to analyze (e.g., main, develop)
   - Business Domain: The business domain of the repository

### Analyzing Code

1. Navigate to the repository detail page
2. Click "Analyze Now"
3. Wait for the analysis to complete
4. View the risk areas identified in the code

### Generating Test Suggestions

1. Navigate to an analysis detail page
2. Click "Generate Test Suggestions"
3. Review the generated test suggestions
4. Copy and implement the suggested tests in your codebase

### Configuring Risk Areas

1. Navigate to the Risk Configurations page
2. Select a repository
3. Add or edit risk area configurations:
   - Pattern: A regular expression to match file paths
   - Risk Weight: A value between 0.1 and 10 indicating risk level
   - Description: A description of why this pattern indicates risk

## Project Structure

### Backend

- `src/main/java/com/testsage/model`: Entity classes
- `src/main/java/com/testsage/repository`: Repository interfaces
- `src/main/java/com/testsage/service`: Service classes
- `src/main/java/com/testsage/controller`: REST controllers
- `src/main/java/com/testsage/config`: Configuration classes

### Frontend

- `src/components`: React components
- `src/services`: API service functions
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was developed as part of the TLM Hackathon 2025.
