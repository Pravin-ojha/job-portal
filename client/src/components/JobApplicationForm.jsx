import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormHelperText,
  Stack,
  Alert,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const JobApplicationForm = ({ open, jobTitle, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolioUrl: '',
    linkedinUrl: '',
    phone: '',
    yearsOfExperience: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$|^[+]\d{11,13}$/.test(formData.phone.replace(/[\s()-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.yearsOfExperience === '') {
      newErrors.yearsOfExperience = 'Years of experience is required';
    } else if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number';
    }

    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL';
    }

    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        coverLetter: '',
        portfolioUrl: '',
        linkedinUrl: '',
        phone: '',
        yearsOfExperience: '',
        notes: '',
      });
    }
  };

  const handleClose = () => {
    setFormData({
      coverLetter: '',
      portfolioUrl: '',
      linkedinUrl: '',
      phone: '',
      yearsOfExperience: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Apply for: {jobTitle}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please provide your details to complete the application.
        </Alert>

        <Stack spacing={2.5}>
          {/* Phone */}
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000 or 10 digit number"
            required
            error={!!errors.phone}
            helperText={errors.phone}
            variant="outlined"
          />

          {/* Years of Experience */}
          <TextField
            fullWidth
            label="Years of Experience"
            name="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            required
            error={!!errors.yearsOfExperience}
            helperText={errors.yearsOfExperience}
            inputProps={{ min: 0, step: 0.5 }}
            variant="outlined"
          />

          {/* Cover Letter */}
          <TextField
            fullWidth
            label="Cover Letter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Tell us why you're interested in this position..."
            helperText="Optional: Provide a brief cover letter"
            variant="outlined"
          />

          {/* Portfolio URL */}
          <TextField
            fullWidth
            label="Portfolio URL"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
            error={!!errors.portfolioUrl}
            helperText={errors.portfolioUrl || 'Optional: Link to your portfolio'}
            variant="outlined"
          />

          {/* LinkedIn URL */}
          <TextField
            fullWidth
            label="LinkedIn Profile URL"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            error={!!errors.linkedinUrl}
            helperText={errors.linkedinUrl || 'Optional: Link to your LinkedIn profile'}
            variant="outlined"
          />

          {/* Additional Notes */}
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Any additional information you'd like to share..."
            helperText="Optional: Tell us anything else we should know"
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobApplicationForm;
