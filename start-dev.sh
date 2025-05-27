#!/bin/bash

# Start development environment for TestSage

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting TestSage Development Environment${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${YELLOW}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Start PostgreSQL database
echo -e "${GREEN}Starting PostgreSQL database...${NC}"
docker-compose up -d postgres

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo -e "${YELLOW}Warning: OPENAI_API_KEY environment variable is not set.${NC}"
  echo -e "${YELLOW}AI features will not work without an API key.${NC}"
  echo -e "${YELLOW}Set it with: export OPENAI_API_KEY=your_api_key${NC}"
fi

# Start backend in a new terminal window
echo -e "${GREEN}Starting backend service...${NC}"
cd backend
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && ./mvnw spring-boot:run"'

# Start frontend in a new terminal window
echo -e "${GREEN}Starting frontend service...${NC}"
cd ../frontend
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm start"'

echo -e "${GREEN}TestSage development environment is starting up.${NC}"
echo -e "${GREEN}Backend will be available at: http://localhost:8080${NC}"
echo -e "${GREEN}Frontend will be available at: http://localhost:3000${NC}"
