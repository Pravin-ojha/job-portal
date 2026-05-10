import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error, setError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'job-seeker',
  });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (setError) setError(null);
  }, [setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      // Backend error is already handled by AuthContext
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        
        <Card className="border-border bg-card backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(localError || error) && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6 flex items-start gap-2 border border-destructive/20">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{localError || error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="bg-muted border-border focus-visible:ring-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last Name</label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="bg-muted border-border focus-visible:ring-primary h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-muted border-border focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-muted border-border focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-muted border-border focus-visible:ring-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Account Type</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-between rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="job-seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              <Button type="submit" className="w-full h-11 text-base mt-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
