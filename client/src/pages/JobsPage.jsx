import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import JobFilters from '../components/JobFilters';
import PaginationComponent from '../components/Pagination';
import JobCard from '../components/JobCard';
import { AlertCircle, Loader2, Search } from 'lucide-react';

const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalJobs: 0,
  });
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: [0, 200000],
    search: '',
  });

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [currentPage, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.title && { title: filters.title }),
        ...(filters.location && { location: filters.location }),
        ...(filters.jobType && { jobType: filters.jobType }),
        ...(filters.experienceLevel && { experienceLevel: filters.experienceLevel }),
        ...(filters.salaryRange[1] < 200000 && { salaryMin: filters.salaryRange[0], salaryMax: filters.salaryRange[1] }),
      };

      const response = await api.get('/jobs', { params });
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/jobs/user/saved');
      setSavedJobs(response.data.map((job) => job._id));
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setTimeout(() => fetchJobs(), 100);
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salaryRange: [0, 200000],
      search: '',
    });
    setCurrentPage(1);
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/jobs/save', { jobId });
      setSavedJobs([...savedJobs, jobId]);
    } catch (err) {
      console.error('Failed to save job:', err);
      alert(err.response?.data?.error || 'Failed to save job');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.post('/jobs/unsave', { jobId });
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
      alert('Failed to remove job from saved');
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Search className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Search Jobs
        </h1>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilters onFilter={handleFilter} onClear={handleClearFilters} />
        </div>

        {/* Jobs Listing */}
        <div className="lg:col-span-3">
          {jobs.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Found {pagination.totalJobs} jobs
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedJobs.includes(job._id)}
                    onSave={handleSaveJob}
                    onUnsave={handleUnsaveJob}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <PaginationComponent
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalJobs}
                    itemsPerPage={pagination.jobsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No jobs found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
