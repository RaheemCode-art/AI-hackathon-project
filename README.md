# AI Fitness Coach

## Overview
AI Fitness Coach is a full-stack, AI-powered platform designed to deliver highly personalized fitness guidance. By utilizing computer vision for body analysis and large language models for plan generation, the application provides users with customized diet and workout routines. The system also includes a comprehensive Admin Panel to monitor platform activity, manage users, and moderate AI outputs to ensure quality and safety.

## Core Features

### User Experience
*   **AI Onboarding & Body Analysis:** Users upload four body images (Front, Back, Left, Right). The system uses MediaPipe to detect posture, identify body landmarks, and estimate the user's BMI.
*   **Goal-Oriented Generation:** Users define their fitness objectives, choosing from Weight Loss, Weight Gain, Muscle Building, or Maintenance.
*   **Personalized Diet & Workout Plans:** Based on the analysis and goals, the AI generates custom meal plans (including calories, macros, and allergy awareness) and workout splits (Home or Gym routines with specific sets and reps).
*   **Daily Habit Tracker & Dashboard:** A central hub where users track meals, water intake, workouts, and sleep to build streaks and improve their overall fitness score.
*   **Context-Aware AI Chatbot:** An integrated RAG (Retrieval-Augmented Generation) chatbot that provides personalized fitness advice based on the user's specific active plans and historical progress data.
*   **Weekly Progress Tracking:** Users can upload weekly photos for comparison and receive AI-driven insights on their journey.

### Admin Panel & Moderation
*   **User & Analytics Management:** Admins can view all users, track active users (DAU/WAU), monitor plan completion rates, and manage accounts (ban/deactivate).
*   **AI Output & Plan Control:** Admins have the authority to review generated plans, adjust prompt templates for AI tuning, and manually override or edit plans for specific users.
*   **Content Moderation:** A dedicated system to review uploaded body images and chatbot conversations, allowing admins to delete flagged content or block abusive users to maintain safety.
*   **System Logs:** Comprehensive tracking of system errors and AI usage metrics (like API calls and token usage).

## Technical Architecture

*   **Frontend:** Built with React, utilizing Tailwind CSS (with ShadeCN/Material UI) for the interface, featuring separate routing for User and Admin dashboards.
*   **Backend:** Node.js and Express.js REST APIs configured with JWT authentication and Role-Based Access Control (RBAC).
*   **Database:** MongoDB handling collections for Users, Plans, Progress, Chat logs, and Admin logs.
*   **Real-Time Sync:** Socket.IO integrated for live chat updates and progress synchronization.
*   **AI Layer:**
    *   MediaPipe for pose detection and body structure estimation.
    *   LLM integration (OpenAI/Gemini/Groq) for dynamic text generation and the RAG system.

## Application Flows

### User Flow
1. Signup/Login to the platform.
2. Upload required body images for AI analysis.
3. Select a primary fitness goal.
4. Receive the AI-generated diet and workout plan.
5. Track daily habits and chat with the AI coach for guidance.
6. Submit weekly updates for continuous tracking.

### Admin Flow
1. Secure Admin login.
2. View high-level dashboard analytics.
3. Monitor user activity and system logs.
4. Review and moderate AI outputs, chat logs, and uploaded images.
5. Adjust system settings and AI prompt templates as needed.

## Important Constraints
Please note that the AI components are not medically certified. The image analysis provides estimations, and strict admin moderation is required to ensure user safety and appropriate platform usage.