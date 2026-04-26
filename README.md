# LegalAI – Document-Grounded Chat Application

LegalAI is a full-stack web application built with a React frontend and an Express.js backend. The application allows users to upload legal documents, ask questions through an AI chatbot, and receive responses grounded in the uploaded documents with citations.

---

## Tech Stack

### Frontend
- React
- CSS / Tailwind-style UI
- Firebase Authentication

### Backend
- Express.js
- Node.js
- API routes for chat, documents, and user-related actions
- Services for external API communication

### Database / Storage
- Cloud SQL / PostgreSQL for persistent chat history
- Firebase / Firestore for upload statistics and user account management
- External infrastructure API for document ingestion and AI responses

### Deployment
- Google Cloud Run
- Google Cloud Build

---

## Requirements
- Node.js (v18+ recommended)
- npm
- Google Cloud SDK (gcloud CLI)

---

## Features

- Account creation and user account management
- Password recovery / forgot password functionality
- Document upload system
- Document library
- Document-based question answering
- AI chat functionality
- Citation generation
- Persistent chat history

---

## Project Structure

```
capstone-legal-genAI/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── firebase/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## How the Application Works

1. The user creates an account or logs in through the React frontend.
2. The user uploads legal documents through the document upload page.
3. The Express backend receives the uploaded file and sends it to the infrastructure API for ingestion.
4. Uploaded document metadata is stored so the user can view documents in the document library.
5. The user asks a question through the chat interface.
6. The backend sends the question to the AI infrastructure API.
7. The AI response is returned with citations from the uploaded documents.
8. The chat message, response, citations, and related metadata are saved to the database.
9. The user can return later and view previous conversations through persistent chat history.

---

## Installation

Clone the repository:

```
git clone https://github.com/BenIncollingo/capstone-legal-genAI.git
cd capstone-legal-genAI
```

Install backend dependencies:

```
cd server
npm install
```

Install frontend dependencies:

```
cd ../client
npm install
```

---

## Running Locally
### Note that the upload document and chat features will not work unless deployed on the peered VPC network
Start the backend:

```
cd server
node server.js
```

Backend runs on:
http://localhost:8080

Start the frontend:

```
cd ../client
npm run build
npx serve -s build -l 3000
```

Frontend runs on:
http://localhost:3000

---

## Environment Variables
### Please note that this will not run locally without the .env files
Example backend .env:

```
PORT=8080
INFRA_BASE_URL=your_infra_api_url
PROJECT_ID=your_project_id
API_KEY=your_api_key
DATABASE_URL=your_database_url
```

Example frontend .env:

```
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Do not commit real API keys or secrets.

---

## Testing

Run frontend unit tests:

```
cd client
npm run test -- --coverage
```

---

## Deployment
### Note that this will not work without the .env.yaml files 

Before deploying, log in to the Google Cloud SDK:

```
gcloud auth login
```

Set your active project:

```
gcloud config set project YOUR_PROJECT_ID
```

Backend deployment:

```
cd server
gcloud run deploy lgl-backend --source . --region us-east1 --allow-unauthenticated --env-vars-file=.env.yaml --add-cloudsql-instances genai-legal-488518:us-east4:ai-legal-bot-chats
```

Frontend deployment:

```
cd ../client
gcloud run deploy lgl-frontend --source . --region us-east1 --allow-unauthenticated --env-vars-file=.env.yaml
```

---
