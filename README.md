
# SmartScan 🧠📄

SmartScan is an AI-powered resume analysis and enhancement platform designed to help job seekers and professionals get the most out of their resumes. With just one upload, users receive instant insights on key skills, ATS score, and tailored feedback — making it easier to align resumes with job descriptions and boost hiring potential.

## 🌐 Live Demo

👉 [Try SmartScan Now](https://smart-scan-eight.vercel.app)

---


## 🌟 Key Features

### 🧠 AI Resume Analyzer
- Upload your resume and get instant extraction of **key skills**, **technologies**, and **keywords** using advanced AI models.
- Summarized resume analysis with categorized sections like skills, experience, education, etc.

### 📊 ATS Score Calculator
- Simulate how well your resume performs in **Applicant Tracking Systems (ATS)**.
- Instant scoring based on format, keyword match, and clarity.

### 📋 Resume vs. Job Description Matcher
- Paste a job description and compare it with your uploaded resume.
- Get a **match percentage** and suggestions to improve alignment with the target role.

### 💬 AI Suggestions & Feedback
- Get **GPT-powered feedback** to improve resume structure, grammar, and keyword usage.
- Suggestions to tailor your resume for different industries or job profiles.

### 🔒 Authentication System
- Secure login and registration with **JWT-based authentication**.
- User dashboard to track uploaded resumes and past analysis.
- Rate Limited APIs to limit the request to the backend

### 🌐 Responsive UI
- Modern and intuitive user interface built with React and Tailwind CSS.
- Optimized for both desktop and mobile views.

---

## ⚙️ Tech Stack

### 💻 Frontend
- React + TypeScript
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router

### 🖥️ Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- Multer (for file uploads)
- JWT (Authentication)
- GEMINI (for skill extraction and resume feedback)
- NodeMailer (for sending email)

---

## 🗂️ Project Structure

```
SmartScan/
├── frontend/           # React client app
├── backend/            # Express server with AI logic
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JayantRautela/SmartScan.git
cd SmartScan
```

---

### 2. Setup Backend

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Run migrations
npx prisma generate
npx prisma migrate dev

# Start the server
npm run dev
```

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

> ⚠️ Ensure the backend is running at the URL defined in `.env` (`VITE_BACKEND_API_URL`).

---

## 🧪 Sample Use Cases

1. Upload a resume (PDF or DOCX).
2. View extracted skills and a categorized summary of the resume.
3. Paste a job description to see how well the resume matches.
4. Read improvement suggestions powered by AI.
5. Download or update your resume with feedback.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

### ✨ Made with ❤️ by [Jayant Rautela](https://github.com/JayantRautela)
