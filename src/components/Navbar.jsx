import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  PlusSquare, 
  LogOut, 
  LayoutDashboard,
  Heart
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Sync dark mode state
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Medicines', path: '/catalog' },
    { name: 'Upload Prescription', path: '/upload-prescription' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300 flex items-center">
                <span className="mr-1.5 text-emerald-600 dark:text-emerald-400">✙</span> MediCare Pharma
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 pb-1'
                      : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link */}
            {isAuthenticated && (
              <Link
                to="/dashboard?tab=wishlist"
                className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 transition-colors relative"
                title="Wishlist"
              >
                <Heart size={20} />
                {user?.wishlist?.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full transform translate-x-1 -translate-y-1">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-sm text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name ? user.name.split(' ')[0] : ''}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-200 dark:border-slate-800">
                    <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Logged in as <strong>{user?.role === 'admin' ? 'Admin' : 'Customer'}</strong>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon size={16} className="mr-2" /> My Profile
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LayoutDashboard size={16} className="mr-2" /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 border border-emerald-600 dark:border-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <Link
              to="/cart"
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
            >
              <ShoppingCart size={18} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full transform translate-x-1 -translate-y-1">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-2 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200 dark:border-slate-800 my-2" />
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold mr-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user?.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                </div>
              </div>
              
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Profile
              </Link>
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Admin Panel
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                className="text-center px-4 py-2 border border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
