# Skill-to-Career AI Engine (Backend)

The Node.js Express backend powering the Skill-to-Career AI Engine. This service handles user authentication, centralized career profile management, and integrates with the OpenRouter AI API to generate dynamic skill analyses and career roadmaps.

## Features

- **User Authentication**: Secure JWT-based registration and login system.
- **AI Integration**: Communicates with OpenRouter (using models like Meta Llama 3) to process resume text, analyze skill gaps, and generate step-by-step career roadmaps.
- **Profile Management**: Stores user goals, current skills, target skills, timeline configurations, and calculated match scores in a MongoDB database.
- **Dynamic Fallbacks**: Resilient backend architecture that gracefully handles AI API failures or timeouts.

## Tech Stack

- **Framework**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **AI Service**: OpenRouter API
- **File Uploads**: `multer` for resume parsing

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- OpenRouter API Key

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
   OPENROUTER_API_KEY=your_openrouter_api_key
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
