import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageDropdownProps {
  isScrolled: boolean;
  isTopUpPage: boolean;
}

const LanguageDropdown = ({ isScrolled, isTopUpPage }: LanguageDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, availableLanguages, setLanguage } = useLanguage();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const textColor = (isScrolled || !isTopUpPage) ? 'text-[#004a59]' : 'text-white';

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 200ms delay before closing
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex items-center space-x-2 cursor-pointer px-2 py-1 rounded transition-colors`}>
        <div className="flex items-center space-x-1">
          <img src="/flag-icon.png" alt="Language" className="w-5 h-5" />
          <span className={`text-sm ${textColor}`}>{currentLanguage.code.toUpperCase()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 ${textColor} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
            >
              <span className="text-base">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;