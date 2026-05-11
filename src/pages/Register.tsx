import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User as UserIcon, Phone } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate name: only alphabets and spaces allowed
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces";
    }

    // Validate password: exactly 10 characters
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length !== 10) {
      errors.password = "Password must be exactly 10 characters long";
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    }

    // Validate phone: exactly 10 numeric digits
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-harvest-50 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-harvest-100"
      >
        <div className="bg-harvest-600 p-8 text-white text-center">
          <h2 className="font-serif text-3xl font-bold mb-2">Create Account</h2>
          <p className="opacity-80 text-sm">Join the AgriGuide community</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (validationErrors.name) setValidationErrors({...validationErrors, name: ""});
                  }}
                  className={`w-full bg-harvest-50 border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-earth-400 ${
                    validationErrors.name ? "border-red-500 focus:border-red-500" : "border-harvest-200"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (validationErrors.email) setValidationErrors({...validationErrors, email: ""});
                  }}
                  className={`w-full bg-harvest-50 border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-earth-400 ${
                    validationErrors.email ? "border-red-500 focus:border-red-500" : "border-harvest-200"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Phone Number <span className="text-xs text-earth-400">(exactly 10 digits)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow numeric values
                    const numericValue = e.target.value.replace(/[^\d]/g, "");
                    setFormData({...formData, phone: numericValue});
                    if (validationErrors.phone) setValidationErrors({...validationErrors, phone: ""});
                  }}
                  maxLength={10}
                  pattern="\d{10}"
                  inputMode="numeric"
                  className={`w-full bg-harvest-50 border rounded-xl py-2 pl-10 pr-12 focus:outline-none focus:border-earth-400 ${
                    validationErrors.phone ? "border-red-500 focus:border-red-500" : "border-harvest-200"
                  }`}
                  placeholder="9876543210"
                />
                <span className="absolute right-3 top-3 text-xs text-earth-400">{formData.phone.length}/10</span>
              </div>
              {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Password <span className="text-xs text-earth-400">(exactly 10 characters)</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-earth-300" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (validationErrors.password) setValidationErrors({...validationErrors, password: ""});
                  }}
                  className={`w-full bg-harvest-50 border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-earth-400 ${
                    validationErrors.password ? "border-red-500 focus:border-red-500" : "border-harvest-200"
                  }`}
                  placeholder="••••••••••"
                />
                <span className="absolute right-3 top-3 text-xs text-earth-400">{formData.password.length}/10</span>
              </div>
              {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-harvest-600 text-white py-3 rounded-xl font-bold hover:bg-harvest-700 transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg shadow-harvest-600/20"
            >
              <UserPlus size={20} />
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-earth-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-earth-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
