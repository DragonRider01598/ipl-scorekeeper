import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        if (data.msg) {
          alert(data.msg);
        } else {
          alert(data.errors[0].msg);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-500/10 p-3 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-center">
              Join our community and start predicting matches
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Input Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Choose a strong password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 ml-1 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <Lock className="h-4 w-4" />
              <p>Your data is securely encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;