import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';

const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getJobById(id);
      const job = response.data;
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || '',
        description: job.description || '',
        requirements: job.requirements || '',
      });
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError(
        err.response?.data?.error || 'Failed to load job details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.jobType ||
      !formData.description ||
      !formData.requirements
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await jobsAPI.updateJob(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to update job:', err);
      setError(
        err.response?.data?.error || 'Failed to update job. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h2" sx={{ mb: 4 }}>
        Edit Job Posting
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Job updated successfully! Redirecting to dashboard... 🎉
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Type"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="e.g., Full-time, Part-time, Remote"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Salary (Optional)"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="e.g., $50,000 - $70,000"
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  multiline
                  rows={6}
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="e.g., 3+ years experience, Bachelor's degree, etc."
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Job'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditJobPage;
