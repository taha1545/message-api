# 🚀 message-app-api

A real-time messaging backend with user auth, Google OAuth, PostgreSQL + Sequelize, and WebSocket-powered chats.

---

## 🎯 Quick Start (Run Locally)

1. **Start your database**

   If you have Docker:

   ```bash
   docker-compose up -d
This spins up PostgreSQL with your configured user/password.

No Docker? Use your own PostgreSQL or SQLite setup instead.

Install dependencies

bash
Copy
Edit
npm install
Run migrations

bash
Copy
Edit
npm run migrate
Setup your environment variables

Copy .env.example to .env and fill in all values:

bash
Copy
Edit
cp .env.example .env
Start the server in development mode

bash
Copy
Edit
npm run start:dev
Your API should now be running on http://localhost:3000 (or the port set in .env).

🛠 API Endpoints
🔐 Auth & Users
Method	Endpoint	Description	Auth Required
POST	/users/signup	Signup new user (with optional image upload)	No
POST	/users/login	Login	No
POST	/users/sendOtp	Send OTP email for password reset	No
PUT	/users/reset-password-otp	Reset password using OTP	No
PATCH	/users/reset-password	Change password	Yes
GET	/users/me	Get logged-in user info	Yes
PUT	/users/update	Update user profile	Yes
GET	/users/	Get all users (admin only)	Yes (admin)
GET	/users/search	Search users	No
GET	/users/:id	Get user by ID (admin only)	Yes (admin)
DELETE	/users/:id	Delete user (admin only)	Yes (admin)
POST	/users/send-verify-otp	Send email verification OTP	No
PUT	/users/verify-email	Verify user email	No

🌐 Google OAuth
Method	Endpoint	Description
GET	/auth/google	Redirect to Google login
GET	/auth/google/callback	Google OAuth callback handler

📇 Contacts
Method	Endpoint	Description	Auth Required
POST	/api/contacts	Create new contact	No
GET	/api/contacts	List all contacts	No
GET	/api/contacts/:id	Get contact detail	No
DELETE	/api/contacts/:id	Delete contact	No

🤝 Friends
Method	Endpoint	Description	Auth Required
GET	/api/friends	List your friends	Yes
POST	/api/friends	Add a friend	Yes
PUT	/api/friends/:id	Update friend status	Yes
DELETE	/api/friends/:id	Remove a friend	Yes

💬 Messages
Method	Endpoint	Description	Auth Required
GET	/api/message	List messages	Yes
POST	/api/message	Send a message	Yes
PUT	/api/message/:id	Update a message	Yes
DELETE	/api/message/:id	Delete a message	Yes

⚡ Real-time Namespaces (Socket.IO)
Namespace	Purpose
/chat	Messaging & chats
/friend	Friends & friend status
/user	User presence & info
/call	Audio/video calls

🎉 Enjoy building your app!
