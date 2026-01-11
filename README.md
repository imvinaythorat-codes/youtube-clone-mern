🎬 YouTube Clone – MERN Stack Capstone Project

A full-stack YouTube-style video platform built using MongoDB, Express, React (Vite), and Node.js.
The project focuses on real-world full-stack concepts like authentication, protected routes, CRUD operations, search & filtering, and responsive UI.

🚀 Features
🎨 Frontend (React + Vite + Tailwind CSS)
🏠 Home Page

YouTube-style header with logo, search bar, and auth status.

Hamburger-toggle sidebar (responsive).

Category filter buttons: React, JavaScript, Node.js, MongoDB, CSS, Projects.

Responsive video grid displaying:

Thumbnail

Title

Channel name

View count

🔐 User Authentication

User registration with:

Username

Email

Password

Optional avatar URL

Client-side & server-side validation with clear errors.

Secure JWT-based login.

Token stored in localStorage.

Auto-redirect to Login after successful registration.

Header dynamically updates:

Shows username when logged in

Logout button enabled

▶️ Video Player Page

Embedded YouTube videos using iframe.

Displays:

Title

Description

Channel name

View count

👍 Like / 👎 Dislike functionality (backend powered).

💬 Comments system (full CRUD):

Add comment

Edit own comment

Delete own comment

📺 Channel Page (Protected)

Accessible only to authenticated users.

Create a channel with:

Channel name

Description

Banner image URL

Displays all videos uploaded by the channel owner.

🎥 Video CRUD:

Upload video

Edit video

Delete video

🔍 Search & Filters

Search videos by title from the header.

Filter videos by category on the home page.

Newly uploaded videos appear instantly in:

Home feed

Search results

Category filters

📱 Responsiveness

Fully responsive layout:

Mobile 📱

Tablet 📲

Desktop 💻

Sidebar hides on small screens while keeping UI usable.

🧠 Backend (Node.js + Express + MongoDB)
🔐 Authentication

Passwords hashed using bcryptjs.

JWT-based authentication.

Protected routes using middleware.

req.user injected from verified token.

🗄️ Data Models

User

username, email, password (hashed), avatar

Channel

channelName, owner, description, banner, subscribers, videos

Video

title, description, thumbnailUrl, videoUrl, channel, uploader

views, likes, dislikes, category, uploadDate

Comment

video, user, text, timestamp

🔌 API Routes
🔑 Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me (protected)

📺 Channels

POST /api/channels (protected)

GET /api/channels/:id

GET /api/channels/:id/videos

🎥 Videos

GET /api/videos?search=&category=

GET /api/videos/:id (increments views)

POST /api/videos (protected)

PUT /api/videos/:id (protected)

DELETE /api/videos/:id (protected)

POST /api/videos/:id/like

POST /api/videos/:id/dislike

💬 Comments

GET /api/comments/video/:videoId

POST /api/comments/video/:videoId (protected)

PUT /api/comments/:id (protected)

DELETE /api/comments/:id (protected)

🌱 Database & Seeding

Hosted on MongoDB Atlas ☁️

Collections:

Users

Channels

Videos

Comments

Media stored as URLs (YouTube embeds & image links).

🌱 Seed Script

npm run seed will:

Wipe existing data

Create:

3 users

3 channels

Multiple categorized videos

Sample comments

🛠 Tech Stack

Frontend

React

Vite

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

Database

MongoDB Atlas

Auth & Utilities

JWT

bcryptjs

dotenv

cors

📁 Project Structure
youtube-clone-mern/
  backend/
    config/
    controllers/
    middleware/
    models/
    seed/
    server.js
  frontend/
    src/
      api/
      components/
      context/
      pages/
    index.css
    vite.config.js
  README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/imvinaythorat-codes/youtube-clone-mern.git
cd youtube-clone-mern

2️⃣ Backend Setup
cd backend
npm install


Create .env:

PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret

3️⃣ Seed Database (Optional)
npm run seed

4️⃣ Start Backend
npm start

5️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


➡️ Frontend runs at: http://localhost:5173

🧪 Usage

Register a new user or login using seeded credentials:

📧 john@example.com

🔑 password123

Explore:

Video feed

Search & filters

Like / dislike

Comments

Channel & video management

📝 Notes for Evaluators

✅ ES Modules used throughout backend
✅ Vite used instead of CRA
✅ Fully protected routes
✅ Clean MVC-style architecture
✅ Real-world CRUD & auth flow
✅ Production-ready project structure

🔗 GitHub Repository

👉 https://github.com/imvinaythorat-codes/youtube-clone-mern

## 🌍 Live Demo

Frontend: https://youtube-clone-mern.netlify.app  
Backend: https://youtube-clone-mern-ers8.onrender.com
