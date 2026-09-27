# Task Ledger (ED2 Task Manager)

A simple task management web app built for FAU's Engineering Design 2 course, using AI-assisted development tools as taught in the AI Hootcamp lectures.

**Live app:** https://glittering-hamster-d6bdb5.netlify.app

## What It Does

Task Ledger lets users register an account, log in, and manage a personal to-do list. Each user only sees and can modify their own tasks — data is scoped per-account using Firebase Authentication and Firestore security rules.

**Features:**
- User registration, login, and logout (Firebase Authentication)
- Create, read, update, and delete tasks (Firestore)
- Mark tasks complete/incomplete
- Set a due date and priority level per task
- Real-time sync — changes reflect instantly without a page refresh
- Per-user data isolation enforced via Firestore security rules

## Technologies Used

- **Frontend:** React (Vite)
- **Routing:** React Router
- **Backend/Database:** Firebase (Authentication + Firestore)
- **Deployment:** Netlify
- **Version control:** Git/GitHub

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/nchowdhury2021-commits/ed2-task-manager.git
   cd ed2-task-manager
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the project root with your own Firebase project config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Demo Video

https://www.youtube.com/watch?v=E2Mj-UYHnd8

## Author

Naqib Chowdhury — FAU Engineering Design 2
