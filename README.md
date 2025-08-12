to run this server localy u should ::

- docker-compose up -d (to create db if u have docker ... else just use ur db or require sqllite )

- npm install

- npm run migrate

- copy paste .env.exmple to .env and file all varibles
  
-npm run start:dev



API Endpoints Overview
Auth & Users
POST /users/signup — Signup (multipart with optional image upload)

POST /users/login — Login

POST /users/sendOtp — Send OTP email for password reset

PUT /users/reset-password-otp — Reset password using OTP

PATCH /users/reset-password — Change password (requires auth)

GET /users/me — Get logged-in user info (requires auth)

PUT /users/update — Update user profile (requires auth)

GET /users/ — Get all users (admin only)

GET /users/search — Search users

GET /users/:id — Get user by ID (admin only)

DELETE /users/:id — Delete user (admin only)

POST /users/send-verify-otp — Send email verification OTP

PUT /users/verify-email — Verify user email

Google OAuth
GET /auth/google — Redirect to Google login

GET /auth/google/callback — Google OAuth callback

Contacts
POST /api/contacts — Create contact

GET /api/contacts — List all contacts

GET /api/contacts/:id — Get contact details

DELETE /api/contacts/:id — Delete contact

Friends
GET /api/friends — List friends (auth required)

POST /api/friends — Add friend (auth required)

PUT /api/friends/:id — Update friend status (auth required)

DELETE /api/friends/:id — Delete friend (auth required)

Messages
GET /api/message — List messages (auth required)

POST /api/message — Create message (auth required)

PUT /api/message/:id — Update message (auth required)

DELETE /api/message/:id — Delete message (auth required)



real time namespaces:
 /chat
 /freidn
 /user 
 /call 
 
 
