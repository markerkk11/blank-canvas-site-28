import { useLanguage } from './useLanguage';
import { translations, TranslationKey, LanguageCode } from '@/locales/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    const langCode = currentLanguage.code as LanguageCode;
    return translations[langCode]?.[key] || translations.en[key] || key;
  };

  return { t };
};