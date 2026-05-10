# JobPortal - MERN Stack Job Portal

A modern job portal application built with MERN (MongoDB, Express, React, Node.js) stack featuring a professional menu, job listings, and recruitment management.

## 🎯 Features

- **Responsive Navigation** - Modern Material-UI navbar with mobile support
- **Job Search** - Search and filter jobs by title and location
- **Post Jobs** - Employers can post new job listings
- **User Dashboard** - Track applications and saved jobs
- **Authentication** - Login and signup functionality
- **Material-UI Design** - Clean and professional UI with gradient styling

## 📁 Project Structure

```
FINAL PROJECT/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components (Navbar, etc.)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main App component
│   │   └── index.js        # Entry point
│   └── package.json
├── server/                 # Node/Express backend
│   ├── src/
│   │   ├── models/         # Database models (User, Job)
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Controller logic
│   │   ├── middleware/     # Custom middleware
│   │   └── index.js        # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
└── package.json            # Root package.json

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone and Navigate**
   ```bash
   cd "FINAL PROJECT"
   ```

2. **Install Root Dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for both client and server.

3. **Setup Environment Variables**
   
   Create a `.env` file in the `server` folder:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run Development Servers**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   Or run separately:
   - **Client**: `npm run client` (runs on http://localhost:3000)
   - **Server**: `npm run server` (runs on http://localhost:5000)

## 🎨 Navigation Menu

The navbar includes the following menu items:
- **Home** - Landing page with features
- **Search Jobs** - Browse and filter job listings
- **Post Job** - Create new job postings
- **Dashboard** - User dashboard with stats
- **Login/Sign Up** - Authentication pages
- **Profile Menu** - Additional user options

## 📝 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with features |
| `/jobs` | JobsPage | Job search and listings |
| `/post-job` | PostJobPage | Post new job form |
| `/dashboard` | DashboardPage | User dashboard |
| `/login` | LoginPage | User login |
| `/signup` | SignupPage | User registration |

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- Material-UI (MUI)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## 📦 Available Scripts

### Root Level
```bash
npm run dev              # Run both client and server
npm run client          # Run only client
npm run server          # Run only server
npm run client:install  # Install client dependencies
npm run server:install  # Install server dependencies
npm run install-all     # Install all dependencies
```

### Client Level (from `client` folder)
```bash
npm start   # Start React development server
npm build   # Build for production
npm test    # Run tests
```

### Server Level (from `server` folder)
```bash
npm run dev # Start with nodemon
npm start   # Start server
npm test    # Run tests
```

## 🔒 Authentication

The app includes mock authentication. For production:
1. Implement JWT token verification on the server
2. Add secure password hashing with bcryptjs
3. Store tokens securely (httpOnly cookies)
4. Implement proper authorization middleware

## 🎨 Styling

The application features:
- Gradient color scheme (Purple to Pink)
- Responsive Material-UI components
- Mobile-first design
- Smooth animations and transitions

## 📱 Responsive Design

The navbar is fully responsive with:
- Desktop navigation menu
- Mobile drawer menu
- Responsive grid layouts
- Mobile-optimized forms

## 🤝 Next Steps

To extend this project:
1. Connect MongoDB database
2. Implement JWT authentication
3. Add job application functionality
4. Create email notifications
5. Implement job filters and advanced search
6. Add user profile management
7. Implement admin dashboard

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips

- Use `dotenv` for environment variables
- Keep API calls in separate service files
- Use context API for global state management
- Implement proper error handling and validation
- Add loading states for async operations

---

Happy coding! 🚀
