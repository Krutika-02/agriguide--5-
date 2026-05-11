import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, UserPlus, Phone, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"farmer" | "admin">("farmer");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loginRole", role);
      
      login(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-harvest-50 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-harvest-100"
      >
        {/* Toggle Buttons Header */}
        <div className="bg-earth-600 p-6 text-white">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setRole("farmer")}
              className={`flex-1 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                role === "farmer"
                  ? "bg-harvest-500 text-white shadow-lg shadow-harvest-500/30"
                  : "bg-earth-700 text-earth-100 hover:bg-earth-600"
              }`}
            >
              🌾 Farmer Login
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                role === "admin"
                  ? "bg-harvest-500 text-white shadow-lg shadow-harvest-500/30"
                  : "bg-earth-700 text-earth-100 hover:bg-earth-600"
              }`}
            >
              👨‍💼 Admin Login
            </button>
          </div>
          <h2 className="font-serif text-3xl font-bold text-center">
            {role === "admin" ? "Admin Access" : "Farmer Portal"}
          </h2>
          <p className="opacity-80 text-sm text-center mt-2">Welcome back to AgriGuide</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-earth-400 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-earth-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-earth-600 text-white py-3 rounded-xl font-bold hover:bg-earth-700 transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg shadow-earth-600/20"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-harvest-100 text-center">
            <p className="text-earth-600 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-harvest-600 font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
