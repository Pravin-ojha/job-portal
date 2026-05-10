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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Rating,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ClearIcon from '@mui/icons-material/Clear';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  getSavedJobsLocal,
  addSavedJobLocal,
  removeSavedJobLocal,
  getAppliedJobsLocal,
  addAppliedJobLocal,
  syncUserDataToStorage,
} from '../services/storageService';

const JobsPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [unsaveDialog, setUnsaveDialog] = useState({ open: false, jobId: null });

  useEffect(() => {
    if (user?._id) {
      fetchJobsData();
    }
  }, [user?._id]);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from API
      const savedRes = await jobsAPI.getSavedJobs();
      const appRes = await jobsAPI.getUserApplications();

      const savedJobsList = Array.isArray(savedRes.data) ? savedRes.data : [];
      const appliedJobsList = Array.isArray(appRes.data) ? appRes.data : [];

      setSavedJobs(savedJobsList);
      setAppliedJobs(appliedJobsList);

      // Sync to local storage
      syncUserDataToStorage(user._id, savedJobsList, appliedJobsList);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      // Fallback to local storage
      const localSaved = getSavedJobsLocal(user._id);
      const localApplied = getAppliedJobsLocal(user._id);
      
      setSavedJobs(localSaved);
      setAppliedJobs(localApplied);

      if (localSaved.length === 0 && localApplied.length === 0) {
        setError('Unable to load data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async () => {
    try {
      await jobsAPI.unsaveJob(unsaveDialog.jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== unsaveDialog.jobId));
      removeSavedJobLocal(user._id, unsaveDialog.jobId);
      setUnsaveDialog({ open: false, jobId: null });
    } catch (err) {
      console.error('Error unsaving job:', err);
      // Update locally even if API fails
      setSavedJobs(savedJobs.filter(job => job._id !== unsaveDialog.jobId));
      removeSavedJobLocal(user._id, unsaveDialog.jobId);
      setUnsaveDialog({ open: false, jobId: null });
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId || app.jobId?._id === jobId);
  };

  const getApplicationStatus = (jobId) => {
    const app = appliedJobs.find(a => a.jobId === jobId || a.jobId?._id === jobId);
    return app?.status || null;
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
        My Jobs
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Manage your saved and applied jobs in one place
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} Using cached data.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
              py: 3,
            }}
          >
            <CardContent>
              <BookmarkIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {savedJobs.length}
              </Typography>
              <Typography variant="body2">Saved Jobs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              textAlign: 'center',
              py: 3,
            }}
          >
            <CardContent>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {appliedJobs.length}
              </Typography>
              <Typography variant="body2">Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              textAlign: 'center',
              py: 3,
            }}
          >
            <CardContent>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {appliedJobs.filter(a => a.status === 'accepted').length}
              </Typography>
              <Typography variant="body2">Accepted</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 500,
            }
          }}
        >
          <Tab label={`Saved Jobs (${savedJobs.length})`} />
          <Tab label={`My Applications (${appliedJobs.length})`} />
        </Tabs>
      </Box>

      {/* Saved Jobs Tab */}
      {tabValue === 0 && (
        <Box>
          {savedJobs.length > 0 ? (
            <Grid container spacing={2}>
              {savedJobs.map((job) => {
                const isApplied = isJobApplied(job._id);
                const applicationStatus = getApplicationStatus(job._id);

                return (
                  <Grid item xs={12} key={job._id}>
                    <Card
                      sx={{
                        transition: 'all 0.3s ease',
                        border: isApplied ? '2px solid #4caf50' : '1px solid #e0e0e0',
                        background: isApplied ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)' : 'transparent',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                  cursor: 'pointer',
                                  '&:hover': { color: '#667eea' }
                                }}
                                onClick={() => navigate(`/jobs/${job._id}`)}
                              >
                                {job.title}
                              </Typography>
                              {isApplied && (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Applied"
                                  color="success"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>

                            {/* Company and Basic Info */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              {job.company && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {job.company}
                                  </Typography>
                                </Box>
                              )}
                              {job.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOnIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2">
                                    {job.location}
                                  </Typography>
                                </Box>
                              )}
                              {job.jobType && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <WorkIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2">
                                    {job.jobType}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            {/* Salary */}
                            {(job.salary || job.salaryMin || job.salaryMax) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                <AttachMoneyIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                  ₹{job.salaryMin || job.salary} - ₹{job.salaryMax || job.salary}
                                </Typography>
                              </Box>
                            )}

                            {/* Description Preview */}
                            {job.description && (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  mb: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {job.description}
                              </Typography>
                            )}

                            {/* Tags */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {job.experienceLevel && (
                                <Chip
                                  label={job.experienceLevel}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                              )}
                              {job.postedBy && (
                                <Chip
                                  label={`by ${job.postedBy.firstName || 'Unknown'}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Action Buttons */}
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}
                          >
                            {isApplied ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => navigate('/applications')}
                                sx={{ flex: { xs: 1, sm: 'auto' } }}
                              >
                                View Application
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/jobs/${job._id}`)}
                                sx={{ flex: { xs: 1, sm: 'auto' } }}
                              >
                                Apply Now
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<ClearIcon />}
                              onClick={() => setUnsaveDialog({ open: true, jobId: job._id })}
                              sx={{ flex: { xs: 1, sm: 'auto' } }}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <BookmarkBorderIcon sx={{ fontSize: 64, color: '#999', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No Saved Jobs
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Start saving jobs you're interested in
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/jobs')}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Applications Tab */}
      {tabValue === 1 && (
        <Box>
          {appliedJobs.length > 0 ? (
            <Grid container spacing={2}>
              {appliedJobs.map((app) => {
                const jobData = app.jobId && typeof app.jobId === 'object' ? app.jobId : { title: app.title, company: app.company };
                const jobId = app.jobId?._id || app.jobId;

                return (
                  <Grid item xs={12} key={app._id || jobId}>
                    <Card
                      sx={{
                        transition: 'all 0.3s ease',
                        borderLeft: `4px solid ${
                          app.status === 'accepted' ? '#4caf50' :
                          app.status === 'rejected' ? '#f44336' :
                          app.status === 'reviewed' || app.status === 'pending' ? '#ff9800' :
                          '#2196f3'
                        }`,
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                  cursor: 'pointer',
                                  '&:hover': { color: '#667eea' }
                                }}
                                onClick={() => navigate(`/jobs/${jobId}`)}
                              >
                                {jobData.title}
                              </Typography>
                              <Chip
                                icon={
                                  app.status === 'accepted' ? <CheckCircleIcon /> :
                                  app.status === 'rejected' ? <ClearIcon /> :
                                  <PendingIcon />
                                }
                                label={app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                size="small"
                                color={
                                  app.status === 'accepted' ? 'success' :
                                  app.status === 'rejected' ? 'error' :
                                  'warning'
                                }
                                variant="filled"
                              />
                            </Box>

                            {/* Company and Basic Info */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              {jobData.company && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PersonIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {jobData.company}
                                  </Typography>
                                </Box>
                              )}
                              {app.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOnIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2">
                                    {app.location}
                                  </Typography>
                                </Box>
                              )}
                              {app.jobType && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <WorkIcon sx={{ fontSize: 18, color: '#666' }} />
                                  <Typography variant="body2">
                                    {app.jobType}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            {/* Applied Date */}
                            {app.appliedAt && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                                <DateRangeIcon sx={{ fontSize: 18, color: '#999' }} />
                                <Typography variant="body2" color="textSecondary">
                                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}

                            {/* Application Details */}
                            {(app.coverLetter || app.phone || app.yearsOfExperience) && (
                              <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                {app.phone && (
                                  <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                                    <strong>Phone:</strong> {app.phone}
                                  </Typography>
                                )}
                                {app.yearsOfExperience && (
                                  <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                                    <strong>Experience:</strong> {app.yearsOfExperience} years
                                  </Typography>
                                )}
                                {app.coverLetter && (
                                  <Typography variant="caption" display="block" sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    <strong>Cover Letter:</strong> {app.coverLetter}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>

                          {/* Action Button */}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/jobs/${jobId}`)}
                            sx={{ mt: { xs: 2, sm: 0 } }}
                          >
                            View Job
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <PendingIcon sx={{ fontSize: 64, color: '#999', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No Applications Yet
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Apply for jobs to track your applications here
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/jobs')}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Unsave Confirmation Dialog */}
      <Dialog open={unsaveDialog.open} onClose={() => setUnsaveDialog({ open: false, jobId: null })}>
        <DialogTitle>Remove Saved Job</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this job from your saved list?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnsaveDialog({ open: false, jobId: null })}>Cancel</Button>
          <Button onClick={handleUnsaveJob} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsPanel;
