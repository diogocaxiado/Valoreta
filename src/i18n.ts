import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationPT from "./locales/pt/translation.json";
import translationEN from "./locales/en/translation.json";

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
};

i18n
  .use(LanguageDetector) // detecta idioma do navegador
  .use(initReactI18next) // conecta com o React
  .init({
    resources,
    fallbackLng: "en", // idioma padrão
    interpolation: {
      escapeValue: false, // React já faz o escaping
    },
    detection: {
      order: ["navigator", "htmlTag", "localStorage", "cookie", "path"],
      caches: ["localStorage"], // salva a escolha do idioma
    },
  });

export default i18n;
