import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center">
                ✙ MediCare Pharma
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner in health. Delivering genuine medicines, healthcare supplements, and diagnostic equipment directly to your doorstep.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800 p-2.5 rounded-lg border border-slate-700">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
              <span>Registered under E-Pharmacy Regulations. license: DL-3921/2026.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-emerald-400 transition-colors">Browse Medicines</Link>
              </li>
              <li>
                <Link to="/upload-prescription" className="hover:text-emerald-400 transition-colors">Upload Prescription</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">My Cart</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">User Dashboard</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Client Login</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase">Top Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog?category=cardiac-care" className="hover:text-emerald-400 transition-colors">Cardiac Care</Link>
              </li>
              <li>
                <Link to="/catalog?category=diabetes-management" className="hover:text-emerald-400 transition-colors">Diabetes Support</Link>
              </li>
              <li>
                <Link to="/catalog?category=antibiotics" className="hover:text-emerald-400 transition-colors">Antibiotics</Link>
              </li>
              <li>
                <Link to="/catalog?category=pain-relief" className="hover:text-emerald-400 transition-colors">Pain Relievers</Link>
              </li>
              <li>
                <Link to="/catalog?category=otc-wellness" className="hover:text-emerald-400 transition-colors">OTC Wellness</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase">Contact Us</h3>
            <div className="flex items-start text-sm space-x-2.5">
              <MapPin size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>12 Health Plaza, Sector 62, Noida, Uttar Pradesh, 201301</span>
            </div>
            <div className="flex items-center text-sm space-x-2.5">
              <Phone size={18} className="text-emerald-400 flex-shrink-0" />
              <span>+91-120-445566 / 889900</span>
            </div>
            <div className="flex items-center text-sm space-x-2.5">
              <Mail size={18} className="text-emerald-400 flex-shrink-0" />
              <span>support@medicare.com</span>
            </div>
            <div className="flex items-center text-sm space-x-2.5">
              <HeartPulse size={18} className="text-emerald-400 flex-shrink-0" />
              <span>Emergency 24x7: +91-112-990099</span>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="text-xs text-slate-500 leading-relaxed space-y-4">
            <p>
              <strong>*Regulatory Warning (Prescription Medicines):</strong> In compliance with the Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945, some medicines listed on our website are Schedule H, Schedule H1 or Schedule X drugs and require a valid physical/digital prescription from a Registered Medical Practitioner (RMP). We reserve the right to verify, audit, and reject any orders that fail our pharmacist audit controls.
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 font-medium">
              <p>© {new Date().getFullYear()} MediCare Pharma Ltd. All rights reserved.</p>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-slate-400 transition-colors">Returns & Refunds</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
