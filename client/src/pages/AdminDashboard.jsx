import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  TablePagination,
} from '@mui/material';
import { usersAPI, jobsAPI } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [jobPage, setJobPage] = useState(0);
  const [applicationPage, setApplicationPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null,
    id: null,
    name: '',
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [tab, userPage, jobPage, applicationPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsResponse = await usersAPI.getAdminStats();
      setStats(statsResponse.data);

      if (tab === 0) {
        // Fetch users
        const usersResponse = await usersAPI.getAllUsers({
          page: userPage + 1,
          limit: rowsPerPage,
        });
        setUsers(usersResponse.data.users || []);
      } else if (tab === 1) {
        // Fetch jobs
        const jobsResponse = await usersAPI.getAllJobs({
          page: jobPage + 1,
          limit: rowsPerPage,
        });
        setJobs(jobsResponse.data.jobs || []);
      } else if (tab === 2) {
        // Fetch applications
        const appsResponse = await usersAPI.getAllApplications({
          page: applicationPage + 1,
          limit: rowsPerPage,
        });
        setApplications(appsResponse.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(
        error.response?.data?.error || 'You are not authorized to access admin panel'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      if (deleteDialog.type === 'user') {
        await usersAPI.deleteUser(deleteDialog.id);
        setUsers(users.filter((u) => u._id !== deleteDialog.id));
      } else if (deleteDialog.type === 'job') {
        await usersAPI.deleteJob(deleteDialog.id);
        setJobs(jobs.filter((j) => j._id !== deleteDialog.id));
      }
      setDeleteDialog({ open: false, type: null, id: null, name: '' });
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeUserPage = (event, newPage) => {
    setUserPage(newPage);
  };

  const handleChangeJobPage = (event, newPage) => {
    setJobPage(newPage);
  };

  const handleChangeApplicationPage = (event, newPage) => {
    setApplicationPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setUserPage(0);
    setJobPage(0);
    setApplicationPage(0);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      applied: 'info',
      pending: 'warning',
      reviewed: 'warning',
      accepted: 'success',
      rejected: 'error',
      withdrawn: 'default',
    };
    return statusColors[status] || 'default';
  };

  if (loading && !stats) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SecurityIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: '#667eea' }} />
        <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }, fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <GroupIcon sx={{ color: '#667eea', fontSize: { xs: 24, sm: 28 } }} />
                  <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 'bold' }}>
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 135, 20, 0.1) 100%)',
              border: '1px solid rgba(240, 147, 251, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <PersonIcon sx={{ color: '#f093fb', fontSize: { xs: 24, sm: 28 } }} />
                  <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Job Seekers
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 'bold' }}>
                  {stats.jobSeekers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
              border: '1px solid rgba(118, 75, 162, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <WorkIcon sx={{ color: '#764ba2', fontSize: { xs: 24, sm: 28 } }} />
                  <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Employers
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 'bold' }}>
                  {stats.employers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <AssignmentIcon sx={{ color: '#4caf50', fontSize: { xs: 24, sm: 28 } }} />
                  <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Total Applications
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 'bold' }}>
                  {stats.totalApplications || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(245, 135, 20, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
            }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <WorkIcon sx={{ color: '#667eea', fontSize: { xs: 24, sm: 28 } }} />
                  <Typography color="textSecondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Total Jobs
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 'bold' }}>
                  {stats.totalJobs}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Data Management Tabs */}
      <Card>
        <Tabs
          value={tab}
          onChange={(e, newTab) => {
            setTab(newTab);
            setUserPage(0);
            setJobPage(0);
            setApplicationPage(0);
          }}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#fafafa',
            px: { xs: 1, sm: 2 },
            overflowX: 'auto',
          }}
        >
          <Tab label={`Users (${users.length})`} sx={{ minWidth: { xs: '80px', sm: '120px' } }} />
          <Tab label={`Jobs (${jobs.length})`} sx={{ minWidth: { xs: '80px', sm: '120px' } }} />
          <Tab label={`Applied Jobs (${applications.length})`} sx={{ minWidth: { xs: '100px', sm: '140px' } }} />
        </Tabs>

        {/* Users Tab */}
        {tab === 0 && (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '180px' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '90px' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '110px' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '100px' }}>Joined</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '80px' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell sx={{ wordBreak: 'break-all' }}>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                              size="small"
                              color={user.userType === 'job_seeker' ? 'primary' : 'secondary'}
                            />
                          </TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              startIcon={<DeleteIcon />}
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteClick(
                                  'user',
                                  user._id,
                                  `${user.firstName} ${user.lastName}`
                                )
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, p: { xs: 1, sm: 2 } }}>
              {users.length > 0 ? (
                <Stack spacing={2}>
                  {users.map((user) => (
                    <Paper key={user._id} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5, wordBreak: 'break-all' }}>
                        {user.email}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={user.userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                          size="small"
                          color={user.userType === 'job_seeker' ? 'primary' : 'secondary'}
                        />
                        <Typography variant="caption" color="textSecondary">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        startIcon={<DeleteIcon />}
                        color="error"
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleDeleteClick(
                            'user',
                            user._id,
                            `${user.firstName} ${user.lastName}`
                          )
                        }
                      >
                        Delete
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                  No users found
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Jobs Tab */}
        {tab === 1 && (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '100px' }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '90px' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Posted By</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '90px' }}>Posted</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '80px' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <TableRow key={job._id} hover>
                          <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job.title}
                          </TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            <Chip label={job.jobType} size="small" />
                          </TableCell>
                          <TableCell>
                            {job.postedBy?.firstName} {job.postedBy?.lastName}
                          </TableCell>
                          <TableCell>
                            {new Date(job.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              startIcon={<DeleteIcon />}
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteClick('job', job._id, job.title)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          No jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, p: { xs: 1, sm: 2 } }}>
              {jobs.length > 0 ? (
                <Stack spacing={2}>
                  {jobs.map((job) => (
                    <Paper key={job._id} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                        {job.company}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip label={job.jobType} size="small" />
                        <Chip label={job.location} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                        By: {job.postedBy?.firstName} {job.postedBy?.lastName} • {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                      <Button
                        fullWidth
                        startIcon={<DeleteIcon />}
                        color="error"
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleDeleteClick('job', job._id, job.title)
                        }
                      >
                        Delete
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                  No jobs found
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Applied Jobs Tab */}
        {tab === 2 && (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Applicant</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Job Title</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '100px' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '90px' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '100px' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '90px' }}>Applied</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: '110px' }}>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.length > 0 ? (
                      applications.map((app) => (
                        <TableRow key={`${app.jobId}-${app.userId}`} hover>
                          <TableCell>
                            {app.applicant?.firstName} {app.applicant?.lastName}
                          </TableCell>
                          <TableCell sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.jobTitle}
                          </TableCell>
                          <TableCell>{app.jobCompany}</TableCell>
                          <TableCell>
                            <Chip
                              label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              size="small"
                              color={getStatusColor(app.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ wordBreak: 'break-all' }}>
                            {app.applicant?.email}
                          </TableCell>
                          <TableCell>
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{app.applicant?.phone || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          No applications found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, p: { xs: 1, sm: 2 } }}>
              {applications.length > 0 ? (
                <Stack spacing={2}>
                  {applications.map((app) => (
                    <Paper key={`${app.jobId}-${app.userId}`} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {app.applicant?.firstName} {app.applicant?.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                        {app.jobTitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          size="small"
                          color={getStatusColor(app.status)}
                          variant="outlined"
                        />
                        <Chip label={app.jobCompany} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5, wordBreak: 'break-all' }}>
                        Email: {app.applicant?.email}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                        Phone: {app.applicant?.phone || '-'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                  No applications found
                </Typography>
              )}
            </Box>
          </>
        )}
        <TablePagination
          component="div"
          count={tab === 0 ? users.length : tab === 1 ? jobs.length : applications.length}
          page={tab === 0 ? userPage : tab === 1 ? jobPage : applicationPage}
          onPageChange={tab === 0 ? handleChangeUserPage : tab === 1 ? handleChangeJobPage : handleChangeApplicationPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.type === 'user' ? 'user' : 'job'}:{' '}
            <strong>{deleteDialog.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
