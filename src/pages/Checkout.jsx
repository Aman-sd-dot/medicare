import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../store/orderSlice.js';
import { fetchMyPrescriptions, uploadPrescriptionFile } from '../store/prescriptionSlice.js';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Truck, 
  FileText, 
  UploadCloud, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const { items, subtotal, deliveryCharges, tax, total, needsPrescription } = useSelector((state) => state.cart);
  const { prescriptions, uploading: rxUploading } = useSelector((state) => state.prescriptions);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  // Address State (prefill with user's saved data if present)
  const [name, setName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Prescription selection state
  const [selectedRxId, setSelectedRxId] = useState('');
  const [rxFile, setRxFile] = useState(null);
  const [rxComments, setRxComments] = useState('');
  const [rxUploadSuccess, setRxUploadSuccess] = useState(false);
  const [rxError, setRxError] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');

  // Transaction processing modal simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    if (token) {
      dispatch(fetchMyPrescriptions(token));
    }
  }, [dispatch, token, items, navigate]);

  // Handle uploading prescription file immediately
  const handleRxUpload = async (e) => {
    e.preventDefault();
    setRxError('');
    if (!rxFile) {
      setRxError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', rxFile);
    formData.append('comments', rxComments);

    try {
      const action = await dispatch(uploadPrescriptionFile({ formData, token }));
      if (uploadPrescriptionFile.fulfilled.match(action)) {
        setSelectedRxId(action.payload._id);
        setRxUploadSuccess(true);
        setRxFile(null);
        setRxComments('');
        // Reload prescription lists
        dispatch(fetchMyPrescriptions(token));
      } else {
        setRxError(action.payload || 'Upload failed');
      }
    } catch (err) {
      setRxError('Network error uploading file');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (needsPrescription && !selectedRxId) {
      alert('Error: A valid prescription must be linked for Schedule H/H1 clinical orders.');
      return;
    }

    // Prepare checkout data
    const orderData = {
      items: items.map(item => ({
        medicineId: item.medicineId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: { name, street, city, state, zipCode, phone },
      paymentDetails: {
        method: paymentMethod,
        transactionId: paymentMethod !== 'cod' ? 'TXN' + Math.random().toString(36).substring(2, 11).toUpperCase() : ''
      },
      prescriptionId: selectedRxId || ''
    };

    // Simulate payment transaction steps
    setIsProcessing(true);
    if (paymentMethod === 'cod') {
      setProcessingStep('Registering delivery address...');
      setTimeout(async () => {
        const action = await dispatch(placeOrder({ orderData, token }));
        setIsProcessing(false);
        if (placeOrder.fulfilled.match(action)) {
          navigate(`/order-tracking/${action.payload._id}`);
        } else {
          alert(action.payload || 'Order failed');
        }
      }, 1500);
    } else {
      setProcessingStep('Connecting to secure payment gateway...');
      setTimeout(() => {
        setProcessingStep('Verifying card/UPI funds...');
        setTimeout(() => {
          setProcessingStep('Securing transactional receipt...');
          setTimeout(async () => {
            const action = await dispatch(placeOrder({ orderData, token }));
            setIsProcessing(false);
            if (placeOrder.fulfilled.match(action)) {
              navigate(`/order-tracking/${action.payload._id}`);
            } else {
              alert(action.payload || 'Transaction failed');
            }
          }, 1000);
        }, 1000);
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* PROCESSING MODAL OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Processing Order</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">{processingStep}</p>
            </div>
            <div className="flex justify-center text-[10px] text-slate-400 font-semibold space-x-1.5 uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>PCI-DSS SSL Encrypted Gateway</span>
            </div>
          </div>
        </div>
      )}

      <Link to="/cart" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={16} className="mr-1.5" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mb-8 tracking-tight">Checkout Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            
            {/* 1. SHIPPING ADDRESS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Truck size={18} className="mr-2 text-emerald-600" /> Shipping Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9988776655"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat 405, Building 4B, Green Valley"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Delhi"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Pincode</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="110025"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PRESCRIPTION LINKING (Conditional) */}
            {needsPrescription && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <FileText size={18} className="mr-2 text-amber-500" /> Link Clinical Prescription
                </h3>

                {/* Status indicator */}
                {selectedRxId ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-200/50 rounded-2xl text-xs flex items-center justify-between font-semibold">
                    <span className="flex items-center"><CheckCircle size={16} className="mr-1.5 text-emerald-500" /> Prescription linked successfully! (ID: {selectedRxId.substring(0, 8).toUpperCase()})</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedRxId('')} 
                      className="text-[10px] text-red-500 hover:underline ml-2"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-955/10 text-amber-700 dark:text-amber-450 border border-amber-200/50 rounded-2xl text-xs flex items-start space-x-2">
                    <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                    <span>
                      <strong>Prescription Needed:</strong> This order contains Schedule H/H1 items. Please select a previously uploaded prescription or upload a new one below.
                    </span>
                  </div>
                )}

                {/* Pre-uploaded Selection list */}
                {prescriptions.length > 0 && !selectedRxId && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Choose from Saved Prescriptions</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {prescriptions.map((rx) => (
                        <label
                          key={rx._id}
                          className={`p-3 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                            selectedRxId === rx._id 
                              ? 'border-emerald-500 bg-emerald-50/30' 
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 text-xs">
                            <input
                              type="radio"
                              name="prescriptionSelect"
                              checked={selectedRxId === rx._id}
                              onChange={() => setSelectedRxId(rx._id)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <p className="font-semibold text-slate-750 dark:text-slate-200">Prescription - {rx._id.substring(0, 8).toUpperCase()}</p>
                              <p className="text-[10px] text-slate-400">Uploaded on {new Date(rx.createdAt).toLocaleDateString()} | Status: <span className="capitalize font-bold">{rx.status}</span></p>
                            </div>
                          </div>
                          <a href={rx.imageUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-bold hover:underline">View Image</a>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New form widget */}
                {!selectedRxId && (
                  <div className="border border-dashed border-slate-250 dark:border-slate-700 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                    <h4 className="text-xs font-bold text-slate-650 dark:text-slate-200">Upload New Prescription File</h4>
                    {rxError && <p className="text-xs text-red-650">⚠️ {rxError}</p>}
                    {rxUploadSuccess && <p className="text-xs text-emerald-650">🎉 Uploaded! Linked automatically.</p>}

                    <div className="grid grid-cols-1 gap-3">
                      {/* File select */}
                      <div className="flex items-center space-x-3">
                        <label className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl cursor-pointer text-xs font-bold hover:bg-slate-50 flex items-center space-x-2 text-slate-700 dark:text-slate-350">
                          <UploadCloud size={16} className="text-slate-400" />
                          <span>Choose PDF or Image</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setRxFile(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                          {rxFile ? rxFile.name : 'No file selected'}
                        </span>
                      </div>

                      {/* Comments */}
                      <input
                        type="text"
                        value={rxComments}
                        onChange={(e) => setRxComments(e.target.value)}
                        placeholder="Add remarks (optional, e.g. Doctor name)"
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />

                      <button
                        type="button"
                        onClick={handleRxUpload}
                        disabled={rxUploading || !rxFile}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                      >
                        {rxUploading ? 'Uploading file...' : 'Upload & Link Prescription'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 3. SIMULATED PAYMENT SELECTION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <CreditCard size={18} className="mr-2 text-emerald-600" /> Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* COD */}
                <label className={`p-4 border rounded-2xl flex items-center space-x-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-400">Pay cash upon delivery</p>
                  </div>
                </label>

                {/* UPI */}
                <label className={`p-4 border rounded-2xl flex items-center space-x-3 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">UPI / QR Code</p>
                    <p className="text-[10px] text-slate-400">Pay via GPay/PhonePe</p>
                  </div>
                </label>

                {/* Card */}
                <label className={`p-4 border rounded-2xl flex items-center space-x-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="paymentMode"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400">Visa, MasterCard, Rupay</p>
                  </div>
                </label>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="space-y-1 w-full">
                      <label className="text-xs font-semibold text-slate-500">UPI ID</label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis"
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="flex-shrink-0 text-center text-slate-400 border border-slate-200 dark:border-slate-800 p-2 rounded-xl bg-white dark:bg-slate-900">
                      <QrCode size={48} className="mx-auto" />
                      <span className="text-[8px] font-bold uppercase block mt-1">Scan QR code</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4321 0987 6543 2100"
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">CVV / CVN</label>
                      <input
                        type="password"
                        required
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="•••"
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-start space-x-2 text-xs text-slate-500 leading-normal">
              <input type="checkbox" required className="mt-0.5 text-emerald-600 focus:ring-emerald-500" />
              <span>
                I agree to the e-pharmacy terms and conditions, and declare that the patient information and prescription details linked are completely authentic.
              </span>
            </div>

            <button
              type="submit"
              disabled={orderLoading || (needsPrescription && !selectedRxId)}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Order & Pay Rs. {total.toFixed(2)}
            </button>

          </form>
        </div>

        {/* Right column: Items summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              Cart Items ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
            
            {/* Items list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.medicineId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 max-w-[150px] line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} x Rs. {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-850 dark:text-slate-100">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charges</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deliveryCharges === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `Rs. ${deliveryCharges.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (GST 12%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. {tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-slate-850 dark:text-slate-100 pt-2 text-sm border-t border-dashed border-slate-200 dark:border-slate-800">
                <span>Grand Total</span>
                <span className="text-emerald-600 dark:text-emerald-450">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] text-slate-500 leading-normal flex items-start space-x-2">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>SSL secure checkouts:</strong> Medicare Pharma guarantees original medicines from verified pharmaceutical warehouses.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
