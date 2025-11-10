
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { translate } from './services/geminiService';
import TranslatorCard from './components/TranslatorCard';
import { SwapIcon } from './components/Icons';
import { Language } from './types';


const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<Language>(Language.EN);
  const [targetLang, setTargetLang] = useState<Language>(Language.LEB);
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSourceText = useDebounce(sourceText, 500);

  const handleTranslate = useCallback(async () => {
    if (!debouncedSourceText.trim()) {
      setTranslatedText('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await translate(debouncedSourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError('Failed to translate. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSourceText, sourceLang, targetLang]);


  useEffect(() => {
    handleTranslate();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSourceText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText); 
  };

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
  };
  
  const sourceLanguageName = useMemo(() => sourceLang === Language.EN ? 'English' : 'Leb Lango', [sourceLang]);
  const targetLanguageName = useMemo(() => targetLang === Language.EN ? 'English' : 'Leb Lango', [targetLang]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">Leb Lango</h1>
        <p className="text-lg text-gray-400 mt-2">Instant AI-Powered Translation</p>
      </header>
      
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
             <div className="w-full text-center text-lg font-semibold text-cyan-400">{sourceLanguageName}</div>
             <button
                onClick={handleSwapLanguages}
                className="p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Swap languages"
              >
                <SwapIcon className="w-6 h-6" />
              </button>
             <div className="w-full text-center text-lg font-semibold text-gray-400">{targetLanguageName}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatorCard
              language={sourceLanguageName}
              text={sourceText}
              onChange={handleSourceTextChange}
              onClear={handleClear}
              isReadOnly={false}
              placeholder="Enter text to translate..."
            />
            <TranslatorCard
              language={targetLanguageName}
              text={translatedText}
              isLoading={isLoading}
              isReadOnly={true}
              placeholder="Translation will appear here..."
            />
          </div>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </main>
      
      <footer className="text-center text-gray-500 mt-8">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};


// Custom hook for debouncing
function useDebounce<T,>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default App;
