const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing Login with Seed User...');
    try {
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@jobportal.com',
        password: 'password123'
      });
      console.log('Seed user login successful:', loginRes.data.user.email);
    } catch (e) {
      console.error('Seed user login failed:', e.response ? e.response.data : e.message);
    }

    console.log('\nTesting Signup...');
    const signupData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'abc12345@gmail.com',
      password: 'mypassword',
      confirmPassword: 'mypassword',
      userType: 'job-seeker'
    };
    
    let token = '';
    try {
      const signupRes = await axios.post('http://localhost:5000/api/auth/signup', signupData);
      console.log('Signup successful:', signupRes.data.user.email);
      token = signupRes.data.token;
    } catch (e) {
      console.error('Signup failed:', e.response ? e.response.data : e.message);
    }

    console.log('\nTesting Login with New User...');
    try {
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'abc12345@gmail.com',
        password: 'mypassword'
      });
      console.log('New user login successful:', loginRes.data.user.email);
    } catch (e) {
      console.error('New user login failed:', e.response ? e.response.data : e.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth();
