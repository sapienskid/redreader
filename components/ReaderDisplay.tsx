import React, { useMemo } from 'react';

interface ReaderDisplayProps {
  word: string;
  isPlaying: boolean;
}

const ReaderDisplay: React.FC<ReaderDisplayProps> = ({ word, isPlaying }) => {
  // Logic to find the Optimal Recognition Point (ORP)
  const { left, pivot, right } = useMemo(() => {
    if (!word) return { left: '', pivot: '', right: '' };
    
    const length = word.length;
    // Simple heuristic: Pivot is around 30-40% into the word.
    let pivotIndex = Math.floor((length - 1) / 2);
    if (length > 3) {
        pivotIndex = Math.floor(length * 0.35); 
    }
    
    return {
      left: word.slice(0, pivotIndex),
      pivot: word[pivotIndex],
      right: word.slice(pivotIndex + 1)
    };
  }, [word]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center bg-black overflow-hidden select-none my-12 border-y border-neutral-900">
      {/* Horizontal Guidance Lines */}
      <div className="absolute w-full h-px bg-neutral-900 top-1/2 -translate-y-1/2 left-0 z-0"></div>
      <div className="absolute w-px h-16 bg-neutral-900 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0"></div>
      
      {/* Word Container */}
      {/* 
         Using CSS Grid with [1fr auto 1fr] ensures the middle column (Pivot) 
         is effectively centered in the available space, regardless of screen size.
         This prevents the overlapping issues caused by percentage-based widths on small screens.
      */}
      <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-baseline w-full max-w-5xl mx-auto font-mono text-6xl md:text-7xl font-bold">
        <span className="text-neutral-200 text-right whitespace-pre">
            {left}
        </span>
        <span className="text-red-600 text-center">
            {pivot}
        </span>
        <span className="text-neutral-200 text-left whitespace-pre">
            {right}
        </span>
      </div>

      {!word && (
        <div className="absolute z-20 text-neutral-700 font-mono text-sm uppercase tracking-widest animate-pulse">
          Ready
        </div>
      )}
    </div>
  );
};

export default ReaderDisplay;