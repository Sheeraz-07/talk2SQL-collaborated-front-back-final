import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceInputState {
  isListening: boolean;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
}

interface UseVoiceInputProps {
  language?: 'en' | 'ur';
  onResult?: (result: string) => void;
}

export const useVoiceInput = ({ language = 'en', onResult }: UseVoiceInputProps = {}) => {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    interimTranscript: '',
    error: null,
    isSupported: false,
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to reset the silence timer
  const resetSilenceTimer = useCallback(() => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
    }

    // Auto-stop after 5 seconds of silence
    silenceTimer.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setState((prev) => ({ ...prev, isListening: false }));
      }
    }, 5000);
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setState((prev) => ({ ...prev, error: 'Speech recognition not supported in this browser', isSupported: false }));
      return;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language === 'en' ? 'en-US' : 'ur-PK';

    recognitionInstance.onresult = (event: any) => {
      resetSilenceTimer(); // Reset timer on speech detection

      let interim = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      // Propagate final results immediately via callback
      if (finalChunk && onResult) {
        onResult(finalChunk.trim());
      }

      setState((prev) => ({
        ...prev,
        interimTranscript: interim,
      }));
    };

    recognitionInstance.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        return;
      }

      let errorMessage = 'An error occurred during speech recognition';
      switch (event.error) {
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable in browser settings.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
      }

      setState((prev) => ({ ...prev, error: errorMessage, isListening: false }));
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };

    recognitionInstance.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }));
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };

    recognitionRef.current = recognitionInstance;
    setState((prev) => ({ ...prev, isSupported: true }));

    return () => {
      recognitionInstance.stop();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [language, resetSilenceTimer, onResult]);


  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setState((prev) => ({ ...prev, isListening: true, error: null, interimTranscript: '' }));
        resetSilenceTimer();
      } catch (err: any) {
        if (err.name === 'InvalidStateError' || err.message?.includes('already started')) {
          // If already started, just ensure state is synced
          setState((prev) => ({ ...prev, isListening: true, error: null, interimTranscript: '' }));
        } else {
          console.error("Failed to start recognition:", err);
        }
      }
    }
  }, [resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // Force state update immediately
      setState((prev) => ({ ...prev, isListening: false }));
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    }
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
  };
};
