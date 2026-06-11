import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice.js';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, FileText } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, subtotal, deliveryCharges, tax, total, needsPrescription } = useSelector((state) => state.cart);

  const handleQtyChange = (medicineId, currentQty, stock, increment) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    if (newQty >= 1 && newQty <= stock) {
      dispatch(updateQuantity({ medicineId, quantity: newQty }));
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto shadow-sm">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Add medicines or supplements from our catalog to get started with your clinical order.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
              
              {items.map((item) => (
                <div key={item.medicineId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-150 dark:border-slate-800"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm hover:text-emerald-600">
                        <Link to={`/medicine/${item.medicineId}`}>{item.name}</Link>
                      </h3>
                      {item.requiresPrescription && (
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 bg-amber-500/90 text-slate-950 font-bold text-[10px] rounded">
                          <FileText size={10} className="mr-1" /> Rx Prescription Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-250 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/60 p-0.5">
                      <button
                        onClick={() => handleQtyChange(item.medicineId, item.quantity, item.stock, false)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.medicineId, item.quantity, item.stock, true)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center space-x-6">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(item.medicineId))}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350"
          >
            <ArrowLeft size={16} className="mr-1.5" /> Continue Shopping
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              Order Summary
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-205">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-slate-800 dark:text-slate-205">
                  {deliveryCharges === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `Rs. ${deliveryCharges.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (GST 12%)</span>
                <span className="font-semibold text-slate-850 dark:text-slate-205">Rs. {tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm font-bold text-slate-850 dark:text-slate-100 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Total Price</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400">Rs. {total.toFixed(2)}</span>
            </div>

            {/* Prescription Notification */}
            {needsPrescription && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-450 leading-relaxed rounded-2xl flex items-start space-x-2">
                <FileText size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Schedule H warning:</strong> You have prescription-only medicines in your cart. You will be prompted to select or upload a prescription file on the next screen.
                </span>
              </div>
            )}

            {/* Checkout Trigger */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center"
            >
              Proceed to Checkout <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
