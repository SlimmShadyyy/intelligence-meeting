# Hintro Meeting Intelligence API

A powerful Node.js/Express REST API that analyzes meeting transcripts using Gemini AI, manages action items, and automates Slack notifications for overdue tasks.

## 🚀 Evaluator Demo Dashboard
This project includes a built-in UI dashboard so you can test the entire pipeline visually!
1. Start the server (`npm run dev`)
2. Open your browser to `http://localhost:3000`

## 🛠️ Setup Instructions & Local Execution

1. **Install Dependencies:**
   `npm install`
2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="file:./dev.db"
   GEMINI_API_KEY="your_api_key_here"
   JWT_SECRET="your_secret_key"
   SLACK_WEBHOOK_URL="your_webhook_here"


3. **Initialize Database:**
    `npx prisma db push`

4. **Run the Server:**
    `npm run dev`

## 🐳 Docker Support
    To run this application via Docker:
    ```Bash
        docker build -t hintro-api .
        docker run -p 3000:3000 --env-file .env hintro-api



## 🌐 Deployment Instructions (Render)
1. Push repository to GitHub.

2. Create a new Web Service on Render.com.

3. Build Command: npm install && npx prisma db push

4. Start Command: npm run start

5. Add .env variables in the Render dashboard.

## 📡 API Usage Examples
    POST /api/meetings (Requires Bearer Token)
        JSON
        {
        "title": "Product Sync",
        "participants": ["john@example.com"],
        "meetingDate": "2023-10-01T10:00:00Z",
        "transcript": [
            { "timestamp": "00:05", "speaker": "John", "text": "Let's review the architecture." }
        ]
        }