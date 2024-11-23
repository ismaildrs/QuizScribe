# QuizScribe

**QuizScribe** turns YouTube videos into interactive learning tools. By leveraging AI technologies like AssemblyAI, QuizScribe enhances video content with summaries, flashcards, quizzes, and diagrams, making learning more active, engaging, and effective.

![QuizScribe Preview](public/quizscribe-preview.png)

## Links

- Chrome Extension Repository: [https://github.com/ismaildrs/quizscribe-chrome-extention](https://github.com/ismaildrs/quizscribe-chrome-extention)
- Blog Post: https://dev.to/ismail_drissi_32520264908/quizscribe-turning-youtube-videos-into-interactive-learning-tools-4l7g

## Features

- **Summaries:** Quickly review the main points of a video.
- **Flashcards:** Automatically create and export study cards to Anki.
- **Quizzes:** Test your knowledge with multiple-choice questions.
- **Diagrams:** Visualize concepts for better understanding.
- **Folders:** Organize videos by topic or goals.
- **Browser Extension:** Convert any YouTube video into a course instantly.

## Setup and Installation

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Next.js](https://nextjs.org/)

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ismaildrs/quizscribe.git
   cd quizscribe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following values:

   ```
   AUTH_SECRET=<your_auth_secret>
   AUTH_GOOGLE_ID=<your_google_client_id>
   AUTH_GOOGLE_SECRET=<your_google_client_secret>
   ASSEMBLYAI_API_KEY=<your_assemblyai_api_key>
   GROQAI_API_KEY=<your_groqai_api_key>
   YOUTUBE_API_KEY=<your_youtube_api_key>
   DATABASE_URL=<your_mongodb_connection_string>
   ```

   #### Instructions for each variable:

   - **AUTH_SECRET**: A secure string used for authentication.
   - **AUTH_GOOGLE_ID** and **AUTH_GOOGLE_SECRET**: Set up OAuth 2.0 credentials in the [Google Cloud Console](https://console.cloud.google.com/) under the "APIs & Services" section.
   - **ASSEMBLYAI_API_KEY**: Sign up for an account and obtain your API key from [AssemblyAI](https://www.assemblyai.com/).
   - **GROQAI_API_KEY**: Obtain your API key by signing up at [GROQAI](https://console.groq.com/keys).
   - **YOUTUBE_API_KEY**: Create a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the YouTube Data API, and generate an API key.
   - **DATABASE_URL**: Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/atlas/database).

4. Configure the Database:

   Run the following Prisma commands to generate the client and synchronize your database schema:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## About Us

Created by [Ismail Drissi](https://github.com/ismaildrs) and [Imad IDALI OUALI](https://github.com/ImadIdaliouali) to make online learning smarter and more engaging.
