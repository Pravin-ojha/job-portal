import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Chip, Rating, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Search Jobs',
      description: 'Find your perfect job from thousands of listings',
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Post Jobs',
      description: 'Hire the best talent for your organization',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Career Growth',
      description: 'Build your career with opportunities tailored for you',
    },
  ];

  // Featured Jobs Data
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      logo: '🔵',
      location: 'San Francisco, CA',
      salary: '$150,000 - $200,000',
      type: 'Full-time',
      tags: ['React', 'Node.js', 'Cloud'],
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Apple',
      logo: '🍎',
      location: 'Cupertino, CA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      tags: ['Product Strategy', 'Analytics'],
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Meta',
      logo: '👁️',
      location: 'Menlo Park, CA',
      salary: '$160,000 - $210,000',
      type: 'Full-time',
      tags: ['Machine Learning', 'Python', 'SQL'],
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Amazon',
      logo: '🔶',
      location: 'Seattle, WA',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      tags: ['React', 'TypeScript', 'AWS'],
    },
  ];

  // Companies Data
  const companies = [
    { name: 'Google', emoji: '🔵', jobs: 248 },
    { name: 'Apple', emoji: '🍎', jobs: 156 },
    { name: 'Microsoft', emoji: '💻', jobs: 189 },
    { name: 'Amazon', emoji: '🔶', jobs: 312 },
    { name: 'Meta', emoji: '👁️', jobs: 127 },
    { name: 'Tesla', emoji: '⚡', jobs: 94 },
  ];

  // Statistics Data
  const stats = [
    { label: 'Active Jobs', value: '5,000+' },
    { label: 'Companies', value: '1,200+' },
    { label: 'Job Seekers', value: '50,000+' },
    { label: 'Placements', value: '10,000+' },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: 'John Smith',
      role: 'Senior Developer at Google',
      company: 'Google',
      avatar: '👨‍💼',
      rating: 5,
      message: 'Found my dream job through this platform. The process was smooth and straightforward!',
    },
    {
      name: 'Sarah Johnson',
      role: 'HR Manager at Microsoft',
      company: 'Microsoft',
      avatar: '👩‍💼',
      rating: 5,
      message: 'Best platform for recruiting top talent. We hired 15 talented professionals in just 3 months!',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Apple',
      company: 'Apple',
      avatar: '👨‍💻',
      rating: 5,
      message: 'The quality of candidates is exceptional. Highly recommended for any serious recruiter.',
    },
  ];

  return (
    <Box>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            color: '#fff',
            mb: 8,
            mt: 2,
          }}
        >
          <Typography variant="h1" sx={{ color: '#fff', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Welcome to JobPortal
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Find your dream job or hire top talent today
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#fff',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#fff',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
              onClick={() => navigate('/post-job')}
            >
              Post a Job
            </Button>
          </Box>
        </Box>

        {/* Statistics Section */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    border: '1px solid #667eea30',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Jobs Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
              Featured Jobs
            </Typography>
            <Button color="primary" onClick={() => navigate('/jobs')}>
              View All Jobs →
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredJobs.map((job) => (
              <Grid item xs={12} md={6} key={job.id}>
                <Card
                  sx={{
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.2)',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/jobs`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span sx={{ fontSize: '1.2rem' }}>{job.logo}</span>
                          {job.company}
                        </Typography>
                      </Box>
                      <Chip label={job.type} size="small" color="primary" variant="outlined" />
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 18 }} /> {job.location}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachMoneyIcon sx={{ fontSize: 18 }} /> {job.salary}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {job.tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Companies Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            Trusted by Leading Companies
          </Typography>
          <Grid container spacing={3}>
            {companies.map((company, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>{company.emoji}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {company.jobs} Active Jobs
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
                    border: '1px solid #667eea30',
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 1 }} />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{testimonial.message}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ fontSize: '1.5rem', width: 40, height: 40, background: '#667eea20' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            color: '#fff',
            mb: 8,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of job seekers and employers who are finding success on our platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#fff',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#fff',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
              onClick={() => navigate('/post-job')}
            >
              Post Your Job
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box sx={{ background: '#1a1a2e', color: '#fff', py: 6, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Company Info */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                JobPortal
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Your trusted platform for finding and hiring talent worldwide.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <LinkedInIcon sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
                <TwitterIcon sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
                <FacebookIcon sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Browse Jobs
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Post a Job
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Companies
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  About Us
                </Typography>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Career Tips
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Blog
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Help Center
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Contact
                </Typography>
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  📧 support@jobportal.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  📞 +1 (555) 123-4567
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  📍 San Francisco, CA
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Footer Bottom */}
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              pt: 3,
              mt: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
              © 2026 JobPortal. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Privacy Policy
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Terms of Service
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Cookie Policy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
