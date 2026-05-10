import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Slider,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

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
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filter Jobs
      </Typography>
      <Stack spacing={2}>
        {/* Search */}
        <TextField
          label="Search Jobs"
          placeholder="e.g., React Developer"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          fullWidth
          size="small"
        />

        {/* Title */}
        <TextField
          label="Job Title"
          placeholder="e.g., Senior Developer"
          value={filters.title}
          onChange={(e) => handleFilterChange('title', e.target.value)}
          fullWidth
          size="small"
        />

        {/* Location */}
        <TextField
          label="Location"
          placeholder="e.g., San Francisco, CA"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          fullWidth
          size="small"
        />

        {/* Job Type */}
        <FormControl fullWidth size="small">
          <InputLabel>Job Type</InputLabel>
          <Select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
        </FormControl>

        {/* Experience Level */}
        <FormControl fullWidth size="small">
          <InputLabel>Experience Level</InputLabel>
          <Select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
          >
            <MenuItem value="">All Levels</MenuItem>
            <MenuItem value="Entry-level">Entry-level</MenuItem>
            <MenuItem value="Mid-level">Mid-level</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>
        </FormControl>

        {/* Salary Range */}
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Salary Range: ${filters.salaryRange[0].toLocaleString()} - $
            {filters.salaryRange[1].toLocaleString()}
          </Typography>
          <Slider
            value={filters.salaryRange}
            onChange={(e, newValue) =>
              handleFilterChange('salaryRange', newValue)
            }
            valueLabelDisplay="auto"
            min={0}
            max={200000}
            step={10000}
          />
        </Box>

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
            fullWidth
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            fullWidth
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default JobFilters;
