# YouTube Clone – MERN Stack Capstone Project

Full-stack YouTube-style video platform built with MongoDB, Express, React (Vite), and Node.js, featuring authentication, channels, video management, comments, search, filters, and responsive UI.

## Features

### Frontend (React + Vite + Tailwind)

- **Home Page**
  - YouTube-style header with logo, search bar, and sign-in / user name display.
  - Static sidebar that can be toggled from a hamburger menu in the header.
  - At least 6 filter buttons (React, JavaScript, Node.js, MongoDB, CSS, Projects, etc.).
  - Responsive grid of video thumbnails (title, thumbnail, channel name, views).
- **User Authentication**
  - Registration with username, email, password, optional avatar URL.
  - Validation on all auth inputs with clear error messages.
  - Login using JWT; token stored in `localStorage`.
  - After successful registration, automatic redirect to Login page.
  - Header updates to show logged-in username and Logout button.
- **Video Player Page**
  - Embedded video player (YouTube embeds via `iframe` using `videoUrl`).
  - Shows title, description, channel name, views.
  - Fully functional Like / Dislike buttons using backend endpoints.
  - Comments section with full CRUD:
    - Add comment
    - Edit own comment
    - Delete own comment
- **Channel Page**
  - Accessible only to authenticated users (protected route).
  - Create a new channel (channel name, description, banner URL).
  - Display videos belonging to the logged-in user’s channel.
  - Full video CRUD from channel page:
    - Create / upload video (title, description, thumbnail, `videoUrl`, category).
    - Edit existing video.
    - Delete existing video.
- **Search & Filter**
  - Search bar in the header filters videos by title.
  - Filter buttons on the home page filter videos by `category` (React, JavaScript, etc.).
  - Uploaded videos appear dynamically on the home page and are included in search/filter results.
- **Responsiveness**
  - Layout tested on mobile, tablet, and desktop breakpoints using Tailwind CSS.
  - Sidebar hides on very small screens, header and video grid remain usable.

### Backend (Node.js + Express + MongoDB)

- **Authentication**
  - Register: hash passwords with `bcryptjs`, store users in MongoDB.
  - Login: verify password, return signed JWT.
  - JWT middleware protects routes and injects `req.user`.
- **Data Models**
  - `User`: username, email, password (hashed), avatar, channels.
  - `Channel`: channelName, owner (user), description, banner, subscribers, videos.
  - `Video`: title, description, thumbnailUrl, videoUrl, channel, uploader, views, likes, dislikes, category, uploadDate.
  - `Comment`: video, user, text, timestamp.
- **Routes / APIs**
  - `POST /api/auth/register` – user registration with validation.
  - `POST /api/auth/login` – login with email/password, returns JWT + user.
  - `GET /api/auth/me` – get current user (protected).
  - `POST /api/channels` – create new channel (protected).
  - `GET /api/channels/:id` – get channel by id.
  - `GET /api/channels/:id/videos` – list videos for a channel.
  - `GET /api/videos` – list all videos with optional query params:
    - `?search=<title>` – search by title (case-insensitive).
    - `?category=<category>` – filter by category.
  - `GET /api/videos/:id` – get single video (increments view count).
  - `POST /api/videos` – create video (protected; only channel owner).
  - `PUT /api/videos/:id` – update video (protected; only uploader).
  - `DELETE /api/videos/:id` – delete video (protected; only uploader).
  - `POST /api/videos/:id/like` – like video (protected).
  - `POST /api/videos/:id/dislike` – dislike video (protected).
  - `GET /api/comments/video/:videoId` – list comments for a video.
  - `POST /api/comments/video/:videoId` – add comment (protected).
  - `PUT /api/comments/:id` – update own comment (protected).
  - `DELETE /api/comments/:id` – delete own comment (protected).
- **Database**
  - All data stored in MongoDB Atlas:
    - Users, Channels, Videos, Comments collections.
  - `videoUrl` stored as a string (YouTube embed URLs).
  - `thumbnailUrl` and `channelBanner` stored as image URLs.
