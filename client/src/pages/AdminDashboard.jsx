import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  User, 
  Briefcase, 
  FileText, 
  Trash2, 
  AlertCircle, 
  Loader2, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [jobPage, setJobPage] = useState(0);
  const [applicationPage, setApplicationPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null,
    id: null,
    name: '',
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [tab, userPage, jobPage, applicationPage, rowsPerPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsResponse = await usersAPI.getAdminStats();
      setStats(statsResponse.data);

      if (tab === 0) {
        // Fetch users
        const usersResponse = await usersAPI.getAllUsers({
          page: userPage + 1,
          limit: rowsPerPage,
        });
        setUsers(usersResponse.data.users || []);
      } else if (tab === 1) {
        // Fetch jobs
        const jobsResponse = await usersAPI.getAllJobs({
          page: jobPage + 1,
          limit: rowsPerPage,
        });
        setJobs(jobsResponse.data.jobs || []);
      } else if (tab === 2) {
        // Fetch applications
        const appsResponse = await usersAPI.getAllApplications({
          page: applicationPage + 1,
          limit: rowsPerPage,
        });
        setApplications(appsResponse.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(
        error.response?.data?.error || 'You are not authorized to access admin panel'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      if (deleteDialog.type === 'user') {
        await usersAPI.deleteUser(deleteDialog.id);
        setUsers(users.filter((u) => u._id !== deleteDialog.id));
      } else if (deleteDialog.type === 'job') {
        await usersAPI.deleteJob(deleteDialog.id);
        setJobs(jobs.filter((j) => j._id !== deleteDialog.id));
      }
      setDeleteDialog({ open: false, type: null, id: null, name: '' });
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      applied: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      reviewed: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      withdrawn: 'bg-accent text-muted-foreground border-border',
    };
    return statusColors[status] || 'bg-accent text-muted-foreground border-border';
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Card className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalUsers}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-pink-500/10 border border-pink-500/20">
                <User className="h-6 w-6 text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.jobSeekers}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Seekers</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Briefcase className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.employers}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Employers</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <FileText className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalApplications || 0}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Applications</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-muted transition-all hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Briefcase className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalJobs}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Jobs</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Management Tabs */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="flex overflow-x-auto border-b border-border bg-muted no-scrollbar">
          <button
            onClick={() => { setTab(0); setUserPage(0); setJobPage(0); setApplicationPage(0); }}
            className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === 0
                ? 'border-primary text-primary bg-muted'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Users <span className="ml-1.5 py-0.5 px-2 bg-accent rounded-full text-xs">{users.length}</span>
          </button>
          <button
            onClick={() => { setTab(1); setUserPage(0); setJobPage(0); setApplicationPage(0); }}
            className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === 1
                ? 'border-primary text-primary bg-muted'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Jobs <span className="ml-1.5 py-0.5 px-2 bg-accent rounded-full text-xs">{jobs.length}</span>
          </button>
          <button
            onClick={() => { setTab(2); setUserPage(0); setJobPage(0); setApplicationPage(0); }}
            className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === 2
                ? 'border-primary text-primary bg-muted'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Applications <span className="ml-1.5 py-0.5 px-2 bg-accent rounded-full text-xs">{applications.length}</span>
          </button>
        </div>

        <div className="p-0">
          {/* Users Tab */}
          {tab === 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-muted transition-colors">
                        <td className="p-4 text-sm font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground break-all max-w-[200px]">
                          {user.email}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border ${
                            user.userType === 'job_seeker' 
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                              : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                          }`}>
                            {user.userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{user.phone || '-'}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleDeleteClick('user', user._id, `${user.firstName} ${user.lastName}`)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Jobs Tab */}
          {tab === 1 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Posted By</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Posted</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-muted transition-colors">
                        <td className="p-4 text-sm font-medium text-foreground max-w-[200px] truncate">
                          {job.title}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{job.company}</td>
                        <td className="p-4 text-sm text-muted-foreground">{job.location}</td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-0.5 bg-accent text-foreground border border-border rounded text-xs font-medium">
                            {job.jobType}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {job.postedBy?.firstName} {job.postedBy?.lastName}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleDeleteClick('job', job._id, job.title)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">No jobs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Applied Jobs Tab */}
          {tab === 2 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Applicant</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Title</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Applied</th>
                    <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <tr key={`${app.jobId}-${app.userId}`} className="hover:bg-muted transition-colors">
                        <td className="p-4 text-sm font-medium text-foreground">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">
                          {app.jobTitle}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{app.jobCompany}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground break-all max-w-[200px]">
                          {app.applicant?.email}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td className="p-4 text-sm text-muted-foreground">{app.applicant?.phone || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">No applications found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-border p-4 bg-muted">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                className="bg-muted border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setUserPage(0);
                  setJobPage(0);
                  setApplicationPage(0);
                }}
              >
                {[5, 10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Page {(tab === 0 ? userPage : tab === 1 ? jobPage : applicationPage) + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 border-border"
                  disabled={(tab === 0 ? userPage : tab === 1 ? jobPage : applicationPage) === 0}
                  onClick={() => {
                    if (tab === 0) setUserPage(Math.max(0, userPage - 1));
                    if (tab === 1) setJobPage(Math.max(0, jobPage - 1));
                    if (tab === 2) setApplicationPage(Math.max(0, applicationPage - 1));
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 border-border"
                  onClick={() => {
                    if (tab === 0) setUserPage(userPage + 1);
                    if (tab === 1) setJobPage(jobPage + 1);
                    if (tab === 2) setApplicationPage(applicationPage + 1);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Confirm Deletion</h2>
              <button 
                onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
                disabled={deleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground">
                Are you sure you want to delete {deleteDialog.type === 'user' ? 'user' : 'job'}:{' '}
                <strong className="text-foreground">{deleteDialog.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 mt-auto">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} 
                disabled={deleting} 
                className="border-border hover:bg-accent"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm} 
                disabled={deleting}
              >
                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
