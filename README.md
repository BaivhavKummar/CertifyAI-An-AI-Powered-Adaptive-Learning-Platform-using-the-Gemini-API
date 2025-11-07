
# CertifyAI - An AI-Powered Adaptive Learning Platform

---

## TITLE PAGE

**PROJECT REPORT**

_on_

### **CertifyAI: An AI-Powered Adaptive Learning Platform using the Gemini API**

_Submitted in partial fulfillment of the requirements for..._

**Submitted By:**

[Your Name]

[Your ID/Roll No.]

---

### BONAFIDE CERTIFICATE

Certified that this project report **"CertifyAI - An AI-Powered Adaptive Learning Platform"** is the bonafide work of **[Your Name] ([Your ID])** who carried out the project work under my/our supervision.

<br/>

**SIGNATURE**

**[Name of Supervisor]**

**HEAD OF THE DEPARTMENT / SUPERVISOR**

---

### PROJECT TITLE

CertifyAI - An AI-Powered Adaptive Learning Platform

---

### PROJECT DESCRIPTION

CertifyAI is an intelligent, full-stack adaptive learning platform designed to create personalized and efficient educational experiences. The core problem this project addresses is the "one-size-fits-all" approach of traditional learning systems, which often fails to cater to individual student pacing and understanding.

This platform leverages the power of the Google Gemini API to bridge this gap. For instructors, it offers powerful tools to automate content creation by generating high-quality, relevant quiz questions directly from a course syllabus. It also provides a suite of analytics tools, including cohort progress heatmaps and mastery trajectories, to monitor student performance in real-time. A standout feature is the AI-powered Study Guide Generator, which identifies a student's weakest topics and creates a personalized guide to help them improve.

For students, CertifyAI provides an adaptive learning path where topics are unlocked based on the mastery of prerequisites. This ensures a solid foundational understanding before moving to more advanced concepts. The platform includes an interactive quiz engine for assessments, a performance dashboard to track personal progress, and a conversational AI Tutor (powered by Gemini) to provide instant help and explanations on difficult topics.

The application is built with a modern tech stack, featuring a React/TypeScript frontend and a Python/Flask backend, and is fully containerized with Docker for easy setup and deployment.

---

### HARDWARE/SOFTWARE REQUIREMENTS

#### Hardware Requirements

*   **Processor**: Intel i3 / AMD Ryzen 3 or equivalent (or better)
*   **RAM**: 4 GB (8 GB recommended)
*   **Storage**: 10 GB of free disk space
*   **Internet Connection**: Broadband internet connection for API access and package downloads.

#### Software Requirements

*   **Operating System**: Windows 10/11, macOS, or a modern Linux distribution.
*   **Web Browser**: Latest version of Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.
*   **Core Technologies**:
    *   **Docker & Docker Compose**: For containerized setup and deployment (Recommended).
    *   **Node.js**: v18 or newer (for local development).
    *   **Python**: v3.8 or newer with `pip` (for local development).
*   **API Key**:
    *   **Google Gemini API Key**: A valid API key is required for all AI-powered features. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   **Key Frameworks & Libraries**:
    *   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Recharts.
    *   **Backend**: Python, Flask, `google-generativeai`.
*   **Development Environment**: A code editor like Visual Studio Code is recommended.

---

### ER DIAGRAM (Conceptual)

Below is a text-based representation of the Entity-Relationship model for the CertifyAI platform.

*   **Entities**: `User`, `Role`, `Topic`, `Question`.
*   **Relationships**:
    *   A `User` has one `Role`. (One-to-One)
    *   A `User` (as a Student) has mastery progress for many `Topics`. (One-to-Many, through a join table like `StudentProgress`)
    *   A `Topic` can have many prerequisite `Topics`. (Many-to-Many, self-referencing)
    *   A `Topic` contains many `Questions`. (One-to-Many)

