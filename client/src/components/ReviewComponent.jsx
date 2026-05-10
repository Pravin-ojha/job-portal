import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, X } from 'lucide-react';

const StarRating = ({ value, onChange, readOnly }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform p-0.5`}
        >
          <Star 
            className="h-5 w-5" 
            fill={star <= value ? "#eab308" : "transparent"} 
            color={star <= value ? "#eab308" : "#52525b"} 
          />
        </button>
      ))}
    </div>
  );
};

const ReviewComponent = ({ reviews, onAddReview, allowReview }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: '',
    cons: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
      pros: '',
      cons: '',
    });
  };

  const handleSubmitReview = async () => {
    if (!newReview.title || !newReview.comment) {
      alert('Please fill in all required fields');
      return;
    }

    const reviewData = {
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      pros: newReview.pros.split(',').map((p) => p.trim()).filter(Boolean),
      cons: newReview.cons.split(',').map((c) => c.trim()).filter(Boolean),
    };

    await onAddReview(reviewData);
    handleCloseDialog();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Reviews & Ratings</h3>
        
        {allowReview && (
          <Button onClick={handleOpenDialog}>
            Add Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {review.reviewer?.firstName?.[0]}
                      {review.reviewer?.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {review.reviewer?.firstName} {review.reviewer?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <StarRating value={review.rating} readOnly />
                </div>

                <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{review.comment}</p>

                <div className="space-y-3">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-emerald-500 mb-1.5 uppercase tracking-wider">Pros</div>
                      <div className="flex flex-wrap gap-1.5">
                        {review.pros.map((pro, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                            {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-destructive mb-1.5 uppercase tracking-wider">Cons</div>
                      <div className="flex flex-wrap gap-1.5">
                        {review.cons.map((con, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs rounded border border-destructive/20 bg-destructive/10 text-destructive">
                            {con}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 bg-card rounded-xl border border-border border-dashed">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>

      {/* Add Review Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Add Your Review</h2>
              <button 
                onClick={handleCloseDialog}
                className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating *</label>
                <StarRating 
                  value={newReview.rating} 
                  onChange={(val) => setNewReview({ ...newReview, rating: val })} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review Title *</label>
                <Input
                  placeholder="e.g., Great Experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Comment *</label>
                <textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pros (comma-separated)</label>
                <Input
                  placeholder="e.g., Great team, Good pay, Remote work"
                  value={newReview.pros}
                  onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cons (comma-separated)</label>
                <Input
                  placeholder="e.g., Long hours, Poor management"
                  value={newReview.cons}
                  onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-card flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseDialog} className="border-border hover:bg-accent">
                Cancel
              </Button>
              <Button onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;
