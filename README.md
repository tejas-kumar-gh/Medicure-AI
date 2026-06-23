# MediCure - Full-Stack AI-Powered Healthcare Assistant

MediCure is a production-ready, highly secure web application designed to compute body status indicators (BMI, BMR/TDEE calorie targets, and hydration ratios) and deliver personalized wellness guidance via an AI Chatbot powered by OpenAI's `gpt-4o-mini` model.

---

## Technical Stack

* **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Axios, TanStack Query (React Query), React Hot Toast
* **Backend**: Node.js, Express.js, MongoDB Atlas (via Mongoose), JWT Authentications (via HTTP-Only cookies), Cookie Parser, Helmet, Express Validator, Express Rate Limit
* **AI Engine**: OpenAI API (`gpt-4o-mini`)
* **Hosting**: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## Folder Structure

```
medicure/
├── backend/
│   ├── src/
│   │   ├── config/             # Database & OpenAI client instances
│   │   │   ├── db.js
│   │   │   └── openai.js
│   │   ├── controllers/        # Request business handlers (MVC)
│   │   │   ├── authController.js
│   │   │   ├── profileController.js
│   │   │   ├── chatController.js
│   │   │   └── recommendationController.js
│   │   ├── middleware/         # Security, Auth & request filters
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   └── rateLimiter.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Profile.js
│   │   │   ├── Chat.js
│   │   │   └── Recommendation.js
│   │   ├── routes/             # Router endpoints mappings
│   │   │   ├── authRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── recommendationRoutes.js
│   │   ├── services/           # External API & Calculation helpers
│   │   │   ├── openaiService.js
│   │   │   └── recommendationService.js
│   │   ├── utils/              # Clean wrapper utilities
│   │   │   ├── asyncHandler.js
│   │   │   ├── token.js
│   │   │   └── healthCalculator.js
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server listen port hook
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios instances & configurations
│   │   │   └── axiosInstance.js
│   │   ├── components/         # Reusable layouts & UI widgets
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── context/            # Auth status providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Routed pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HealthProfile.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx             # React routing entry
│   │   ├── index.css           # Global custom stylings
│   │   └── main.jsx            # DOM renderer
│   ├── .env
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── package.json                # Root concurrently development configuration
```

---

## Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (or local MongoDB database)
* [OpenAI API Key](https://platform.openai.com/)

### Step 1: Clone and Install Dependencies
Navigate into the project root and run:
```bash
# Installs root concurrently helper, then sets up both backend and frontend packages
npm install
npm run install-all
```

### Step 2: Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicure?retryWrites=true&w=majority
JWT_SECRET=your_jwt_signing_secret_here
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend Configuration (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run the Application Locally
In the root directory, start both development servers concurrently:
```bash
npm run dev
```
* **Frontend UI**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`

---

## API Documentation

All routes (except Auth Login & Register) are protected and require the HttpOnly JWT token cookie set.

### 1. Authentication
* `POST /api/auth/register` - Create a user account.
  * Inputs: `{ name, email, password }`
* `POST /api/auth/login` - Authenticate credentials and save signed JWT token cookie.
  * Inputs: `{ email, password }`
* `POST /api/auth/logout` - Clear the JWT cookie.
* `GET /api/auth/me` - Get current session's user attributes.

### 2. Health Profile
* `GET /api/profile` - Fetch current user's profile details.
* `POST /api/profile` - Create physical profile.
  * Inputs: `{ age, gender, weight, height, activityLevel, fitnessGoal }`
* `PUT /api/profile` - Update profile parameters (automatically triggers recalculations of recommendation indicators).

### 3. AI Chatbot
* `POST /api/chat/message` - Send user message and fetch safety-guardrailed reply.
  * Inputs: `{ message }`
* `GET /api/chat/history` - Fetch full conversation history array.
* `DELETE /api/chat/history` - Empty chat history array for user.

### 4. Health Recommendations Engine
* `GET /api/recommendations` - Retrieve calculated health metrics (BMI, calorie counts, water targets) and personalized diet/fitness guidelines.

---

## Deployment Guide

### 1. MongoDB Atlas Setup
1. Log into your [MongoDB Atlas Portal](https://www.mongodb.com/).
2. Create a new Cluster. Choose a shared tier (Free).
3. Under **Network Access**, add IP address `0.0.0.0/0` (or your backend's static outbound IPs if using a proxy, though `0.0.0.0/0` is standard for Render).
4. Under **Database Access**, create a user with read/write privileges.
5. Go to **Database -> Connect -> Drivers** to copy your connection string (`MONGO_URI`). Replace `<username>` and `<password>` inside it.

### 2. Backend Deployment (Render)
1. Sign up on [Render](https://render.com/).
2. Click **New + -> Web Service**.
3. Connect your Git repository.
4. Configure setting:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. In **Environment Variables**, click **Add Environment Variable** and specify:
   * `NODE_ENV`: `production`
   * `PORT`: `10000` (Render binds this automatically)
   * `MONGO_URI`: `your_atlas_connection_string`
   * `JWT_SECRET`: `your_production_jwt_signing_key`
   * `OPENAI_API_KEY`: `your_openai_api_key`
   * `CLIENT_URL`: `https://your-frontend-vercel-domain.vercel.app`
6. Click **Deploy Web Service**. Save your web service URL (e.g. `https://medicure-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign up on [Vercel](https://vercel.com/).
2. Click **Add New -> Project**.
3. Connect your Git repository.
4. Select the project directory, then configure setting:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   * `VITE_API_URL`: `https://your-backend-render-domain.onrender.com/api` (Render domain URL + `/api`)
6. Click **Deploy**.

### 4. Production CORS & Cookie Configuration
Because the frontend and backend are hosted on different domains, we use cross-origin cookie sharing:
* **CORS credentials**: In `backend/src/app.js`, CORS is configured with `credentials: true` and the origin set strictly to your Vercel URL (`CLIENT_URL`).
* **JWT Cookie settings**: In `backend/src/utils/token.js`, the cookie set in production uses:
  * `httpOnly: true` (prevents XSS access)
  * `secure: true` (requires HTTPS transit)
  * `sameSite: "none"` (enables cookies to be sent across third-party/different domains)
