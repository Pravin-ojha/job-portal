import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [DrawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Search Jobs', path: '/jobs' },
    ...(user && user.userType === 'job_seeker' ? [{ label: 'My Jobs', path: '/my-jobs' }] : []),
    ...(user && user.userType === 'job_seeker' ? [{ label: 'Applications', path: '/applications' }] : []),
    ...(user && user.userType === 'job_seeker' ? [{ label: 'Saved Jobs', path: '/saved-jobs' }] : []),
    ...(user && user.userType === 'employer' ? [{ label: 'Post Job', path: '/post-job' }] : []),
    ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
    ...(user && user.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ];

  const drawerContent = (
    <List sx={{ width: 250 }}>
      {menuItems.map((item) => (
        <ListItem
          key={item.label}
          button
          onClick={() => {
            navigate(item.path);
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
      {!user && (
        <>
          <ListItem button onClick={() => { navigate('/login'); setDrawerOpen(false); }}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/signup'); setDrawerOpen(false); }}>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      )}
      {user && (
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingY: 1,
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1,
              }}
              onClick={() => navigate('/')}
            >
              <WorkIcon sx={{ fontSize: 32, color: '#fff' }} />
              <Box sx={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                JobPortal
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Auth Buttons / Profile Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && !user && (
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#fff',
                      borderColor: '#fff',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#fff',
                      },
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#fff',
                      color: '#667eea',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              {/* Profile Menu Icon - shown when logged in */}
              {user && (
                <IconButton
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                  title={`${user.firstName} ${user.lastName}`}
                >
                  <AccountCircleIcon sx={{ fontSize: 28 }} />
                </IconButton>
              )}

              {/* Mobile Menu Icon */}
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={toggleDrawer(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Menu */}
      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {user.firstName} {user.lastName}
            </Typography>
          </MenuItem>
          <MenuItem disabled>
            <Typography variant="caption" color="textSecondary">
              {user.userType === 'employer' ? 'Employer' : 'Job Seeker'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { navigate('/dashboard'); handleProfileMenuClose(); }}>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => { navigate('/jobs'); handleProfileMenuClose(); }}>
            Browse Jobs
          </MenuItem>
          <MenuItem onClick={() => { navigate('/saved-jobs'); handleProfileMenuClose(); }}>
            Saved Jobs
          </MenuItem>
          {user.userType === 'job_seeker' && (
            <MenuItem onClick={() => { navigate('/applications'); handleProfileMenuClose(); }}>
              Applied Jobs
            </MenuItem>
          )}
          {user.userType === 'employer' && (
            <MenuItem onClick={() => { navigate('/post-job'); handleProfileMenuClose(); }}>
              Post a Job
            </MenuItem>
          )}
          {user.role === 'admin' && (
            <MenuItem onClick={() => { navigate('/admin'); handleProfileMenuClose(); }}>
              Admin Dashboard
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={DrawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
