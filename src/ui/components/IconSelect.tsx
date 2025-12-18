/**
 * Custom Select Component with Icon Support
 * 
 * A dropdown select that can display icons alongside text labels.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface IconSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface IconSelectProps {
  options: IconSelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const IconSelect: React.FC<IconSelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center gap-2 px-3 py-2 
          bg-civ-surface border border-civ-border rounded-lg
          text-left text-sm text-gray-200
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-civ-hover cursor-pointer'}
          ${isOpen ? 'border-civ-accent ring-1 ring-civ-accent/50' : ''}
        `}
      >
        {selectedOption?.icon && (
          <span className="flex-shrink-0">{selectedOption.icon}</span>
        )}
        <span className="flex-1 truncate">
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 py-1 bg-civ-surface border border-civ-border rounded-lg shadow-xl max-h-60 overflow-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-left text-sm
                transition-colors
                ${option.disabled 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-gray-200 hover:bg-civ-hover cursor-pointer'
                }
                ${option.value === value ? 'bg-civ-accent/20 text-civ-accent' : ''}
              `}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <svg className="w-4 h-4 ml-auto text-civ-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

