import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden bg-neutral-50 dark:bg-white/5 transition-colors hover:border-primary/30 dark:hover:border-indigo-400/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-medium text-neutral-900 dark:text-white"
      >
        {question}
        <span
          className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? "rotate-180 text-primary dark:text-indigo-400" : "text-neutral-400"}`}
        >
          expand_more
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
