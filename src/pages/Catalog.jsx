import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicines, fetchCategories } from '../store/medicineSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const { medicines, categories, totalCount, pages, loading } = useSelector((state) => state.medicines);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch medicines whenever filters change
  useEffect(() => {
    dispatch(fetchMedicines({ search, category, sort, page, limit: 8 }));
    
    // Sync URL queries
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (page > 1) params.page = page.toString();
    setSearchParams(params);
  }, [dispatch, search, category, sort, page]);

  // Sync state with URL params change (e.g. clicking category link from Home Page)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    setCategory(urlCategory);
    setSearch(urlSearch);
    if (!urlCategory && !urlSearch) {
      setPage(1);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    // Trigger useEffect
  };

  const handleCategoryChange = (slug) => {
    setCategory(slug);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSort('popular');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search and Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Medicine Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {medicines.length} of {totalCount} authentic therapeutic products
          </p>
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-sm flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 px-3 shadow-sm">
          <Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, chemical or manufacturer..."
            className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-slate-800 dark:text-slate-100 py-2"
          />
          {search && (
            <button 
              type="button" 
              onClick={() => { setSearch(''); setPage(1); }} 
              className="text-xs text-slate-400 hover:text-slate-650 ml-1.5"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center">
                <SlidersHorizontal size={16} className="mr-2 text-emerald-600" /> Filters
              </h3>
              {(category || search || sort !== 'popular') && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-755 dark:text-emerald-400 flex items-center"
                >
                  <RefreshCw size={10} className="mr-1 animate-spin" style={{ animationIterationCount: 1 }} /> Reset
                </button>
              )}
            </div>

            {/* Category Filter list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Categories</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left text-xs py-1.5 px-3 rounded-lg transition-all font-medium ${
                    category === ''
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-3 rounded-lg transition-all font-medium ${
                      category === cat.slug
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Filter */}
            <div className="space-y-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
                <ArrowUpDown size={12} className="mr-1.5" /> Sort By
              </h4>
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full text-xs bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-200 dark:border-slate-700"
              >
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">New Launches</option>
              </select>
            </div>

            {/* Warning Disclosure */}
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-450 leading-relaxed flex items-start space-x-2">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Items labeled with Rx badges require a valid prescription. Orders will stay locked under verification until approved by our pharmacist.
              </span>
            </div>

          </div>
        </aside>

        {/* PRODUCTS LIST */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg w-2/3"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg w-1/2"></div>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="text-slate-350 dark:text-slate-650 flex justify-center">
                <Search size={48} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No Medicines Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any medicine matching your filters. Try checking spelling or resetting search queries.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {medicines.map((med) => (
                  <ProductCard key={med._id} medicine={med} />
                ))}
              </div>

              {/* Pagination controls */}
              {pages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        page === i + 1
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
}
