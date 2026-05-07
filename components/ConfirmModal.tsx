import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false,
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-premium overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Top accent line */}
            <div className={`h-1 w-full ${danger ? 'bg-red-500' : 'bg-primary'}`}></div>

            <div className="p-6 sm:p-8">
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}`}>
                  <span className="material-symbols-outlined">
                    {danger ? 'warning' : 'info'}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all transform hover:-translate-y-0.5 ${
                    danger
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                      : 'bg-primary hover:bg-primary-dark shadow-indigo-500/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
