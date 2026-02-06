# Full-Stack Starter (React + Express)

This repo is a simple full-stack starter with:
- **Frontend:** Create React App on `http://localhost:3000`
- **Backend:** Express on `http://localhost:8080`

For now the frontend calls the backend through a test route (`/api/data/test`) to demonstrate the full request flow.  In the future the `/api/data/` route will handle everything related to cleaning/initializing our data documents 

---

## Requirements

- Node.js (recommended: Node 18+)
- npm (comes with Node)

---

## Project Structure
```
project-root/  
    backend/  
    server.js  
    package.json  
    src/  
      routes/  
        index.js  
        data.routes.js  
      services/  
        data.service.js

  frontend/
    package.json
    src/
      api/
        data.api.js
      components/
        DataButton.jsx
        DataButton.css
      pages/
        Home.jsx
      styles/
        global.css
      App.js
      index.js
```

---

## Installation

### Clone the repository
```
git clone https://github.com/BenIncollingo/capstone-legal-genAI.git  
cd capstone-legal-genAI
```

### Install backend dependencies
```
cd backend  
npm install
```

### Install frontend dependencies
```
cd ../frontend  
npm install
```

---

## Running the Project (Development)

### Start the backend
From the backend folder:
```
node server.js
```

The backend will run on:
http://localhost:8080

### Start the frontend
From the frontend folder:
```
npm start
```

The frontend will run on:
http://localhost:3000

---

## How the Frontend Calls the Backend

### High-level flow

1. The user clicks a button on the frontend.
2. The frontend calls `/api/data` using `fetch()`.
3. The React dev server proxies the request to `http://localhost:8080`.
4. The backend receives the request and routes it to the correct handler.
5. A service function runs backend logic.
6. The backend returns JSON to the frontend.
7. The frontend receives and logs the response.

---

## Why a Proxy Is Used

The frontend runs on port 3000 and the backend runs on port 8080. Since these are different origins, the browser would normally enforce CORS rules.

To simplify development, Create React App uses a proxy:
- Frontend requests `/api/...`
- React forwards the request to `http://localhost:8080/api/...`

This avoids CORS configuration during local development.

---

## Backend File Responsibilities

### backend/server.js
- Creates the Express app
- Adds middleware (express.json)
- Mounts all API routes under `/api`
- Starts the server on port 8080

### backend/src/routes/index.js
- Central router that groups feature routes
- Mounts `/data` routes
- Keeps routing scalable as features grow

### backend/src/routes/data.routes.js
- Handles routes under `/api/data`
- Example:
  - GET `/api/data/test`
- Calls a service function to separate logic from routing

### backend/src/services/data.service.js
- Contains business logic
- Currently logs a test message
- This is where we will write our scripts/algorithms for cleanup data, etc.

### Backend Route Nesting Explanation

Routes are layered:
- server.js mounts `/api`
- index.js mounts `/data`
- data.routes.js uses `/test`

Combined, the final endpoint becomes:
`/api/data/test`

---

## Frontend File Responsibilities

### frontend/package.json
- Contains dependencies (list of npm libraries/packages used) and scripts
- Includes a proxy pointing to `http://localhost:8080` (backend)

### frontend/src/api/data.api.js
- Centralized place for backend requests
- Uses fetch to call `/api/data`
- The /api folder is where we will call the endpoints in our backend from out frontend 

### frontend/src/App.js
- Sets up routing using react-router-dom (sets the routes that push each page)

### frontend/src/index.js
- React entry point
- Renders the App component
- Imports global styles

### frontend/src/styles/global.css
- Global CSS styles
- Handles resets, layout, and basic styling

---

## Testing the Connection

1. Start the backend on port 8080
2. Start the frontend on port 3000
3. Open the frontend in the browser
4. Click the backend test button
5. Backend console output should show:
   route hit: /api/data/test
   test
6. Frontend console output should show:
   { message: "data route working" }

---

## Scaling the Project

As the project grows:
- Add new backend routes inside `backend/src/routes`
- Add matching services in `backend/src/services`
- Add new frontend API helpers in `frontend/src/api`
- Keep UI components reusable
- Keep pages as route-level components

---