- **Seed Script**
  - `npm run seed` wipes existing data and inserts:
    - 3 users (e.g. `john@example.com`, `jane@example.com`, `dev@example.com`).
    - 3 channels with banners and subscriber counts.
    - Multiple videos spread across categories (React, JavaScript, Node.js, MongoDB, CSS, Projects).
    - Sample comments on various videos.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (cloud)
- **Auth:** JWT (JSON Web Tokens)
- **Other:** bcryptjs, dotenv, cors

## Project Structure

```text
youtube-clone-mern/
  backend/
    config/
      db.js
    controllers/
      authController.js
      channelController.js
      videoController.js
      commentController.js
    middleware/
      authMiddleware.js
    models/
      User.js
      Channel.js
      Video.js
      Comment.js
    seed/
      seed.js
    server.js
    package.json
    .env (not committed)
  frontend/
    src/
      api/
        axios.js
      components/
        Header.jsx
        Sidebar.jsx
        VideoCard.jsx
        ProtectedRoute.jsx
      context/
        AuthContext.jsx
      pages/
        HomePage.jsx
        LoginPage.jsx
        RegisterPage.jsx
        VideoPlayerPage.jsx
        ChannelPage.jsx
      App.jsx
      main.jsx
      index.css
    index.html
    vite.config.js
    tailwind.config.js
    postcss.config.js
    package.json
  .gitignore
  README.md

Prerequisites

•  Node.js and npm installed.
•  Git installed.
•  MongoDB Atlas account.

Setup Instructions

1. Clone the repository
git clone https://github.com/<your-username>/youtube-clone-mern.git
cd youtube-clone-mern

2. Backend setup
cd backend
npm install

Create backend/.env:
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_long_random_jwt_secret_here

3. Seed database (optional but recommended)
cd backend
npm run seed

4. Run backend
cd backend
npm start

5. Frontend setup
cd ../frontend
npm install
npm run dev

---

Vite dev server runs on http://localhost:5173.

Usage

1. Open http://localhost:5173 in your browser.
2. Register a new user or log in with a seeded user, e.g.:
◦  Email: john@example.com
◦  Password: password123
3. Explore features:
◦  Use search bar and category filters on the home page.
◦  Click a video to open the video player page (like/dislike, comments).
◦  Go to Your Channel to create a channel and manage your videos (CRUD).

API Summary

Base URL: http://localhost:5000/api

•  Auth
◦  POST /auth/register
◦  POST /auth/login
◦  GET /auth/me (requires Authorization: Bearer <token>)
•  Channels
◦  POST /channels (protected)
◦  GET /channels/:id
◦  GET /channels/:id/videos
•  Videos
◦  GET /videos?search=&category=
◦  GET /videos/:id
◦  POST /videos (protected)
◦  PUT /videos/:id (protected)
◦  DELETE /videos/:id (protected)
◦  POST /videos/:id/like (protected)
◦  POST /videos/:id/dislike (protected)
•  Comments
◦  GET /comments/video/:videoId
◦  POST /comments/video/:videoId (protected)
◦  PUT /comments/:id (protected)
◦  DELETE /comments/:id (protected)

Notes for Evaluators

•  ES Modules (import / export) are used on the backend (no CommonJS).
•  React frontend is built with Vite, not Create React App.
•  All styling is done using Tailwind CSS utility classes.
•  node_modules are excluded via .gitignore.
•  Authentication is fully functional and required for:
◦  Channel creation and video management (CRUD).
◦  Like / Dislike.
◦  Comment CRUD on the video player page.
•  The project demonstrates:
◦  Clean folder structure.
◦  Separation of concerns (models, controllers, routes, middleware).
◦  Clear comments and this README for setup and usage.

GitHub Repository Link:
https://github.com/imvinaythorat-codes/youtube-clone-mern.git