import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import JobFilters from '../components/JobFilters';
import PaginationComponent from '../components/Pagination';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalJobs: 0,
  });
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: [0, 200000],
    search: '',
  });

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [currentPage, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.title && { title: filters.title }),
        ...(filters.location && { location: filters.location }),
        ...(filters.jobType && { jobType: filters.jobType }),
        ...(filters.experienceLevel && { experienceLevel: filters.experienceLevel }),
        ...(filters.salaryRange[1] < 200000 && { salaryMin: filters.salaryRange[0], salaryMax: filters.salaryRange[1] }),
      };

      const response = await api.get('/jobs', { params });
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/jobs/user/saved');
      setSavedJobs(response.data.map((job) => job._id));
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setTimeout(() => fetchJobs(), 100);
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salaryRange: [0, 200000],
      search: '',
    });
    setCurrentPage(1);
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/jobs/save', { jobId });
      setSavedJobs([...savedJobs, jobId]);
    } catch (err) {
      console.error('Failed to save job:', err);
      alert(err.response?.data?.error || 'Failed to save job');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.post('/jobs/unsave', { jobId });
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
      alert('Failed to remove job from saved');
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Search Jobs
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <JobFilters onFilter={handleFilter} onClear={handleClearFilters} />
        </Grid>

        {/* Jobs Listing */}
        <Grid item xs={12} md={9}>
          {jobs.length > 0 ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Found {pagination.totalJobs} jobs
                </Typography>
              </Box>
              
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedJobs.includes(job._id)}
                  onSave={handleSaveJob}
                  onUnsave={handleUnsaveJob}
                />
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <PaginationComponent
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalJobs}
                  itemsPerPage={pagination.jobsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <Alert severity="info">
              No jobs found matching your criteria. Try adjusting your filters.
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobsPage;
