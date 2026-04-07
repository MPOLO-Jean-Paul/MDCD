'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';

type Locale = 'en' | 'fr';

const translations = { en, fr };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to French if translation is missing
        let fallbackResult: any = translations.fr;
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
        }
        result = fallbackResult || key;
        break; // Exit loop after finding fallback or using key
      }
    }

    let finalString = typeof result === 'string' ? result : key;

    if (replacements) {
      for (const [placeholder, value] of Object.entries(replacements)) {
        finalString = finalString.replace(`{${placeholder}}`, String(value));
      }
    }
    
    return finalString;
  };

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
