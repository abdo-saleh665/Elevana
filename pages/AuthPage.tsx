import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 bg-white dark:bg-surface-dark z-10 relative">
        <div className="absolute top-8 left-8 sm:left-12 lg:left-20">
          <a className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary dark:bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">E</div>
            <span className="text-2xl font-bold text-neutral-800 dark:text-white tracking-tight font-display">Elevana</span>
          </a>
        </div>

        <div className="max-w-md w-full mx-auto mt-16 lg:mt-0">
          <div className="mb-10">
            <div className="inline-flex bg-neutral-100 dark:bg-gray-800/50 p-1 rounded-xl w-full relative">
              <div className={`w-1/2 h-full absolute left-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-in-out transform ${!isLogin ? 'translate-x-full' : 'translate-x-0'}`}></div>
              <button 
                className={`w-1/2 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors focus:outline-none ${isLogin ? 'text-primary dark:text-white' : 'text-neutral-500 dark:text-gray-400'}`}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
              <button 
                className={`w-1/2 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-colors focus:outline-none ${!isLogin ? 'text-primary dark:text-white' : 'text-neutral-500 dark:text-gray-400'}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </div>

          {isLogin ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white font-display mb-2">Welcome back</h1>
                <p className="text-neutral-500 dark:text-gray-400">Enter your details to access your study dashboard.</p>
              </div>
              
              <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google logo" />
                 Continue with Google
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs uppercase tracking-wider font-semibold">Or continue with email</span>
                <div className="flex-grow border-t border-neutral-200 dark:border-gray-700"></div>
              </div>

              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">Email Address</label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">mail</span>
                        </div>
                        <input className="block w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="student@university.edu" type="email" />
                    </div>
                </div>
                 <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">Password</label>
                        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark dark:text-accent dark:hover:text-primary-light">Forgot password?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-neutral-400 text-[20px]">lock</span>
                        </div>
                        <input className="block w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="••••••••" type="password" />
                    </div>
                </div>
                <div className="pt-2">
                    <button className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-primary-light text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Sign In
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white font-display mb-2">Create an account</h1>
                    <p className="text-neutral-500 dark:text-gray-400">Join thousands of students mastering their lectures.</p>
                </div>
                 <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google logo" />
                    Continue with Google
                </button>
                 <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-neutral-200 dark:border-gray-700"></div>
                    <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs uppercase tracking-wider font-semibold">Or create with email</span>
                    <div className="flex-grow border-t border-neutral-200 dark:border-gray-700"></div>
                </div>
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSignUp(); }}>
                     <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-neutral-400 text-[20px]">mail</span>
                            </div>
                            <input className="block w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="student@university.edu" type="email" />
                        </div>
                    </div>
                     <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-neutral-400 text-[20px]">lock</span>
                            </div>
                            <input className="block w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-gray-800/50 border border-neutral-200 dark:border-gray-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Create a strong password" type="password" />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Must be at least 8 characters.</p>
                    </div>
                    <div className="pt-2">
                        <button className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-primary-light text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            Create Account
                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        </button>
                    </div>
                </form>
                 <div className="mt-8 text-center">
                    <p className="text-xs text-neutral-400">
                        By continuing, you agree to Elevana's <a href="#" className="underline hover:text-neutral-600 dark:hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-600 dark:hover:text-gray-300">Privacy Policy</a>.
                    </p>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent z-10"></div>
        <img 
            src="https://picsum.photos/1200/1600" 
            alt="Study Environment" 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105" 
            style={{ filter: 'contrast(0.95) brightness(0.95)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-20 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-semibold mb-6">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI-Powered Learning
            </div>
            <h2 className="text-4xl font-extrabold font-display leading-tight mb-4">
                "Elevana completely transformed how I prepare for exams."
            </h2>
            <div className="flex items-center gap-4 mt-8">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                         <img key={i} src={`https://picsum.photos/100/100?random=${i}`} alt="Student" className="w-10 h-10 rounded-full border-2 border-primary-dark object-cover" />
                    ))}
                </div>
                <div className="text-indigo-100 text-sm font-medium">
                    Trusted by 10,000+ students from top universities
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;