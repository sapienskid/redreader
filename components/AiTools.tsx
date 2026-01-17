import React, { useState } from 'react';
import { Sparkles, FileText, Check, X, Loader2 } from 'lucide-react';
import { summarizeText, simplifyText } from '../services/geminiService';

interface AiToolsProps {
  originalText: string;
  onApplyText: (newText: string, newTitle: string) => void;
  onClose: () => void;
}

const AiTools: React.FC<AiToolsProps> = ({ originalText, onApplyText, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'summary' | 'simplify' | null>(null);

  const handleAction = async (action: 'summary' | 'simplify') => {
    setLoading(true);
    setMode(action);
    setResult(null);
    try {
      if (action === 'summary') {
        const summary = await summarizeText(originalText);
        setResult(summary);
      } else {
        const simplified = await simplifyText(originalText);
        setResult(simplified);
      }
    } catch (error) {
      setResult("Error processing text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-mono font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-red-600" />
            AI INTELLIGENCE
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleAction('summary')}
              className="p-6 border border-neutral-800 hover:border-red-600 hover:bg-neutral-950 transition-all group text-left"
            >
              <div className="text-red-500 mb-2 group-hover:scale-110 transition-transform origin-left">
                <FileText size={24} />
              </div>
              <h3 className="text-white font-bold font-mono mb-1">Summarize</h3>
              <p className="text-neutral-500 text-xs font-mono">Get key bullet points before reading.</p>
            </button>

            <button
              onClick={() => handleAction('simplify')}
              className="p-6 border border-neutral-800 hover:border-red-600 hover:bg-neutral-950 transition-all group text-left"
            >
              <div className="text-red-500 mb-2 group-hover:scale-110 transition-transform origin-left">
                <Sparkles size={24} />
              </div>
              <h3 className="text-white font-bold font-mono mb-1">Simplify Text</h3>
              <p className="text-neutral-500 text-xs font-mono">Rewrite content for easier speed reading.</p>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-500 gap-4">
            <Loader2 size={32} className="animate-spin text-red-600" />
            <span className="font-mono text-xs uppercase tracking-widest">Processing with Gemini...</span>
          </div>
        )}

        {/* Result State */}
        {result && !loading && (
          <div className="space-y-6">
             <div className="max-h-60 overflow-y-auto bg-black p-4 border border-neutral-800 font-mono text-sm text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800">
               {result.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 last:mb-0">{line}</p>
               ))}
             </div>
             
             <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setResult(null)} 
                  className="px-4 py-2 text-neutral-500 hover:text-white font-mono text-xs uppercase transition-colors"
                >
                  Back
                </button>
                {mode === 'simplify' ? (
                  <button 
                    onClick={() => onApplyText(result, "Simplified Content")}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    <Check size={14} /> Read This
                  </button>
                ) : (
                   <button 
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Done
                  </button>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiTools;
