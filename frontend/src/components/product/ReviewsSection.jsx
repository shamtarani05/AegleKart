import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import styles from '../../styles/medicinedescriptionpage.module.css';

export default function ReviewsSection({ productData }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 5
  });

  useEffect(() => {
    // Fetch reviews when product data is loaded
    const fetchReviews = async () => {
      if (!productData || !productData._id) return;
      
      try {
        setReviewsLoading(true);
        const { currentPage, limit } = reviewsPagination;
        const response = await fetch(
          `http://localhost:3000/reviews/product/${productData._id}?page=${currentPage}&limit=${limit}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        
        const data = await response.json();
        setReviews(data.reviews || []);
        setReviewsPagination({
          ...reviewsPagination,
          totalPages: data.totalPages || 1,
          totalReviews: data.totalReviews || 0
        });
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productData, reviewsPagination.currentPage, reviewsPagination.limit]);

  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setUserReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setUserReview(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle change page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > reviewsPagination.totalPages) return;
    setReviewsPagination({
      ...reviewsPagination,
      currentPage: newPage
    });
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);
    
    // Validate form
    if (!userReview.userName.trim()) {
      setReviewError("Please enter your name");
      return;
    }
    if (!userReview.title.trim()) {
      setReviewError("Please enter a review title");
      return;
    }
    if (!userReview.comment.trim()) {
      setReviewError("Please enter your review comments");
      return;
    }
    
    try {
      setReviewSubmitting(true);
      
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productData._id,
          ...userReview
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
      
      // Reset form and show success message
      setUserReview({
        userName: '',
        rating: 5,
        title: '',
        comment: ''
      });
      
      setReviewSuccess(true);
      
      // Refresh the first page of reviews after adding new one
      setReviewsPagination({
        ...reviewsPagination,
        currentPage: 1
      });
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className={styles.reviewsSection}>
      <div className={styles.reviewsHeader}>
        <div className={styles.reviewsOverview}>
          <h3 className={styles.tabContentTitle}>Customer Reviews</h3>
          {productData?.rating && productData?.reviewCount ? (
            <div className={styles.ratingOverview}>
              <div className={styles.ratingStars}>
                <div className={styles.ratingValue}>{productData.rating}</div>
                <div className={styles.starsDisplay}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star}
                      size={18} 
                      fill={star <= Math.round(productData.rating) ? "#FFB400" : "none"}
                      color={star <= Math.round(productData.rating) ? "#FFB400" : "#D1D1D1"}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.reviewsCount}>
                Based on {productData.reviewCount} {productData.reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          ) : (
            <div className={styles.noReviews}>
              No reviews yet. Be the first to review this product.
            </div>
          )}
        </div>
        
        <button 
          className={styles.writeReviewButton}
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          <MessageSquare size={16} />
          {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {showReviewForm && (
        <div className={styles.reviewFormContainer}>
          <h4 className={styles.reviewFormTitle}>Write Your Review</h4>
          
          {reviewSuccess && (
            <div className={styles.reviewSuccessMessage}>
              Your review has been submitted successfully! Thank you for your feedback.
            </div>
          )}
          
          {reviewError && (
            <div className={styles.reviewErrorMessage}>
              {reviewError}
            </div>
          )}
          
          <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="userName" className={styles.formLabel}>Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                className={styles.formInput}
                value={userReview.userName}
                onChange={handleReviewChange}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rating</label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star}
                    size={24} 
                    fill={star <= userReview.rating ? "#FFB400" : "none"}
                    color={star <= userReview.rating ? "#FFB400" : "#D1D1D1"}
                    className={styles.starInput}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>Review Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className={styles.formInput}
                value={userReview.title}
                onChange={handleReviewChange}
                placeholder="Summarize your review"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="comment" className={styles.formLabel}>Review Comment</label>
              <textarea
                id="comment"
                name="comment"
                className={styles.formTextarea}
                value={userReview.comment}
                onChange={handleReviewChange}
                placeholder="Tell others about your experience with this product"
                rows={4}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitReviewButton}
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      <div className={styles.reviewsList}>
        {reviewsLoading ? (
          <div className={styles.reviewsLoading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAuthor}>{review.userName}</div>
                  <div className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star}
                      size={16} 
                      fill={star <= review.rating ? "#FFB400" : "none"}
                      color={star <= review.rating ? "#FFB400" : "#D1D1D1"}
                    />
                  ))}
                  {review.verified && (
                    <span className={styles.verifiedBadge}>Verified Purchase</span>
                  )}
                </div>
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
            
            {/* Pagination controls */}
            {reviewsPagination.totalPages > 1 && (
              <div className={styles.reviewsPagination}>
                <button 
                  onClick={() => handlePageChange(reviewsPagination.currentPage - 1)}
                  disabled={reviewsPagination.currentPage === 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                
                <div className={styles.paginationInfo}>
                  Page {reviewsPagination.currentPage} of {reviewsPagination.totalPages}
                </div>
                
                <button 
                  onClick={() => handlePageChange(reviewsPagination.currentPage + 1)}
                  disabled={reviewsPagination.currentPage === reviewsPagination.totalPages}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noReviewsYet}>
            No reviews yet for this product.
          </div>
        )}
      </div>
    </div>
  );
}
