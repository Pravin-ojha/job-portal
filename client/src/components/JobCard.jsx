import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Briefcase, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';
import JobApplicationForm from './JobApplicationForm';
import { jobsAPI } from '../services/api';
import { addSavedJobLocal, removeSavedJobLocal } from '../services/storageService';
import { timeAgo } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const JobCard = ({
  job,
  isSaved = false,
  onSave,
  onUnsave,
  applicationStatus,
  onApplySuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [isJobSaved, setIsJobSaved] = useState(isSaved);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isJobSaved) {
        await jobsAPI.unsaveJob(job._id);
        removeSavedJobLocal(user._id, job._id);
        if (onUnsave) onUnsave(job._id);
        setIsJobSaved(false);
      } else {
        await jobsAPI.saveJob(job._id);
        addSavedJobLocal(user._id, job);
        if (onSave) onSave(job._id);
        setIsJobSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      // Still update locally even if API fails
      if (isJobSaved) {
        removeSavedJobLocal(user._id, job._id);
        if (onUnsave) onUnsave(job._id);
      } else {
        addSavedJobLocal(user._id, job);
        if (onSave) onSave(job._id);
      }
      setIsJobSaved(!isJobSaved);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      setSubmittingApplication(true);
      await jobsAPI.applyForJob(job._id, {
        ...formData,
        email: user.email,
      });
      setShowApplicationForm(false);
      toast.success('Application submitted successfully!');
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      toast.error(err.response?.data?.error || 'Failed to apply for job');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
      case 'reviewed':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'applied':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-accent text-foreground border-border';
    }
  };

  return (
    <>
      <Card className="border-border bg-card hover:bg-muted transition-colors group mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-none mb-2">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${
                isJobSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
              title={isJobSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className="h-5 w-5" fill={isJobSaved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
              {job.location}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
              {job.jobType}
            </span>
            {job.experienceLevel && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
                {job.experienceLevel}
              </span>
            )}
          </div>

          {job.salary && (
            <div className="text-sm font-medium text-foreground mb-3">
              {job.salary}
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {job.description}
          </p>

          {job.createdAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(job.createdAt)}
            </p>
          )}

          {applicationStatus && (
            <div className="mt-4">
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(applicationStatus)}`}>
                Application: {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-border bg-transparent hover:bg-muted"
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            View Details
          </Button>
          <Button
            className="flex-1"
            onClick={handleApplyClick}
            disabled={applicationStatus === 'applied' || applicationStatus === 'pending' || submittingApplication}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            {applicationStatus ? 'Applied' : 'Apply Now'}
          </Button>
        </CardFooter>
      </Card>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <JobApplicationForm
          open={showApplicationForm}
          jobTitle={job.title}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApplicationSubmit}
          loading={submittingApplication}
        />
      )}
    </>
  );
};

export default JobCard;
