import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  ExternalLink,
  X,
  AlertTriangle,
  CheckCircle,
  Loader,
} from "lucide-react";

interface Scheme {
  _id?: string;
  name: string;
  description: string;
  category: "central" | "state";
  link: string;
  createdAt?: Date;
}

interface GovernmentSchemesProps {
  onStatusChange?: (status: { type: "success" | "error"; msg: string }) => void;
}

export default function GovernmentSchemes({
  onStatusChange,
}: GovernmentSchemesProps) {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Scheme>({
    name: "",
    description: "",
    category: "central",
    link: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/schemes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch schemes");
      const data = await res.json();
      setSchemes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.description.trim() || !formData.link.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add scheme");
      }

      fetchSchemes();
      setFormData({ name: "", description: "", category: "central", link: "" });
      setIsAdding(false);
      onStatusChange?.({ type: "success", msg: "Scheme added successfully!" });
    } catch (err: any) {
      setError(err.message);
      onStatusChange?.({ type: "error", msg: err.message });
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheme?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/schemes/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to delete scheme");

      fetchSchemes();
      onStatusChange?.({ type: "success", msg: "Scheme deleted successfully!" });
    } catch (err: any) {
      setError(err.message);
      onStatusChange?.({ type: "error", msg: err.message });
    }
  };

  const centralSchemes = schemes.filter((s) => s.category === "central");
  const stateSchemes = schemes.filter((s) => s.category === "state");

  return (
    <div className="min-h-screen pt-24 pb-12 bg-harvest-50 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-earth-800">
              Government Schemes
            </h1>
            <p className="text-earth-400">Manage agricultural schemes and programs</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-harvest-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-harvest-700 transition-all shadow-md"
          >
            <Plus size={20} /> Add Scheme
          </button>
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg text-white bg-red-500 shadow-red-500/20"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} />
              {error}
            </div>
            <button onClick={() => setError(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <Loader size={48} className="mx-auto text-harvest-600 animate-spin mb-4" />
            <p className="text-earth-400 italic text-lg">Loading schemes...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Central Government Schemes */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-earth-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Central Government Schemes
              </h2>

              {centralSchemes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[40px] border border-harvest-100">
                  <p className="text-earth-400 italic">No central schemes added yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {centralSchemes.map((scheme) => (
                    <motion.div
                      key={scheme._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[32px] border border-blue-100 shadow-lg p-6 hover:shadow-xl transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-earth-900 text-lg flex-1">
                          {scheme.name}
                        </h3>
                        <button
                          onClick={() => handleDeleteScheme(scheme._id!)}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-earth-600 text-sm mb-4 line-clamp-3">
                        {scheme.description}
                      </p>

                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
                      >
                        Official Link
                        <ExternalLink size={14} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* State Government Schemes */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-earth-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                State Government Schemes
              </h2>

              {stateSchemes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[40px] border border-harvest-100">
                  <p className="text-earth-400 italic">No state schemes added yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stateSchemes.map((scheme) => (
                    <motion.div
                      key={scheme._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[32px] border border-emerald-100 shadow-lg p-6 hover:shadow-xl transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-earth-900 text-lg flex-1">
                          {scheme.name}
                        </h3>
                        <button
                          onClick={() => handleDeleteScheme(scheme._id!)}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-earth-600 text-sm mb-4 line-clamp-3">
                        {scheme.description}
                      </p>

                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors"
                      >
                        Official Link
                        <ExternalLink size={14} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Add Scheme Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <header className="px-8 py-6 border-b border-harvest-100 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-earth-800">
                    Add New Scheme
                  </h2>
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-harvest-50 rounded-xl text-earth-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </header>

              <form onSubmit={handleAddScheme} className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-earth-700 mb-2">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2 px-4 focus:outline-none focus:border-earth-400"
                    placeholder="e.g., PM-Kisan, Raita Mitra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-earth-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2 px-4 focus:outline-none focus:border-earth-400 min-h-[100px]"
                    placeholder="Brief description of the scheme"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-earth-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as "central" | "state",
                      })
                    }
                    className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2 px-4 focus:outline-none focus:border-earth-400"
                  >
                    <option value="central">Central Government</option>
                    <option value="state">State Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-earth-700 mb-2">
                    Official Link
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full bg-harvest-50 border border-harvest-200 rounded-xl py-2 px-4 focus:outline-none focus:border-earth-400 font-mono text-xs"
                    placeholder="https://example.gov.in"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-earth-900 text-white py-3 rounded-2xl font-bold hover:bg-earth-800 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Add Scheme
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
