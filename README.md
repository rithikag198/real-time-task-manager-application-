# Mini Real-Time Task Manager

A full-stack web application for task management with real-time updates, user authentication, and responsive design.

## Features

- **User Authentication**: Register and login with JWT authentication
- **Task Management**: Create, read, update, and delete tasks
- **Real-Time Updates**: Instant task updates using Socket.io
- **Search & Filter**: Search tasks by title/description and filter by status
- **Statistics**: View total, completed, and pending task counts
- **Responsive UI**: Mobile-friendly design with Tailwind CSS
- **Modern Stack**: React, Node.js, Express, MongoDB, Socket.io

## Tech Stack

### Frontend
- React.js with TypeScript
- React Router for navigation
- Axios for API calls
- Socket.io-client for real-time updates
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Socket.io for real-time features
- CORS for cross-origin requests

## Project Structure

```
mini-realtime-task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and socket services
│   │   ├── types/          # TypeScript types
│   │   └── hooks/          # Custom hooks
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-realtime-task-manager
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```bash
cp .env.example .env
```

Update the `.env` file if needed:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

## Socket.io Events

### Client to Server
- `joinUserRoom` - Join user's personal room for targeted updates

### Server to Client
- `taskCreated` - New task created
- `taskUpdated` - Task updated
- `taskDeleted` - Task deleted

## Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

### Client (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_SERVER_URL` - Socket.io server URL

## Deployment

### Netlify (Frontend)

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to Netlify

3. Configure environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` - Your deployed backend URL
   - `REACT_APP_SERVER_URL` - Your deployed backend URL

### Backend Deployment Options

- **Heroku**: Deploy the server folder
- **Vercel**: Deploy serverless functions
- **DigitalOcean**: Deploy to a droplet
- **AWS**: Deploy to EC2 or Lambda

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your tasks and statistics
4. **Add Tasks**: Create new tasks with title and optional description
5. **Manage Tasks**: Edit, delete, or toggle task status
6. **Search**: Find tasks using the search bar
7. **Filter**: Filter tasks by status (all/pending/completed)

## Real-Time Features

- When you add, update, or delete a task, all connected clients for that user receive instant updates
- No need to refresh the page to see changes
- Task statistics update in real-time

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- CORS configuration
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file

2. **CORS Errors**
   - Verify CLIENT_URL matches your frontend URL
   - Check that API calls use the correct base URL

3. **Socket.io Connection Issues**
   - Ensure REACT_APP_SERVER_URL is correct
   - Check that the backend server is running

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET is set in backend .env

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend are running
4. Check network connectivity

## Screenshots

*(Add screenshots of your application here)*

- Login page
- Registration page
- Dashboard with task list
- Task creation form
- Real-time updates demonstration
