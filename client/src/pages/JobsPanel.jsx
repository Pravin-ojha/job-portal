import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getSavedJobsLocal,
  addSavedJobLocal,
  removeSavedJobLocal,
  getAppliedJobsLocal,
  addAppliedJobLocal,
  syncUserDataToStorage,
} from '../services/storageService';
import {
  Bookmark,
  CheckCircle2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  User,
  Clock,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';

const JobsPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [unsaveDialog, setUnsaveDialog] = useState({ open: false, jobId: null });

  useEffect(() => {
    if (user?._id) {
      fetchJobsData();
    }
  }, [user?._id]);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from API
      const savedRes = await jobsAPI.getSavedJobs();
      const appRes = await jobsAPI.getUserApplications();

      const savedJobsList = Array.isArray(savedRes.data) ? savedRes.data : [];
      const appliedJobsList = Array.isArray(appRes.data) ? appRes.data : [];

      setSavedJobs(savedJobsList);
      setAppliedJobs(appliedJobsList);

      // Sync to local storage
      syncUserDataToStorage(user._id, savedJobsList, appliedJobsList);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      // Fallback to local storage
      const localSaved = getSavedJobsLocal(user._id);
      const localApplied = getAppliedJobsLocal(user._id);
      
      setSavedJobs(localSaved);
      setAppliedJobs(localApplied);

      if (localSaved.length === 0 && localApplied.length === 0) {
        setError('Unable to load data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async () => {
    try {
      await jobsAPI.unsaveJob(unsaveDialog.jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== unsaveDialog.jobId));
      removeSavedJobLocal(user._id, unsaveDialog.jobId);
      setUnsaveDialog({ open: false, jobId: null });
    } catch (err) {
      console.error('Error unsaving job:', err);
      // Update locally even if API fails
      setSavedJobs(savedJobs.filter(job => job._id !== unsaveDialog.jobId));
      removeSavedJobLocal(user._id, unsaveDialog.jobId);
      setUnsaveDialog({ open: false, jobId: null });
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId || app.jobId?._id === jobId);
  };

  const getApplicationStatus = (jobId) => {
    const app = appliedJobs.find(a => a.jobId === jobId || a.jobId?._id === jobId);
    return app?.status || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          My Jobs
        </h1>
        <p className="text-muted-foreground">
          Manage your saved and applied jobs in one place
        </p>
      </div>

      {error && (
        <div className="bg-warning/15 text-warning text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-warning/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error} Using cached data.</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <Card className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 transition-all">
          <CardContent className="p-6 text-center flex flex-col items-center">
            <Bookmark className="h-10 w-10 text-blue-500 mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">{savedJobs.length}</div>
            <div className="text-sm font-medium text-blue-500/80 uppercase tracking-wider">Saved Jobs</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 transition-all">
          <CardContent className="p-6 text-center flex flex-col items-center">
            <Briefcase className="h-10 w-10 text-purple-500 mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">{appliedJobs.length}</div>
            <div className="text-sm font-medium text-purple-500/80 uppercase tracking-wider">Applications</div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
          <CardContent className="p-6 text-center flex flex-col items-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">
              {appliedJobs.filter(a => a.status === 'accepted').length}
            </div>
            <div className="text-sm font-medium text-emerald-500/80 uppercase tracking-wider">Accepted</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border mb-8 pb-px no-scrollbar">
        <button
          onClick={() => setTabValue(0)}
          className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tabValue === 0
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          }`}
        >
          Saved Jobs <span className="ml-1.5 py-0.5 px-2 bg-muted rounded-full text-xs">{savedJobs.length}</span>
        </button>
        <button
          onClick={() => setTabValue(1)}
          className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tabValue === 1
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
          }`}
        >
          My Applications <span className="ml-1.5 py-0.5 px-2 bg-muted rounded-full text-xs">{appliedJobs.length}</span>
        </button>
      </div>

      {/* Saved Jobs Tab */}
      {tabValue === 0 && (
        <div>
          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {savedJobs.map((job) => {
                const isApplied = isJobApplied(job._id);

                return (
                  <Card key={job._id} className={`bg-card transition-colors ${isApplied ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border hover:bg-muted'}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate(`/jobs/${job._id}`)}
                            >
                              {job.title}
                            </h3>
                            {isApplied && (
                              <span className="shrink-0 bg-emerald-500 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Applied
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mb-4">
                            {job.company && (
                              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {job.company}
                              </div>
                            )}
                            {job.location && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                            )}
                            {job.jobType && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                {job.jobType}
                              </div>
                            )}
                          </div>

                          {(job.salary || job.salaryMin || job.salaryMax) && (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 mb-4">
                              <DollarSign className="w-4 h-4" />
                              ₹{job.salaryMin || job.salary} - ₹{job.salaryMax || job.salary}
                            </div>
                          )}

                          {job.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {job.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {job.experienceLevel && (
                              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-muted-foreground bg-muted">
                                {job.experienceLevel}
                              </span>
                            )}
                            {job.postedBy && (
                              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-muted-foreground bg-muted">
                                by {job.postedBy.firstName || 'Unknown'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 justify-start">
                          {isApplied ? (
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-primary-foreground" onClick={() => navigate('/applications')}>
                              View Application
                            </Button>
                          ) : (
                            <Button className="w-full" onClick={() => navigate(`/jobs/${job._id}`)}>
                              Apply Now
                            </Button>
                          )}
                          <Button variant="outline" className="w-full border-border text-destructive hover:bg-destructive/10" onClick={() => setUnsaveDialog({ open: true, jobId: job._id })}>
                            <X className="w-4 h-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border border-dashed">
              <Bookmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Saved Jobs</h3>
              <p className="text-muted-foreground mb-6">Start saving jobs you're interested in</p>
              <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {tabValue === 1 && (
        <div>
          {appliedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {appliedJobs.map((app) => {
                const jobData = app.jobId && typeof app.jobId === 'object' ? app.jobId : { title: app.title, company: app.company };
                const jobId = app.jobId?._id || app.jobId;

                return (
                  <Card 
                    key={app._id || jobId} 
                    className={`bg-card border-l-4 hover:bg-muted transition-all ${
                      app.status === 'accepted' ? 'border-l-emerald-500' :
                      app.status === 'rejected' ? 'border-l-destructive' :
                      app.status === 'reviewed' || app.status === 'pending' ? 'border-l-amber-500' :
                      'border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate(`/jobs/${jobId}`)}
                            >
                              {jobData.title}
                            </h3>
                            <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                              app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                              app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                              'bg-amber-500/10 text-amber-500'
                            }`}>
                              {app.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                               app.status === 'rejected' ? <X className="w-3.5 h-3.5" /> :
                               <Clock className="w-3.5 h-3.5" />}
                              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-4">
                            {jobData.company && (
                              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {jobData.company}
                              </div>
                            )}
                            {app.location && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {app.location}
                              </div>
                            )}
                            {app.jobType && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                {app.jobType}
                              </div>
                            )}
                          </div>

                          {app.appliedAt && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                              <Calendar className="w-4 h-4" />
                              Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                          )}

                          {(app.coverLetter || app.phone || app.yearsOfExperience) && (
                            <div className="mt-4 p-4 bg-muted rounded-lg border border-border space-y-2">
                              {app.phone && (
                                <p className="text-sm text-foreground">
                                  <strong className="text-muted-foreground mr-2">Phone:</strong> {app.phone}
                                </p>
                              )}
                              {app.yearsOfExperience && (
                                <p className="text-sm text-foreground">
                                  <strong className="text-muted-foreground mr-2">Experience:</strong> {app.yearsOfExperience} years
                                </p>
                              )}
                              {app.coverLetter && (
                                <p className="text-sm text-foreground line-clamp-2">
                                  <strong className="text-muted-foreground mr-2">Cover Letter:</strong> {app.coverLetter}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 w-full md:w-auto flex flex-col justify-start">
                          <Button variant="outline" className="w-full md:w-auto border-border" onClick={() => navigate(`/jobs/${jobId}`)}>
                            View Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border border-dashed">
              <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">Apply for jobs to track your applications here</p>
              <Button onClick={() => navigate('/jobs')}>Find Jobs</Button>
            </div>
          )}
        </div>
      )}

      {/* Unsave Confirmation Dialog */}
      {unsaveDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Remove Saved Job</h2>
              <button 
                onClick={() => setUnsaveDialog({ open: false, jobId: null })}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground">
                Are you sure you want to remove this job from your saved list?
              </p>
            </div>

            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 mt-auto">
              <Button 
                variant="outline" 
                onClick={() => setUnsaveDialog({ open: false, jobId: null })} 
                className="border-border hover:bg-accent"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleUnsaveJob} 
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPanel;
