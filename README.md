# Skill-to-Career AI Engine (Backend)

The Node.js Express backend powering the Skill-to-Career AI Engine. This service handles user authentication, centralized career profile management, and integrates with the Google Gemini API to generate dynamic skill analyses and career roadmaps.

## Features

- **User Authentication**: Secure JWT-based registration and login system.
- **AI Integration**: Communicates with Google's Gemini API to process resume text, analyze skill gaps, and generate step-by-step career roadmaps.
- **Robust AI Fallback & Retry System**:
  - **Primary Model**: `gemini-3.1-flash-lite`
  - **Secondary Model**: `gemini-2.5-flash`
  - **Resilience**: Automatically detects Rate Limits (429) or Server Overloads (503) and retries requests up to 2 times with a 1.5s delay.
  - **Graceful Degradation**: If both primary and secondary models fail, the system seamlessly falls back to static estimations without crashing the application.
- **Profile Management**: Stores user goals, current skills, target skills, timeline configurations, and calculated match scores in a MongoDB database.

## Tech Stack

- **Framework**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **AI Service**: Google Gemini API (`generativelanguage.googleapis.com`)
- **File Uploads**: `multer` for resume parsing

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Or for development (with nodemon):
   ```bash
   npm run dev
   ```

## Deployment

This backend is optimized for deployment on platforms like Render or Heroku. Ensure all environment variables are correctly mapped in your production environment settings.
