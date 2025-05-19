# Patient Voices

Patient Voices is a full-stack web application where users can share and read personal reviews of diseases, helping others better understand their impact. Inspired by platforms like RateMyProfessor and health forums, the app emphasizes community experiences and subjective insight.

## Features

- Browse a catalog of diseases (using a public API).
- Leave severity ratings (1–5) and optional comments on diseases.
- View average severity per condition.
- Rate other users' reviews as helpful.
- Register and log in with secure password hashing and JWT-based authentication.
- Fully responsive frontend built with React and Vite.

## Tech Stack

**Frontend:**
- React
- Vite
- CSS (Vanilla)

**Backend:**
- Node.js
- Express
- PostgreSQL (via Neon)
- Knex.js
- bcrypt (password hashing)
- JSON Web Tokens (JWT)

**Deployment:**
- Frontend: Render
- Backend: Render

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/patient-voices.git
   ```

2. Install dependencies:
   - For backend:
     ```bash
     cd backend
     npm install
     ```
   - For frontend:
     ```bash
     cd frontend
     npm install
     ```

3. Set up environment variables:
   - In `/backend`, create a `.env` file:
     ```
     PGHOST=your_neon_host
     PGDATABASE=your_database_name
     PGUSER=your_user
     PGPASSWORD=your_password
     JWT_SECRET=your_jwt_secret
     ```

4. Start the servers:
   - Backend: `npm run dev` (if using nodemon)
   - Frontend: `npm run dev`

5. Access the app at `http://localhost:5173`

## License

This project is licensed under the MIT License.

## Author

Gabriel Roisenberg Rodrigues — (https://github.com/groisenberg79)