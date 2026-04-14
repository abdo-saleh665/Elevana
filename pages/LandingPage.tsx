import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQItem } from "../components/FAQItem";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly",
  );

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Height of the fixed navbar + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-neutral-200/60 dark:border-gray-800 glass-panel transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <a
            className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="self-center text-2xl font-bold whitespace-nowrap text-neutral-800 dark:text-white tracking-tight font-display">
              Eleva<span className="text-primary dark:text-indigo-400">na</span>
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => navigate("/login")}
              className="text-neutral-600 dark:text-gray-300 hover:text-primary dark:hover:text-white font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-white bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-primary-light focus:ring-4 focus:outline-none focus:ring-primary/20 font-medium rounded-lg text-sm px-6 py-2.5 text-center transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScroll(e, "features")}
                  className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScroll(e, "how-it-works")}
                  className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScroll(e, "pricing")}
                  className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Background blobs */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-blue-100/40 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-indigo-900/30 text-primary dark:text-indigo-300 text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            New: Flashcard integration is live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-8 leading-[1.1] font-display"
          >
            Master Your Lectures <br className="hidden md:block" /> with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-indigo-300">
              AI Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Transform hours of university lectures into concise notes,
            interactive quizzes, and personalized study plans in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 py-4 bg-primary dark:bg-accent text-white rounded-xl font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary-dark dark:hover:bg-primary-light hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/10 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-white/10 transition-all duration-200 text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md backdrop-blur-sm">
              <span className="material-symbols-outlined text-primary dark:text-indigo-300">
                play_circle
              </span>
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-20 relative mx-auto w-full max-w-6xl animate-float"
          >
            <div className="rounded-2xl overflow-hidden shadow-premium dark:shadow-none dark:border dark:border-white/10 bg-white dark:bg-gray-900 ring-1 ring-gray-900/5 dark:ring-white/10">
              <div className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <div className="mx-auto w-1/3 h-6 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  elevana.ai/dashboard
                </div>
              </div>
              <div className="relative aspect-[16/10] w-full bg-neutral-50 dark:bg-gray-900 overflow-hidden group">
                <img
                  src="https://picsum.photos/1200/800"
                  alt="Dashboard Preview"
                  className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 max-w-lg w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-300">
                      <span className="material-symbols-outlined">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                        Generating Summary
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                        AI Processing
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2.5 bg-neutral-200 dark:bg-gray-700 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-2.5 bg-neutral-200 dark:bg-gray-700 rounded-full w-full animate-pulse delay-75"></div>
                    <div className="h-2.5 bg-neutral-200 dark:bg-gray-700 rounded-full w-5/6 animate-pulse delay-150"></div>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
                    <span>Processing lecture audio...</span>
                    <span>78%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-neutral-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary dark:bg-accent w-[78%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-18 bg-background-light dark:bg-background-dark relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary dark:text-indigo-400 font-semibold tracking-wide uppercase text-sm">
              Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl font-display">
              Everything you need to <br />{" "}
              <span className="text-primary dark:text-indigo-400">
                ace your exams
              </span>
            </h2>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
              Stop drowning in readings. Let Elevana organize your study
              material so you can focus on understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "PDF to Notes",
                desc: "Upload raw lecture slides or textbook chapters. Our AI instantly extracts key concepts and generates concise, readable summaries.",
                icon: "description",
                color:
                  "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
              },
              {
                title: "AI Quizzes",
                desc: "Test your knowledge immediately. Generate multiple choice or short-answer quizzes based specifically on your uploaded materials.",
                icon: "quiz",
                color:
                  "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
              },
              {
                title: "Study Plans",
                desc: "Never miss a deadline. Elevana creates a personalized study schedule tailored to your exam dates and learning pace.",
                icon: "event_note",
                color:
                  "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100 dark:border-white/5 group"
              >
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 font-display">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-white dark:bg-surface-dark border-y border-neutral-100 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 dark:text-white font-display mb-4">
              From PDF to A+ in{" "}
              <span className="text-emerald-500">3 simple steps</span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Our AI handles the heavy lifting so you can focus on actually
              learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 dark:from-emerald-900/30 dark:via-emerald-800/50 dark:to-emerald-900/30 z-0"></div>

            {[
              {
                step: "01",
                title: "Upload Material",
                desc: "Drag & drop your lecture slides, PDFs, or paste a YouTube link.",
                icon: "upload_file",
              },
              {
                step: "02",
                title: "AI Analysis",
                desc: "Elevana instantly reads, summarizes, and extracts key concepts.",
                icon: "auto_awesome",
              },
              {
                step: "03",
                title: "Start Mastering",
                desc: "Get instant quizzes, flashcards, and a tailored study schedule.",
                icon: "school",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-white dark:bg-surface-dark rounded-full border-4 border-emerald-50 dark:border-emerald-900/20 flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-emerald-500">
                    {item.icon}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                    Step {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 dark:text-white font-display mb-6">
            Invest in your GPA
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your semester workload. Cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${billingCycle === "monthly" ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle((prev) =>
                  prev === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`w-16 h-9 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-accent/30 shadow-inner ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-primary-light"
                  : "bg-neutral-200 dark:bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${billingCycle === "yearly" ? "translate-x-7" : ""}`}
              ></div>
            </button>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${billingCycle === "yearly" ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`}
            >
              Yearly{" "}
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full ml-1 border border-emerald-100 dark:border-emerald-800/30">
                SAVE 20%
              </span>
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-neutral-100 dark:border-white/5 shadow-sm text-left relative overflow-hidden group hover:border-primary/20 transition-all"
            >
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-display">
                Free
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Perfect for trying out AI-powered study.
              </p>

              <div className="mt-8 mb-8">
                <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                  $0
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  /mo
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "5 PDF Uploads / month",
                  "Basic Summaries",
                  "Standard Support",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                      check
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                className="w-full py-3.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1E1B4B] dark:bg-black rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative text-left overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                MOST POPULAR
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              <h3 className="text-xl font-bold text-white font-display">Pro</h3>
              <p className="text-sm text-indigo-200 mt-2">
                For serious students aiming for top grades.
              </p>

              <div className="mt-8 mb-8">
                <span className="text-5xl font-bold text-white">
                  ${billingCycle === "monthly" ? "6.00" : "4.80"}
                </span>
                <span className="text-indigo-300">/mo</span>
                {billingCycle === "yearly" && (
                  <div className="text-xs text-emerald-400 font-medium mt-1">
                    Billed $57.60 yearly
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited PDF Uploads",
                  "Advanced AI Quizzes (Deep Mode)",
                  "Personalized Study Plans",
                  "Priority Email Support",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[14px] font-bold">
                        check
                      </span>
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                className="w-full py-3.5 rounded-xl bg-white text-primary-dark font-bold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-surface-dark border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-white font-display mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is Elevana free to use?",
                a: "Yes! Our Student Basic plan is completely free and includes 5 PDF uploads per month, basic summaries, and standard support. No credit card required to start.",
              },
              {
                q: "How accurate is the AI summarization?",
                a: "We use advanced large language models optimized for academic content. While accuracy is very high (98%+), we always recommend reviewing the summaries alongside your original material.",
              },
              {
                q: "Can I upload handwritten notes?",
                a: "Currently, we specialize in digital text (PDF, PPTX, DOCX) and audio/video lectures. Handwritten note recognition is on our roadmap for Q4 2026.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use enterprise-grade encryption (AES-256) and Row Level Security. Your uploads are private and are NEVER used to train our public models.",
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary dark:bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-6">
            Ready to ace your exams?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter, not
            harder.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-primary-dark font-bold py-4 px-10 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:bg-indigo-50 hover:-translate-y-1 transition-all duration-300"
          >
            Get Started Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-surface-light dark:bg-[#05080F] border-t border-neutral-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <a className="flex items-center space-x-2.5 mb-6">
                <span className="self-center text-xl font-bold whitespace-nowrap text-neutral-800 dark:text-white tracking-tight font-display">
                  Eleva
                  <span className="text-primary dark:text-indigo-400">na</span>
                </span>
              </a>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
                Elevana is the AI-powered study companion that helps you master
                your lectures, ace your exams, and reclaim your free time.
              </p>
              <div className="flex gap-4 mt-6">
                {["twitter", "github"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-primary hover:text-white dark:hover:bg-accent transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {social === "twitter" ? "flutter_dash" : "code"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white mb-6">
                Product
              </h4>
              <ul className="space-y-4 text-sm text-neutral-500 dark:text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Integration
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white mb-6">
                Resources
              </h4>
              <ul className="space-y-4 text-sm text-neutral-500 dark:text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white mb-6">
                Legal
              </h4>
              <ul className="space-y-4 text-sm text-neutral-500 dark:text-neutral-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary dark:hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400 dark:text-neutral-600">
              © 2026 Elevana Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
