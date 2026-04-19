import React, { useState } from 'react';
import { Scan, CheckCircle, AlertCircle, RefreshCw, Camera } from 'lucide-react';

const ScanningPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<null | { condition: string; confidence: string; details: string }>(null);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        condition: 'Psoriasis (Initial Stage)',
        confidence: '94.8%',
        details: 'The AI model has detected characteristic scaling patterns and inflammation clusters associated with early-stage psoriasis.'
      });
    }, 3000);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">AI Intelligence Scanning</h1>
        <p className="text-text-secondary">Capture or upload skin images for real-time diagnostic sequencing</p>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className={`relative glass-card border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center min-h-[400px] ${isScanning ? 'border-primary' : 'border-gray-200 hover:border-black'}`}>
            {isScanning ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl z-20">
                <div className="w-24 h-24 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-6"></div>
                <p className="font-bold text-xl animate-pulse">Sequencing Image...</p>
                <p className="text-xs text-text-secondary uppercase tracking-widest mt-2">CNN-RNN Engine Active v1.02</p>
              </div>
            ) : (
                <div className="text-center p-10 cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                        <Camera size={32} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <p className="text-xl font-bold mb-2">Drop Image Here</p>
                    <p className="text-sm text-text-secondary px-10">Supported formats: JPEG, PNG, HEIC. Max file size: 12MB</p>
                    <button className="btn btn-secondary mt-8 px-10 border-gray-200">
                        Choose File
                    </button>
                </div>
            )}
            
            {/* Simulated Scanning Line */}
            {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-[#DAF185] shadow-[0_0_20px_#DAF185] animate-scan-line top-0 z-10"></div>
            )}
          </div>

          <button 
            onClick={startScan}
            disabled={isScanning}
            className="btn btn-primary w-full py-5 text-lg rounded-full shadow-2xl disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="animate-spin" /> : <Scan />}
            {isScanning ? 'Processing...' : 'Execute Intelligence Scan'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass-card h-full min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-8 border-b border-gray-100 pb-4">Diagnostic Report</h3>
            
            {result ? (
              <div className="space-y-8 flex-1 animate-fade-in">
                <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex items-start gap-4">
                  <CheckCircle className="text-success mt-1" />
                  <div>
                    <p className="text-xs font-bold text-success uppercase tracking-widest mb-1">Diagnosis Confirmed</p>
                    <h4 className="text-2xl font-bold text-gray-900">{result.condition}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AI Confidence</p>
                        <p className="text-3xl font-bold text-black">{result.confidence}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Risk Assessment</p>
                        <p className="text-3xl font-bold text-amber-500">Low</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Model Synthesis</p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {result.details}
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-100 flex gap-4">
                    <button className="btn btn-secondary flex-1 py-4 text-sm font-bold border-gray-200">
                        Download PDF
                    </button>
                    <button className="btn btn-primary flex-1 py-4 text-sm font-bold bg-[#DAF185] text-black border-[#DAF185]">
                        Consult Specialist
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-bold">Waiting for input...</p>
                <p className="text-xs mt-1">Ready to receive image sequence</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }
        .animate-scan-line {
            animation: scanLine 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ScanningPage;