```
+-------+       +--------+
| Role  |-------| User   |
+-------+       +--------+
                  |
                  | (is a Student)
                  |
+-----------------+-----------------+
|                                   |
| has mastery of                    | has
v                                   v
+-------+ -- (prerequisite) -- > +-------+
| Topic |                        | Topic |
+-------+ <----------------------> +-------+
  |
  | contains
  v
+-----------+
| Question  |
+-----------+
```

---

### SCHEMA

The data structures are defined in `frontend/src/types.ts`. The backend models align with this schema.

#### User & Role

```typescript
export enum Role {
  Student = 'STUDENT',
  Instructor = 'INSTRUCTOR',
}

export interface User {
  id: string;
  username: string;
  role: Role;
}
```

#### Topic

```typescript
export interface Topic {
  id: string;
  name: string;
  mastery: number; // Percentage from 0-100
  prerequisites: string[]; // Array of topic IDs
}
```

#### Question

```typescript
export enum QuestionType {
  MCQ = 'MCQ',
  ShortAnswer = 'ShortAnswer',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
  source: 'Manual' | 'LLM';
}
```

---

### FRONT-END & OUTPUT SCREENS

#### 1. Login Screen
*   **Description**: The entry point of the application. Users select their role (Student or Instructor) and enter a username.
*   **Features**: Role selection toggle, username input, validation, and a sleek, modern UI with a dynamic background.
*   **Output**: Upon successful login, the user is redirected to their respective dashboard.

#### 2. Student Console
A tabbed interface providing students with all necessary tools.
*   **Dashboard Tab**:
    *   **Description**: The main landing page for students.
    *   **Output**: Displays the adaptive `Learning Path`, visually showing completed, current, unlocked, and locked topics. A prominent button allows the student to start a quiz on their current topic.
*   **Performance Tab**:
    *   **Description**: An analytics view for students to track their own progress.
    *   **Output**: Shows an `Overall Mastery` score, a bar chart of `Mastery by Topic`, and lists of `Strengths` and `Areas for Improvement`.
*   **AI Tutor Tab**:
    *   **Description**: A conversational AI chat interface.
    *   **Output**: Students can ask questions about course topics and receive instant, helpful explanations generated by a (mocked) Gemini-powered backend.

#### 3. Quiz View
*   **Description**: The interface for taking quizzes. It presents one question at a time.
*   **Output**: After submitting an answer, the student receives immediate feedback, showing whether their answer was correct and providing a detailed explanation. Progress is tracked via a progress bar.

#### 4. Instructor Console
A tabbed interface for instructors to manage the course and students.
*   **Syllabus & AI Generation Tab**:
    *   **Description**: Instructors can paste their course syllabus and specify parameters for question generation.
    *   **Output**: After clicking "Generate," a loading spinner appears, and then a list of AI-generated questions is displayed in a `Question Review` panel for approval.
*   **Analytics Tab**:
    *   **Description**: Provides a cohort-level view of student performance.
    *   **Output**: Displays a `Mastery Heatmap` for a quick visual summary of every student's topic mastery and a `Mastery Trajectory Chart` to track progress over time.
*   **Study Guide Generator Tab**:
    *   **Description**: An AI tool to help struggling students.
    *   **Output**: The instructor selects a student, and the system identifies their weakest topics. A personalized study guide is then generated by Gemini, which can be shared with the student.
*   **Question Bank Tab**:
    *   **Description**: A full CRUD interface for managing all questions in the course.
    *   **Output**: A list of all questions is displayed with options to `Edit` or `Delete`. Clicking "Edit" opens a modal pre-filled with the question's details for modification.

---

### LIMITATIONS & FUTURE SCOPE

#### Limitations

*   **Stateless Backend**: The current backend is stateless and uses in-memory mock data, meaning all changes (like student progress or new questions) are lost upon server restart.
*   **Mock Authentication**: The login system is a simple mock and does not involve secure password handling or session management.
*   **Limited AI Tutor**: The AI Tutor feature on the frontend is currently mocked and does not make a live call to the Gemini API for conversational chat.
*   **Scalability**: The current design with mock data and a simple Flask server is not built for high concurrency or large datasets.
*   **Content Scope**: The platform is designed around text-based quizzes (MCQ/Short Answer) and does not support other media types or complex question formats.

