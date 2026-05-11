import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { useToast } from '../components/Toast';
import GridBackground from '../components/GridBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Loader2, Briefcase, Sparkles } from 'lucide-react';

const PostJobPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    experienceLevel: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location || !formData.jobType || !formData.description || !formData.requirements) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await jobsAPI.createJob(formData);
      toast.success('Job posted successfully! 🎉');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      console.error('Failed to post job:', err);
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all";

  return (
    <div className="min-h-screen">
      <GridBackground className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Reach thousands of candidates
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Post a New <span className="text-gradient-primary">Job</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Fill out the details below. Supports Markdown formatting for descriptions and requirements.
          </p>
        </div>
      </GridBackground>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-6 flex items-start gap-3 border border-destructive/20">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-foreground">
                  Job Title <span className="text-destructive">*</span>
                </label>
                <input id="title" name="title" type="text" required disabled={loading}
                  value={formData.title} onChange={handleChange} className={inputClass}
                  placeholder="e.g. Senior Frontend Engineer" />
              </div>

              {/* 2-col grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold text-foreground">
                    Company <span className="text-destructive">*</span>
                  </label>
                  <input id="company" name="company" type="text" required disabled={loading}
                    value={formData.company} onChange={handleChange} className={inputClass}
                    placeholder="e.g. Acme Corp" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-semibold text-foreground">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <input id="location" name="location" type="text" required disabled={loading}
                    value={formData.location} onChange={handleChange} className={inputClass}
                    placeholder="e.g. Remote, San Francisco" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="salary" className="text-sm font-semibold text-foreground">Salary Range</label>
                  <input id="salary" name="salary" type="text" disabled={loading}
                    value={formData.salary} onChange={handleChange} className={inputClass}
                    placeholder="e.g. $100k - $150k" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobType" className="text-sm font-semibold text-foreground">
                    Job Type <span className="text-destructive">*</span>
                  </label>
                  <select id="jobType" name="jobType" required disabled={loading}
                    value={formData.jobType} onChange={handleChange} className={inputClass}>
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Entry-level', 'Mid-level', 'Senior'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                      className={`py-2.5 px-4 rounded-lg border-2 text-sm font-semibold transition-all ${
                        formData.experienceLevel === level
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="text-sm font-semibold text-foreground">
                    Job Description <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground font-mono">Markdown supported</span>
                </div>
                <textarea id="description" name="description" required disabled={loading}
                  value={formData.description} onChange={handleChange} rows={6}
                  className={`${inputClass} min-h-[140px] resize-y font-mono text-[13px] leading-relaxed`}
                  placeholder={"## About the Role\n\nDescribe responsibilities...\n\n## What You'll Do\n\n- Build scalable systems\n- Collaborate with the team"} />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="requirements" className="text-sm font-semibold text-foreground">
                    Requirements <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground font-mono">Markdown supported</span>
                </div>
                <textarea id="requirements" name="requirements" required disabled={loading}
                  value={formData.requirements} onChange={handleChange} rows={5}
                  className={`${inputClass} min-h-[120px] resize-y font-mono text-[13px] leading-relaxed`}
                  placeholder={"- 3+ years experience with React\n- Strong TypeScript skills\n- Experience with REST APIs"} />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading}
                  className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Posting...</>
                  ) : (
                    <><Briefcase className="mr-2 h-5 w-5" /> Post Job</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
