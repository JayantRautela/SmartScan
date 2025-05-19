# SmartScan Backend

The **SmartScan Backend** is the server-side engine of the SmartScan platform — an AI-powered resume parser and job-matching tool. It provides powerful APIs for resume parsing, ATS scoring, skill extraction, and secure user management.

> 📌 [Frontend Repository](https://github.com/JayantRautela/SmartScan/tree/main/frontend)

## 🚀 Features

- 📄 Resume parsing and metadata extraction (skills, education, experience)
- 📊 ATS (Applicant Tracking System) score calculator
- 🧠 AI-based matching with job descriptions
- 🔐 User authentication with JWT
- ☁️ File uploads for resumes
- 🔄 RESTful APIs to serve the frontend
- 🧼 Input validation and error handling

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Storage:** Cloudinary 
- **AI:** Integration with Gemini or local NLP tools
- **File Upload:** Multer
- **Email Sending:** Nodemailer

## 📁 Folder Structure

```
backend/
│
├── prisma/                # Prisma schema and client
├── src/
│   ├── controllers/       # Route logic
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Auth and error middleware
│   ├── config/            # Different configurations
│   ├── utils/             # Helper functions
│   ├── index.ts           # Entry point
│   └── app.ts             # Express app setup
├── .env                   # Environment variables
├── tsconfig.json          # TypeScript configuration
├── package.json
└── README.md
```

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/JayantRautela/SmartScan.git
cd SmartScan/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=tyour_secret
GEMINI_API_KEY=gemini_api_key
PORT=5000
```

4. **Run Prisma migrations:**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start the development server:**

```bash
npm run dev
```

Server will run on `http://localhost:5000`.

## 📮 API Endpoints (Sample)

> Base URL: `http://localhost:5000/api`

| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| POST   | `/auth/register`     | Register a new user          |
| POST   | `/auth/login`        | Authenticate user and get JWT|
| POST   | `/resume/upload`     | Upload and analyze a resume  |
| POST   | `/resume/compare`    | Match resume with job description |
| GET    | `/resume/:id`        | Get parsed resume details    |


## 🔐 Authentication

Uses JWT tokens. Secure routes require an `accessToken` cookie.

## 🧠 AI Integration

The backend integrates with OpenAI to extract skills, generate summaries, and provide feedback on resumes.


### ✨ Made with ❤️ by [Jayant Rautela](https://github.com/JayantRautela)