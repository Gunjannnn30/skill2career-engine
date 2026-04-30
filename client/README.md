# Skill-to-Career AI Engine (Frontend)

A modern, production-ready SaaS frontend built with React that maps users' current skills to their dream careers using AI.

## Features

- **Guest Mode**: Try out the core AI skill analysis without logging in.
- **SaaS Interface**: Clean, white-themed responsive layout with a collapsible sidebar and premium iconography. Adjusted visual spacing for optimized viewing experience on landing pages.
- **Secure Authentication**: Robust local email formatting and password strength validations implemented for seamless onboarding.
- **Career Roadmap**: Generates structured, time-based implementation roadmaps.
- **Skill Injection**: Actively track and mathematically recalculate your readiness score as you learn new skills.
- **Study Resources**: Actionable, curated study resources integrated directly into the roadmap.

## Tech Stack

- **Framework**: React.js
- **Styling**: Vanilla CSS (Custom Properties / Variables)
- **Icons**: `lucide-react`
- **Routing**: Internal React state management for SPA behavior

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository and navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `client` root:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Deployment

The frontend is optimized for deployment on Vercel or any static hosting provider.
```bash
npm run build
```
This command generates an optimized production build inside the `build/` folder.
