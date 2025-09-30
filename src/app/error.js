"use client";

const ErrorPage = ({ error, reset }) => {
  return (
    <div className="min-h-screen  from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="relative bgColor  rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl border border-purple-500/30 transform transition-all duration-500 hover:scale-105">
        {/* Animated Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src="/bug.png"
              alt="Error icon"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="w-30 h-30 md:w-32 md:h-32 animate-pulse opacity-90"
            />
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        {/* Headline with Gradient Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Something Went Wrong
        </h2>

        {/* Error Message with Subtle Animation */}
        <p className="mt-4 text-lg text-gray-300 bg-gray-900/50 p-4 rounded-xl border border-red-500/30 animate-fade-in">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>

        {/* Premium Try Again Button with Hover Effect */}
        <button
          onClick={() => reset()}
          aria-label="Try again"
          className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-purple-500/50"
        >
          Try Again
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;