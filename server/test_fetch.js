async function test() {
  try {
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'pswrdtest@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        userType: 'job-seeker'
      })
    });
    console.log('Signup:', await signupRes.json());

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pswrdtest@example.com',
        password: 'password123'
      })
    });
    console.log('Login:', await loginRes.json());
  } catch (e) {
    console.error(e);
  }
}
test();
