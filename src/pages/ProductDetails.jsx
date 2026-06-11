import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicineDetails, clearCurrentMedicine, addReview } from '../store/medicineSlice.js';
import { addToCart } from '../store/cartSlice.js';
import { toggleWishlist } from '../store/authSlice.js';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  FileText, 
  AlertTriangle, 
  Info,
  Clock,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { currentMedicine, relatedMedicines, reviews, detailLoading, error } = useSelector((state) => state.medicines);

  useEffect(() => {
    dispatch(fetchMedicineDetails(id));
    return () => {
      dispatch(clearCurrentMedicine());
    };
  }, [dispatch, id]);

  const isWishlisted = user?.wishlist?.includes(id);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(id));
    await fetch(`/api/auth/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ medicineId: id })
    });
  };

  const handleAddToCart = () => {
    if (!currentMedicine) return;
    dispatch(addToCart({
      medicineId: currentMedicine._id,
      name: currentMedicine.name,
      price: currentMedicine.price,
      requiresPrescription: currentMedicine.requiresPrescription,
      imageUrl: currentMedicine.imageUrl,
      stock: currentMedicine.stock
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!reviewComment.trim()) {
      setReviewError('Please write a comment');
      return;
    }

    try {
      const action = await dispatch(addReview({
        medicineId: id,
        reviewData: { rating: reviewRating, comment: reviewComment },
        token
      }));

      if (addReview.rejected.match(action)) {
        setReviewError(action.payload || 'Failed to submit review');
      } else {
        setReviewSuccess(true);
        setReviewComment('');
      }
    } catch (err) {
      setReviewError('Network error');
    }
  };

  if (detailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 mt-4">Loading medicine specifications...</p>
      </div>
    );
  }

  if (error || !currentMedicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <AlertTriangle size={48} className="text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold">Failed to load medicine</h2>
        <p className="text-sm text-slate-500">{error || 'The medicine profile is unavailable.'}</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. Main Columns (Image & Details) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
        
        {/* Left: Product Image */}
        <div className="relative flex justify-center items-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 h-[350px] sm:h-[450px] overflow-hidden border border-slate-100 dark:border-slate-800/80">
          <img
            src={currentMedicine.imageUrl}
            alt={currentMedicine.name}
            className="max-h-full max-w-full object-contain rounded-xl shadow-sm hover:scale-105 transition-transform"
          />
          {currentMedicine.requiresPrescription && (
            <span className="absolute top-4 left-4 flex items-center px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md">
              <FileText size={14} className="mr-1" /> {currentMedicine.scheduleType || 'Rx Required'}
            </span>
          )}
        </div>

        {/* Right: Buy Area */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-1">
              {currentMedicine.manufacturer}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              {currentMedicine.name}
            </h1>
            {currentMedicine.genericName && (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1 font-medium">
                Active Ingredient: {currentMedicine.genericName}
              </p>
            )}

            {/* Rating block */}
            <div className="flex items-center space-x-2.5 mt-3">
              <div className="flex items-center text-amber-500">
                {[...Array(Math.round(currentMedicine.rating))].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
                {[...Array(5 - Math.round(currentMedicine.rating))].map((_, i) => (
                  <Star key={i} size={16} className="text-slate-200 dark:text-slate-705" />
                ))}
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1.5">
                  {currentMedicine.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-400 font-medium">({currentMedicine.reviewsCount} patient reviews)</span>
            </div>

            {/* Prescription Alert Banner */}
            {currentMedicine.requiresPrescription && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-450 leading-relaxed flex items-start space-x-2">
                <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Schedule H/H1 Regulatory warning:</strong> You must upload a valid doctor prescription during checkout to purchase this medicine. Our pharmacists will review it prior to shipment.
                </span>
              </div>
            )}
          </div>

          {/* Pricing & Cart Action */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                Rs. {currentMedicine.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">(inclusive of GST/taxes)</span>
            </div>

            {/* Stock Notification */}
            {currentMedicine.stock === 0 ? (
              <span className="inline-flex items-center px-3 py-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg">
                <AlertTriangle size={14} className="mr-1" /> Out of Stock
              </span>
            ) : currentMedicine.stock < 15 ? (
              <span className="inline-flex items-center px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-lg">
                <AlertTriangle size={14} className="mr-1" /> Low Stock: Only {currentMedicine.stock} left in inventory
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg">
                In Stock
              </span>
            )}

            {/* Controls */}
            {currentMedicine.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-stretch pt-2">
                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" /> Add to Shopping Cart
                </button>

                {/* Wishlist button */}
                <button
                  onClick={handleWishlistToggle}
                  className="px-4 py-3.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-650 dark:text-slate-300 transition-colors flex items-center justify-center"
                >
                  <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Tabs: Usage, Benefits, Side Effects */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          {[
            { id: 'info', name: 'Information' },
            { id: 'usage', name: 'Usage instructions' },
            { id: 'benefits', name: 'Clinical Benefits' },
            { id: 'sideEffects', name: 'Side Effects' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-grow sm:flex-initial text-center px-6 py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-450 dark:text-emerald-450 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 text-sm text-slate-650 dark:text-slate-350 leading-relaxed space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Product Description</h3>
              <p>{currentMedicine.description || 'No description provided.'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Manufacturer</span>
                  <span className="text-sm font-semibold text-slate-750 dark:text-slate-200">{currentMedicine.manufacturer}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Therapeutic Class</span>
                  <span className="text-sm font-semibold text-slate-750 dark:text-slate-200">{currentMedicine.scheduleType || 'General OTC'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Dosage & Directions</h3>
              <p>{currentMedicine.usageInstructions || 'Take strictly under medical advice.'}</p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Indications & Efficacy</h3>
              <p>{currentMedicine.benefits || 'Clinical outcomes depends on dosage instructions.'}</p>
            </div>
          )}

          {activeTab === 'sideEffects' && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Precautions & Warnings</h3>
              <p className="text-red-600 dark:text-red-400 font-medium">Please review these warnings:</p>
              <p>{currentMedicine.sideEffects || 'Mild symptoms like dry mouth or headaches can occur.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. REVIEWS & SUBMISSION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <h2 className="text-2xl font-bold text-slate-850 dark:text-slate-100 flex items-center">
          <MessageSquare size={24} className="mr-2 text-emerald-600" /> Patient Feedback
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No patient reviews submitted yet for this medicine. Be the first to leave a feedback!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    {rev.comment}
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Review form */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Write a Review</h3>
                
                {reviewError && <p className="text-xs text-red-650">⚠️ {reviewError}</p>}
                {reviewSuccess && <p className="text-xs text-emerald-650">🎉 Review posted successfully!</p>}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Very Good)</option>
                      <option value="3">3 Stars (Good)</option>
                      <option value="2">2 Stars (Fair)</option>
                      <option value="1">1 Star (Poor)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Your Comments</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your dosage experience or results..."
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl text-center space-y-3">
                <Info size={24} className="text-slate-400 mx-auto" />
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Patient Authentication Required</h4>
                <p className="text-[11px] text-slate-500 leading-normal">You must be signed in to submit reviews for this pharmaceutical.</p>
                <Link to="/login" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm">
                  Sign In
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. RELATED PRODUCTS */}
      {relatedMedicines.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Related Healthcare Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedMedicines.map((med) => (
              <ProductCard key={med._id} medicine={med} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
