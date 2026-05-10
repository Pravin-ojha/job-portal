import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';

const JobFilters = ({ onFilter, onClear }) => {
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: [0, 200000],
    search: '',
  });

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleApplyFilters = () => {
    onFilter(filters);
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
    onClear();
  };

  return (
    <Card className="border-border bg-card mb-6 sticky top-24">
      <CardHeader className="pb-4 border-b border-border/20">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-4 w-4" /> Filter Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
          <Input
            placeholder="e.g., React Developer"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="bg-muted border-border"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Title</label>
          <Input
            placeholder="e.g., Senior Developer"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="bg-muted border-border"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
          <Input
            placeholder="e.g., San Francisco, CA"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="bg-muted border-border"
          />
        </div>

        {/* Job Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience Level</label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <option value="">All Levels</option>
            <option value="Entry-level">Entry-level</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Min Salary: ${filters.salaryRange[0].toLocaleString()}
          </label>
          <input
            type="range"
            min={0}
            max={200000}
            step={10000}
            value={filters.salaryRange[0]}
            onChange={(e) => handleFilterChange('salaryRange', [parseInt(e.target.value), filters.salaryRange[1]])}
            className="w-full accent-primary"
          />
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters} className="w-full border-border hover:bg-muted text-muted-foreground">
            <X className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
