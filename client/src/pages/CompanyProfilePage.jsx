import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Rating,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { companiesAPI, jobsAPI } from '../services/api';
import ReviewComponent from '../components/ReviewComponent';

const CompanyProfilePage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getCompanyById(id);
      setCompany(response.data.company);
      setReviews(response.data.reviews || []);

      // Fetch jobs by this company
      const jobsResponse = await jobsAPI.getAllJobs({
        company: response.data.company.name,
      });
      setJobs(jobsResponse.data.jobs || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await companiesAPI.addCompanyReview(id, reviewData);
      setReviews([response.data.review, ...reviews]);
      setCompany({
        ...company,
        rating: response.data.company?.rating || company.rating,
        reviewCount: response.data.company?.reviewCount || company.reviewCount,
      });
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!company) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Company not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Company Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {company.logo && (
                <Avatar
                  src={company.logo}
                  sx={{ width: 120, height: 120 }}
                  variant="rounded"
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {company.name}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={company.rating || 0} readOnly />
                    <Typography variant="body2">
                      {company.rating?.toFixed(1)} ({company.reviewCount || 0} reviews)
                    </Typography>
                  </Box>
                </Stack>
                {company.description && (
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                    {company.description}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Company Info */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {company.industry && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Industry
                  </Typography>
                  <Typography variant="body1">{company.industry}</Typography>
                </Grid>
              )}
              {company.location && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{company.location}</Typography>
                </Grid>
              )}
              {company.foundedYear && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Founded
                  </Typography>
                  <Typography variant="body1">{company.foundedYear}</Typography>
                </Grid>
              )}
              {company.employeeCount && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Employees
                  </Typography>
                  <Typography variant="body1">{company.employeeCount}</Typography>
                </Grid>
              )}
              {company.website && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Website
                  </Typography>
                  <Button
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: 'none', pl: 0 }}
                  >
                    {company.website}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Open Positions */}
      {jobs && jobs.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Open Positions ({jobs.length})
          </Typography>
          <Stack spacing={2}>
            {jobs.map((job) => (
              <Card key={job._id}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {job.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                    <Chip label={job.location} size="small" variant="outlined" />
                    <Chip
                      label={job.jobType}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    {job.salary && <Chip label={job.salary} size="small" />}
                  </Stack>
                  <Button
                    size="small"
                    color="primary"
                    href={`/jobs/${job._id}`}
                  >
                    View Job
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Reviews */}
      <ReviewComponent
        reviews={reviews}
        onAddReview={handleAddReview}
        allowReview={true}
      />
    </Container>
  );
};

export default CompanyProfilePage;
