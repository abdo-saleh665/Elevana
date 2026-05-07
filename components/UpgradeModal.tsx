import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade?: (billingCycle: "monthly" | "annual") => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual",
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[700px]"
          >
            {/* Close Button */}
            <button aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
<span className="material-symbols-outlined text-lg">close</span>
</button>

            {/* Left Side - Dark Marketing Area */}
            <div className="md:w-2/5 bg-[#1e1b4b] relative p-5 md:p-6 text-white flex flex-col justify-between overflow-hidden">
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined text-yellow-300 text-lg">
                    auto_awesome
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-display leading-tight mb-2">
                  Unlock your academic potential.
                </h2>
                <p className="text-indigo-200 text-xs leading-relaxed">
                  Preview the Pro workflow locally before real billing is connected.
                </p>
              </div>

              <div className="relative z-10 space-y-3 mt-4">
                {/* Feature Highlight 1 */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <span className="material-symbols-outlined text-sm">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs">MVP Preview</div>
                    <div className="text-[9px] text-indigo-200">
                      Enables local demo Pro access
                    </div>
                  </div>
                </div>

                {/* Feature Highlight 2 */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined text-sm">
                      speed
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs">Study Tools</div>
                    <div className="text-[9px] text-indigo-200">
                      Notes, quizzes, and tutor context
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-300 border border-[#1e1b4b] flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-indigo-600 border border-[#1e1b4b] flex items-center justify-center text-[8px] font-bold">
                      MVP
                    </div>
                  </div>
                  <div className="text-[10px] italic text-indigo-200">
                    Local-only upgrade for testing the product flow.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Pricing & Features */}
            <div className="md:w-3/5 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                  Elevate with Pro
                </h3>
                <span className="material-symbols-outlined text-yellow-400 text-lg">
                  workspace_premium
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-5 text-xs">
                Choose the plan that fits your study style.
              </p>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-200 dark:bg-gray-800 p-0.5 rounded-lg inline-flex relative">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all z-10 ${
                      billingCycle === "monthly"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 z-10 ${
                      billingCycle === "annual"
                        ? "bg-[#312e81] text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Annual
                    <span
                      className={`text-[9px] px-1 py-0.5 rounded bg-indigo-500/30 text-indigo-100 ${
                        billingCycle === "annual"
                          ? ""
                          : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                      }`}
                    >
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-1.5">
                  <div className="text-left">Feature</div>
                  <div className="text-center">Free</div>
                  <div className="text-right text-[#312e81] dark:text-indigo-400">
                    Pro
                  </div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-3 items-center py-1.5 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300">
                    Uploads
                  </div>
                  <div className="text-center text-[10px] text-gray-500">
                    5 / mo
                  </div>
                  <div className="text-right">
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      Unlimited
                    </span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 items-center py-1.5 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300">
                    Quiz Type
                  </div>
                  <div className="text-center text-[10px] text-gray-500">
                    Basic
                  </div>
                  <div className="text-right font-bold text-xs text-[#312e81] dark:text-indigo-400 flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      psychology
                    </span>
                    AI Deep Dive
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-3 items-center py-1.5 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300">
                    Response Speed
                  </div>
                  <div className="text-center text-[10px] text-gray-500">
                    Standard
                  </div>
                  <div className="text-right font-bold text-[#312e81] dark:text-indigo-400 flex items-center justify-end">
                    <span className="material-symbols-outlined text-[14px]">
                      bolt
                    </span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-3 items-center py-1.5">
                  <div className="font-medium text-xs text-gray-700 dark:text-gray-300">
                    Export Options
                  </div>
                  <div className="text-center text-[10px] text-gray-500">
                    PDF Only
                  </div>
                  <div className="text-right font-bold text-xs text-[#312e81] dark:text-indigo-400">
                    All Formats
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-end gap-1.5 mb-0.5">
                  <span className="text-gray-400 line-through text-xs font-medium">
                    {billingCycle === "annual" ? "$6.00/mo" : "$7.50/mo"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {billingCycle === "annual" ? "$4.80" : "$6.00"}
                    </span>
                    <span className="text-gray-500 font-medium text-[10px]">
                      / month
                    </span>
                  </div>
                  {billingCycle === "annual" && (
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Billed $57.60 yearly
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mb-3">
                <span className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100 dark:border-orange-900/30">
                    Demo only - no payment charged
                  </span>
                </div>

                <button
                  onClick={() => {
                    onUpgrade?.(billingCycle);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#3d38b1] hover:bg-[#312e81] text-white rounded-lg font-bold text-sm shadow-md shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                >
                  Upgrade to Pro
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>

                <div className="flex items-center justify-center gap-3 mt-3 text-[9px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">
                      lock
                    </span>
                    Local demo upgrade
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">
                      calendar_today
                    </span>
                    Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
