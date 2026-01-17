import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Maximize2, Minimize2 } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  progress: number; // 0 to 100
  onSeek: (value: number) => void;
  totalWords: number;
  currentWordIndex: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  wpm,
  onWpmChange,
  progress,
  onSeek,
  totalWords,
  currentWordIndex,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Progress Bar */}
      <div className="space-y-2 group">
        <div className="flex justify-between text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1 bg-neutral-900 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-none hover:[&::-webkit-slider-thumb]:bg-red-500 transition-all"
        />
        <div className="flex justify-between text-xs text-neutral-600 font-mono">
          <span>{currentWordIndex} / {totalWords} words</span>
          <span>~{Math.ceil((totalWords - currentWordIndex) / (wpm || 1))} min left</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-8 relative">
        
        {/* Reset (Left Side) */}
        <button
          onClick={onReset}
          className="p-4 text-neutral-500 hover:text-red-500 transition-colors duration-200"
          aria-label="Reset (R)"
          title="Reset (R)"
        >
          <RotateCcw size={20} />
        </button>

        {/* Play/Pause (Center) */}
        <button
          onClick={onTogglePlay}
          className="group relative flex items-center justify-center w-20 h-20 bg-neutral-900 border border-neutral-800 hover:border-red-600 transition-all duration-300 rounded-none"
          aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <Pause size={32} className="fill-current text-white group-hover:text-red-500 transition-colors" />
          ) : (
            <Play size={32} className="fill-current text-white group-hover:text-red-500 transition-colors ml-1" />
          )}
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-red-600 transition-all duration-300"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-red-600 transition-all duration-300"></div>
        </button>

        {/* Fullscreen (Right Side) */}
        <button
          onClick={onToggleFullscreen}
          className="p-4 text-neutral-500 hover:text-red-500 transition-colors duration-200"
          aria-label="Toggle Fullscreen (F)"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Speed Controls (Bottom) */}
      <div className="flex flex-col items-center gap-2">
           <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Speed (Up/Down)</span>
           <div className="flex items-center gap-4">
             <button 
                onClick={() => onWpmChange(Math.max(100, wpm - 50))}
                className="text-neutral-600 hover:text-red-500 transition-colors"
                title="Decrease Speed (Down Arrow)"
             >
               <Rewind size={16} />
             </button>
             
             <input
                type="number"
                value={wpm}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                        onWpmChange(val);
                    }
                }}
                className="w-20 bg-transparent text-xl font-bold font-mono text-red-500 text-center outline-none border-b border-transparent focus:border-red-600 transition-colors [&::-webkit-inner-spin-button]:appearance-none appearance-none"
             />

             <button 
                onClick={() => onWpmChange(Math.min(2000, wpm + 50))}
                className="text-neutral-600 hover:text-red-500 transition-colors"
                title="Increase Speed (Up Arrow)"
             >
               <FastForward size={16} />
             </button>
           </div>
           <span className="text-[10px] text-neutral-600 font-mono">WPM</span>
        </div>
    </div>
  );
};

export default Controls;
