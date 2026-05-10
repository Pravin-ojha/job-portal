import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Stack,
  Chip,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Reviews & Ratings
      </Typography>

      {/* Add Review Button */}
      {allowReview && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ mb: 3 }}
        >
          Add Review
        </Button>
      )}

      {/* Reviews List */}
      <Stack spacing={2}>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent>
                <Stack spacing={2}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {review.reviewer?.firstName?.[0]}
                        {review.reviewer?.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {review.reviewer?.firstName} {review.reviewer?.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>

                  {/* Title */}
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {review.title}
                  </Typography>

                  {/* Comment */}
                  <Typography variant="body2" color="textSecondary">
                    {review.comment}
                  </Typography>

                  {/* Pros and Cons */}
                  {review.pros && review.pros.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Pros:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        {review.pros.map((pro, idx) => (
                          <Chip
                            key={idx}
                            label={pro}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Cons:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        {review.cons.map((con, idx) => (
                          <Chip
                            key={idx}
                            label={con}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No reviews yet. Be the first to review!
          </Typography>
        )}
      </Stack>

      {/* Add Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            {/* Rating */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rating *
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, value) =>
                  setNewReview({ ...newReview, rating: value })
                }
                size="large"
              />
            </Box>

            {/* Title */}
            <TextField
              label="Review Title *"
              placeholder="e.g., Great Experience"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              fullWidth
              size="small"
            />

            {/* Comment */}
            <TextField
              label="Your Comment *"
              placeholder="Share your experience..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              size="small"
            />

            {/* Pros */}
            <TextField
              label="Pros (comma-separated)"
              placeholder="e.g., Great team, Good pay, Remote work"
              value={newReview.pros}
              onChange={(e) =>
                setNewReview({ ...newReview, pros: e.target.value })
              }
              fullWidth
              size="small"
            />

            {/* Cons */}
            <TextField
              label="Cons (comma-separated)"
              placeholder="e.g., Long hours, Poor management"
              value={newReview.cons}
              onChange={(e) =>
                setNewReview({ ...newReview, cons: e.target.value })
              }
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color="primary"
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewComponent;
