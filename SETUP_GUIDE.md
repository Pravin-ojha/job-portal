# 🚀 JobPortal Setup Guide

## Step-by-Step Setup Instructions

### 1. Initial Setup

```bash
# Navigate to project directory
cd "FINAL PROJECT"

# Install all dependencies
npm run install-all
```

### 2. Configure Environment Variables

#### For Server (server/.env):
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_super_secret_key_123
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### For Client (client/.env):
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development

From the root directory (`FINAL PROJECT`):

#### Option A: Run both servers simultaneously
```bash
npm run dev
```

#### Option B: Run servers separately

Terminal 1 (Client):
```bash
npm run client
```

Terminal 2 (Server):
```bash
npm run server
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📋 Menu Navigation

Once the app is running, you can navigate through:

1. **Home** - View platform features and overview
2. **Search Jobs** - Browse job listings with filters
3. **Post Job** - Create a new job posting
4. **Dashboard** - View your activity and stats
5. **Login/Sign Up** - Authenticate users
6. **Profile Menu** - Access additional user options

## 🔧 Common Issues & Fixes

**Port Already in Use**
```bash
# Change port in server/.env
PORT=5001
```

**Module Not Found**
```bash
# Reinstall dependencies
npm run install-all
```

**CORS Error**
```bash
# Make sure CLIENT_URL in server/.env matches your frontend URL
CLIENT_URL=http://localhost:3000
```

## 📦 Project Structure Quick Reference

```
FINAL PROJECT/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API utilities
│   │   └── App.jsx      # Main app
│   └── package.json
├── server/          # Node Backend
│   ├── src/
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   └── index.js     # Server entry
│   └── package.json
└── README.md        # Full documentation
```

## 🎨 Customization Tips

### Change Color Scheme
Edit `client/src/App.jsx` theme colors:
```javascript
palette: {
  primary: { main: '#667eea' },
  secondary: { main: '#764ba2' }
}
```

### Modify Menu Items
Edit `client/src/components/Navbar.jsx` menuItems array

### Add New Pages
1. Create new file in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add navigation link in Navbar

## 🧪 Testing the Features

1. **Home Page** - Should display hero section and features
2. **Search Jobs** - Search and filter functionality using mock data
3. **Post Job** - Fill form and submit (no backend yet)
4. **Dashboard** - View stats and recent activity
5. **Authentication** - Login/Signup forms (mock)

## 📚 Next Development Steps

- [ ] Connect MongoDB database
- [ ] Implement JWT authentication
- [ ] Add job application system
- [ ] Create user profiles
- [ ] Add email notifications
- [ ] Implement advanced search filters
- [ ] Add user reviews and ratings
- [ ] Create admin dashboard

## 💬 Need Help?

Refer to:
- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)

---

Happy coding! 🎉
