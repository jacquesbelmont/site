export const languages = {
  en: 'English',
  es: 'Español', 
  'zh-cn': '中文',
  ar: 'العربية',
  pt: 'Português',
};

export const defaultLang = 'en';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: string) {
    return translations[lang]?.[key] || translations[defaultLang][key] || key;
  }
}

export function pathNameIsInLanguage(pathname: string, lang: string) {
  return pathname.startsWith(`/${lang}`) || (lang === defaultLang && !pathNameHasLanguage(pathname));
}

function pathNameHasLanguage(pathname: string) {
  const segments = pathname.split('/');
  return segments.length > 1 && segments[1] in languages;
}

export function getLocalizedPath(path: string, lang: string) {
  if (lang === defaultLang) {
    return path;
  }
  return `/${lang}${path}`;
}

export function getAlternateLinks(currentPath: string) {
  return Object.keys(languages).map(lang => ({
    hreflang: lang === 'zh-cn' ? 'zh-CN' : lang,
    href: `https://jacquesbelmont.com${getLocalizedPath(currentPath, lang)}`
  }));
}

const translations: Record<string, any> = {
  // ... translations object from translations.ts
};