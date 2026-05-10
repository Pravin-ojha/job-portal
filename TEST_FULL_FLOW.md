# Complete Job Portal Testing Guide

## ✅ Systems Status
- **Backend Server**: Running on http://localhost:5000 ✅
- **Frontend Server**: Running on http://localhost:3000 ✅
- **Database**: Connected ✅

---

## 🧪 Test Sequence

### Phase 1: User Registration & Authentication

#### Test 1.1: Register as Job Seeker
```
URL: http://localhost:3000/signup
Steps:
1. Click "Job Seeker" option
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: seeker@test.com
   - Password: test123456
   - Confirm Password: test123456
3. Click "Sign Up"
Expected: Redirected to dashboard with user info
```

#### Test 1.2: Register as Employer
```
URL: http://localhost:3000/signup
Steps:
1. Click "Employer" option
2. Fill form:
   - First Name: Jane
   - Last Name: Smith
   - Email: employer@test.com
   - Password: test123456
   - Confirm Password: test123456
   - Company: Tech Corp
3. Click "Sign Up"
Expected: Redirected to employer dashboard
```

---

### Phase 2: Job Seeker Dashboard (Applied & Saved Jobs)

#### Test 2.1: View Dashboard - No Applications
```
As: Job Seeker (seeker@test.com)
URL: http://localhost:3000/dashboard
Expected Results:
✅ Dashboard loads
✅ Stats show "My Applications: 0"
✅ Stats show "Saved Jobs: 0"
✅ Tab 1: "My Applications (0)" - Empty state shown
✅ Tab 2: "Saved Jobs (0)" - Empty state shown
```

#### Test 2.2: Navigate to Jobs & Save a Job
```
As: Job Seeker
Steps:
1. Go to http://localhost:3000/jobs
2. Find a job or wait for jobs to load
3. Click bookmark icon or "Save Job" button
4. Expected: Button changes state/shows saved indicator
```

#### Test 2.3: Check Saved Jobs in Dashboard
```
As: Job Seeker
Steps:
1. Go to Dashboard
2. Click "Saved Jobs" tab
Expected:
✅ Saved job(s) appear in grid
✅ Each job card shows:
   - Job title
   - Company name
   - Location
   - Job type
   - "View & Apply" or "View Application" button
✅ Remove button available
```

---

### Phase 3: Job Application Flow

#### Test 3.1: Apply for Job from Saved Jobs
```
As: Job Seeker
Steps:
1. Go to Dashboard → Saved Jobs tab
2. Click "View & Apply" on a job
3. Fill application form:
   - Phone: 555-1234
   - Years of Experience: 3
   - Cover Letter: "I am interested..."
   - Portfolio URL: https://portfolio.com
4. Click "Apply"
Expected:
✅ Modal closes
✅ Button changes to "View Application"
✅ Job shows "Applied" badge
```

#### Test 3.2: Check Applications in Dashboard
```
As: Job Seeker
Steps:
1. Go to Dashboard
2. Click "My Applications" tab
Expected:
✅ Applications tab shows table with columns:
   - Job Title
   - Company
   - Location
   - Status (with blue "Applied Job" badge)
   - Applied On (date)
   - Actions (View button)
✅ Applications count updated
```

#### Test 3.3: View Application from Dashboard
```
As: Job Seeker
Steps:
1. Dashboard → Applications tab
2. Click "View" button on an application
Expected:
✅ Navigates to job detail page
✅ Job details display correctly
✅ Status shows "Already Applied"
```

---

### Phase 4: Employer Dashboard

#### Test 4.1: View Employer Dashboard
```
As: Employer (employer@test.com)
URL: http://localhost:3000/dashboard
Expected:
✅ Dashboard shows "My Posted Jobs (X)"
✅ Stats show "Job Posts: 0" initially
✅ "Post New Job" button available
```

#### Test 4.2: Post a New Job
```
As: Employer
Steps:
1. Click "Post New Job" button
2. Fill form:
   - Job Title: Senior Developer
   - Company: Tech Corp
   - Location: New York
   - Salary: $100k - $150k
   - Job Type: Full-time
   - Description: Looking for senior developer
   - Requirements: 5+ years experience
3. Click "Post Job"
Expected:
✅ Success message appears
✅ Redirected to jobs page
✅ New job visible in job listing
```

