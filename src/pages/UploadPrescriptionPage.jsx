import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPrescriptionFile } from '../store/prescriptionSlice.js';
import { UploadCloud, CheckCircle, ArrowLeft, FileText, FileWarning } from 'lucide-react';

export default function UploadPrescriptionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { uploading } = useSelector((state) => state.prescriptions);

  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/upload-prescription' } } });
      return;
    }

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', file);
    formData.append('comments', comments);

    try {
      const action = await dispatch(uploadPrescriptionFile({ formData, token }));
      if (uploadPrescriptionFile.fulfilled.match(action)) {
        setSuccess(true);
        setFile(null);
        setComments('');
      } else {
        setError(action.payload || 'Upload failed');
      }
    } catch (err) {
      setError('Network error uploading file');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-emerald-600">
        <ArrowLeft size={16} className="mr-1.5" /> Back to Home
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">Prescription Upload Portal</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Upload your medical prescriptions to purchase Schedule H, H1, or other regulated medicines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Drag and Drop Upload */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 flex items-center justify-center">
                <CheckCircle size={28} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-250 text-base">Prescription Uploaded Successfully</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Our registered pharmacists will review and approve this prescription shortly. You can now browse medicines and add them to your cart.
              </p>
              <div className="flex gap-4 justify-center pt-2">
                <Link to="/catalog" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
                  Go to Shop
                </Link>
                <Link to="/dashboard?tab=prescriptions" className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl text-xs font-bold">
                  View in Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-xs text-red-650">⚠️ {error}</p>}

              {/* Upload Drag/Drop area */}
              <div className="border-2 border-dashed border-slate-250 dark:border-slate-700 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 relative group hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-2">
                  <div className="mx-auto w-10 h-10 bg-white dark:bg-slate-900 rounded-xl shadow border flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-105 transition-all">
                    <UploadCloud size={24} />
                  </div>
                  <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200">Drag & Drop file here or Click to select</h4>
                  <p className="text-[10px] text-slate-400">Supports JPG, PNG, PDF formats (Max: 5MB)</p>
                </div>
              </div>

              {file && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-red-500 text-[10px] hover:underline">Remove</button>
                </div>
              )}

              {/* Remarks */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-550 block">Instructions for Pharmacist (Optional)</label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="E.g. Doctor name, patient age, dosage changes..."
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-xs disabled:opacity-50"
              >
                {uploading ? 'Uploading prescription...' : 'Submit Prescription'}
              </button>
            </form>
          )}
        </div>

        {/* Right column: Regulatory Instructions */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center">
              <FileWarning size={16} className="mr-1.5 text-amber-500" /> Regulatory Notice
            </h3>
            
            <p className="text-slate-500 leading-relaxed">
              MediCare Pharma strictly complies with the guidelines of the <strong>Central Drugs Standard Control Organisation (CDSCO), India</strong>.
            </p>

            <ul className="space-y-2 list-disc list-inside text-slate-500 leading-relaxed">
              <li>Prescription must clearly state the <strong>doctor's name, degree, and registration number</strong>.</li>
              <li>Patient name and date of consultation must be legible.</li>
              <li>A prescription is valid for up to 6 months from issuance unless specified.</li>
            </ul>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
              <FileText size={14} />
              <span>Standard CDSCO pharmacy audit rules apply.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
