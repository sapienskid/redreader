import React, { useState } from 'react';
import { FileText, Loader2, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onStart: (content: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onStart, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onStart(inputValue);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-red-500 font-mono tracking-widest uppercase border-b-2 border-red-500 pb-2 text-sm">
           <FileText size={16} /> <span>Paste Content</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative p-1">
            <textarea
                placeholder="Paste your text here to speed read..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-64 bg-neutral-950 text-white placeholder-neutral-700 px-6 py-4 outline-none font-mono text-sm border border-neutral-800 focus:border-red-900 transition-colors resize-none"
                required
            />
        </div>

        <div className="mt-8 flex justify-center">
            <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="group/btn relative px-8 py-3 bg-neutral-100 text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
            <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <>Processing <Loader2 size={16} className="animate-spin" /></>
                ) : (
                    <>Start Reading <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" /></>
                )}
            </span>
            </button>
        </div>
      </form>
      
      <div className="text-center">
          <p className="text-neutral-700 text-xs font-mono max-w-xs mx-auto">
            Paste any text. Adjust speed up to 2000 WPM.
          </p>
      </div>
    </div>
  );
};

export default InputSection;