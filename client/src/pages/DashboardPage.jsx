import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import GridBackground from '../components/GridBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { timeAgo } from '@/lib/dateUtils';
import { 
  FileText, 
  Bookmark, 
  User, 
  PlusSquare, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle,
  X,
  LayoutDashboard
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [userJobs, setUserJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [jobSeekerTab, setJobSeekerTab] = useState(0);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userRes = await usersAPI.getUserProfile();
      setUserData(userRes.data);

      // Fetch user's applications (for job seekers)
      if (userRes.data.userType === 'job_seeker') {
        try {
          const applicationsRes = await jobsAPI.getUserApplications();
          const appList = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
          
          const transformedApps = appList.map(app => ({
            _id: `${app.jobId}-${app.appliedAt}`,
            jobId: {
              _id: app.jobId,
              title: app.title,
              company: app.company,
              location: app.location,
              jobType: app.jobType,
              experienceLevel: app.experienceLevel,
              salary: app.salary,
              description: app.description,
              requirements: app.requirements
            },
            status: app.status || 'applied',
            appliedAt: app.appliedAt,
            createdAt: app.createdAt,
            postedBy: app.postedBy,
            coverLetter: app.coverLetter,
            portfolioUrl: app.portfolioUrl,
            linkedinUrl: app.linkedinUrl,
            phone: app.phone,
            yearsOfExperience: app.yearsOfExperience,
            notes: app.notes,
            resumePath: app.resumePath,
            updatedAt: app.updatedAt
          }));
          
          setApplications(transformedApps);
          
          const appliedIds = new Set(appList.map(app => app.jobId));
          setAppliedJobIds(appliedIds);
        } catch (err) {
          console.log('No applications found:', err.response?.status);
          setApplications([]);
          setAppliedJobIds(new Set());
        }

        try {
          const savedRes = await jobsAPI.getSavedJobs();
          setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : []);
        } catch (err) {
          console.log('No saved jobs found:', err.response?.status);
          setSavedJobs([]);
        }
      }

      // Fetch user's jobs (for employers)
      if (userRes.data.userType === 'employer') {
        try {
          const jobsRes = await jobsAPI.getUserJobs();
          setUserJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        } catch (err) {
          console.error('Error fetching user jobs:', err);
          setUserJobs([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await jobsAPI.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await jobsAPI.deleteJob(deleteDialog.id);
      setUserJobs(userJobs.filter(job => job._id !== deleteDialog.id));
      setDeleteDialog({ open: false, type: null, id: null });
      toast.success('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = userData?.userType === 'job_seeker' ? [
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      label: 'My Applications',
      value: applications.length,
    },
    {
      icon: <Bookmark className="h-8 w-8 text-purple-500" />,
      label: 'Saved Jobs',
      value: savedJobs.length,
    },
    {
      icon: <User className="h-8 w-8 text-pink-500" />,
      label: 'Profile Status',
      value: '100%',
    },
  ] : [
    {
      icon: <PlusSquare className="h-8 w-8 text-blue-500" />,
      label: 'Job Posts',
      value: userJobs.length,
    },
    {
      icon: <User className="h-8 w-8 text-purple-500" />,
      label: 'Profile Status',
      value: '100%',
    },
  ];

  return (
    <div>
      <GridBackground className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Welcome back, {userData?.firstName || user?.firstName}. Here's your overview.</p>
        </div>
      </GridBackground>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <div className="mb-4 p-3 rounded-full bg-muted border border-border">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Profile Section */}
      {userData && (
        <Card className="mb-10 bg-card border-border">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
                <div className="font-semibold text-foreground">{userData.firstName} {userData.lastName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                <div className="font-semibold text-foreground break-all">{userData.email}</div>
              </div>
              {userData.userType === 'employer' && userData.company && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Company</div>
                  <div className="font-semibold text-foreground">{userData.company}</div>
                </div>
              )}
              {userData.phone && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                  <div className="font-semibold text-foreground">{userData.phone}</div>
                </div>
              )}
              {userData.bio && (
                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Bio</div>
                  <div className="text-foreground">{userData.bio}</div>
                </div>
              )}
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">User Type</div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  userData.userType === 'job_seeker' 
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                    : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                }`}>
                  {userData.userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posted Jobs Section */}
      {userData?.userType === 'employer' && (
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              My Posted Jobs <span className="text-muted-foreground text-lg font-normal">({userJobs.length})</span>
            </h2>
            <Button onClick={() => navigate('/post-job')} className="w-full sm:w-auto">
              Post New Job
            </Button>
          </div>

          {userJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {userJobs.map((job) => (
                <Card key={job._id} className="bg-card border-border hover:bg-muted transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {job.location} • {job.jobType}
                        </p>
                        {job.salary && (
                          <p className="text-sm font-medium text-foreground mb-2">
                            ${job.salaryMin?.toLocaleString() || job.salary?.toLocaleString()} - ${job.salaryMax?.toLocaleString() || job.salary?.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Applications: <span className="font-semibold text-foreground">{job.applications?.length || 0}</span>
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/jobs/${job._id}`)} className="flex-1 border-border">
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/edit-job/${job._id}`)} className="flex-1 border-border">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" color="destructive" onClick={() => setDeleteDialog({ open: true, type: 'job', id: job._id })} className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
              <p className="text-muted-foreground mb-4">No jobs posted yet. Start by creating a new job posting!</p>
              <Button onClick={() => navigate('/post-job')}>Post New Job</Button>
            </div>
          )}
        </div>
      )}

      {/* Job Seeker Sections with Tabs */}
      {userData?.userType === 'job_seeker' && (
        <div className="mb-10">
          <div className="flex overflow-x-auto border-b border-border mb-8 pb-px no-scrollbar">
            <button
              onClick={() => setJobSeekerTab(0)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                jobSeekerTab === 0
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              My Applications <span className="ml-1.5 py-0.5 px-2 bg-muted rounded-full text-xs">{applications.length}</span>
            </button>
            <button
              onClick={() => setJobSeekerTab(1)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                jobSeekerTab === 1
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              Saved Jobs <span className="ml-1.5 py-0.5 px-2 bg-muted rounded-full text-xs">{savedJobs.length}</span>
            </button>
          </div>

          {/* Applications Tab */}
          {jobSeekerTab === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">My Applications</h2>
              {applications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <Card key={app._id} className="bg-card border-border hover:bg-muted transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-foreground">{app.jobId?.title || 'Job'}</h3>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                                app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                app.status === 'applied' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                app.status === 'rejected' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {app.status === 'applied' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                {app.status === 'applied' ? 'Applied' : app.status || 'Pending'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {app.jobId?.company}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">
                              {app.jobId?.location}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Applied on: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="shrink-0 w-full md:w-auto">
                            <Button variant="outline" className="w-full border-border" onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                              View Job
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
                  <p className="text-muted-foreground mb-4">You haven't applied for any jobs yet.</p>
                  <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
                </div>
              )}
            </div>
          )}

          {/* Saved Jobs Tab */}
          {jobSeekerTab === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Saved Jobs</h2>
              {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {savedJobs.map((job) => {
                    const isApplied = appliedJobIds.has(job._id);
                    return (
                      <Card key={job._id} className={`flex flex-col h-full bg-card transition-colors ${isApplied ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border hover:bg-muted'}`}>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">{job.title}</h3>
                            {isApplied && (
                              <span className="shrink-0 bg-emerald-500 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Applied
                              </span>
                            )}
                          </div>
                          <div className="mb-4 flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{job.company}</p>
                            <p className="text-sm text-muted-foreground mb-2">{job.location} • {job.jobType}</p>
                            {job.salary && (
                              <p className="text-sm font-medium text-foreground mb-2">
                                ${job.salaryMin?.toLocaleString() || job.salary?.toLocaleString()} - ${job.salaryMax?.toLocaleString() || job.salary?.toLocaleString()}
                              </p>
                            )}
                            <span className="inline-block px-2 py-1 bg-muted border border-border rounded text-xs text-muted-foreground">
                              {job.experienceLevel}
                            </span>
                          </div>
                          <div className="space-y-2 mt-auto">
                            <Button className="w-full" onClick={() => navigate(`/jobs/${job._id}`)}>
                              {isApplied ? 'View Application' : 'View & Apply'}
                            </Button>
                            <Button variant="outline" className="w-full border-border text-destructive hover:bg-destructive/10" onClick={() => handleRemoveSavedJob(job._id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
                  <p className="text-muted-foreground mb-4">You haven't saved any jobs yet.</p>
                  <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Confirm Deletion</h2>
              <button 
                onClick={() => setDeleteDialog({ open: false, type: null, id: null })}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 border-t border-border bg-card flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: null, id: null })} className="border-border hover:bg-accent">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteJob}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;
