import React, { createContext, useContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../i18n';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === newLanguage)) {
      i18nInstance.changeLanguage(newLanguage);
      setLanguageState(newLanguage);
    }
  }, [i18nInstance]);

  // None of the supported Indian languages are RTL
  const isRTL = false;

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key: string, params?: Record<string, string | number>) => t(key, params as any),
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { SUPPORTED_LANGUAGES };
export type { SupportedLanguage };
