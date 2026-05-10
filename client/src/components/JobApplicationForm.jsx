import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X, Info } from 'lucide-react';

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

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Let the parent component handle closing and clearing
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-foreground">Apply for: {jobTitle}</h2>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-sm p-3 rounded-lg mb-6 flex items-start gap-2">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <span>Please provide your details to complete the application.</span>
          </div>

          <form id="job-application-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`bg-muted border-border h-11 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                disabled={loading}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience *</label>
              <Input
                name="yearsOfExperience"
                type="number"
                min="0"
                step="0.5"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 3"
                className={`bg-muted border-border h-11 ${errors.yearsOfExperience ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                disabled={loading}
              />
              {errors.yearsOfExperience && <p className="text-xs text-destructive mt-1">{errors.yearsOfExperience}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter (Optional)</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us why you're interested in this position..."
                className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio URL (Optional)</label>
              <Input
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                className={`bg-muted border-border h-11 ${errors.portfolioUrl ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                disabled={loading}
              />
              {errors.portfolioUrl && <p className="text-xs text-destructive mt-1">{errors.portfolioUrl}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn Profile URL (Optional)</label>
              <Input
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className={`bg-muted border-border h-11 ${errors.linkedinUrl ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                disabled={loading}
              />
              {errors.linkedinUrl && <p className="text-xs text-destructive mt-1">{errors.linkedinUrl}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information you'd like to share..."
                className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                disabled={loading}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card flex justify-end gap-3 mt-auto">
          <Button variant="outline" onClick={handleClose} disabled={loading} className="border-border hover:bg-accent">
            Cancel
          </Button>
          <Button type="submit" form="job-application-form" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
