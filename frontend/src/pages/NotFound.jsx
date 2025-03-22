import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 hover:scale-[1.01]">
        {/* 404 Number */}
        <img src='./NotFound.webp' alt="Lost Dragon" className="w-64 h-64 mb-4 rounded-lg mx-auto" />

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          Oops! It seems you've ventured into uncharted territory. The page you're looking for doesn't exist in this realm.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl gap-2 group"
          >
            <Home className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            <span>Return Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700/50 text-gray-300 font-medium rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:text-white hover:bg-gray-700 gap-2 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-gray-500 text-sm">
            Lost? Don't worry, we've all been there.
          </p>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}