import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/ApplicationCard';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState({
    open: false,
    jobId: null,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getUserApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = (jobId) => {
    setWithdrawDialog({
      open: true,
      jobId,
    });
  };

  const handleConfirmWithdraw = async () => {
    try {
      setWithdrawing(true);
      await jobsAPI.withdrawApplication(withdrawDialog.jobId);
      setApplications(
        applications.map((app) =>
          app.jobId === withdrawDialog.jobId ? { ...app, status: 'withdrawn' } : app
        )
      );
      setWithdrawDialog({ open: false, jobId: null });
      alert('Application withdrawn successfully');
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(err.response?.data?.error || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleCloseDialog = () => {
    setWithdrawDialog({ open: false, jobId: null });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter applications by status
  const getFilteredApplications = () => {
    if (tabValue === 'all') return applications;
    return applications.filter((app) => app.status === tabValue);
  };

  const filteredApplications = getFilteredApplications();

  // Count applications by status
  const statusCounts = {
    all: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    withdrawn: applications.filter((a) => a.status === 'withdrawn').length,
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          My Applications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track and manage all your job applications
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                {statusCounts.all}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {statusCounts.accepted}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Accepted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {statusCounts.pending + statusCounts.reviewed}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Under Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {statusCounts.rejected}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All (${statusCounts.all})`} value="all" />
          <Tab label={`Applied (${statusCounts.applied})`} value="applied" />
          <Tab label={`Pending (${statusCounts.pending})`} value="pending" />
          <Tab label={`Reviewed (${statusCounts.reviewed})`} value="reviewed" />
          <Tab label={`Accepted (${statusCounts.accepted})`} value="accepted" />
          <Tab label={`Rejected (${statusCounts.rejected})`} value="rejected" />
          <Tab label={`Withdrawn (${statusCounts.withdrawn})`} value="withdrawn" />
        </Tabs>
      </Box>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Alert severity="info">
          {tabValue === 'all'
            ? 'You have not applied for any jobs yet. Start exploring jobs now!'
            : `No applications with status "${tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}" found.`}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredApplications.map((application) => (
            <Grid item xs={12} key={application.jobId}>
              <ApplicationCard
                application={application}
                onWithdraw={handleWithdrawClick}
                loading={withdrawing}
                canWithdraw={true}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={withdrawDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Withdrawal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to withdraw this application? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={withdrawing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmWithdraw}
            color="error"
            variant="contained"
            disabled={withdrawing}
          >
            {withdrawing ? 'Withdrawing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationsPage;
