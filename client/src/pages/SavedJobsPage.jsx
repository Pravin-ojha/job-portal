import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { api } from '../services/api';
import JobCard from '../components/JobCard';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/user/saved');
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.post('/jobs/unsave', { jobId });
      setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove job from saved');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Saved Jobs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {savedJobs.length === 0 ? (
        <Alert severity="info">
          You haven't saved any jobs yet. Browse jobs and save them for later!
        </Alert>
      ) : (
        <Stack spacing={2}>
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved={true}
              onUnsave={handleUnsave}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default SavedJobsPage;
