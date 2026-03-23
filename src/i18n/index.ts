import { createContext, useContext } from 'react';
import type { Locale, Translations } from './types';
import { zhHant } from './zh-Hant';
import { en } from './en';
import { ja } from './ja';

export type { Locale, Translations };

export const translations: Record<Locale, Translations> = {
  'zh-Hant': zhHant,
  'en': en,
  'ja': ja,
};

export const localeNames: Record<Locale, string> = {
  'zh-Hant': '繁體中文',
  'en': 'English',
  'ja': '日本語',
};

export const localeHtmlLang: Record<Locale, string> = {
  'zh-Hant': 'zh-Hant',
  'en': 'en',
  'ja': 'ja',
};

// Navigation paths (relative to BrowserRouter basename)
export const localePaths: Record<Locale, string> = {
  'zh-Hant': '/',
  'en': '/en/',
  'ja': '/ja/',
};

// Full paths for SEO URLs (canonical, hreflang, og:url)
export const localeSeoSlugs: Record<Locale, string> = {
  'zh-Hant': '/',
  'en': '/en/',
  'ja': '/ja/',
};

export function pathToLocale(pathname: string): Locale {
  // BrowserRouter strips basename, so pathname is relative
  if (pathname.startsWith('/en')) return 'en';
  if (pathname.startsWith('/ja')) return 'ja';
  return 'zh-Hant';
}

export const I18nContext = createContext<{
  locale: Locale;
  t: Translations;
}>({
  locale: 'zh-Hant',
  t: zhHant,
});

export function useI18n() {
  return useContext(I18nContext);
}
