import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";

// Language configuration with proper metadata
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼", native: "Ikinyarwanda" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
];

// Core language selector hook for reusability
const useLanguageSelector = (initialLang = "en") => {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (langCode: React.SetStateAction<string>) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    // Simulate language change callback
    console.log(`Language changed to: ${langCode}`);
  };

  return {
    currentLang,
    isOpen,
    setIsOpen,
    changeLanguage,
    currentLanguage: LANGUAGES.find((lang) => lang.code === currentLang),
  };
};

export const ModernDropdownSelector = ({
  lang,
  changeLanguage,
}: {
  lang: any;
  changeLanguage: any;
}) => {
  const {
    currentLang,
    isOpen,
    setIsOpen,
    changeLanguage: handleChange,
    currentLanguage,
  } = useLanguageSelector(lang);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref type for a div element

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    handleChange(langCode);
    changeLanguage(langCode); // Call parent callback
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              role="option"
              aria-selected={currentLang === language.code}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.native}</div>
                </div>
              </div>
              {currentLang === language.code && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
