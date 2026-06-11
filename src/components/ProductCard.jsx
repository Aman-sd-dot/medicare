import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice.js';
import { toggleWishlist } from '../store/authSlice.js';
import { Star, ShoppingCart, Heart, FileText, AlertTriangle } from 'lucide-react';

export default function ProductCard({ medicine }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  
  const isWishlisted = user?.wishlist?.includes(medicine._id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigation to details page if clicking button
    dispatch(addToCart({
      medicineId: medicine._id,
      name: medicine.name,
      price: medicine.price,
      requiresPrescription: medicine.requiresPrescription,
      imageUrl: medicine.imageUrl,
      stock: medicine.stock
    }));
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // prevent navigation
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Simulate toggle in server/store
      dispatch(toggleWishlist(medicine._id));
      
      // Post to server
      await fetch(`/api/auth/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medicineId: medicine._id })
      });
    } catch (err) {
      console.error('Wishlist sync error', err);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between h-full">
      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full glass border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all text-slate-400 hover:text-red-500"
        title="Add to Wishlist"
      >
        <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
      </button>

      {/* Main Image Link */}
      <Link to={`/medicine/${medicine._id}`} className="block flex-shrink-0 relative">
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Prescription Required overlay */}
        {medicine.requiresPrescription && (
          <span className="absolute bottom-2 left-2 flex items-center px-2 py-1 bg-amber-500/90 text-slate-950 font-bold text-xs rounded-md shadow-sm">
            <FileText size={12} className="mr-1" /> {medicine.scheduleType || 'Rx Required'}
          </span>
        )}
      </Link>

      {/* Info details */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Manufacturer & brand */}
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            {medicine.manufacturer}
          </span>
          
          {/* Name & Generic Name */}
          <Link to={`/medicine/${medicine._id}`} className="block">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 text-base line-clamp-1">
              {medicine.name}
            </h3>
            {medicine.genericName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                {medicine.genericName}
              </p>
            )}
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-semibold ml-1">{medicine.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400">({medicine.reviewsCount} reviews)</span>
          </div>
        </div>

        <div className="mt-4">
          {/* Stock Notification */}
          {medicine.stock === 0 ? (
            <div className="text-xs text-red-500 font-semibold mb-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" /> Out of Stock
            </div>
          ) : medicine.stock < 15 ? (
            <div className="text-xs text-amber-500 font-medium mb-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" /> Low Stock: Only {medicine.stock} left
            </div>
          ) : (
            <div className="text-xs text-emerald-500 font-medium mb-2">
              In Stock
            </div>
          )}

          {/* Pricing & Add to Cart button */}
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Price</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Rs. {medicine.price.toFixed(2)}
              </span>
            </div>

            {medicine.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-medium text-sm flex items-center shadow-md active:scale-95 transition-all"
                title="Add to Cart"
              >
                <ShoppingCart size={16} />
              </button>
            ) : (
              <button
                disabled
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-medium text-sm cursor-not-allowed"
                title="Out of Stock"
              >
                <ShoppingCart size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
