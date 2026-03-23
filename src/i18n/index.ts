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

const BASE_PATH = '/tools/date-calculator';

export const localePaths: Record<Locale, string> = {
  'zh-Hant': `${BASE_PATH}/`,
  'en': `${BASE_PATH}/en/`,
  'ja': `${BASE_PATH}/ja/`,
};

export function pathToLocale(pathname: string): Locale {
  // Strip base path before matching locale
  const stripped = pathname.replace(BASE_PATH, '');
  if (stripped.startsWith('/en')) return 'en';
  if (stripped.startsWith('/ja')) return 'ja';
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
