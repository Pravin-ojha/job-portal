import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GridBackground from '../components/GridBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Briefcase } from 'lucide-react';

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
    <GridBackground className="min-h-[calc(100vh-4rem)]" showDecorators>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-6">

          {/* Logo */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 mb-4">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">JobPortal</h2>
          </div>
          
          <Card className="border-border bg-card/80 backdrop-blur-md shadow-xl">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(localError || error) && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 flex items-start gap-2 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{localError || error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="bg-background border-border focus-visible:ring-primary h-11"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-background border-border focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'job-seeker' }))}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        formData.userType === 'job-seeker'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl mb-1">🎯</span>
                      <span className="text-sm font-semibold">Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'employer' }))}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        formData.userType === 'employer'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl mb-1">🏢</span>
                      <span className="text-sm font-semibold">Employer</span>
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold mt-2 shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-6">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </GridBackground>
  );
};

export default SignupPage;
