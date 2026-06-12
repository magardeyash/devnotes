# DevNotes

DevNotes is a personal developer notes and code snippets manager, now featuring an integrated **Gemini AI Developer Assistant** and a custom **Landing Page**. 

## Features

- **Personalized Dashboards:** Search and filter your code snippets by title, contents, or category tags.
- **Categorized Tags:** Keep your notes cleanly organized under tags (`JavaScript`, `TypeScript`, `CSS`, `HTML`, `Python`, `General`, `DevOps`, `Database`).
- **Secure Authentication:** Keep your snippets private using password hashing (bcryptjs) and JWT validation.
- **✨ Integrated Gemini AI Assistant:**
  - **Auto-Tag:** Analyzes your snippet content to auto-detect and assign categories.
  - **AI Enhance:** Standardizes, formats, and comments code structures.
  - **AI Explain:** Generates bulleted annotations summarizing code logic.
  - *Fallback Simulation:* Works seamlessly out-of-the-box using rule-based mock fallbacks if no API key is specified!

---

## Tech Stack

- **Frontend:** React (Vite), React Router v6, Axios, Vanilla CSS
- **Backend:** Node.js, Express.js, JWT (jsonwebtoken), bcryptjs, @google/generative-ai
- **Database:** MongoDB + Mongoose (Atlas or Local)
- **Tooling:** dotenv, nodemon

---

## Folder Structure

```
devnotes/
├── backend/
│   ├── middleware/      # authMiddleware.js
│   ├── models/          # User.js, Note.js
│   ├── routes/          # auth.js, notes.js, ai.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/         # axiosInstance.js
│   │   ├── components/  # Navbar, NoteCard, ProtectedRoute
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Landing, Login, Register, Dashboard, NoteDetail
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Local Setup & Run

### Prerequisites
- Node.js installed (v18+)
- Local MongoDB running, or a MongoDB Atlas connection string.
- (Optional) A Gemini API key from Google AI Studio.

### 1. Setup Backend
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template and configure:
   ```bash
   cp .env.example .env
   ```
   *Note: Edit `.env` to supply your custom `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` (if using actual Gemini AI).*
4. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. In a new terminal, navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite dev server (runs on port 5173):
   ```bash
   npm run dev
   ```

---

## API Reference

### Auth Endpoints (`/api/auth`)
- **POST `/register`** - Register a new user. Expects JSON `{ "name", "email", "password" }`. Returns JWT token and user details.
- **POST `/login`** - Authenticate user. Expects JSON `{ "email", "password" }`. Returns JWT token and user details.

### Notes Endpoints (`/api/notes`) - *All Protected*
*Requires header: `Authorization: Bearer <token>`*
- **GET `/`** - Get all notes for the authenticated user (sorted by newest).
- **POST `/`** - Create a new note. Expects JSON `{ "title", "content", "tag" }`.
- **GET `/:id`** - Get details for a single note (must belong to user).
- **PUT `/:id`** - Update fields of a note (must belong to user).
- **DELETE `/:id`** - Delete a note (must belong to user).

### AI Assistant Endpoints (`/api/ai`) - *All Protected*
*Requires header: `Authorization: Bearer <token>`*
- **POST `/assist`** - Query AI help. Expects JSON `{ "action", "title", "content" }` where `action` is `'suggest_tag'`, `'enhance'`, or `'explain'`.

### Health Check Endpoint
- **GET `/api/health`** - Check system health/uptime. Returns `{ "status": "ok", "timestamp" }`.

---

## Deployment Notes

### Backend (Railway/Render)
- Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (Frontend URL), `PORT`, and `GEMINI_API_KEY`.
- Build command: `npm install`
- Start command: `node server.js`

### Frontend (Vercel/Netlify)
- Set Environment Variable: `VITE_API_URL` to point to your deployed backend API URL (e.g. `https://your-backend-app.herokuapp.com/api`).
- Build command: `npm run build`
- Output directory: `dist`
