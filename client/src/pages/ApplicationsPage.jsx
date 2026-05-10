import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/ApplicationCard';
import { jobsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, X } from 'lucide-react';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState({
    open: false,
    jobId: null,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getUserApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = (jobId) => {
    setWithdrawDialog({
      open: true,
      jobId,
    });
  };

  const handleConfirmWithdraw = async () => {
    try {
      setWithdrawing(true);
      await jobsAPI.withdrawApplication(withdrawDialog.jobId);
      setApplications(
        applications.map((app) =>
          app.jobId === withdrawDialog.jobId ? { ...app, status: 'withdrawn' } : app
        )
      );
      setWithdrawDialog({ open: false, jobId: null });
      alert('Application withdrawn successfully');
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(err.response?.data?.error || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleCloseDialog = () => {
    setWithdrawDialog({ open: false, jobId: null });
  };

  // Filter applications by status
  const getFilteredApplications = () => {
    if (tabValue === 'all') return applications;
    return applications.filter((app) => app.status === tabValue);
  };

  const filteredApplications = getFilteredApplications();

  // Count applications by status
  const statusCounts = {
    all: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    withdrawn: applications.filter((a) => a.status === 'withdrawn').length,
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track and manage all your job applications
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border text-center py-4 hover:bg-muted transition-colors">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-blue-500 mb-1">{statusCounts.all}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center py-4 hover:bg-muted transition-colors">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-emerald-500 mb-1">{statusCounts.accepted}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Accepted</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center py-4 hover:bg-muted transition-colors">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-amber-500 mb-1">{statusCounts.pending + statusCounts.reviewed}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Under Review</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center py-4 hover:bg-muted transition-colors">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-destructive mb-1">{statusCounts.rejected}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border mb-8 pb-px no-scrollbar">
        {[
          { id: 'all', label: 'All', count: statusCounts.all },
          { id: 'applied', label: 'Applied', count: statusCounts.applied },
          { id: 'pending', label: 'Pending', count: statusCounts.pending },
          { id: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed },
          { id: 'accepted', label: 'Accepted', count: statusCounts.accepted },
          { id: 'rejected', label: 'Rejected', count: statusCounts.rejected },
          { id: 'withdrawn', label: 'Withdrawn', count: statusCounts.withdrawn },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabValue(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tabValue === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
            }`}
          >
            {tab.label} <span className="ml-1.5 py-0.5 px-2 bg-muted rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border border-dashed">
          <p className="text-muted-foreground">
            {tabValue === 'all'
              ? 'You have not applied for any jobs yet. Start exploring jobs now!'
              : `No applications with status "${tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}" found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.jobId}
              application={application}
              onWithdraw={handleWithdrawClick}
              loading={withdrawing}
              canWithdraw={true}
            />
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      {withdrawDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Confirm Withdrawal</h2>
              <button 
                onClick={handleCloseDialog}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
                disabled={withdrawing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground">
                Are you sure you want to withdraw this application? This action cannot be undone.
              </p>
            </div>

            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 mt-auto">
              <Button variant="outline" onClick={handleCloseDialog} disabled={withdrawing} className="border-border hover:bg-accent">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmWithdraw} disabled={withdrawing}>
                {withdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {withdrawing ? 'Withdrawing...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
