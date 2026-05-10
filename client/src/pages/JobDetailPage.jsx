import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ReviewComponent from '../components/ReviewComponent';
import JobApplicationForm from '../components/JobApplicationForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Briefcase,
  DollarSign,
  Loader2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Trash2,
  Edit,
  ArrowLeft
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch job details
      const jobRes = await jobsAPI.getJobById(id);
      setJob(jobRes.data);

      // Fetch reviews
      try {
        const reviewsRes = await jobsAPI.getJobReviews(id);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.log('No reviews found');
      }

      // Check if user has saved this job
      if (user) {
        try {
          const savedRes = await jobsAPI.getSavedJobs();
          const jobIds = savedRes.data.map((j) => j._id);
          setIsSaved(jobIds.includes(id));

          // Check if user has applied
          const appliedRes = await jobsAPI.getUserApplications();
          const appliedJob = appliedRes.data.find((app) => app.jobId === id);
          if (appliedJob) {
            setHasApplied(true);
            setApplicationStatus(appliedJob.status);
          }
        } catch (err) {
          console.log('Could not check saved status');
        }
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      setSubmittingApplication(true);
      await jobsAPI.applyForJob(id, {
        ...formData,
        email: user.email,
      });
      setHasApplied(true);
      setApplicationStatus('applied');
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
      // Refresh applications to show updated status
      const appliedRes = await jobsAPI.getUserApplications();
      const appliedJob = appliedRes.data.find((app) => app.jobId === id);
      if (appliedJob) {
        setApplicationStatus(appliedJob.status);
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      alert(err.response?.data?.error || 'Failed to apply for job');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await jobsAPI.unsaveJob(id);
        setIsSaved(false);
      } else {
        await jobsAPI.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job');
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await jobsAPI.addJobReview(id, reviewData);
      setReviews([response.data.review, ...reviews]);
      alert('Review added successfully!');
    } catch (err) {
      console.error('Error adding review:', err);
      alert(err.response?.data?.error || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-warning/15 text-warning text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-warning/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>Job not found</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </div>
    );
  }

  const isJobOwner = user && user._id === job.postedBy?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground p-0 h-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Job Header */}
      <Card className="bg-card border-border mb-8">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {job.title}
              </h1>
              <h2 className="text-xl text-muted-foreground mb-6 flex items-center gap-2">
                <Building className="h-5 w-5" />
                {job.company}
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-border bg-muted text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-primary/20 bg-primary/10 text-primary font-medium">
                  <Briefcase className="h-4 w-4" />
                  {job.jobType}
                </span>
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-border bg-muted text-foreground">
                    {job.experienceLevel} Level
                  </span>
                )}
              </div>

              {job.salary && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Salary</p>
                  <p className="text-xl font-bold text-emerald-500 flex items-center gap-1">
                    <DollarSign className="h-5 w-5" /> {job.salary}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full md:w-64 shrink-0">
              {isJobOwner ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border hover:bg-accent"
                    onClick={() => navigate(`/edit-job/${id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Job
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
                        jobsAPI
                          .deleteJob(id)
                          .then(() => {
                            alert('Job deleted successfully');
                            navigate('/jobs');
                          })
                          .catch(() => alert('Failed to delete job'));
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full font-bold text-base h-12"
                    disabled={hasApplied}
                    onClick={handleApply}
                  >
                    {hasApplied ? `Applied (${applicationStatus})` : 'Apply Now'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full font-medium h-12 border-border ${isSaved ? 'text-primary border-primary/30 bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent'}`}
                    onClick={handleSaveJob}
                  >
                    {isSaved ? (
                      <><BookmarkCheck className="mr-2 h-5 w-5" /> Saved</>
                    ) : (
                      <><Bookmark className="mr-2 h-5 w-5" /> Save Job</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Job Description</h3>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
                {job.description}
              </div>

              <div className="h-px w-full bg-border/40 my-8"></div>

              <h3 className="text-xl font-bold text-foreground mb-4">Requirements</h3>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.requirements}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ReviewComponent
                reviews={reviews}
                onAddReview={handleAddReview}
                allowReview={hasApplied}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Company Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Company Info</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
                  {job.company?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{job.company}</p>
                </div>
              </div>

              <div className="h-px w-full bg-border/40 my-6"></div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Posted by</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs text-muted-foreground">
                      {job.postedBy?.firstName?.[0] || 'U'}
                    </div>
                    {job.postedBy?.firstName} {job.postedBy?.lastName}
                  </p>
                </div>

                {job.postedBy?.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${job.postedBy.email}`} className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {job.postedBy.email}
                    </a>
                  </div>
                )}

                {job.postedBy?.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                    <a href={`tel:${job.postedBy.phone}`} className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {job.postedBy.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* View Company Profile */}
          {job.postedBy?.company && (
            <Button
              variant="outline"
              className="w-full border-border hover:bg-muted"
              onClick={() => navigate(`/companies/${job.postedBy._id}`)}
            >
              View Company Profile
            </Button>
          )}
        </div>
      </div>

      {/* Application Form Dialog */}
      <JobApplicationForm
        open={showApplicationForm}
        jobTitle={job?.title}
        onClose={() => setShowApplicationForm(false)}
        onSubmit={handleApplicationSubmit}
        loading={submittingApplication}
      />
    </div>
  );
};

export default JobDetailPage;
