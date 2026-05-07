import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  icon: string;
  labelPrefix?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  icon,
  labelPrefix = "",
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md ${
          isOpen
            ? "border-primary text-primary ring-2 ring-primary/20 dark:bg-gray-800"
            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary active:bg-gray-50 dark:active:bg-gray-800"
        }`}
      >
        <span className={`material-symbols-outlined text-[18px] ${isOpen ? "text-primary" : "text-gray-400 group-hover:text-primary"}`}>
          {icon}
        </span>
        {labelPrefix}
        {selectedOption?.label}
        <span className={`material-symbols-outlined text-[18px] transition-transform ${isOpen ? "rotate-180 text-primary" : "text-gray-400"}`}>
          arrow_drop_down
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-48 origin-top-left bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 focus:outline-none"
          >
            <div className="py-1 px-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    value === option.value
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
