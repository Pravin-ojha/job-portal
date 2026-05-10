const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal';

async function startDatabase() {
  let finalUri = MONGODB_URI;
  if (finalUri.includes('localhost') && process.env.NODE_ENV === 'development') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      finalUri = mongoServer.getUri();
      console.log('Using MongoDB Memory Server at', finalUri);
    } catch (e) {
      console.log('Could not start memory server, using default uri:', e.message);
    }
  }

  try {
    await mongoose.connect(finalUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    
    // Seed some initial data
    const Job = require('./models/Job');
    const User = require('./models/User');
    
    // Always ensure test users exist
    let adminUser = await User.findOne({ email: 'admin@jobportal.com' });
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@jobportal.com',
        password: 'password123',
        userType: 'employer',
        role: 'admin',
      });
      console.log('✓ Created admin user: admin@jobportal.com / password123');
    }

    // Create test job seeker user
    let jobSeekerUser = await User.findOne({ email: 'jobseeker@test.com' });
    if (!jobSeekerUser) {
      jobSeekerUser = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jobseeker@test.com',
        password: 'password123',
        userType: 'job_seeker',
      });
      console.log('✓ Created job seeker user: jobseeker@test.com / password123');
    }

    // Seed jobs only if empty
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      const user = adminUser;
      
      await Job.insertMany([
        {
          title: 'Senior React Developer',
          company: 'Tech Innovators Inc.',
          description: 'Looking for a Senior React developer to lead our frontend team. Must have strong experience with modern React patterns and state management.',
          requirements: '5+ years experience, React, Redux, Node.js',
          location: 'San Francisco, CA (Remote)',
          salary: '$120,000 - $150,000',
          salaryMin: 120000,
          salaryMax: 150000,
          experienceLevel: 'Senior',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Backend Node.js Engineer',
          company: 'DataSpark',
          description: 'Join our backend engineering team to build scalable microservices. You will be responsible for setting up our new data pipelines and integrations.',
          requirements: '3+ years with Node.js, Express, MongoDB, Redis',
          location: 'New York, NY',
          salary: '$100,000 - $130,000',
          salaryMin: 100000,
          salaryMax: 130000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Frontend Intern',
          company: 'StartupX',
          description: 'Great opportunity for a summer intern to learn modern web development. You will be mentored by senior engineers and contribute to production code.',
          requirements: 'HTML, CSS, basic JavaScript experience',
          location: 'Austin, TX',
          salary: '$20/hr',
          salaryMin: 20000,
          salaryMax: 20000,
          experienceLevel: 'Entry-level',
          jobType: 'Internship',
          postedBy: user._id
        },
        {
          title: 'Full Stack JavaScript Developer',
          company: 'WebFlow Agency',
          description: 'Looking for a full-stack developer to build modern web applications using the latest technologies. You will work on both frontend and backend.',
          requirements: '3+ years JavaScript, React, Node.js, MongoDB, REST APIs',
          location: 'Los Angeles, CA',
          salary: '$85,000 - $115,000',
          salaryMin: 85000,
          salaryMax: 115000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Junior Python Developer',
          company: 'Data Solutions Ltd',
          description: 'Entry-level position for a Python developer to join our data processing team. Great learning opportunity with mentorship from experienced engineers.',
          requirements: 'Python basics, problem-solving skills, willingness to learn',
          location: 'Boston, MA',
          salary: '$55,000 - $70,000',
          salaryMin: 55000,
          salaryMax: 70000,
          experienceLevel: 'Entry-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Vue.js Developer',
          company: 'Creative Digital',
          description: 'Experienced Vue.js developer needed for our product team. Work on modern single-page applications and UI components.',
          requirements: '2+ years Vue.js, JavaScript, CSS, REST APIs',
          location: 'Seattle, WA (Remote)',
          salary: '$75,000 - $105,000',
          salaryMin: 75000,
          salaryMax: 105000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          description: 'Senior DevOps engineer to lead our infrastructure and deployment automation. Experience with CI/CD pipelines and containerization required.',
          requirements: '5+ years DevOps, Docker, Kubernetes, AWS, Linux',
          location: 'Chicago, IL',
          salary: '$110,000 - $150,000',
          salaryMin: 110000,
          salaryMax: 150000,
          experienceLevel: 'Senior',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'QA Automation Engineer',
          company: 'Software Testing Pro',
          description: 'Automation QA engineer to develop and maintain automated test suites. Work with modern testing frameworks and tools.',
          requirements: '2+ years QA automation, Selenium, Java or Python, CI/CD',
          location: 'Denver, CO',
          salary: '$65,000 - $90,000',
          salaryMin: 65000,
          salaryMax: 90000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Mobile App Developer (React Native)',
          company: 'AppBuilder Inc',
          description: 'Develop cross-platform mobile applications using React Native. Work on iOS and Android apps for millions of users.',
          requirements: '3+ years React Native, JavaScript, mobile development experience',
          location: 'San Francisco, CA',
          salary: '$100,000 - $140,000',
          salaryMin: 100000,
          salaryMax: 140000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Freelance Web Developer',
          company: 'DigitalHub',
          description: 'Freelance web developer for short-term projects. Build responsive websites and web applications for clients.',
          requirements: 'HTML, CSS, JavaScript, WordPress experience helpful',
          location: 'Remote',
          salary: '$50 - $100/hour',
          salaryMin: 50,
          salaryMax: 100,
          experienceLevel: 'Entry-level',
          jobType: 'Contract',
          postedBy: user._id
        },
        {
          title: 'Database Administrator',
          company: 'Enterprise Systems Corp',
          description: 'Senior DBA to manage our MongoDB and PostgreSQL databases. Ensure performance, security, and availability of critical database systems.',
          requirements: '5+ years MongoDB, PostgreSQL, database optimization, backup strategies',
          location: 'Dallas, TX',
          salary: '$95,000 - $140,000',
          salaryMin: 95000,
          salaryMax: 140000,
          experienceLevel: 'Senior',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'UI/UX Designer',
          company: 'Design Studio Creative',
          description: 'Creative UI/UX designer to design beautiful and intuitive user interfaces for web and mobile applications.',
          requirements: 'Figma, Adobe XD, UI/UX principles, prototyping experience',
          location: 'Portland, OR (Remote)',
          salary: '$70,000 - $100,000',
          salaryMin: 70000,
          salaryMax: 100000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Machine Learning Engineer',
          company: 'AI Innovations Labs',
          description: 'Build and deploy machine learning models for real-world applications. Work with large datasets and modern ML frameworks.',
          requirements: 'Python, TensorFlow, scikit-learn, statistics, 2+ years ML experience',
          location: 'Mountain View, CA',
          salary: '$130,000 - $180,000',
          salaryMin: 130000,
          salaryMax: 180000,
          experienceLevel: 'Senior',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Technical Support Engineer',
          company: 'SaaS Platform Co',
          description: 'Entry-level technical support engineer to help customers with product issues. Troubleshoot and resolve technical problems.',
          requirements: 'Excellent communication, problem-solving skills, basic technical knowledge',
          location: 'Remote',
          salary: '$40,000 - $55,000',
          salaryMin: 40000,
          salaryMax: 55000,
          experienceLevel: 'Entry-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Angular Developer (Part-time)',
          company: 'Web Solutions Inc',
          description: 'Part-time Angular developer for ongoing projects. Flexible hours, work from home available.',
          requirements: 'Angular, TypeScript, RxJS, REST APIs',
          location: 'Remote',
          salary: '$40 - $60/hour',
          salaryMin: 40,
          salaryMax: 60,
          experienceLevel: 'Mid-level',
          jobType: 'Part-time',
          postedBy: user._id
        },
        {
          title: 'Java Backend Developer',
          company: 'Enterprise Solutions',
          description: 'Experienced Java developer to build scalable backend services. Work with Spring Boot, microservices, and distributed systems.',
          requirements: '4+ years Java, Spring Boot, microservices, SQL',
          location: 'New York, NY',
          salary: '$95,000 - $130,000',
          salaryMin: 95000,
          salaryMax: 130000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Graphic Designer',
          company: 'Brand Creative Agency',
          description: 'Graphic designer to create visual content for marketing campaigns. Design social media graphics, brochures, and web assets.',
          requirements: 'Adobe Creative Suite, design principles, portfolio required',
          location: 'Miami, FL',
          salary: '$50,000 - $75,000',
          salaryMin: 50000,
          salaryMax: 75000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Software Quality Assurance (Intern)',
          company: 'QA Academy',
          description: 'Summer internship in QA to learn testing methodologies and gain hands-on experience with testing tools and frameworks.',
          requirements: 'Basic understanding of software testing, attention to detail',
          location: 'San Jose, CA',
          salary: '$18/hr',
          salaryMin: 18,
          salaryMax: 18,
          experienceLevel: 'Entry-level',
          jobType: 'Internship',
          postedBy: user._id
        },
        {
          title: 'AWS Solutions Architect',
          company: 'Cloud Infrastructure Corp',
          description: 'Senior AWS architect to design scalable cloud solutions for enterprise clients. Lead architecture decisions and best practices.',
          requirements: '5+ years AWS, cloud architecture, networking, security',
          location: 'Seattle, WA',
          salary: '$140,000 - $180,000',
          salaryMin: 140000,
          salaryMax: 180000,
          experienceLevel: 'Senior',
          jobType: 'Full-time',
          postedBy: user._id
        },
        {
          title: 'Content Writer',
          company: 'Tech Blog Network',
          description: 'Technical content writer for our blog and documentation. Create engaging articles about software development and technology.',
          requirements: 'Excellent writing skills, technical knowledge, SEO awareness',
          location: 'Remote',
          salary: '$45,000 - $65,000',
          salaryMin: 45000,
          salaryMax: 65000,
          experienceLevel: 'Mid-level',
          jobType: 'Full-time',
          postedBy: user._id
        }
      ]);
      console.log('Seeded database with sample jobs');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

startDatabase();

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ==================== HEALTH CHECK & API INFO ====================
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Job Portal API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Job Portal API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (signup, login, me)',
      jobs: '/api/jobs (list, create, apply, save, review)',
      users: '/api/users (profile, admin)',
      companies: '/api/companies (list, create, review)',
      health: '/api/health',
    },
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
