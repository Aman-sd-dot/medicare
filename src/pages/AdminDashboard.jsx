import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAdminAnalytics, 
  fetchAllOrdersAdmin, 
  updateOrderStatusAdmin 
} from '../store/orderSlice.js';
import { 
  fetchAllPrescriptionsAdmin, 
  verifyPrescriptionAdmin 
} from '../store/prescriptionSlice.js';
import { 
  fetchMedicines, 
  createMedicineAdmin, 
  updateMedicineAdmin, 
  deleteMedicineAdmin 
} from '../store/medicineSlice.js';
import { 
  TrendingUp, 
  ShoppingBag, 
  FileText, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Package
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const { analytics, orders, analyticsLoading } = useSelector((state) => state.orders);
  const { prescriptions } = useSelector((state) => state.prescriptions);
  const { medicines, categories } = useSelector((state) => state.medicines);

  const [activeTab, setActiveTab] = useState('analytics');

  // Medicine Form Modal State
  const [showMedModal, setShowMedModal] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [medName, setMedName] = useState('');
  const [medGeneric, setMedGeneric] = useState('');
  const [medBrand, setMedBrand] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medPrice, setMedPrice] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medPrescription, setMedPrescription] = useState(false);
  const [medSchedule, setMedSchedule] = useState('OTC');
  const [medManufacturer, setMedManufacturer] = useState('');
  const [medDesc, setMedDesc] = useState('');

  // Prescription Review Remark
  const [rxRemarks, setRxRemarks] = useState({});

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    dispatch(fetchAdminAnalytics(token));
    dispatch(fetchAllOrdersAdmin(token));
    dispatch(fetchAllPrescriptionsAdmin(token));
    dispatch(fetchMedicines({ limit: 100 })); // load all medicines
  }, [dispatch, token, user, navigate]);

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    const medicineData = {
      name: medName,
      genericName: medGeneric,
      brandName: medBrand,
      categoryId: medCategory || categories[0]?._id,
      price: parseFloat(medPrice),
      stock: parseInt(medStock),
      requiresPrescription: medPrescription,
      scheduleType: medSchedule,
      manufacturer: medManufacturer,
      description: medDesc
    };

    if (editingMedId) {
      await dispatch(updateMedicineAdmin({ id: editingMedId, medicineData, token }));
    } else {
      await dispatch(createMedicineAdmin({ medicineData, token }));
    }
    
    // Close modal & reset
    setShowMedModal(false);
    resetMedForm();
    dispatch(fetchMedicines({ limit: 100 }));
    dispatch(fetchAdminAnalytics(token));
  };

  const handleEditMed = (med) => {
    setEditingMedId(med._id);
    setMedName(med.name);
    setMedGeneric(med.genericName);
    setMedBrand(med.brandName);
    setMedCategory(med.categoryId);
    setMedPrice(med.price.toString());
    setMedStock(med.stock.toString());
    setMedPrescription(med.requiresPrescription);
    setMedSchedule(med.scheduleType || 'OTC');
    setMedManufacturer(med.manufacturer);
    setMedDesc(med.description);
    setShowMedModal(true);
  };

  const handleDeleteMed = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      await dispatch(deleteMedicineAdmin({ id, token }));
      dispatch(fetchAdminAnalytics(token));
    }
  };

  const resetMedForm = () => {
    setEditingMedId(null);
    setMedName('');
    setMedGeneric('');
    setMedBrand('');
    setMedCategory(categories[0]?._id || '');
    setMedPrice('');
    setMedStock('');
    setMedPrescription(false);
    setMedSchedule('OTC');
    setMedManufacturer('');
    setMedDesc('');
  };

  const handleOrderStatusUpdate = async (id, status) => {
    await dispatch(updateOrderStatusAdmin({ id, statusData: { status }, token }));
    dispatch(fetchAdminAnalytics(token));
  };

  const handlePrescriptionVerify = async (id, status) => {
    const comments = rxRemarks[id] || '';
    await dispatch(verifyPrescriptionAdmin({ id, statusData: { status, comments }, token }));
    // Clear remark input
    setRxRemarks(prev => ({ ...prev, [id]: '' }));
    dispatch(fetchAdminAnalytics(token));
  };

  // Prepare chart data safely
  const salesByClassData = analytics?.categorySales
    ? Object.keys(analytics.categorySales).map(key => ({
        name: key,
        value: analytics.categorySales[key]
      }))
    : [];

  const trendData = [
    { month: 'Jan', Sales: 45000 },
    { month: 'Feb', Sales: 52000 },
    { month: 'Mar', Sales: 61000 },
    { month: 'Apr', Sales: 58000 },
    { month: 'May', Sales: 72000 },
    { month: 'Jun', Sales: analytics?.stats?.totalSales || 75000 }
  ];

  const COLORS = ['#059669', '#0ea5e9', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* 1. MEDICINE CRUD FORM MODAL */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 mb-4">
              {editingMedId ? 'Edit Medicine Profile' : 'Add New Medicine'}
            </h3>

            <form onSubmit={handleMedSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Medicine Name</label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="Paracetamol 650"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Generic Formula Name</label>
                  <input
                    type="text"
                    value={medGeneric}
                    onChange={(e) => setMedGeneric(e.target.value)}
                    placeholder="Acetaminophen"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Brand Name</label>
                  <input
                    type="text"
                    value={medBrand}
                    onChange={(e) => setMedBrand(e.target.value)}
                    placeholder="Crocin"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Category</label>
                  <select
                    value={medCategory}
                    onChange={(e) => setMedCategory(e.target.value)}
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Price (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={medPrice}
                    onChange={(e) => setMedPrice(e.target.value)}
                    placeholder="45.00"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Stock Inventory</label>
                  <input
                    type="number"
                    required
                    value={medStock}
                    onChange={(e) => setMedStock(e.target.value)}
                    placeholder="100"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Schedule Drug Type</label>
                  <select
                    value={medSchedule}
                    onChange={(e) => {
                      setMedSchedule(e.target.value);
                      setMedPrescription(e.target.value !== 'OTC');
                    }}
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  >
                    <option value="OTC">OTC (Over the Counter)</option>
                    <option value="Schedule H">Schedule H (Rx Required)</option>
                    <option value="Schedule H1">Schedule H1 (Rx Required)</option>
                    <option value="Schedule X">Schedule X (Rx Strict)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 font-bold flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={medPrescription}
                      onChange={(e) => setMedPrescription(e.target.checked)}
                      className="mr-2 text-emerald-600 focus:ring-emerald-500"
                    />
                    Requires Prescription
                  </label>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Manufacturer</label>
                  <input
                    type="text"
                    value={medManufacturer}
                    onChange={(e) => setMedManufacturer(e.target.value)}
                    placeholder="GSK Wellness Ltd"
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Description</label>
                  <textarea
                    rows={2}
                    value={medDesc}
                    onChange={(e) => setMedDesc(e.target.value)}
                    placeholder="Therapeutic uses and actions..."
                    className="w-full text-xs bg-slate-50 border p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowMedModal(false); resetMedForm(); }}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {editingMedId ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
          ✙ Admin Dashboard Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">MediCare Pharma clinical analytics and control panel.</p>
      </div>

      {/* 2. OVERVIEW ROW WIDGETS */}
      {analyticsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-205 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-2xl shadow-sm">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Sales</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Rs. {analytics?.stats?.totalSales.toFixed(2)}</span>
            </div>
          </div>

          {/* Orders count */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-sky-100 dark:bg-sky-950/20 text-sky-650 dark:text-sky-450 rounded-2xl shadow-sm">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Orders Placed</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{analytics?.stats?.ordersCount}</span>
            </div>
          </div>

          {/* Pending RX */}
          <div className={`bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm flex items-center space-x-4 transition-colors ${
            analytics?.stats?.pendingPrescriptions > 0 ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20' : 'border-slate-200 dark:border-slate-850'
          }`}>
            <div className={`p-3.5 rounded-2xl shadow-sm ${
              analytics?.stats?.pendingPrescriptions > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Rx Audit</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                {analytics?.stats?.pendingPrescriptions}
                {analytics?.stats?.pendingPrescriptions > 0 && <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
              </span>
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className={`bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm flex items-center space-x-4 transition-colors ${
            analytics?.stats?.lowStockMedicines > 0 ? 'border-red-300 dark:border-red-800/80 bg-red-50/10' : 'border-slate-200 dark:border-slate-850'
          }`}>
            <div className={`p-3.5 rounded-2xl shadow-sm ${
              analytics?.stats?.lowStockMedicines > 0 ? 'bg-red-100 text-red-650' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Warn</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{analytics?.stats?.lowStockMedicines}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TABS SELECTOR */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-1 max-w-md">
        {[
          { id: 'analytics', name: 'Sales Analytics', icon: <TrendingUp size={16} /> },
          { id: 'medicines', name: 'Inventory (Medicines)', icon: <Package size={16} /> },
          { id: 'orders', name: 'Manage Orders', icon: <ShoppingBag size={16} /> },
          { id: 'prescriptions', name: 'Verify Prescriptions', icon: <FileText size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 flex-grow justify-center py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon} <span>{tab.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="min-h-[400px]">
        
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Sales Trend chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center">
                <TrendingUp size={16} className="mr-1.5 text-emerald-600" /> Sales Growth (Monthly)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Sales" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category class chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center">
                <Layers size={16} className="mr-1.5 text-emerald-600" /> Revenue share by Class
              </h3>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByClassData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} interval={0} tickFormatter={(value) => value.split(' ')[0]} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]}>
                      {salesByClassData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'medicines' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-950/20">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Medicine Stocks list</h3>
              <button
                onClick={() => { resetMedForm(); setShowMedModal(true); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-955 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b">
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Schedule</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                  {medicines.map((med) => {
                    const cat = categories.find(c => c._id === med.categoryId);
                    return (
                      <tr key={med._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                          {med.name}
                          {med.genericName && <p className="text-[10px] text-slate-400 font-normal italic mt-0.5">{med.genericName}</p>}
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{cat ? cat.name : 'Unknown'}</td>
                        <td className="p-4 text-right font-semibold">Rs. {med.price.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            med.stock === 0 ? 'bg-red-100 text-red-700' :
                            med.stock < 15 ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {med.stock}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                            med.requiresPrescription ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {med.scheduleType}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2.5">
                            <button
                              onClick={() => handleEditMed(med)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteMed(med._id)}
                              className="p-1.5 text-slate-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-slate-50 dark:bg-slate-950/20">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Customer Orders Manager</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-955 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b">
                    <th className="p-4">INV ID</th>
                    <th className="p-4">Address</th>
                    <th className="p-4 text-right">Total Price</th>
                    <th className="p-4 text-center">Payment Status</th>
                    <th className="p-4 text-center">Shipment State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                        INV-{order._id.substring(0, 8).toUpperCase()}
                        <p className="text-[9px] text-slate-400 font-normal mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-750 dark:text-slate-305">{order.shippingAddress.name}</p>
                        <p className="text-[10px] text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.phone}</p>
                      </td>
                      <td className="p-4 text-right font-semibold">Rs. {order.total.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <select
                          value={order.paymentDetails.status}
                          onChange={(e) => dispatch(updateOrderStatusAdmin({ id: order._id, statusData: { paymentStatus: e.target.value }, token }))}
                          className="bg-slate-50 dark:bg-slate-850 text-[11px] p-1.5 rounded-lg border outline-none font-bold text-slate-700 dark:text-slate-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-850 text-[11px] p-1.5 rounded-lg border outline-none font-bold text-slate-700 dark:text-slate-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="prescription_verification">Rx Review</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            
            {/* Table of Prescriptions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-slate-50 dark:bg-slate-950/20">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Pharmacist Rx Audits</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-955 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b">
                      <th className="p-4">Rx ID</th>
                      <th className="p-4">Patient Info</th>
                      <th className="p-4">Prescription Image</th>
                      <th className="p-4">Pharmacist Remarks</th>
                      <th className="p-4 text-center">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                    {prescriptions.map((rx) => (
                      <tr key={rx._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                        <td className="p-4 font-semibold text-slate-850 dark:text-slate-200">
                          RX-{rx._id.substring(0, 8).toUpperCase()}
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">{new Date(rx.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          {rx.userId}
                          {rx.comments && <p className="text-[10px] text-slate-400 italic mt-0.5">Note: "{rx.comments}"</p>}
                        </td>
                        <td className="p-4">
                          <a 
                            href={rx.imageUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-block border border-slate-200 p-1 bg-white dark:bg-slate-950 rounded-lg hover:scale-105 transition-all"
                          >
                            <img src={rx.imageUrl} alt="Prescription file" className="w-20 h-12 object-cover rounded-md" />
                          </a>
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Add rejection reason or remarks"
                            value={rxRemarks[rx._id] || ''}
                            onChange={(e) => setRxRemarks(prev => ({ ...prev, [rx._id]: e.target.value }))}
                            className="bg-slate-50 border p-2 rounded-xl text-xs w-full min-w-[150px] outline-none"
                          />
                        </td>
                        <td className="p-4 text-center">
                          {rx.status === 'pending' ? (
                            <div className="flex items-center justify-center space-x-2.5">
                              <button
                                onClick={() => handlePrescriptionVerify(rx._id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] flex items-center shadow-sm"
                              >
                                <CheckCircle size={12} className="mr-1" /> Approve
                              </button>
                              <button
                                onClick={() => handlePrescriptionVerify(rx._id, 'rejected')}
                                className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-[10px] flex items-center shadow-sm"
                              >
                                <XCircle size={12} className="mr-1" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-0.5 font-bold rounded uppercase text-[10px] ${
                              rx.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {rx.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
