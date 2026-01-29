import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
];

interface LanguageContextType {
  currentLanguage: Language;
  availableLanguages: Language[];
  setLanguage: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const detectLanguageFromIP = async (): Promise<string> => {
  try {
    // Try to get user's location from IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Map country codes to language codes
    const countryToLanguage: Record<string, string> = {
      'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
      'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
      'DE': 'de', 'AT': 'de', 'CH': 'de',
      'FR': 'fr', 'BE': 'fr', 'LU': 'fr',
      'IT': 'it',
      'PT': 'pt', 'BR': 'pt',
      'RU': 'ru', 'BY': 'ru', 'KZ': 'ru',
      'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar',
      'IN': 'hi',
      'IR': 'fa', 'AF': 'fa',
    };
    
    return countryToLanguage[data.country_code] || 'en';
  } catch (error) {
    console.error('Failed to detect language from IP:', error);
    return 'en'; // Default to English
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const initializeLanguage = async () => {
      // Check if language is already stored
      const storedLanguage = localStorage.getItem('selectedLanguage');
      
      if (storedLanguage) {
        const lang = languages.find(l => l.code === storedLanguage);
        if (lang) {
          setCurrentLanguage(lang);
          return;
        }
      }
      
      // Detect language from IP
      const detectedLangCode = await detectLanguageFromIP();
      const detectedLang = languages.find(l => l.code === detectedLangCode);
      
      if (detectedLang) {
        setCurrentLanguage(detectedLang);
        localStorage.setItem('selectedLanguage', detectedLang.code);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = (code: string) => {
    const language = languages.find(l => l.code === code);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', code);
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages: languages,
      setLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};