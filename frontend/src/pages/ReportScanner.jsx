import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Activity } from 'lucide-react';
import axios from 'axios';

const ReportScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    
    setIsScanning(true);
    const formData = new FormData();
    formData.append('report', file);

    try {
      const res = await axios.post('http://localhost:5000/api/ocr/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to scan the report.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Report Scanner 📄</h1>
          <p className="text-slate-500 mt-2">Upload medical lab reports to extract and simplify data using OCR AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              preview ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
            }`}
            onClick={() => !isScanning && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={isScanning}
            />
            
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Report Preview" className="max-h-64 mx-auto rounded-xl shadow-sm" />
                <p className="text-sm font-medium text-blue-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-4 py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Upload size={28} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-700">Click to upload report</p>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={!file || isScanning}
            className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <><Loader2 size={20} className="animate-spin" /> Extracting Text...</>
            ) : (
              <><FileText size={20} /> Start OCR Scan</>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-y-auto max-h-[600px]">
          {result ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                <CheckCircle2 size={24} />
                <span className="font-medium">Scan successful</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  Key Findings Analysis
                </h3>
                <div className="space-y-3">
                  {result.analysis.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-md">
                          {item.type}
                        </span>
                        {item.status && (
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.status === 'Normal' ? 'bg-green-100 text-green-700' : item.status.includes('Abnormal') ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium">{item.finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Raw Extracted Text</h3>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {result.extractedText}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
              <AlertCircle size={48} className="text-slate-400 mb-4" />
              <p className="text-slate-500 font-medium max-w-[250px]">
                Upload an image of your report and click scan to see the extracted results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportScanner;
