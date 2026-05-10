import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ReviewComponent from '../components/ReviewComponent';
import JobApplicationForm from '../components/JobApplicationForm';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch job details
      const jobRes = await jobsAPI.getJobById(id);
      setJob(jobRes.data);

      // Fetch reviews
      try {
        const reviewsRes = await jobsAPI.getJobReviews(id);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.log('No reviews found');
      }

      // Check if user has saved this job
      if (user) {
        try {
          const savedRes = await jobsAPI.getSavedJobs();
          const jobIds = savedRes.data.map((j) => j._id);
          setIsSaved(jobIds.includes(id));

          // Check if user has applied
          const appliedRes = await jobsAPI.getUserApplications();
          const appliedJob = appliedRes.data.find((app) => app.jobId === id);
          if (appliedJob) {
            setHasApplied(true);
            setApplicationStatus(appliedJob.status);
          }
        } catch (err) {
          console.log('Could not check saved status');
        }
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      setSubmittingApplication(true);
      await jobsAPI.applyForJob(id, {
        ...formData,
        email: user.email,
      });
      setHasApplied(true);
      setApplicationStatus('applied');
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
      // Refresh applications to show updated status
      const appliedRes = await jobsAPI.getUserApplications();
      const appliedJob = appliedRes.data.find((app) => app.jobId === id);
      if (appliedJob) {
        setApplicationStatus(appliedJob.status);
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.error || 'Failed to apply for job');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await jobsAPI.unsaveJob(id);
        setIsSaved(false);
      } else {
        await jobsAPI.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job');
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await jobsAPI.addJobReview(id, reviewData);
      setReviews([response.data.review, ...reviews]);
      alert('Review added successfully!');
    } catch (err) {
      console.error('Error adding review:', err);
      alert(err.response?.data?.error || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Job not found</Alert>
        <Button variant="contained" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Job Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {job.title}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {job.company}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={job.location}
                  variant="outlined"
                />
                <Chip
                  icon={<WorkIcon />}
                  label={job.jobType}
                  color="primary"
                  variant="outlined"
                />
                {job.experienceLevel && (
                  <Chip
                    label={`${job.experienceLevel} Level`}
                    variant="outlined"
                  />
                )}
              </Stack>

              {job.salary && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Salary
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <CurrencyRupeeIcon /> {job.salary}
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {user && user._id === job.postedBy?._id ? (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate(`/edit-job/${id}`)}
                    >
                      Edit Job
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure?')) {
                          jobsAPI
                            .deleteJob(id)
                            .then(() => {
                              alert('Job deleted successfully');
                              navigate('/jobs');
                            })
                            .catch(() => alert('Failed to delete job'));
                        }
                      }}
                    >
                      Delete Job
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={hasApplied}
                      onClick={handleApply}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {hasApplied ? `Applied (${applicationStatus})` : 'Apply Now'}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      onClick={handleSaveJob}
                    >
                      {isSaved ? 'Saved' : 'Save Job'}
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {job.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Requirements
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {job.requirements}
              </Typography>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent>
              <ReviewComponent
                reviews={reviews}
                onAddReview={handleAddReview}
                allowReview={hasApplied}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Company Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Company Info
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{ width: 50, height: 50, bgcolor: '#667eea' }}
                  alt={job.company}
                >
                  {job.company?.[0] || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {job.company}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Posted by
                </Typography>
                <Typography variant="body1">
                  {job.postedBy?.firstName} {job.postedBy?.lastName}
                </Typography>
              </Box>

              {job.postedBy?.email && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{job.postedBy.email}</Typography>
                </Box>
              )}

              {job.postedBy?.phone && (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{job.postedBy.phone}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* View Company Profile */}
          {job.postedBy?.company && (
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate(`/companies/${job.postedBy._id}`)}
            >
              View Company Profile
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Application Form Dialog */}
      <JobApplicationForm
        open={showApplicationForm}
        jobTitle={job?.title}
        onClose={() => setShowApplicationForm(false)}
        onSubmit={handleApplicationSubmit}
        loading={submittingApplication}
      />
    </Container>
  );
};

export default JobDetailPage;
