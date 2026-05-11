import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ReviewComponent from '../components/ReviewComponent';
import JobApplicationForm from '../components/JobApplicationForm';
import GridBackground from '../components/GridBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { timeAgo } from '@/lib/dateUtils';
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
  ArrowLeft,
  Clock,
  Share2,
  ExternalLink,
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();
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

      const jobRes = await jobsAPI.getJobById(id);
      setJob(jobRes.data);

      try {
        const reviewsRes = await jobsAPI.getJobReviews(id);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.log('No reviews found');
      }

      if (user) {
        try {
          const savedRes = await jobsAPI.getSavedJobs();
          const jobIds = savedRes.data.map((j) => j._id);
          setIsSaved(jobIds.includes(id));

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
      toast.success('Application submitted successfully!');
      const appliedRes = await jobsAPI.getUserApplications();
      const appliedJob = appliedRes.data.find((app) => app.jobId === id);
      if (appliedJob) {
        setApplicationStatus(appliedJob.status);
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      toast.error(err.response?.data?.error || 'Failed to apply for job');
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
        toast.info('Job removed from saved');
      } else {
        await jobsAPI.saveJob(id);
        setIsSaved(true);
        toast.success('Job saved!');
      }
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await jobsAPI.addJobReview(id, reviewData);
      setReviews([response.data.review, ...reviews]);
      toast.success('Review added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error || 'Job not found'}</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
      </div>
    );
  }

  const isJobOwner = user && user._id === job.postedBy?._id;

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <GridBackground className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Back button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {job.company?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    {job.title}
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border bg-card text-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-primary/20 bg-primary/10 text-primary font-semibold">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.jobType}
                </span>
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border bg-card text-foreground font-medium">
                    {job.experienceLevel}
                  </span>
                )}
                {job.salary && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-semibold">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.salary}
                  </span>
                )}
              </div>

              {job.createdAt && (
                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Posted {timeAgo(job.createdAt)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">
              {isJobOwner ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => navigate(`/edit-job/${id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Job
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-center"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this job?')) {
                        jobsAPI
                          .deleteJob(id)
                          .then(() => {
                            toast.success('Job deleted successfully');
                            navigate('/jobs');
                          })
                          .catch(() => toast.error('Failed to delete job'));
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
                    className="w-full font-bold text-base h-12 shadow-lg shadow-primary/20"
                    disabled={hasApplied}
                    onClick={handleApply}
                  >
                    {hasApplied ? `Applied (${applicationStatus})` : 'Apply Now'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full font-medium h-12 ${isSaved ? 'text-primary border-primary/30 bg-primary/5 hover:bg-primary/10' : ''}`}
                    onClick={handleSaveJob}
                  >
                    {isSaved ? (
                      <><BookmarkCheck className="mr-2 h-5 w-5" /> Saved</>
                    ) : (
                      <><Bookmark className="mr-2 h-5 w-5" /> Save Job</>
                    )}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </GridBackground>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description with Markdown */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">Job Description</h3>
                <div className="prose-job">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {job.description}
                  </ReactMarkdown>
                </div>

                <div className="h-px w-full bg-border my-8" />

                <h3 className="text-xl font-bold text-foreground mb-4">Requirements</h3>
                <div className="prose-job">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {job.requirements}
                  </ReactMarkdown>
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

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-6">Company Info</h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border border-primary/20">
                    {job.company?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">{job.company}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-border my-6" />

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Posted by</p>
                    <p className="text-foreground font-medium flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                        {job.postedBy?.firstName?.[0] || 'U'}
                      </div>
                      {job.postedBy?.firstName} {job.postedBy?.lastName}
                    </p>
                  </div>

                  {job.postedBy?.email && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                      <a href={`mailto:${job.postedBy.email}`} className="text-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {job.postedBy.email}
                      </a>
                    </div>
                  )}

                  {job.postedBy?.phone && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                      <a href={`tel:${job.postedBy.phone}`} className="text-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {job.postedBy.phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {job.postedBy?.company && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/companies/${job.postedBy._id}`)}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> View Company Profile
              </Button>
            )}
          </div>
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
