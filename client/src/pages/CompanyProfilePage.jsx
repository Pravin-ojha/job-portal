import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companiesAPI, jobsAPI } from '../services/api';
import ReviewComponent from '../components/ReviewComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  MapPin,
  Users,
  Globe,
  Briefcase,
  Star,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const CompanyProfilePage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companiesAPI.getCompanyById(id);
      setCompany(response.data.company);
      setReviews(response.data.reviews || []);

      // Fetch jobs by this company
      const jobsResponse = await jobsAPI.getAllJobs({
        company: response.data.company.name,
      });
      setJobs(jobsResponse.data.jobs || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError('Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const response = await companiesAPI.addCompanyReview(id, reviewData);
      setReviews([response.data.review, ...reviews]);
      setCompany({
        ...company,
        rating: response.data.company?.rating || company.rating,
        reviewCount: response.data.company?.reviewCount || company.reviewCount,
      });
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= (rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-zinc-800 text-zinc-800'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-8 flex items-start gap-3 border border-destructive/20">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <span>{error || 'Company not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Company Header */}
      <Card className="bg-card border-border mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20"></div>
        <CardContent className="p-6 md:p-8 pt-0 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-xl border-4 border-zinc-950 bg-muted flex items-center justify-center overflow-hidden shadow-xl shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">{company.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  {renderStars(company.rating)}
                  <span className="text-sm font-medium text-foreground">
                    {company.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-sm">
                    ({company.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pb-2 w-full md:w-auto flex flex-col gap-2">
              {company.website && (
                <Button variant="outline" className="w-full md:w-auto border-border" asChild>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" /> Visit Website <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {company.description && (
            <div className="mb-8 max-w-3xl">
              <h3 className="text-lg font-bold text-foreground mb-3">About Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                {company.description}
              </p>
            </div>
          )}

          {/* Company Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-muted rounded-xl border border-border">
            {company.industry && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Building className="h-4 w-4" /> Industry
                </p>
                <p className="text-foreground font-medium">{company.industry}</p>
              </div>
            )}
            {company.location && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Location
                </p>
                <p className="text-foreground font-medium">{company.location}</p>
              </div>
            )}
            {company.foundedYear && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> Founded
                </p>
                <p className="text-foreground font-medium">{company.foundedYear}</p>
              </div>
            )}
            {company.employeeCount && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Employees
                </p>
                <p className="text-foreground font-medium">{company.employeeCount}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Reviews */}
          <Card className="bg-card border-border h-full">
            <CardContent className="p-6 md:p-8">
              <ReviewComponent
                reviews={reviews}
                onAddReview={handleAddReview}
                allowReview={true}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Open Positions */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Open Positions</h3>
                <span className="inline-flex items-center justify-center bg-primary/20 text-primary h-6 px-2.5 rounded-full text-xs font-bold">
                  {jobs.length}
                </span>
              </div>

              {jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="block group">
                      <div className="p-4 rounded-xl border border-border bg-muted hover:bg-accent transition-colors">
                        <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-border text-muted-foreground bg-card">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-primary/20 text-primary bg-primary/5">
                            <Briefcase className="h-3 w-3" /> {job.jobType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                          <span className="text-xs font-medium text-emerald-500">
                            {job.salary || 'Salary Undisclosed'}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {jobs.length > 5 && (
                    <Button variant="outline" className="w-full border-border" asChild>
                      <Link to={`/jobs?company=${company.name}`}>
                        View All {jobs.length} Jobs
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted rounded-xl border border-border border-dashed">
                  <Briefcase className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No open positions at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
