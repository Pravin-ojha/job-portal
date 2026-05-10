import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Beaker } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, setError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Clear error when component mounts
  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('[LoginPage] Login failed:', err.message);
    }
  };

  const handleTestLogin = (email) => {
    setFormData({
      email,
      password: 'password123',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        <Card className="border-border bg-card backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6 flex items-start gap-2 border border-destructive/20">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                </div>
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
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Test Credentials Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4 border-b border-border/20">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Beaker className="h-4 w-4" />
              Test Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted border border-border text-xs">
              <div className="font-semibold text-foreground mb-1">Job Seeker</div>
              <div className="text-muted-foreground mb-3 truncate">jobseeker@test.com<br/>password123</div>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs border-border bg-transparent hover:bg-accent" onClick={() => handleTestLogin('jobseeker@test.com')} disabled={loading}>
                Use Seeker
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border text-xs">
              <div className="font-semibold text-foreground mb-1">Admin / Employer</div>
              <div className="text-muted-foreground mb-3 truncate">admin@jobportal.com<br/>password123</div>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs border-border bg-transparent hover:bg-accent" onClick={() => handleTestLogin('admin@jobportal.com')} disabled={loading}>
                Use Admin
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default LoginPage;