#### Test 4.3: Verify Posted Job in Dashboard
```
As: Employer
Steps:
1. Go to Dashboard
Expected:
✅ Posted job appears in list
✅ Shows title, location, job type, salary
✅ Shows "Applications: 0"
✅ Edit and Delete buttons available
```

---

### Phase 5: Saved Jobs & Applications Integration

#### Test 5.1: Save Job & Apply
```
As: Job Seeker
Steps:
1. Browse jobs (http://localhost:3000/jobs)
2. Save a job (if not already saved)
3. Apply for the saved job
4. Go to Dashboard
Expected:
✅ Saved Jobs tab shows job with "Applied" badge
✅ Applications tab shows job with status
✅ Badge text: "Applied" with green background
✅ Border/background changed to green
```

#### Test 5.2: Multiple Applications
```
As: Job Seeker
Steps:
1. Apply for 2-3 different jobs
2. Go to Dashboard → My Applications
Expected:
✅ All applications listed
✅ Each with correct status badge
✅ Count updated: "My Applications (3)"
✅ All dates, companies, statuses correct
```

---

### Phase 6: Admin Dashboard (if applicable)

#### Test 6.1: Access Admin Dashboard
```
As: Admin user (if set up)
URL: http://localhost:3000/admin
Expected:
✅ Admin dashboard loads
✅ Stats cards show:
   - Total Users
   - Job Seekers count
   - Employers count
   - Total Jobs
✅ Two tabs: Users and Jobs
```

---

## 🔍 API Endpoint Verification

### Key Endpoints to Verify:

1. **POST /api/auth/signup**
   - Request: `{ firstName, lastName, email, password, userType }`
   - Response: `{ token, user }`
   - Check: userType is `'job_seeker'` or `'employer'` (NOT `'job-seeker'`)

2. **GET /api/jobs/user/applications**
   - Auth: Required (Bearer token)
   - Response: Array of applications with full job details
   - Check: Returns jobId, title, company, status, appliedAt

3. **GET /api/jobs/user/saved**
   - Auth: Required
   - Response: Array of saved job documents
   - Check: Returns job details

4. **POST /api/jobs/save**
   - Auth: Required
   - Body: `{ jobId }`
   - Response: `{ message, savedJobs }`

5. **POST /api/jobs/unsave**
   - Auth: Required
   - Body: `{ jobId }`
   - Response: `{ message, savedJobs }`

6. **POST /api/jobs/:id/apply**
   - Auth: Required
   - Body: Complete application details
   - Response: `{ message, job }`

---

## ✅ Success Criteria

- [ ] Job seekers can save jobs
- [ ] Job seekers can view saved jobs in dashboard
- [ ] Job seekers can apply for jobs (saved or browsing)
- [ ] Applications appear in "My Applications" tab
- [ ] Saved jobs show "Applied" status when application exists
- [ ] Application count updates automatically
- [ ] Date and time information displays correctly
- [ ] All status badges show correct colors
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Backend API returns correct userType (job_seeker, not job-seeker)

---

## 🐛 Troubleshooting

### Issue: Saved Jobs/Applications don't appear
**Solution:**
1. Check browser console for errors (F12)
2. Verify token is saved in localStorage
3. Check Network tab to see API responses
4. Ensure userType is `'job_seeker'` (check DevTools → Application → localStorage)

### Issue: Wrong user type showing
**Solution:**
1. Re-register and make sure correct user type is selected
2. Check database to verify userType stored as `'job_seeker'` not `'job-seeker'`

### Issue: Buttons not responding
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev servers
3. Check for JavaScript errors in console

---

## 📊 Test Results

| Feature | Status | Notes |
|---------|--------|-------|
| User Signup (Job Seeker) | ⏳ Pending | |
| User Signup (Employer) | ⏳ Pending | |
| Save Jobs | ⏳ Pending | |
| View Saved Jobs | ⏳ Pending | |
| Apply for Job | ⏳ Pending | |
| View Applications | ⏳ Pending | |
| Post Job | ⏳ Pending | |
| Admin Dashboard | ⏳ Pending | |

---

## 📝 Notes

**Updated**: April 23, 2026
**Status**: Ready for Testing

### Recent Fixes Applied:
1. ✅ Fixed userType enum (job_seeker vs job-seeker)
2. ✅ Updated DashboardPage data transformation
3. ✅ Fixed PostJobPage styling (no overlapping text)
4. ✅ Verified all API endpoints properly connected

**Next Steps:**
- Run through complete test sequence
- Document any issues found
- Fix any remaining bugs
- Deploy to production
