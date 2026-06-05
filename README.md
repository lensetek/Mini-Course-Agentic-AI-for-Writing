# Mini Course: Agentic AI for Writing

An interactive web learning platform for the **Agentic AI for Writing** mini course by Lensetek International. The app combines a course landing page, student classroom, bilingual learning modules, quiz verification, certificate flow, and a server-side AI Mentor sandbox.

The platform is designed for writers, copywriters, content creators, authors, marketers, and professionals who want to learn how to design AI agent workflows for writing without starting from code.

## App Overview

The platform includes:

- **Course landing page** for benefits, use cases, competencies, and curriculum overview.
- **Student classroom** with private access through invitation codes.
- **Bilingual learning modules** in English and Bahasa Indonesia.
- **Interactive AI Sandbox Lab** for running an AI Mentor in the context of each module.
- **Quiz verification** to validate understanding in each module.
- **Certificate of Completion** after all module challenges are completed.
- **Certificate verification page** for checking certificate credentials.
- **Student profile management** using Firebase Authentication and Firestore.

## Course Modules

The course contains 5 main modules with a total of 20 learning hours:

1. **Foundations of Agentic AI**
   - Chatbots vs autonomous agents.
   - Custom AI assistants / Gemini Gems.
   - Chain-of-thought and structured reasoning workflows.

2. **Workflows & Multi-Agent Systems**
   - Designing specialized AI assistants.
   - Collaborative multi-agent workflows.
   - Reviewer agents, guardrails, and human-in-the-loop checkpoints.

3. **Advanced AI Writing Workflows**
   - Automated SEO writing workflows.
   - Long-form content generation.
   - Editing and proofreading agents.

4. **Content Operations with AI**
   - Visual AI mini-apps with drag-and-drop workflows.
   - Content repurposing automation.
   - Idea generation and research agents.

5. **Low-Code Deployments & Launch**
   - Low-code connections and automation triggers.
   - Quota, cost, and usage-limit monitoring.
   - Security checklist before production release.

## Key Features

- Google login / registration via Firebase Authentication.
- Private classroom access through invitation codes.
- Progress, biodata, and certificate storage in Firestore.
- Learning materials with session breakdowns for each module.
- Module quizzes to unlock course progress.
- AI Mentor sandbox through a direct link to OpenAI ChatGPT Custom GPT.
- Certificate generator and verification URL.
- Responsive UI with React, Vite, Tailwind CSS, Framer Motion, and Lucide React.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Authentication & database**: Firebase Authentication, Firestore, Firebase Analytics
- **Icons**: Lucide React
- **Build tools**: Vite, ESLint

## Installation

### Prerequisites

- Node.js 18 or newer.
- npm.
- A Firebase project with Authentication and Firestore enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/lensetek/Mini-Course-Agentic-AI-for-Writing.git
cd Mini-Course-Agentic-AI-for-Writing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root. Do not commit this file to the repository.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_CREDENTIAL_URL=http://localhost:5173
```

Security notes (**CRITICAL**):
- **Selalu cek keamanan credential project agar tidak terekspose public seperti di frontend atau diakses melalui client side.**
- Variables with the `VITE_` prefix are bundled into the frontend by Vite. Use them only for public client configuration such as Firebase web config.
- `.env.local`, `.env`, and other env files are ignored by `.gitignore`.
- Invitation codes should be stored in Firestore, not in frontend environment variables.

### 4. Run the Frontend

Open your terminal:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Runs the Vite frontend for development.

```bash
npm run build
```

Creates a production build of the frontend.

```bash
npm run preview
```

Runs the Vite production preview.

```bash
npm run lint
```

Runs ESLint.

## Development Guidelines

- **Mobile-View First**: Selalu perhatikan tampilan responsive mobile-view first saat mengembangkan komponen UI.

## Deployment

The frontend can be deployed to Firebase Hosting, Vercel, Netlify, or another static hosting platform that supports Vite.

## License

Copyright 2026 Lensetek International, LLC. All rights reserved.
