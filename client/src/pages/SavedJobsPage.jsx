import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import { AlertCircle, Loader2, Bookmark } from 'lucide-react';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/user/saved');
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.post('/jobs/unsave', { jobId });
      setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove job from saved');
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Saved Jobs
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
          <Bookmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">You haven't saved any jobs yet.</p>
          <p className="text-sm text-muted-foreground/70">Browse jobs and save them for later!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved={true}
              onUnsave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
