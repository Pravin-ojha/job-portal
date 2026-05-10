# Quick Reference Guide - Job Portal Features

**Last Updated**: April 18, 2026

---

## 🎯 Quick Feature Reference

### User Journey: Job Seeker

#### 1. **Browsing Jobs**
- Navigate to `/jobs`
- Use filters: title, location, job type, experience level, salary range
- Click on job card to view details
- Or click "Apply Now" to start application process

#### 2. **Applying for a Job**
- Click "Apply Now" button on job detail page
- Fill out application form:
  ```
  Required:
  - Phone: "9876543210" or "+1 (555) 000-0000"
  - Years of Experience: "3" or "5"
  
  Optional:
  - Cover Letter: "Tell why you're interested..."
  - Portfolio URL: "https://yourportfolio.com"
  - LinkedIn URL: "https://linkedin.com/in/yourprofile"
  - Additional Notes: "Any extra info..."
  ```
- Click "Submit Application"
- Success message appears

#### 3. **Tracking Applications**
- Go to `/applications`
- View stats: Total, Accepted, Under Review, Rejected
- Use tabs to filter by status:
  - All - All applications
  - Applied - Recent applications
  - Pending - Awaiting review
  - Reviewed - Under consideration
  - Accepted - Got the job!
  - Rejected - Not selected
  - Withdrawn - You withdrew
- Click "Withdraw" to cancel application (on pending/applied/reviewed)

#### 4. **Saving Jobs**
- On job card, click bookmark icon
- Go to `/saved-jobs` to see all saved jobs
- Click bookmark again to unsave

#### 5. **Dashboard Overview**
- Go to `/dashboard`
- See quick stats:
  - My Applications (clickable)
  - Saved Jobs (clickable)
- View your profile information
- Edit profile or browse jobs

---

### User Journey: Employer

#### 1. **Posting a Job**
- Go to `/post-job`
- Fill in job details:
  ```
  Title, Company, Location, Job Type (Full-time, Part-time, Contract, Internship)
  Description, Requirements
  Salary (optional), Salary Range (min/max)
  Experience Level (Entry, Mid, Senior)
  ```
- Click "Post Job"
- Job appears on job board

#### 2. **Viewing Applications**
- Go to specific job detail page
- See applications section with all applicants
- View applicant details:
  - Phone, email
  - Years of experience
  - Cover letter
  - Portfolio and LinkedIn links
  - Additional notes

#### 3. **Managing Posted Jobs**
- On dashboard or job detail:
  - Click "Edit Job" to modify
  - Click "Delete Job" to remove
- View list of all posted jobs

#### 4. **Dashboard**
- See Job Posts count
- List of posted jobs
- Quick actions: Edit, Delete, View applications

---

### User Journey: Admin

#### 1. **Accessing Admin Panel**
- Go to `/admin` (admin users only)
- View dashboard statistics:
  - Total users, job seekers, employers
  - Total jobs, average jobs per employer

#### 2. **Managing Users**
- Go to "Users" tab
- View all users with pagination
- Delete user if needed (confirmation required)

#### 3. **Managing Jobs**
- Go to "Jobs" tab
- View all jobs with pagination
- Delete job if needed (confirmation required)

---

## 🔗 API Endpoints Cheat Sheet

### Job Applications

**Apply for Job**
```
POST /api/jobs/:id/apply
Authorization: Bearer {token}
Content-Type: application/json

Body: {
  phone: "9876543210",
  yearsOfExperience: 3,
  coverLetter: "Optional text",
  portfolioUrl: "https://url.com",
  linkedinUrl: "https://linkedin.com/in/profile",
  notes: "Optional notes",
  email: "user@example.com"
}

Response: {
  message: "Application submitted successfully",
  job: { ... updated job with applications array }
}
```

**Get User Applications**
```
GET /api/jobs/user/applications
Authorization: Bearer {token}

Response: [
  {
    jobId: "...",
    title: "Job Title",
    company: "Company Name",
    status: "applied",
    appliedAt: "2026-04-18T...",
    phone: "9876543210",
    yearsOfExperience: 3,
    coverLetter: "...",
    portfolioUrl: "...",
    linkedinUrl: "...",
    notes: "..."
  },
  ...
]
```

**Withdraw Application**
```
POST /api/jobs/withdraw
Authorization: Bearer {token}
Content-Type: application/json

Body: {
  jobId: "..."
}

Response: {
  message: "Application withdrawn successfully",
  application: { ... updated application }
}
```

**Update Application Status** (Employer Only)
```
PUT /api/jobs/application/status
Authorization: Bearer {token}
Content-Type: application/json

Body: {
  jobId: "...",
  userId: "...",
  status: "accepted" | "rejected" | "pending" | "reviewed"
}

Response: {
  message: "Application status updated",
  job: { ... }
}
```

### Jobs

**Search Jobs with Filters**
```
GET /api/jobs?title=...&location=...&jobType=...&salaryMin=...&salaryMax=...&page=1&limit=10

Response: {
  jobs: [ ... ],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalJobs: 50,
    jobsPerPage: 10
  }
}
```

**Get Job Details**
```
GET /api/jobs/:id

Response: {
  _id: "...",
  title: "...",
  company: "...",
  description: "...",
  applications: [ ... ],
  rating: 4.5,
  reviewCount: 10,
  ...
}
```

