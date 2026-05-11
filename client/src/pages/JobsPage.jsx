import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import JobFilters from '../components/JobFilters';
import PaginationComponent from '../components/Pagination';
import JobCard from '../components/JobCard';
import GridBackground from '../components/GridBackground';
import { AlertCircle, Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchTimeout = useRef(null);
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

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
      fetchJobs();
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [searchInput]);

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
    setSearchInput('');
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
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.post('/jobs/unsave', { jobId });
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with grid background */}
      <GridBackground className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
              Find your next <span className="text-gradient-primary">opportunity</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Search through {pagination.totalJobs || 'thousands of'} curated job listings from top companies
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by job title, company, or keyword..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-card shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-base"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </GridBackground>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-8 flex items-start gap-3 border border-destructive/20">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <JobFilters onFilter={handleFilter} onClear={handleClearFilters} />
            </div>
          </div>

          {/* Jobs Listing */}
          <div className="lg:col-span-3">
            {loading && jobs.length === 0 ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Showing <span className="text-foreground font-semibold">{pagination.totalJobs}</span> results
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
              <div className="rounded-xl border border-dashed border-border p-16 text-center bg-card">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
