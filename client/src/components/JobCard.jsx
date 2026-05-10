import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import JobApplicationForm from './JobApplicationForm';
import { jobsAPI } from '../services/api';
import { addSavedJobLocal, removeSavedJobLocal } from '../services/storageService';

const JobCard = ({
  job,
  isSaved = false,
  onSave,
  onUnsave,
  applicationStatus,
  onApplySuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isJobSaved, setIsJobSaved] = useState(isSaved);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isJobSaved) {
        await jobsAPI.unsaveJob(job._id);
        removeSavedJobLocal(user._id, job._id);
        onUnsave(job._id);
        setIsJobSaved(false);
      } else {
        await jobsAPI.saveJob(job._id);
        addSavedJobLocal(user._id, job);
        onSave(job._id);
        setIsJobSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      // Still update locally even if API fails
      if (isJobSaved) {
        removeSavedJobLocal(user._id, job._id);
        onUnsave(job._id);
      } else {
        addSavedJobLocal(user._id, job);
        onSave(job._id);
      }
      setIsJobSaved(!isJobSaved);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      setSubmittingApplication(true);
      await jobsAPI.applyForJob(job._id, {
        ...formData,
        email: user.email,
      });
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.error || 'Failed to apply for job');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
      case 'reviewed':
        return 'warning';
      case 'applied':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {job.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {job.company}
              </Typography>
            </Box>
            <Tooltip title={isJobSaved ? 'Remove from saved' : 'Save job'}>
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{ ml: 1 }}
              >
                {isJobSaved ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Job Details */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label={job.location}
              variant="outlined"
              size="small"
            />
            <Chip
              label={job.jobType}
              variant="outlined"
              size="small"
              color="primary"
            />
            {job.experienceLevel && (
              <Chip
                label={job.experienceLevel}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>

          {/* Salary */}
          {job.salary && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {job.salary}
            </Typography>
          )}

          {/* Description Preview */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {job.description.substring(0, 150)}...
          </Typography>

          {/* Application Status */}
          {applicationStatus && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`Application: ${applicationStatus}`}
                color={getStatusColor(applicationStatus)}
                variant="filled"
                size="small"
              />
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          View Details
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleApplyClick}
          disabled={applicationStatus === 'applied' || submittingApplication}
          startIcon={<WorkIcon />}
          sx={{ ml: 'auto' }}
        >
          {applicationStatus ? 'Already Applied' : 'Apply Now'}
        </Button>
      </CardActions>

      {/* Application Form Modal */}
      <JobApplicationForm
        open={showApplicationForm}
        jobTitle={job.title}
        onClose={() => setShowApplicationForm(false)}
        onSubmit={handleApplicationSubmit}
        loading={submittingApplication}
      />
    </Card>
  );
};

export default JobCard;
