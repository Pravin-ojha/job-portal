import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { usersAPI, jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [userJobs, setUserJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [jobSeekerTab, setJobSeekerTab] = useState(0);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userRes = await usersAPI.getUserProfile();
      setUserData(userRes.data);

      // Fetch user's applications (for job seekers)
      if (userRes.data.userType === 'job_seeker') {
        try {
          const applicationsRes = await jobsAPI.getUserApplications();
          // Backend returns array of applications with complete job and application data
          const appList = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
          
          // Transform to match dashboard structure - wrap job details in jobId object
          const transformedApps = appList.map(app => ({
            _id: `${app.jobId}-${app.appliedAt}`, // Create unique ID from jobId and appliedAt
            jobId: {
              _id: app.jobId,
              title: app.title,
              company: app.company,
              location: app.location,
              jobType: app.jobType,
              experienceLevel: app.experienceLevel,
              salary: app.salary,
              description: app.description,
              requirements: app.requirements
            },
            status: app.status || 'applied',
            appliedAt: app.appliedAt,
            createdAt: app.createdAt,
            postedBy: app.postedBy,
            coverLetter: app.coverLetter,
            portfolioUrl: app.portfolioUrl,
            linkedinUrl: app.linkedinUrl,
            phone: app.phone,
            yearsOfExperience: app.yearsOfExperience,
            notes: app.notes,
            resumePath: app.resumePath,
            updatedAt: app.updatedAt
          }));
          
          setApplications(transformedApps);
          
          // Track which jobs have been applied to
          const appliedIds = new Set(appList.map(app => app.jobId));
          setAppliedJobIds(appliedIds);
        } catch (err) {
          console.log('No applications found:', err.response?.status);
          setApplications([]);
          setAppliedJobIds(new Set());
        }

        try {
          const savedRes = await jobsAPI.getSavedJobs();
          setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : []);
        } catch (err) {
          console.log('No saved jobs found:', err.response?.status);
          setSavedJobs([]);
        }
      }

      // Fetch user's jobs (for employers)
      if (userRes.data.userType === 'employer') {
        try {
          const jobsRes = await jobsAPI.getUserJobs();
          setUserJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        } catch (err) {
          console.error('Error fetching user jobs:', err);
          setUserJobs([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await jobsAPI.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await jobsAPI.deleteJob(deleteDialog.id);
      setUserJobs(userJobs.filter(job => job._id !== deleteDialog.id));
      setDeleteDialog({ open: false, type: null, id: null });
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const stats = userData?.userType === 'job_seeker' ? [
    {
      icon: <DescriptionIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#667eea' }} />,
      label: 'My Applications',
      value: applications.length,
      color: '#667eea',
    },
    {
      icon: <BookmarkIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#764ba2' }} />,
      label: 'Saved Jobs',
      value: savedJobs.length,
      color: '#764ba2',
    },
    {
      icon: <PersonIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#f093fb' }} />,
      label: 'Profile',
      value: '✓',
      color: '#f093fb',
    },
  ] : [
    {
      icon: <PostAddIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#667eea' }} />,
      label: 'Job Posts',
      value: userJobs.length,
      color: '#667eea',
    },
    {
      icon: <PersonIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: '#764ba2' }} />,
      label: 'Profile',
      value: '✓',
      color: '#764ba2',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={userData?.userType === 'job_seeker' ? 4 : 6} key={index}>
            <Card
              sx={{
                textAlign: 'center',
                py: { xs: 2, sm: 2.5, md: 3 },
                px: { xs: 2, sm: 2 },
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid #e0e0e0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                <Box sx={{ mb: 1.5 }}>{stat.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Profile Section */}
      {userData && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              My Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {userData.firstName} {userData.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                  {userData.email}
                </Typography>
              </Grid>
              {userData.userType === 'employer' && userData.company && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Company
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userData.company}
                  </Typography>
                </Grid>
              )}
              {userData.phone && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userData.phone}
                  </Typography>
                </Grid>
              )}
              {userData.bio && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Bio
                  </Typography>
                  <Typography variant="body1">{userData.bio}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  User Type
                </Typography>
                <Chip
                  label={userData.userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                  color={userData.userType === 'job_seeker' ? 'primary' : 'secondary'}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Posted Jobs Section */}
      {userData?.userType === 'employer' && (
        <>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              My Posted Jobs ({userJobs.length})
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: { xs: '100%', sm: 'auto' }
              }}
              onClick={() => navigate('/post-job')}
            >
              Post New Job
            </Button>
          </Box>

          {userJobs.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 6 }}>
              {userJobs.map((job) => (
                <Grid item xs={12} key={job._id}>
                  <Card
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 3,
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'start' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {job.location} • {job.jobType}
                          </Typography>
                          {job.salary && (
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                              ₹{job.salaryMin || job.salary} - ₹{job.salaryMax || job.salary}
                            </Typography>
                          )}
                          <Typography variant="caption" color="textSecondary">
                            Applications: {job.applications?.length || 0}
                          </Typography>
                        </Box>
                        <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            sx={{ flex: { xs: 1, sm: 'auto' } }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/edit-job/${job._id}`)}
                            sx={{ flex: { xs: 1, sm: 'auto' } }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, type: 'job', id: job._id })}
                            sx={{ flex: { xs: 1, sm: 'auto' } }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ mb: 6 }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                <Typography variant="body1" color="textSecondary">
                  No jobs posted yet. Start by creating a new job posting!
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Job Seeker Sections with Tabs */}
      {userData?.userType === 'job_seeker' && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={jobSeekerTab} 
              onChange={(e, newValue) => setJobSeekerTab(newValue)}
              sx={{ 
                '& .MuiTab-root': { textTransform: 'none', fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
            >
              <Tab label={`My Applications (${applications.length})`} />
              <Tab label={`Saved Jobs (${savedJobs.length})`} />
            </Tabs>
          </Box>

          {/* Applications Tab */}
          {jobSeekerTab === 0 && (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                My Applications
              </Typography>
              {applications.length > 0 ? (
                <>
                  {/* Desktop view - Table */}
                  <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 6 }}>
                    <TableContainer component={Card}>
                      <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Applied On</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applications.map((app) => (
                            <TableRow key={app._id} hover>
                              <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {app.jobId?.title || 'Job'}
                              </TableCell>
                              <TableCell>{app.jobId?.company || '-'}</TableCell>
                              <TableCell>{app.jobId?.location || '-'}</TableCell>
                              <TableCell>
                                <Chip
                                  icon={app.status === 'applied' ? <CheckCircleIcon /> : <PendingIcon />}
                                  label={app.status === 'applied' ? 'Applied Job' : app.status || 'pending'}
                                  size="small"
                                  color={
                                    app.status === 'accepted' ? 'success' :
                                    app.status === 'applied' ? 'info' :
                                    app.status === 'rejected' ? 'error' :
                                    'warning'
                                  }
                                  variant={app.status === 'applied' ? 'filled' : 'outlined'}
                                />
                              </TableCell>
                              <TableCell>
                                {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Mobile view - Cards */}
                  <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 6 }}>
                    <Grid container spacing={2}>
                      {applications.map((app) => (
                        <Grid item xs={12} key={app._id}>
                          <Card
                            sx={{
                              background: app.status === 'applied' ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)' : 'transparent',
                              border: app.status === 'applied' ? '2px solid #2196F3' : '1px solid #e0e0e0',
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.95rem', flex: 1 }}>
                                  {app.jobId?.title || 'Job'}
                                </Typography>
                                <Chip
                                  icon={app.status === 'applied' ? <CheckCircleIcon /> : <PendingIcon />}
                                  label={app.status === 'applied' ? 'Applied' : app.status || 'pending'}
                                  size="small"
                                  color={
                                    app.status === 'accepted' ? 'success' :
                                    app.status === 'applied' ? 'info' :
                                    app.status === 'rejected' ? 'error' :
                                    'warning'
                                  }
                                  variant={app.status === 'applied' ? 'filled' : 'outlined'}
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                {app.jobId?.company}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {app.jobId?.location}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                  {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
                                sx={{ mt: 1.5, width: '100%' }}
                              >
                                View Job
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              ) : (
                <Card sx={{ mb: 6 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                      You haven't applied for any jobs yet.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      onClick={() => navigate('/jobs')}
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Saved Jobs Tab */}
          {jobSeekerTab === 1 && (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Saved Jobs
              </Typography>
              {savedJobs.length > 0 ? (
                <Grid container spacing={2} sx={{ mb: 6 }}>
                  {savedJobs.map((job) => {
                    const isApplied = appliedJobIds.has(job._id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={job._id}>
                        <Card
                          sx={{
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: isApplied ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)' : 'transparent',
                            border: isApplied ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                            position: 'relative',
                            '&:hover': {
                              boxShadow: 3,
                              transform: 'translateY(-5px)'
                            }
                          }}
                        >
                          {isApplied && (
                            <Box sx={{
                              position: 'absolute',
                              top: -12,
                              right: 16,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}>
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Applied"
                                size="small"
                                color="success"
                                sx={{ 
                                  background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>
                          )}
                          <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, pt: isApplied ? 3 : 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                              {job.company}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                              {job.location} • {job.jobType}
                            </Typography>
                            {job.salary && (
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                ₹{job.salaryMin || job.salary} - ₹{job.salaryMax || job.salary}
                              </Typography>
                            )}
                            <Typography variant="caption" color="textSecondary">
                              {job.experienceLevel}
                            </Typography>
                          </CardContent>
                          <Stack spacing={1} sx={{ p: { xs: 1, sm: 1.5 } }}>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                              onClick={() => navigate(`/jobs/${job._id}`)}
                            >
                              {isApplied ? 'View Application' : 'View & Apply'}
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveSavedJob(job._id)}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Card sx={{ mb: 6 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                      You haven't saved any jobs yet.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      onClick={() => navigate('/jobs')}
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: null, id: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: null, id: null })}>Cancel</Button>
          <Button onClick={handleDeleteJob} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;
