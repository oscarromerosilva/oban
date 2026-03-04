import { createContext, useContext } from 'react';
import type { SupportedLocale } from './messages';

type IntlContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
};

export const IntlContext = createContext<IntlContextValue | undefined>(
  undefined
);

export function useLocale() {
  const ctx = useContext(IntlContext);
  if (!ctx) {
    throw new Error('useLocale must be used within IntlContext provider');
  }
  return ctx;
}

