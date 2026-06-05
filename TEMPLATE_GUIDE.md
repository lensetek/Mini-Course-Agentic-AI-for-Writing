# Guide: Using This Project as a Template

This document provides a step-by-step guide on how to use the source code of this project to create a new course application.

## 1. Copying the Source Code
Copy the entire project folder to a new location, **excluding** the following files and directories:
- `node_modules/` (You will need to run `npm install` again in the new project).
- `.git/` (Delete this folder so you can initialize a fresh Git repository using `git init`).
- `.env.local` or any other credential files (Do not copy old project credentials to the new project).
- `.gemini/` folder or any other specific AI configuration artifacts (if applicable).

## 2. Installing Dependencies
Once the folder has been copied, open your terminal in the new project directory and run:
```bash
npm install
```

## 3. Environment & Database Configuration (Security & Isolation)
**CRITICAL RULE**: **Selalu cek keamanan credential project agar tidak ter ekspose public seperti di frontend atau diakses melalui client side.**
- Create a new `.env.local` file based on the `.env.example` file.
- Create a new backend/Firebase project (if required) and insert the new configuration/API Keys into `.env.local`.
- **CRITICAL DATA ISOLATION**: If you must reuse an existing Firebase project, you **MUST** rename all database collections in your source code (e.g., in Firestore, rename `progress` to `newcourse_progress`, `certificates` to `newcourse_certificates`). Using the exact same collection names as an existing live project will corrupt and overwrite active student data across multiple courses.
- Remember: Only use the `VITE_` prefix for environment variables that are safe and need to be read by the browser/frontend. Never expose highly sensitive secret keys (like Firebase Admin credentials) in frontend variables. As this project is fully serverless and uses OpenAI Custom GPTs for the AI Mentor, there is no local backend and no OpenAI API key should be required.

## 4. Updating Project Identity
Update the application identity from the old project to the new one in the following files:
- **`package.json`**: Update the `"name"` and `"description"` properties to match your new course (e.g., "Mini-Course-Agentic-AI-for-Writing").
- **`index.html`**: Update the text inside the `<title>...</title>` tag.
- **Visual Assets**: Replace the logo, favicon, and other images in the `public/` and `src/assets/` directories.

## 5. Course Content Customization
- Adjust the content structure, quizzes, modules, and text on UI components or in your JSON/database files.
- Replace any static text on the registration page, home page, or dashboard.
- **AI Mentor Sandbox**: Update the Custom GPT URL link in `src/App.jsx` (inside the AI Mentor rendering block) if you create a new specialized OpenAI Custom GPT for the new course.

## 6. Certificate Customization
If your course uses the automated certificate generation feature:
- **Certificate Prefix**: Open `src/App.jsx` and locate the `createCertificateNo` function. Change the prefix (e.g., `LAIMRA-`) to a unique acronym representing your new course. This ensures new certificates do not conflict with old ones.
- **Certificate Template Overlay**: The base image `public/cert-template.png` may contain hardcoded text. If so, ensure that the dynamic HTML overlay and `jsPDF` coordinate logic in `drawCertificatePdfPage` are properly aligned and sized to cover the old text with the new `courseTitle`. Alternatively, replace `cert-template.png` with a clean image that doesn't have the hardcoded course name.

## 7. Design Guidelines (Mobile-First)
**CRITICAL RULE**: **Selalu perhatikan tampilan responsive mobile-view first.**
Ensure you always adhere to the project's core design principle:
- When creating or modifying UI components, design and optimize the layout for mobile screen sizes first before scaling up to tablet or desktop views.
- Always use the browser's developer tools to test the mobile-view mode after making any styling (CSS) changes to guarantee a seamless mobile experience.

---
Once all the steps above are completed, you can run the new project locally with the following command:
```bash
npm run dev
```
