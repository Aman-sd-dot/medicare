import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicines, fetchCategories } from '../store/medicineSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileCheck,
  Star
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const { medicines, categories, loading } = useSelector((state) => state.medicines);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMedicines({ limit: 4, sort: 'popular' })); // fetch popular items
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Filter out some products for "New Launches" (e.g. newest sorted)
  const featuredMeds = medicines.slice(0, 4);

  const benefits = [
    { icon: <Truck size={28} />, title: 'Super Fast Delivery', desc: 'Get your medicines delivered within 24 hours in all major cities.' },
    { icon: <ShieldCheck size={28} />, title: '100% Genuine Medicines', desc: 'All products are sourced directly from authorized manufacturers.' },
    { icon: <Clock size={28} />, title: '24/7 Support', desc: 'Connect with our support team or virtual pharmacist anytime.' },
    { icon: <FileCheck size={28} />, title: 'Easy Prescription Upload', desc: 'Upload your prescription and let our registered pharmacists verify it.' }
  ];

  const testimonials = [
    { name: 'Amit Verma', role: 'Cardiac Patient', comment: 'MediCare Pharma has made ordering my monthly blood pressure medicines incredibly easy. The prescription verification is fast, and the discount is always helpful!', rating: 5 },
    { name: 'Dr. Priya Sen', role: 'General Physician', comment: 'I recommend this e-pharmacy to my patients. Their strict adherence to Schedule H regulations and prescription validation is highly commendable.', rating: 5 },
    { name: 'Sonia Mehta', role: 'Working Professional', comment: 'Ordering baby wellness supplements and daily vitamins on this app is so quick. The live chat helped me find exactly what I needed in minutes.', rating: 4 }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 py-20 px-4">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-800/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/40 dark:bg-teal-800/10 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <span className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-semibold text-xs rounded-full inline-flex items-center">
              <Sparkles size={14} className="mr-1 animate-pulse" /> Welcome to MediCare Pharma
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
              Your Trusted Online <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">E-Pharmacy</span> Partner
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Order premium medicines, wellness supplements, and health essentials online. Upload your prescription for verified Schedule H/H1 clinical deliveries.
            </p>

            {/* Instant Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto lg:mx-0 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-premium">
              <div className="pl-3 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search paracetamol, lipitor, metformin..."
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-800 dark:text-slate-100 py-2.5 px-3"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/catalog"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm flex items-center"
              >
                Browse Shop <ArrowRight size={16} className="ml-1.5" />
              </Link>
              <Link
                to="/upload-prescription"
                className="px-6 py-3 border border-slate-350 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 rounded-xl font-semibold transition-all text-sm"
              >
                Upload Prescription
              </Link>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="relative mx-auto max-w-md lg:max-w-none flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
                alt="Pharmacy Dashboard Mockup"
                className="rounded-2xl shadow-2xl w-full h-[360px] object-cover relative"
              />
              <div className="absolute -bottom-6 -left-6 glass border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px]">
                <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">100% Verified</h4>
                  <p className="text-[10px] text-slate-500">Pharmacist Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Shop by Category</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse our curated healthcare collections to find daily supplements or specialized medical support.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/catalog?category=${cat.slug}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:shadow-premium-hover hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 bg-emerald-50 dark:bg-slate-800">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED MEDICINES & NEW LAUNCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center">
              <TrendingUp size={14} className="mr-1" /> Featured Medicines
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-1">
              Top Selling Products
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center"
          >
            See All Shop <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredMeds.map((med) => (
              <ProductCard key={med._id} medicine={med} />
            ))}
          </div>
        )}
      </section>

      {/* 4. TRUST / SERVICES BANNER */}
      <section className="bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="flex space-x-4 items-start bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-premium">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm">
                  {b.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{b.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Customer Testimonials</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hear from patients, doctors, and caregivers who rely on MediCare Pharma for therapeutic deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-premium relative flex flex-col justify-between">
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex text-amber-500 space-x-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                  {[...Array(5 - t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-slate-200 dark:text-slate-700" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-sm italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 font-bold flex items-center justify-center text-sm shadow-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -translate-y-12 -translate-x-12"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-16 translate-x-16"></div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Subscribe to our newsletter</h2>
            <p className="text-sm text-emerald-100">
              Get weekly health tips, medicine launching alerts, exclusive coupon codes and diagnostic discount updates directly to your inbox.
            </p>

            {subscribed ? (
              <div className="p-4 bg-white/20 rounded-2xl border border-white/30 text-sm font-semibold animate-pulse">
                🎉 Thank you for subscribing! Keep an eye on your inbox for healthy updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-white/10 p-1.5 rounded-2xl border border-white/20">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent border-none outline-none text-white placeholder-emerald-200 text-sm w-full py-2.5 px-3 focus:ring-0 focus:border-none"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
