import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    if (!formData.title || !formData.company || !formData.location || !formData.jobType || !formData.description || !formData.requirements) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await jobsAPI.createJob(formData);
      setSuccess(true);
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: '',
        description: '',
        requirements: '',
      });
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      console.error('Failed to post job:', err);
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        Post a New Job
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Job posted successfully! Redirecting... 🎉
        </Alert>
      )}

      <Card sx={{ boxShadow: 3 }}>
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
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="e.g., $100k - $150k"
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Type"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  required
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Describe the job responsibilities and role"
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
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
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="List skills and qualifications required"
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '100%',
                    fontWeight: 'bold',
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Post Job'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostJobPage;
