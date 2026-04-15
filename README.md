# Full-Stack Starter (React + Express)

This project is a simple full-stack application with:

- Frontend: React (http://localhost:3000)
- Backend: Express (http://localhost:8080)

---

## Requirements

- Node.js (recommended: Node 18+)
- npm

---

## Project Structure

project-root/
    server/
        server.js
        package.json
        src/
          routes/
          services/

    client/
        package.json
        src/
          api/
          components/
          pages/
          styles/
          App.js
          index.js

---

## Installation

Clone the repository:
git clone https://github.com/BenIncollingo/capstone-legal-genAI.git
cd capstone-legal-genAI

Install backend dependencies:
cd server
npm install

Install frontend dependencies:
cd ../client
npm install

---

## Running the Project (Development)

Start the backend:
cd server
node server.js

Backend runs on:
http://localhost:8080

Start the frontend:
cd client
npm run build
npx serve -s build -l 3000

Frontend runs on:
http://localhost:3000

---

## How the Frontend Talks to the Backend

1. User interacts with the frontend
2. Frontend sends a request using fetch()
3. Request is sent to /api/...
4. Backend processes the request
5. Backend returns JSON
6. Frontend updates UI with response

---

## Proxy (Development Only)

Frontend runs on port 3000  
Backend runs on port 8080  

Requests to /api/... are automatically forwarded to the backend
to avoid CORS issues.

---

## Backend Overview

server.js
- Initializes Express
- Adds middleware (express.json)
- Mounts routes under /api
- Starts the server

routes/
- Defines API endpoints

services/
- Contains business logic and external API calls

---

## Frontend Overview

src/api/
- Handles requests to backend

src/components/
- Reusable UI components

src/pages/
- Page-level components

src/styles/
- Global styling

App.js
- Handles routing

index.js
- React entry point

---

## Scaling the Project

As the project grows:
- Add new backend routes inside `backend/src/routes`
- Add matching services in `backend/src/services`
- Add new frontend API helpers in `frontend/src/api`
- Keep UI components reusable
- Keep pages as route-level components

## Run test
cd client
npm test
---
## Run Unit Test
git switch unit-test
Cd client
npx jest unit.test.js


- Add routes in server/src/routes
- Add logic in server/src/services
- Add API calls in client/src/api
- Keep components reusable
- Keep pages clean and organized
