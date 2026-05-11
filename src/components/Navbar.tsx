import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, LogOut, LayoutDashboard, User as UserIcon, MessageSquare } from "lucide-react";
import { useAuth } from "../AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-harvest-100 border-b border-harvest-200 py-4 px-6 fixed top-0 w-full z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-earth-600 p-2 rounded-xl group-hover:bg-earth-500 transition-colors">
            <Sprout className="text-harvest-100" size={24} />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-earth-800">AgriGuide</span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link to="/" className="text-earth-700 hover:text-earth-900 flex items-center gap-1 font-medium">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="text-earth-700 hover:text-earth-900 flex items-center gap-1 font-medium">
                <UserIcon size={18} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <div className="h-6 w-px bg-harvest-300 mx-2" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-earth-600 hidden md:inline">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-harvest-200 hover:bg-harvest-300 text-earth-800 p-2 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-earth-700 hover:text-earth-900 font-medium">Login</Link>
            <Link to="/register" className="bg-earth-600 text-white px-5 py-2 rounded-full font-medium hover:bg-earth-700 transition-colors">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
