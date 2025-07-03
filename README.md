# MathConnect Server

This is the server-side application for the MathConnect platform, a web app designed to help math club members share and discuss math problems remotely. Users can sign up, follow others, post problems (with LaTeX support), and interact with their community.

## Features
- User authentication and JWT-based session management
- Post creation and feed (with LaTeX support)
- Follow/unfollow users and manage follow requests
- Explore and discover other users
- View user profiles and their posts

## Tech Stack
- **Node.js** + **Express** (API server)
- **MongoDB** + **Mongoose** (database & ODM)
- **JWT** (authentication)
- **dotenv** (environment configuration)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Burgundy800020/socialAppServer.git
   cd socialAppServer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret
   PORT=3080 # optional, defaults to 3080
   ```
4. Start the server:
   ```bash
   npm run run
   ```
   The server will run on `http://localhost:3080` by default.

## API Endpoints
All endpoints are prefixed with `/api`.

### Authentication
- `POST /api/signup` — Register a new user
- `POST /api/auth` — Authenticate and receive JWT
- `POST /api/verify` — Verify JWT token

### Posts & Feed
- `POST /api/post` — Create a new post
- `POST /api/feed` — Get feed of posts from followed users
- `POST /api/profilepage` — Get posts by a specific user

### User & Social
- `POST /api/follow` — Send or remove a follow request
- `POST /api/confirm` — Confirm or reject a follow request
- `POST /api/requests` — Get pending follow requests
- `POST /api/explore` — Discover other users

## Data Models

### User
- `email`: String
- `password`: String
- `follows`: [ObjectId] (users this user follows)
- `followers`: [ObjectId] (users following this user)
- `followReqs`: [String] (pending follow requests)

### Post
- `time`: Number (timestamp)
- `date`: Date
- `author`: String (email)
- `authorId`: ObjectId (user reference)
- `content`: String (problem text, supports LaTeX)

## Environment Variables
- `MONGODB_URL` — MongoDB connection string (required)
- `JWT_KEY` — Secret key for JWT signing (required)
- `PORT` — Port to run the server (optional, default: 3080)

## Scripts
- `npm run run` — Start the server with nodemon

## Folder Structure
- `app.js` — Main server entry point
- `routes/` — API route definitions
- `model/` — Mongoose data models

## License
This project is licensed under the ISC License (see `package.json`).

