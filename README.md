# Placement Portal - Job Portal Application

A comprehensive, full-stack job portal application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This platform enables job seekers to discover opportunities, apply for positions, track applications, and communicate with employers through real-time chat, while employers can post jobs, manage applications, and hire talent efficiently.

## Project Overview

Placement Portal is a complete recruitment management system featuring real-time communication, OAuth authentication, resume management, and intelligent notification systems. The application is production-ready with Docker support, comprehensive error handling, and rate limiting to ensure security and scalability.

## Core Features

### For Job Seekers
- **User Authentication:** Secure JWT-based authentication with OAuth integration (Google, GitHub)
- **Job Discovery:** Browse and search job listings with advanced filtering options
- **Job Applications:** Apply for jobs with resume uploads and track application status
- **Saved Jobs:** Bookmark and save jobs for later review
- **My Applications:** View all submitted applications with detailed status tracking
- **User Profiles:** Create and update professional profiles with skills and experience
- **Real-time Chat:** Communicate directly with employers and recruiters via Socket.io
- **Notifications:** Receive real-time updates on application status changes and messages
- **Resume Management:** Upload, manage, and organize multiple resumes

### For Employers
- **Post Jobs:** Create and manage job listings with detailed descriptions
- **My Jobs:** View all posted jobs and edit job information
- **Application Management:** Review, filter, and manage received job applications
- **Candidate Profiles:** View public profiles of job seekers
- **Real-time Communication:** Chat with candidates in real-time
- **Notifications:** Get notified of new applications and messages

### General Features
- **Responsive Design:** Fully responsive UI optimized for desktop, tablet, and mobile devices
- **Rate Limiting:** Protection against abuse with configurable rate limiting
- **Dark Mode Support:** Theme context for light and dark mode switching
- **Error Handling:** Comprehensive error handling with user-friendly error messages
- **Data Export:** Export application and job data to JSON format
- **Data Import:** Import data from JSON files

## Technology Stack

### Frontend
- **React.js (v18)** - UI library for building interactive user interfaces
- **React Router** - Client-side routing and navigation
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time bidirectional communication
- **React Icons** - Icon library for UI components
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js (v4)** - Web application framework
- **MongoDB & Mongoose** - NoSQL database and ODM
- **JWT (JSON Web Tokens)** - Secure authentication
- **Bcrypt** - Password hashing and security
- **Passport.js** - OAuth authentication (Google, GitHub)
- **Socket.io** - Real-time bidirectional communication
- **Cloudinary** - Cloud image storage and management
- **Express Rate Limit** - API rate limiting
- **Redis & IORedis** - Caching and session management
- **Validator** - Data validation library

### DevOps & Deployment
- **Docker** - Containerization with docker-compose
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **Environment Configuration** - .env-based configuration management

## Project Architecture

### Directory Structure

```
placementportal/
├── backend/
│   ├── config/              # Configuration files (Passport, environment)
│   ├── controllers/         # Route controllers for business logic
│   ├── database/            # Database connection setup
│   ├── middlewares/         # Custom middleware (auth, error, rate limit)
│   ├── models/              # Mongoose schemas (User, Job, Application, Chat, etc.)
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions (JWT token generation)
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Main server file
│   ├── app.js               # Express app configuration
│   ├── socket.js            # Socket.io setup
│   └── docker-compose.yml   # Docker configuration
│
└── frontend/
    ├── src/
    │   ├── components/      # React components organized by feature
    │   │   ├── Application/ # Job application components
    │   │   ├── Auth/        # Authentication and profile components
    │   │   ├── Chat/        # Real-time chat component
    │   │   ├── Job/         # Job listing and management
    │   │   ├── Home/        # Landing page components
    │   │   ├── Layout/      # Layout components (Navbar, Footer)
    │   │   ├── UI/          # Reusable UI components (Button, Card, Modal)
    │   │   └── User/        # User discovery components
    │   ├── context/         # React Context (Socket, Theme)
    │   ├── App.jsx          # Main App component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── public/              # Static assets
    ├── package.json         # Frontend dependencies
    └── tailwind.config.js   # Tailwind CSS configuration
```

### Database Models

