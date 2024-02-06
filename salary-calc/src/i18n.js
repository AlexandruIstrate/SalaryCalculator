import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Set supported languages
export const supportedLngs = {
    en: {
        code: "en",
        flagCountryCode: "GB"
    },
    de: {
        code: "de",
        flagCountryCode: "DE"
    },
    es: {
        code: "es",
        flagCountryCode: "ES"
    },
    fr: {
        code: "fr",
        flagCountryCode: "FR"
    },
    it: {
        code: "it",
        flagCountryCode: "IT"
    },
    ro: {
        code: "ro",
        flagCountryCode: "RO"
    }
};

// Configure i18n
i18n
    // Load translations from backend
    .use(Backend)
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        debug: (process.env.NODE_ENV === "development"),
        fallbackLng: "en",
        supportedLngs: Object.keys(supportedLngs),
        interpolation: {
            escapeValue: false // Not needed for react as it escapes by default
        },
        backend: {
            loadPath: "/SalaryCalculator/locales/{{lng}}/{{ns}}.json" // Make sure we specify the path with our app name prefix
        }
    });

export default i18n;