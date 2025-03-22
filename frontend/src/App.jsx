import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MatchPrediction from "./pages/MatchPrediction";
import Scoreboard from "./pages/Scoreboard";
import NotFound from "./pages/NotFound";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import './App.css';


export default function App() {
  return (
    <Router>
      <AuthProvider> {/* Ensure AuthProvider wraps Router */}
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Scoreboard />} />
            <Route path="/match-prediction" element={<ProtectedRoute element={<MatchPrediction />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} adminOnly />} />
            <Route path="/login" element={<GuestRoute element={<Login />} />} />
            <Route path="/register" element={<GuestRoute element={<Register />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

// Higher Order Component for Protected Routes
function ProtectedRoute({ element, adminOnly = false }) {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user || (adminOnly && !isAdmin)) {
    return <NotFound />; // Redirect unauthorized users to 404 page
  }

  return element;
}

// Higher Order Component for Guest Routes
function GuestRoute({ element }) {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Scoreboard />; // Redirect logged-in users to scoreboard
  }

  return element;
}