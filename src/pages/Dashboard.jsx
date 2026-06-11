import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/orderSlice.js';
import { fetchMyPrescriptions } from '../store/prescriptionSlice.js';
import { toggleWishlist, fetchProfile } from '../store/authSlice.js';
import { fetchMedicines } from '../store/medicineSlice.js';
import { 
  User, 
  ShoppingBag, 
  FileText, 
  Heart, 
  MapPin, 
  ArrowRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  // Profile Form State
  const { token, user } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { prescriptions, loading: rxLoading } = useSelector((state) => state.prescriptions);
  const { medicines } = useSelector((state) => state.medicines);

  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchMyOrders(token));
    dispatch(fetchMyPrescriptions(token));
    dispatch(fetchMedicines({ limit: 100 })); // load medicines to search wishlist items
  }, [dispatch, token, navigate]);

  // Sync tab with URL query parameter
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/auth/me', {
        // We will simulate user address saving on backend by editing model
        // Let's implement an endpoint for updating user profile or mock it here:
        // backend/src/controllers/authController.js currently doesn't have a PUT me, 
        // let's build it dynamically or simulate updating. To make it complete, 
        // we can fetch from endpoint if we implement it. Let's do a post here!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone,
          address: { street, city, state, zipCode, country: 'India' }
        })
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        dispatch(fetchProfile()); // reload store state
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Find wishlist products
  const wishlistItems = medicines.filter(med => user?.wishlist?.includes(med._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mb-8 tracking-tight">Patient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column Tabs Selector */}
        <aside className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', name: 'Profile & Address', icon: <User size={18} /> },
            { id: 'orders', name: 'My Orders', icon: <ShoppingBag size={18} /> },
            { id: 'prescriptions', name: 'My Prescriptions', icon: <FileText size={18} /> },
            { id: 'wishlist', name: 'My Wishlist', icon: <Heart size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon} <span>{tab.name}</span>
            </button>
          ))}
        </aside>

        {/* Right Column Body */}
        <main className="md:col-span-3">
          
          {/* PROFILE & ADDRESS TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 flex items-center">
                <MapPin size={20} className="mr-2 text-emerald-600" /> Patient Demographics & Delivery Address
              </h3>
              
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
                  🎉 Profile and delivery address updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Contact phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9988776655"
                      className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat 405, Green Valley Apartments"
                      className="w-full text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New Delhi"
                      className="w-full text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Delhi"
                        className="w-full text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">ZIP Pincode</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="110025"
                        className="w-full text-xs bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}

          {/* MY ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 flex items-center">
                <ShoppingBag size={20} className="mr-2 text-emerald-600" /> Order History
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-slate-500 text-xs italic">You have not placed any orders yet.</p>
                  <Link to="/catalog" className="text-xs text-emerald-600 font-bold hover:underline">Go to Shop</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Order INV-{order._id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            order.status === 'prescription_verification' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()} | {order.items.length} items</p>
                        <p className="text-xs font-bold text-emerald-600">Rs. {order.total.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Link
                          to={`/order-tracking/${order._id}`}
                          className="flex-grow sm:flex-grow-0 text-center px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Track
                        </Link>
                        <a
                          href={`/api/orders/${order._id}/invoice`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-grow sm:flex-grow-0 text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
                        >
                          <Download size={14} /> <span>Invoice</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY PRESCRIPTIONS TAB */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 flex items-center">
                <FileText size={20} className="mr-2 text-emerald-600" /> Prescriptions History
              </h3>

              {prescriptions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-xs italic">No prescriptions uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((rx) => (
                    <div key={rx._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-750 dark:text-slate-200">Prescription - {rx._id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-400">Uploaded: {new Date(rx.createdAt).toLocaleDateString()}</p>
                        {rx.comments && <p className="text-[10px] italic text-slate-500">Remarks: "{rx.comments}"</p>}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${
                          rx.status === 'approved' ? 'bg-green-100 text-green-700' :
                          rx.status === 'rejected' ? 'bg-red-100 text-red-750' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {rx.status}
                        </span>
                        <a href={rx.imageUrl} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">View Image</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 flex items-center">
                <Heart size={20} className="mr-2 text-red-500" /> My Saved Wishlist
              </h3>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-xs italic">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((med) => (
                    <div key={med._id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="flex items-center space-x-3">
                        <img src={med.imageUrl} alt={med.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <Link to={`/medicine/${med._id}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600">{med.name}</Link>
                          <p className="font-bold text-emerald-600 mt-0.5">Rs. {med.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          dispatch(toggleWishlist(med._id));
                          await fetch(`/api/auth/wishlist`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ medicineId: med._id })
                          });
                        }}
                        className="p-2 text-slate-400 hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
