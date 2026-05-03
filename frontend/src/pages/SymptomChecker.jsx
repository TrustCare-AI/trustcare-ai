import React, { useState } from 'react';
import { Activity, Search, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/predict', { symptoms });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze symptoms. Please make sure the AI engine is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Symptom Checker 🧪</h1>
        <p className="text-slate-500 mt-2">Describe your symptoms to get a preliminary AI analysis using our Ensemble ML Model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handlePredict} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe how you're feeling
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. I have a severe headache, nausea, and fever for the past two days..."
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !symptoms.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <><Loader2 size={20} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Search size={20} /> Analyze Symptoms</>
              )}
            </button>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <p className="text-sm">
                This tool provides preliminary information only and is not a substitute for professional medical advice.
              </p>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity size={32} />
                </div>
                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Predicted Condition</h2>
                <p className="text-2xl font-bold text-slate-800 capitalize">{result.disease}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-slate-400" /> 
                  Description
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-teal-500" /> 
                  Recommended Precautions
                </h3>
                <ul className="space-y-2">
                  {result.precautions.map((prec, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-teal-400" />
                      <span className="capitalize">{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <Activity size={64} className="text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Your analysis results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
