import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Phone, 
  Globe 
} from 'lucide-react';

const ApplicationCard = ({ application, onWithdraw, loading = false, canWithdraw = true }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending':
      case 'reviewed':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'withdrawn':
        return 'bg-accent text-muted-foreground border-border';
      default:
        return 'bg-accent text-foreground border-border';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isWithdrawable =
    canWithdraw && ['applied', 'pending', 'reviewed'].includes(application.status);

  return (
    <Card className="h-full flex flex-col mb-4 bg-card border-border hover:bg-muted transition-colors">
      <CardContent className="p-6 flex-grow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight mb-1">
              {application.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {application.company}
            </p>
          </div>
          <div className="shrink-0">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
          </div>
        </div>

        {/* Location and Job Type */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
            <MapPin className="h-3 w-3" /> {application.location}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
            <Briefcase className="h-3 w-3" /> {application.jobType}
          </span>
          {application.experienceLevel && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
              {application.experienceLevel} Level
            </span>
          )}
          {application.salary && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-muted-foreground">
              <IndianRupee className="h-3 w-3" /> {application.salary}
            </span>
          )}
        </div>

        <div className="h-px w-full bg-border/40 my-4" />

        {/* Application Details */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-bold text-foreground">Application Details</h4>

          <div className="space-y-2">
            {/* Applied Date */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Applied On:</span>
              <span className="text-sm text-foreground">
                {new Date(application.appliedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Years of Experience */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Years of Experience:</span>
              <span className="text-sm font-bold text-foreground">
                {application.yearsOfExperience} years
              </span>
            </div>

            {/* Contact Information */}
            {application.phone && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contact:</span>
                <span className="text-sm text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {application.phone}
                </span>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div>
              <span className="text-xs font-bold text-muted-foreground block mb-1">Cover Letter:</span>
              <div className="p-3 bg-muted rounded-md border border-border text-sm text-muted-foreground italic">
                "{application.coverLetter.substring(0, 200)}
                {application.coverLetter.length > 200 ? '...' : ''}"
              </div>
            </div>
          )}

          {/* Portfolio and LinkedIn */}
          <div className="flex gap-2 flex-wrap">
            {application.portfolioUrl && (
              <a 
                href={application.portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2.5 py-1.5 rounded-md"
              >
                <Globe className="h-3.5 w-3.5" /> Portfolio
              </a>
            )}
            {application.linkedinUrl && (
              <a 
                href={application.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors bg-[#0A66C2]/10 px-2.5 py-1.5 rounded-md"
              >
                <Globe className="h-3.5 w-3.5" /> LinkedIn
              </a>
            )}
          </div>

          {/* Additional Notes */}
          {application.notes && (
            <div>
              <span className="text-xs font-bold text-muted-foreground block mb-1">Additional Notes:</span>
              <div className="p-3 bg-muted rounded-md border border-border text-sm text-foreground">
                {application.notes}
              </div>
            </div>
          )}
        </div>

        {/* Company Info */}
        {application.postedBy && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Posted By</h4>
            <p className="text-sm font-medium text-foreground">
              {application.postedBy.firstName} {application.postedBy.lastName}
            </p>
            {application.postedBy.company && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {application.postedBy.company}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-end">
        {isWithdrawable && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onWithdraw(application.jobId)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Withdraw
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
