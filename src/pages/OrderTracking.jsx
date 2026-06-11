import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../store/orderSlice.js';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Package, FileCheck } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { currentOrder, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrderDetails({ id, token }));
    }
  }, [dispatch, id, token]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 mt-4">Retrieving order tracking info...</p>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500 text-sm">Order profile unavailable. Please check order history.</p>
        <Link to="/dashboard?tab=orders" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Determine active steps based on order status
  const statuses = ['pending', 'prescription_verification', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statuses.indexOf(currentOrder.status);

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order details.', statusKey: 'pending' },
    { label: 'Rx Verified', desc: 'Pharmacist approved prescription files.', statusKey: 'prescription_verification', isRx: true },
    { label: 'Processing', desc: 'Medicines are being packed in sterile facilities.', statusKey: 'processing' },
    { label: 'Shipped', desc: 'Order is in transit with logistics courier.', statusKey: 'shipped' },
    { label: 'Delivered', desc: 'Order received at delivery location.', statusKey: 'delivered' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/dashboard?tab=orders" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-emerald-600">
        <ArrowLeft size={16} className="mr-1.5" /> Back to Dashboard
      </Link>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracking Reference</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Order INV-{currentOrder._id.substring(0, 8).toUpperCase()}</h2>
          <p className="text-xs text-slate-500">Placed: {new Date(currentOrder.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450">Rs. {currentOrder.total.toFixed(2)}</span>
          <p className="text-[10px] text-slate-500 capitalize">{currentOrder.paymentDetails.method} - {currentOrder.paymentDetails.status}</p>
        </div>
      </div>

      {/* Visual Timeline Tracking */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center border-b pb-2">
          <Package size={18} className="mr-2 text-emerald-600" /> Shipment Progress
        </h3>

        {/* Vertical timeline */}
        <div className="space-y-8 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
          
          {steps.map((step, index) => {
            // Check if step is active or completed
            let isCompleted = false;
            let isActive = false;
            let isRxFailed = false;

            if (currentOrder.status === 'cancelled') {
              // Mark cancelled state
              isRxFailed = step.statusKey === 'prescription_verification' && currentOrder.prescriptionId !== '';
            } else {
              // normal track
              if (currentOrder.status === 'prescription_verification' && step.statusKey === 'prescription_verification') {
                isActive = true;
              } else if (currentStatusIndex >= statuses.indexOf(step.statusKey)) {
                isCompleted = true;
              } else if (currentStatusIndex === statuses.indexOf(step.statusKey) - 1) {
                // If it is the next step, mark active pulse
                isActive = true;
              }
            }

            // Skip prescription verification step if order doesn't have a linked prescription
            if (step.isRx && !currentOrder.prescriptionId) {
              return null;
            }

            return (
              <div key={index} className="flex items-start space-x-4 relative z-10">
                {/* Node icon indicator */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                    : isRxFailed 
                    ? 'bg-red-500 border-red-500 text-white shadow-md'
                    : isActive 
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600 animate-pulse-soft scale-110' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : step.isRx ? <FileCheck size={16} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4 className={`font-bold text-sm ${
                    isCompleted || isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed">
                    {isRxFailed ? 'The prescription failed pharmacist review checks.' : step.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Address details card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center">
            <MapPin size={16} className="mr-1.5 text-emerald-600" /> Delivery Location
          </h4>
          <div className="space-y-1 text-slate-650 dark:text-slate-400">
            <p className="font-bold text-slate-800 dark:text-slate-200">{currentOrder.shippingAddress.name}</p>
            <p>{currentOrder.shippingAddress.street}</p>
            <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.zipCode}</p>
            <p className="pt-1">Phone: {currentOrder.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Support card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-3 text-xs justify-between flex flex-col">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center">
              <ShieldCheck size={16} className="mr-1.5 text-emerald-600" /> Pharmacist Assured
            </h4>
            <p className="text-slate-500 leading-relaxed mt-1">
              Have questions regarding your clinical dosage? Connect with our team of support pharmacists via the chat icon below.
            </p>
          </div>
          <Link
            to="/catalog"
            className="text-[11px] font-bold text-emerald-650 hover:underline block pt-2"
          >
            Browse other wellness items
          </Link>
        </div>
      </div>

    </div>
  );
}