#### Future Scope

*   **Persistent Database**: Integrate a robust database like PostgreSQL or MongoDB to persist all data, including users, questions, and student progress.
*   **Full User Authentication**: Implement a secure authentication system using JWT (JSON Web Tokens) or OAuth 2.0 for user registration, login, and session management.
*   **Live AI Tutor**: Connect the AI Tutor front-end to a backend endpoint that manages a conversational chat session with the Gemini API.
*   **Enhanced Content Management**: Allow instructors to upload other course materials like PDFs or videos, and use multimodal Gemini models to generate questions from them.
*   **Deeper Analytics**: Introduce more advanced analytics, such as identifying common misconceptions on specific questions or predicting students at risk of falling behind.
*   **Deployment**: Create a production-ready build and deploy the application to a cloud platform like Google Cloud Platform (GCP), Vercel, or AWS.
*   **Real-time Collaboration**: Add features like real-time leaderboards or instructor announcements using WebSockets.

---

### GITHUB URL

[https://github.com/your-username/certifyai-platform](https://github.com/your-username/certifyai-platform)

---

### PPT SLIDES

A presentation for this project can be structured around the following key slides:
1.  **Title Slide**: Project name, team members.
2.  **Introduction**: The problem with traditional e-learning.
3.  **Proposed Solution**: Overview of CertifyAI as an adaptive platform.
4.  **System Architecture**: High-level diagram of Frontend, Backend, and Gemini API.
5.  **Key Features (Student)**: Walkthrough of Learning Path, Quizzes, Performance, AI Tutor.
6.  **Key Features (Instructor)**: Walkthrough of AI Quiz Generation, Analytics, Study Guides, Question Bank.
7.  **Technology Stack**: Icons and names of technologies used.
8.  **Live Demo**: A live demonstration of the application.
9.  **Limitations & Future Work**: Discuss current limitations and plans for enhancement.
10. **Q&A / Thank You**.

---

### PROJECT CODE

#### Project Structure

```
/
├── backend/
│   ├── app.py              # Flask server, API endpoints, Gemini integration
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── services/       # API and Gemini services
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── ...
│   └── ...
├── docker-compose.yml      # Orchestrates the multi-container application
└── README.md               # This file
```

#### Setup and Running the Application

**Prerequisites**: Docker, Docker Compose, Google Gemini API Key.

**1. Environment Configuration**
*   In the `backend` directory, create a `.env` file from the `.env.example`.
*   Add your Google Gemini API key to `backend/.env`: `API_KEY="YOUR_GEMINI_API_KEY"`

**2. Running with Docker (Recommended)**
From the project's root directory, run:
```bash
docker-compose up --build
```
*   **Frontend**: Available at `http://localhost:5173`
*   **Backend API**: Running on `http://localhost:5000`

**3. Running Locally for Development**
(Run backend and frontend in separate terminals)

*   **Backend Server**:
    ```bash
    cd backend
    pip install -r requirements.txt
    flask run
    ```
*   **Frontend Server**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

### REFERENCES

*   **Google Gemini API Documentation**: [https://ai.google.dev/docs/gemini_api_overview](https://ai.google.dev/docs/gemini_api_overview)
*   **React Documentation**: [https://react.dev/](https://react.dev/)
*   **Flask Documentation**: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
*   **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
*   **Docker Documentation**: [https://docs.docker.com/](https://docs.docker.com/)

---

### BIBLIOGRAPHY

*   VanderPlas, J. (2016). *Python Data Science Handbook*. O'Reilly Media.
*   Haverbeke, M. (2018). *Eloquent JavaScript*. No Starch Press.
*   The official documentation for React, Flask, and Google Gemini API served as primary references for implementation details and best practices.