**Create Job** (Employer Only)
```
POST /api/jobs
Authorization: Bearer {token}

Body: {
  title: "...",
  company: "...",
  description: "...",
  requirements: "...",
  location: "...",
  jobType: "Full-time",
  salaryMin: 50000,
  salaryMax: 80000,
  experienceLevel: "Mid-level"
}
```

### Authentication

**Sign Up**
```
POST /api/auth/signup

Body: {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
  userType: "job_seeker" | "employer"
}

Response: {
  token: "jwt_token",
  user: { ... }
}
```

**Login**
```
POST /api/auth/login

Body: {
  email: "john@example.com",
  password: "password123"
}

Response: {
  token: "jwt_token",
  user: { ... }
}
```

**Get Current User**
```
GET /api/auth/me
Authorization: Bearer {token}

Response: {
  _id: "...",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  userType: "job_seeker",
  role: "user"
}
```

---

## 📁 Key Files Overview

### Frontend Files

| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Main app routing |
| `client/src/pages/ApplicationsPage.jsx` | View all applications |
| `client/src/pages/JobDetailPage.jsx` | Job details + apply |
| `client/src/pages/DashboardPage.jsx` | User dashboard |
| `client/src/components/JobApplicationForm.jsx` | Application form modal |
| `client/src/components/ApplicationCard.jsx` | Application display |
| `client/src/services/api.js` | API calls |

### Backend Files

| File | Purpose |
|------|---------|
| `server/src/models/Job.js` | Job schema |
| `server/src/controllers/jobController.js` | Job logic |
| `server/src/routes/jobRoutes.js` | Job endpoints |
| `server/src/middleware/auth.js` | Auth middleware |

---

## 🧪 Testing Common Scenarios

### Scenario 1: Complete Job Application
```
1. Login as job_seeker
2. Go to /jobs
3. Click on a job
4. Click "Apply Now"
5. Fill form:
   - Phone: "9876543210"
   - Experience: "3"
   - Cover Letter: "I am interested in..."
   - Portfolio: "https://myportfolio.com"
6. Click "Submit Application"
7. Go to /applications
8. See application in "Applied" tab
9. Check all details are saved
```

### Scenario 2: Withdraw Application
```
1. On /applications page
2. Find an application in "Applied" tab
3. Click "Withdraw" button
4. Confirm in dialog
5. Application moves to "Withdrawn" tab
6. Withdraw button disappears
```

### Scenario 3: Dashboard Overview
```
1. Go to /dashboard
2. See application count
3. Click on applications card
4. Should navigate to /applications
5. See all applications
```

### Scenario 4: Post and Apply
```
1. Login as employer
2. Go to /post-job
3. Fill and post job
4. Logout and login as job_seeker
5. Go to /jobs
6. Find the new job
7. Apply for it
8. Logout and login as employer
9. Go to job details
10. See the application
```

---

## ⚙️ Configuration Files

### server/.env
```
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### client/.env.local
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚨 Common Error Solutions

| Error | Solution |
|-------|----------|
| "Phone number is required" | Enter valid phone number (10 digits or international format) |
| "You have already applied for this job" | You've already applied. Go to /applications to see your application. |
| "Application not found" | The application may have been deleted or doesn't exist. |
| "Not authorized" | Make sure you're logged in and have the right user type. |
| "Token expired" | Log out and log in again to get a fresh token. |
| "Server error" | Check backend is running on port 5000. |

---

## 📊 Dashboard Statistics Explained

### Stats Cards on Dashboard:

1. **My Applications**
   - Total number of jobs you've applied to
   - Click to see full applications page
   - Status breakdown: Applied, Under Review, Accepted, Rejected

2. **Saved Jobs**
   - Jobs you bookmarked for later
   - Click to see saved jobs page
   - You can unsave anytime

3. **Job Posts** (Employers) / **Profile** (Job Seekers)
   - For employers: Number of jobs posted
   - For job seekers: Your profile indicator

---

## 🔐 Authentication & Security

- **JWT Tokens**: Stored in localStorage
- **Protected Routes**: Only authenticated users can access
- **Role-Based Access**: Different pages for different user types
- **Admin Only**: Admin dashboard requires admin role
- **Employer Only**: Posting jobs requires employer account

---

## 📱 Responsive Design

All pages are responsive:
- **Desktop**: Full layout with all features
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout, hamburger menu

---

## 💡 Pro Tips

1. **Filter Before Applying**: Use job filters to find best matches
2. **Save First**: Save jobs you're interested in to review later
3. **Complete Profile**: Fill all profile info for better applications
4. **Track Status**: Check /applications regularly to monitor progress
5. **Follow Up**: After applying, check application status in dashboard
6. **Use LinkedIn**: Link your LinkedIn profile for employers to verify

---

## 📞 API Base URL

**Development**: `http://localhost:5000/api`
**Production**: (Set in .env.local)

All endpoints require:
- Content-Type: `application/json`
- Authorization: `Bearer {token}` (for protected routes)

---

## ✅ Verification Checklist

- [x] All endpoints working
- [x] Form validation working
- [x] Application status tracking working
- [x] Dashboard shows correct data
- [x] Navigation working
- [x] Error handling in place
- [x] Mobile responsive
- [x] Protected routes enforced

---

**Happy Job Hunting! 🚀**

For more detailed information, see:
- `IMPLEMENTATION_SUMMARY.md` - Complete feature overview
- `FEATURE_INTEGRATION_REPORT.md` - Technical integration details
- `CONNECTIVITY_FIXES.md` - Connectivity solutions
