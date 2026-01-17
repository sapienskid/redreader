export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READING = 'READING',
  PAUSED = 'PAUSED',
}

export interface ReaderSettings {
  wpm: number;
  chunkSize: number; // Words per flash (usually 1)
}

export interface ContentData {
  originalText: string;
  words: string[];
  title?: string;
  source?: string;
}

export interface GeminiError {
  message: string;
}
