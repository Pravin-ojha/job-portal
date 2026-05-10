import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2, Edit } from 'lucide-react';

const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getJobById(id);
      const job = response.data;
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || '',
        description: job.description || '',
        requirements: job.requirements || '',
      });
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError(
        err.response?.data?.error || 'Failed to load job details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.jobType ||
      !formData.description ||
      !formData.requirements
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await jobsAPI.updateJob(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to update job:', err);
      setError(
        err.response?.data?.error || 'Failed to update job. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Edit className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Edit Job Posting
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
          <span>Job updated successfully! Redirecting to dashboard... 🎉</span>
        </div>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-6 md:p-8">
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
                disabled={submitting}
                value={formData.title}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-foreground">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                disabled={submitting}
                value={formData.company}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-foreground">
                  Location <span className="text-destructive">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.location}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jobType" className="text-sm font-medium text-foreground">
                  Job Type <span className="text-destructive">*</span>
                </label>
                <input
                  id="jobType"
                  name="jobType"
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.jobType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="e.g., Full-time, Part-time, Remote"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-medium text-foreground">
                Salary (Optional)
              </label>
              <input
                id="salary"
                name="salary"
                type="text"
                disabled={submitting}
                value={formData.salary}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Job Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                disabled={submitting}
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[150px]"
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
                disabled={submitting}
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[100px]"
                placeholder="e.g., 3+ years experience, Bachelor's degree, etc."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={submitting}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Job'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJobPage;
