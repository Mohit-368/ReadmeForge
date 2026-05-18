import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../i18n';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  return translations[language];
};