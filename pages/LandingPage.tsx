import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-neutral-200/60 dark:border-gray-800 glass-panel transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <a className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer">
            <div className="w-10 h-10 bg-primary dark:bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">E</div>
            <span className="self-center text-2xl font-bold whitespace-nowrap text-neutral-800 dark:text-white tracking-tight font-display">Elevana</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
            <button onClick={onLogin} className="text-neutral-600 dark:text-gray-300 hover:text-primary dark:hover:text-white font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">Log In</button>
            <button onClick={onGetStarted} className="text-white bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-primary-light focus:ring-4 focus:outline-none focus:ring-primary/20 font-medium rounded-lg text-sm px-6 py-2.5 text-center transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5">Get Started</button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
              <li><a href="#" className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="block py-2 px-3 text-neutral-600 hover:text-primary font-medium dark:text-gray-300 dark:hover:text-white transition-colors">Pricing</a></li>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-indigo-900/30 text-primary dark:text-indigo-300 text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                New: Flashcard integration is live
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-8 leading-[1.1] font-display">
                Master Your Lectures <br className="hidden md:block"/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-accent dark:to-indigo-300">AI Intelligence</span>
            </h1>
            
            <p className="mt-6 text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                Transform hours of university lectures into concise notes, interactive quizzes, and personalized study plans in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-4 bg-primary dark:bg-accent text-white rounded-xl font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary-dark dark:hover:bg-primary-light hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2 group">
                    Get Started for Free
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/10 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-white/10 transition-all duration-200 text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary dark:text-indigo-300">play_circle</span>
                    Watch Demo
                </button>
            </div>

            <div className="mt-20 relative mx-auto w-full max-w-6xl animate-float">
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
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Generating Summary</h3>
                                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">AI Processing</p>
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
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;