# Stock Dashboard

## Architecture

- **Frontend**: Next.js
- **Backend**: Express.js with Redis caching

## Prerequisites

- Node.js (v18 or higher)
- Redis server
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/lazim17/stock-dashboard.git
cd stock-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
REDISURL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Development Mode

1. **Start the backend server**:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

2. **Start the frontend development server**:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`


## Project Structure

```
stock-dashboard/
├── backend/
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic and data services
│   ├── data/           # Data storage
│   └── index.js        # Express server entry point
└── frontend/
    ├── src/
    │   ├── app/        # Next.js app directory
    │   └── components/ # React components
    ├── public/         # Static assets
    └── package.json    # Frontend dependencies
```

