import React, { useState, useEffect, useCallback, useRef } from 'react';
import InputSection from './components/InputSection';
import ReaderDisplay from './components/ReaderDisplay';
import Controls from './components/Controls';
import AiTools from './components/AiTools';
import { AppState, ContentData } from './types';
import { X, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [content, setContent] = useState<ContentData | null>(null);
  const [wpm, setWpm] = useState<number>(300);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);

  // Refs for timing
  const timerRef = useRef<number | null>(null);

  // Helper to process raw text into words
  const processText = (text: string) => {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(w => w.length > 0);
  };

  const handleStart = async (input: string) => {
    setAppState(AppState.LOADING);
    setError(null);

    try {
      const finalWords = processText(input);

      if (finalWords.length === 0) {
        throw new Error("No readable text found.");
      }

      setContent({
        originalText: input,
        words: finalWords,
        title: 'Pasted Text',
        source: undefined
      });
      
      setCurrentWordIndex(0);
      setAppState(AppState.PAUSED);

    } catch (err: any) {
      setError(err.message || "Something went wrong processing the content.");
      setAppState(AppState.IDLE);
    }
  };

  const togglePlay = useCallback(() => {
    if (appState === AppState.READING) {
      setAppState(AppState.PAUSED);
    } else if (appState === AppState.PAUSED) {
      setAppState(AppState.READING);
    }
  }, [appState]);

  const resetReader = useCallback(() => {
    setAppState(AppState.IDLE);
    setContent(null);
    setCurrentWordIndex(0);
    setShowAiTools(false);
  }, []);

  const handleSeek = useCallback((percentage: number) => {
    if (!content) return;
    const newIndex = Math.floor((percentage / 100) * content.words.length);
    setCurrentWordIndex(Math.min(newIndex, content.words.length - 1));
  }, [content]);

  // Adjust current index by a delta (for keyboard nav)
  const jumpWords = useCallback((delta: number) => {
    if (!content) return;
    setCurrentWordIndex(prev => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= content.words.length) return content.words.length - 1;
      return next;
    });
  }, [content]);

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Update Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if we are in the input phase (unless it's just IDLE) 
      // or if AI modal is open (except Esc)
      if (showAiTools) {
          if (e.key === 'Escape') setShowAiTools(false);
          return;
      }
      
      // If we are on the input screen, let people type
      if ((appState === AppState.IDLE || appState === AppState.LOADING) && document.activeElement?.tagName !== 'BODY') {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault(); // Prevent scrolling
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          jumpWords(10); // Skip forward
          break;
        case 'ArrowLeft':
          e.preventDefault();
          jumpWords(-10); // Skip back
          break;
        case 'ArrowUp':
          e.preventDefault();
          setWpm(prev => Math.min(prev + 50, 2000));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setWpm(prev => Math.max(prev - 50, 50));
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'r':
        case 'R':
           if (appState !== AppState.IDLE) resetReader();
           break;
        case 'Escape':
           if (document.fullscreenElement) {
               // Let default browser behavior handle exit, just update state via listener
           } else if (appState !== AppState.IDLE) {
               resetReader();
           }
           break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, togglePlay, jumpWords, toggleFullscreen, resetReader, showAiTools]);


  // The Heartbeat of the App: The RSVP Loop
  useEffect(() => {
    if (appState === AppState.READING && content) {
      const delay = (60 * 1000) / wpm;

      timerRef.current = window.setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= content.words.length - 1) {
            setAppState(AppState.PAUSED);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appState, wpm, content]);

  // Determine current word
  const currentWord = content ? content.words[currentWordIndex] : "";
  const progress = content ? (currentWordIndex / content.words.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-900 selection:text-white flex flex-col font-sans">
      
      {/* Header */}
      <header className={`fixed top-0 w-full p-6 z-40 flex justify-between items-center transition-opacity duration-300 ${appState === AppState.READING && isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-100'} bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none`}>
        <div className="flex items-center gap-2 pointer-events-auto">
            <div className="w-3 h-3 bg-red-600"></div>
            <h1 className="font-mono text-lg font-bold tracking-tighter text-neutral-200">
                RED<span className="text-red-600">READER</span>
            </h1>
        </div>
        
        {content && (
           <div className="flex items-center gap-4 pointer-events-auto">
              <button
                onClick={() => {
                    setAppState(AppState.PAUSED);
                    setShowAiTools(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-red-600 text-neutral-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
              >
                <Sparkles size={14} /> AI Tools
              </button>
              <button 
                onClick={resetReader}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                title="Close (Esc)"
              >
                <X size={24} />
              </button>
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Background Ambient Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {appState === AppState.IDLE || appState === AppState.LOADING ? (
            <div className="w-full max-w-3xl flex flex-col items-center gap-12 mt-12">
               <div className="text-center space-y-4">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-100">
                    READ <br/> <span className="text-red-600">FASTER</span>
                  </h2>
                  <p className="text-neutral-500 font-mono text-sm tracking-widest uppercase">
                    Rapid Serial Visual Presentation
                  </p>
               </div>
               
               <InputSection 
                 onStart={handleStart} 
                 isLoading={appState === AppState.LOADING} 
               />

               {error && (
                 <div className="mt-8 p-4 border border-red-900/50 bg-red-950/20 text-red-200 text-sm font-mono max-w-md text-center">
                    Error: {error}
                 </div>
               )}
            </div>
        ) : (
            <div className="w-full flex flex-col items-center">
                {/* Title Overlay */}
                <div className={`absolute top-24 w-full text-center px-4 mb-8 transition-opacity duration-300 ${appState === AppState.READING ? 'opacity-20 hover:opacity-100' : 'opacity-50'}`}>
                     <h3 className="text-neutral-500 font-mono text-xs uppercase tracking-widest truncate max-w-md mx-auto">
                        {content?.title}
                     </h3>
                </div>

                {/* The Reader Engine */}
                <ReaderDisplay 
                    word={currentWord} 
                    isPlaying={appState === AppState.READING}
                />
                
                {/* Controls */}
                <Controls 
                    isPlaying={appState === AppState.READING}
                    onTogglePlay={togglePlay}
                    onReset={() => setCurrentWordIndex(0)}
                    wpm={wpm}
                    onWpmChange={setWpm}
                    progress={progress}
                    onSeek={handleSeek}
                    totalWords={content?.words.length || 0}
                    currentWordIndex={currentWordIndex}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            </div>
        )}
      </main>

      {/* AI Modal */}
      {showAiTools && content && (
        <AiTools 
            originalText={content.originalText}
            onClose={() => setShowAiTools(false)}
            onApplyText={(newText, newTitle) => {
                const newWords = processText(newText);
                setContent(prev => prev ? ({ ...prev, words: newWords, title: newTitle || prev.title }) : null);
                setCurrentWordIndex(0);
                setShowAiTools(false);
            }}
        />
      )}

      {/* Footer */}
      <footer className="p-6 text-center text-neutral-800 text-[10px] font-mono uppercase tracking-widest fixed bottom-0 w-full pointer-events-none">
        System Active • v1.1.0 • SPACE (Play) • ARROWS (Nav) • F (Full)
      </footer>
    </div>
  );
};

export default App;