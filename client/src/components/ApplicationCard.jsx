import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  Avatar,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const ApplicationCard = ({ application, onWithdraw, loading = false, canWithdraw = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'info';
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'withdrawn':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isWithdrawable =
    canWithdraw && ['applied', 'pending', 'reviewed'].includes(application.status);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}
            >
              {application.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
              {application.company}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Chip
              label={getStatusLabel(application.status)}
              color={getStatusColor(application.status)}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>

        {/* Location and Job Type */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
          <Chip
            icon={<LocationOnIcon />}
            label={application.location}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<WorkIcon />}
            label={application.jobType}
            size="small"
            variant="outlined"
          />
          {application.experienceLevel && (
            <Chip
              label={`${application.experienceLevel} Level`}
              size="small"
              variant="outlined"
            />
          )}
          {application.salary && (
            <Chip
              icon={<CurrencyRupeeIcon />}
              label={application.salary}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Application Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Application Details
          </Typography>

          <Stack spacing={1.5}>
            {/* Applied Date */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                Applied On:
              </Typography>
              <Typography variant="body2">
                {new Date(application.appliedAt).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Years of Experience */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">
                Years of Experience:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {application.yearsOfExperience} years
              </Typography>
            </Box>

            {/* Contact Information */}
            {application.phone && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Contact:
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <PhoneIcon sx={{ fontSize: '1rem' }} />
                  <Typography variant="body2">{application.phone}</Typography>
                </Stack>
              </Box>
            )}

            {/* Cover Letter */}
            {application.coverLetter && (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Cover Letter:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    fontStyle: 'italic',
                  }}
                >
                  {application.coverLetter.substring(0, 200)}
                  {application.coverLetter.length > 200 ? '...' : ''}
                </Typography>
              </Box>
            )}

            {/* Portfolio and LinkedIn */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {application.portfolioUrl && (
                <Button
                  size="small"
                  startIcon={<LanguageIcon />}
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Button>
              )}
              {application.linkedinUrl && (
                <Button
                  size="small"
                  startIcon={<LinkedInIcon />}
                  href={application.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Button>
              )}
            </Box>

            {/* Additional Notes */}
            {application.notes && (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Additional Notes:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                >
                  {application.notes}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Company Info */}
        {application.postedBy && (
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#fafafa', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Posted By
            </Typography>
            <Typography variant="body2">
              {application.postedBy.firstName} {application.postedBy.lastName}
            </Typography>
            {application.postedBy.company && (
              <Typography variant="body2" color="textSecondary">
                {application.postedBy.company}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
        <Box></Box>
        {isWithdrawable && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onWithdraw(application.jobId)}
            disabled={loading}
          >
            Withdraw
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ApplicationCard;
