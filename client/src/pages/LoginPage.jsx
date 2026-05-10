import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, setError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Clear error when component mounts (page is visited)
  React.useEffect(() => {
    setError(null);
    console.log('[LoginPage] Mounted');
  }, [setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LoginPage] Submitting login form:', formData.email);
    try {
      const result = await login(formData.email, formData.password);
      console.log('[LoginPage] Login successful, navigating to home');
      navigate('/');
    } catch (err) {
      console.error('[LoginPage] Login failed:', err.message);
      // Backend error is already handled by AuthContext
    }
  };

  const handleTestLogin = (email) => {
    setFormData({
      email,
      password: 'password123',
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Box sx={{ width: '100%' }}>
          <Card sx={{ width: '100%', mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Welcome Back
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">{error}</Typography>
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 'bold',
                    mb: 2,
                    height: 48,
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link
                      onClick={() => navigate('/signup')}
                      sx={{
                        color: '#667eea',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#667eea' }}>
                🧪 Test Credentials
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Try these accounts to test the application:
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f0f0f0' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Job Seeker Account
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> jobseeker@test.com
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Password:</strong> password123
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleTestLogin('jobseeker@test.com')}
                    disabled={loading}
                  >
                    Use This Account
                  </Button>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#f0f0f0' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Admin/Employer Account
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> admin@jobportal.com
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Password:</strong> password123
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleTestLogin('admin@jobportal.com')}
                    disabled={loading}
                  >
                    Use This Account
                  </Button>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
