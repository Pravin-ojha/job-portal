import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2, Briefcase } from 'lucide-react';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.jobType || !formData.description || !formData.requirements) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await jobsAPI.createJob(formData);
      setSuccess(true);
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: '',
        description: '',
        requirements: '',
      });
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      console.error('Failed to post job:', err);
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Post a New Job
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/15 text-emerald-500 text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-emerald-500/20">
          <CheckCircle2 className="h-5 w-5 mt-0.5" />
          <span>Job posted successfully! Redirecting... 🎉</span>
        </div>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Job Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                disabled={loading}
                value={formData.title}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground">
                  Company Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.company}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-foreground">
                  Location <span className="text-destructive">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.location}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="e.g. Remote, San Francisco"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="salary" className="text-sm font-medium text-foreground">
                  Salary Range
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  disabled={loading}
                  value={formData.salary}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="e.g., $100k - $150k"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jobType" className="text-sm font-medium text-foreground">
                  Job Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  required
                  disabled={loading}
                  value={formData.jobType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Job Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                disabled={loading}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[100px]"
                placeholder="Describe the job responsibilities and role"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="requirements" className="text-sm font-medium text-foreground">
                Requirements <span className="text-destructive">*</span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                required
                disabled={loading}
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[100px]"
                placeholder="List skills and qualifications required"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJobPage;
