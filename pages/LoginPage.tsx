import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #e8eaf6 0%, #e3f2fd 30%, #f3e5f5 60%, #ede7f6 100%)",
      }}
    >
      {/* Floating Letters Animation */}
      <style>{`
        @keyframes floatLetter {
          0% { transform: translateY(0px) rotate(var(--start-rot)); opacity: var(--letter-opacity); }
          50% { transform: translateY(var(--float-dist)) rotate(var(--end-rot)); opacity: calc(var(--letter-opacity) * 1.2); }
          100% { transform: translateY(0px) rotate(var(--start-rot)); opacity: var(--letter-opacity); }
        }
      `}</style>
      {[
        {
          char: "E",
          top: "8%",
          left: "5%",
          size: "6rem",
          opacity: 0.07,
          duration: "8s",
          delay: "0s",
          rot: "-15deg",
          rotEnd: "5deg",
        },
        {
          char: "l",
          top: "15%",
          left: "85%",
          size: "5rem",
          opacity: 0.06,
          duration: "10s",
          delay: "1s",
          rot: "10deg",
          rotEnd: "-10deg",
        },
        {
          char: "e",
          top: "70%",
          left: "8%",
          size: "7rem",
          opacity: 0.05,
          duration: "12s",
          delay: "0.5s",
          rot: "5deg",
          rotEnd: "20deg",
        },
        {
          char: "v",
          top: "75%",
          left: "88%",
          size: "5.5rem",
          opacity: 0.07,
          duration: "9s",
          delay: "2s",
          rot: "-10deg",
          rotEnd: "15deg",
        },
        {
          char: "a",
          top: "5%",
          left: "45%",
          size: "4.5rem",
          opacity: 0.05,
          duration: "11s",
          delay: "1.5s",
          rot: "20deg",
          rotEnd: "-5deg",
        },
        {
          char: "n",
          top: "85%",
          left: "50%",
          size: "6rem",
          opacity: 0.06,
          duration: "10s",
          delay: "0.8s",
          rot: "-20deg",
          rotEnd: "10deg",
        },
        {
          char: "a",
          top: "40%",
          left: "3%",
          size: "4rem",
          opacity: 0.08,
          duration: "13s",
          delay: "2.5s",
          rot: "15deg",
          rotEnd: "-15deg",
          primary: true,
        },
        {
          char: "E",
          top: "45%",
          left: "92%",
          size: "5rem",
          opacity: 0.05,
          duration: "9s",
          delay: "1.2s",
          rot: "-5deg",
          rotEnd: "25deg",
          primary: false,
        },
        {
          char: "l",
          top: "25%",
          left: "20%",
          size: "3.5rem",
          opacity: 0.04,
          duration: "14s",
          delay: "3s",
          rot: "25deg",
          rotEnd: "0deg",
          primary: false,
        },
        {
          char: "v",
          top: "60%",
          left: "75%",
          size: "4rem",
          opacity: 0.04,
          duration: "11s",
          delay: "0.3s",
          rot: "-25deg",
          rotEnd: "5deg",
          primary: false,
        },
        {
          char: "e",
          top: "20%",
          left: "65%",
          size: "3.5rem",
          opacity: 0.03,
          duration: "12s",
          delay: "2s",
          rot: "10deg",
          rotEnd: "-20deg",
          primary: false,
        },
        {
          char: "n",
          top: "55%",
          left: "30%",
          size: "3rem",
          opacity: 0.08,
          duration: "15s",
          delay: "1s",
          rot: "-8deg",
          rotEnd: "12deg",
          primary: true,
        },
      ].map((l, i) => (
        <span
          key={i}
          className={`absolute pointer-events-none select-none font-display font-extrabold ${l.primary ? "text-indigo-600" : "text-neutral-500"}`}
          style={
            {
              top: l.top,
              left: l.left,
              fontSize: l.size,
              "--letter-opacity": l.primary ? 0.3 : 0.08,
              "--float-dist": `${-15 - (i % 3) * 10}px`,
              "--start-rot": l.rot,
              "--end-rot": l.rotEnd,
              animation: `floatLetter ${l.duration} ease-in-out ${l.delay} infinite`,
              opacity: l.primary ? 0.3 : 0.08,
            } as React.CSSProperties
          }
        >
          {l.char}
        </span>
      ))}

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-premium px-8 py-10 relative z-10">
        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-8">
          <button className="flex-1 pb-3 text-sm font-semibold text-primary border-b-2 border-primary transition-colors">
            Log In
          </button>
          <button
            className="flex-1 pb-3 text-sm font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-neutral-900 font-display mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-500">
            Master your learning journey today.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-5">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 font-medium py-3 px-3 rounded-xl hover:bg-neutral-50 transition-all shadow-sm hover:shadow-md text-sm">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 font-medium py-3 px-3 rounded-xl hover:bg-neutral-50 transition-all shadow-sm hover:shadow-md text-sm">
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
              <path d="M11 0H0V11H11V0Z" fill="#F25022" />
              <path d="M23 0H12V11H23V0Z" fill="#7FBA00" />
              <path d="M11 12H0V23H11V12Z" fill="#00A4EF" />
              <path d="M23 12H12V23H23V12Z" fill="#FFB900" />
            </svg>
            Microsoft
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 font-medium py-3 px-3 rounded-xl hover:bg-neutral-50 transition-all shadow-sm hover:shadow-md text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.99 2.97 12.5 4.7 9.56C5.55 8.09 7.13 7.17 8.82 7.15C10.1 7.13 11.32 8.01 12.11 8.01C12.89 8.01 14.37 6.95 15.92 7.11C16.57 7.14 18.39 7.38 19.56 9.07C19.47 9.13 17.29 10.39 17.31 13.03C17.34 16.18 20.05 17.27 20.08 17.28C20.05 17.35 19.61 18.87 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink-0 mx-4 text-neutral-400 text-[11px] uppercase tracking-widest font-semibold">
            Or
          </span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        {/* Form */}
        <form
          className="space-y-5 mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 text-[18px]">
                  mail
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-sm"
                placeholder="student@university.edu"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 text-[18px]">
                  lock
                </span>
              </div>
              <input
                className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-sm"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div className="text-right">
              <a
                href="#"
                className="text-xs font-medium text-primary hover:text-primary-dark"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="w-full text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #312E81, #4338CA)",
              }}
            >
              Sign In
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </form>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            By continuing, you agree to Elevana's{" "}
            <a href="#" className="underline hover:text-neutral-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-neutral-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