- **User Schema** - Stores user information, roles (seeker/employer), profile data
- **Job Schema** - Job listings with requirements, salary, location, company info
- **Application Schema** - Job application records linking users to jobs
- **Chat Group Schema** - Group conversations for job discussions
- **Message Schema** - Individual messages within chat groups
- **Notification Schema** - User notifications for various events

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /me` - Get current user profile
- `PUT /update-profile` - Update user profile
- `GET /oauth/callback` - OAuth callback handler

### Job Routes (`/api/jobs`)
- `GET /` - Get all jobs with filters
- `GET /:id` - Get job details
- `POST /` - Create new job (employer only)
- `PUT /:id` - Update job (employer only)
- `DELETE /:id` - Delete job (employer only)

### Application Routes (`/api/applications`)
- `GET /` - Get user applications
- `POST /` - Submit job application
- `GET /:id` - Get application details
- `PUT /:id/status` - Update application status
- `DELETE /:id` - Cancel application

### Message Routes (`/api/messages`)
- `GET /` - Get chat messages
- `POST /` - Send message
- `GET /groups` - Get chat groups

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read

### User Routes (`/api/users`)
- `GET /` - Get all users (job seekers)
- `GET /:id` - Get user profile
- `GET /:id/public` - Get public user profile

## Real-time Features

**Socket.io Events:**
- `user-connected` - User establishes connection
- `new-message` - Real-time message delivery
- `application-update` - Application status changes
- `new-notification` - New notifications
- `job-update` - Job listing updates
- `user-online` - User status updates

## Getting Started

### Prerequisites

- **Node.js** v22.2.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB server)
- **Cloudinary** account for image storage
- **OAuth Credentials** (Google and GitHub) for authentication

### Installation Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/exclusiveabhi/react-job-portal.git
   cd placementportal
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Environment Configuration:**

   Create a `config/config.env` file in the backend directory with the following variables:

   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # Database
   DB_URL=mongodb+srv://username:password@cluster.mongodb.net/jobportal
   
   # JWT Configuration
   JWT_SECRET_KEY=your_jwt_secret_key
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # OAuth Configuration (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_secret
   ```

5. **Run the Application:**

   **Backend (from `/backend` directory):**
   ```sh
   npm start
   # or for development with hot reload
   npm run dev
   ```
   Backend will run on `http://localhost:4000`

   **Frontend (from `/frontend` directory in a new terminal):**
   ```sh
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

6. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

### Using Docker

To run the entire application using Docker:

```sh
cd backend
docker-compose up --build
```

This will start both the backend server and MongoDB instance in containers.

## Development Guide

### Running Backend in Development Mode
```sh
cd backend
npm install nodemon --save-dev
npm run dev
```

### Running Frontend with Vite
```sh
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```sh
cd frontend
npm run build
npm run preview
```

**Backend:**
```sh
cd backend
npm start
```

### Data Management

**Export Data:**
```sh
node export-data.js
```

**Import Data:**
```sh
node import-data.js
```

## Key Technologies Explained

### Real-time Communication
Socket.io handles real-time messaging and notifications, enabling instant updates across connected clients without page refresh.

### Authentication
- **JWT** for stateless authentication
- **Bcrypt** for secure password hashing
- **Passport.js** for OAuth2 integration with Google and GitHub

### Image Storage
Cloudinary integration allows users to upload resumes and profile pictures with automatic optimization and cloud storage.

### Rate Limiting
Express Rate Limit middleware protects API endpoints from abuse by limiting requests per IP address.

### Database
MongoDB with Mongoose provides flexible schema management for storing user profiles, job listings, applications, and chat messages.


## Contributing

Contributions are welcome and greatly appreciated! Here's how to contribute:

1. **Fork the Repository** - Click the fork button at the top of the repository
2. **Create a Feature Branch:**
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. **Make Your Changes** - Implement your feature or bug fix
4. **Commit Your Changes:**
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```
5. **Push to Your Branch:**
   ```sh
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request** - We'll review and merge within 24 hours

### Code Guidelines
- Follow existing code style and naming conventions
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation as needed

## Performance Optimization

- **Redis Caching** - Frequently accessed data is cached for faster retrieval
- **Rate Limiting** - Prevents API abuse and ensures fair usage
- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Frontend bundle is optimized with Vite

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt ensures passwords are never stored in plain text
- **CORS Configuration** - Controls which domains can access the API
- **Input Validation** - Server-side validation of all user inputs
- **Rate Limiting** - Protects against brute force and DDoS attacks
- **Secure Cookies** - HTTP-only cookies prevent XSS attacks

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB URI in `config.env` is correct
- Check if MongoDB Atlas cluster is whitelisted for your IP
- Verify network connectivity

### Cloudinary Upload Errors
- Verify Cloudinary credentials in `config.env`
- Check file size limits (max 5MB for images by default)
- Ensure proper file format (JPEG, PNG, PDF for resumes)

### Port Already in Use
- Backend: Change PORT in `config.env`
- Frontend: Vite will automatically use next available port

### OAuth Authentication Issues
- Verify redirect URIs match in OAuth provider settings
- Check client ID and secret in `config.env`
- Ensure cookies are enabled in browser

## Deployment Guide

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables for API URL
4. Deploy automatically on push

### Backend Deployment (Render)
1. Create Render account and connect GitHub
2. Create new Web Service
3. Configure environment variables
4. Deploy automatically

### Database (MongoDB Atlas)
1. Create account at MongoDB Atlas
2. Create cluster and database
3. Add database user credentials
4. Whitelist application IP address

## Project Statistics

- **Frontend Components:** 20+ reusable React components
- **Backend APIs:** 40+ RESTful endpoints
- **Database Models:** 6 Mongoose schemas
- **Real-time Features:** Socket.io events for live updates
- **Authentication Methods:** JWT + OAuth2 (Google, GitHub)

## Roadmap

- [ ] Advanced job filtering with faceted search
- [ ] Email notifications for application updates
- [ ] Video interview scheduling
- [ ] Skill-based job recommendations
- [ ] Advanced analytics dashboard for employers
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Payment integration for premium job postings



---

**Happy Coding! 🚀**

*Last Updated: April 2026*
