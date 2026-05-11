import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Trash2, Edit2, Users, Wheat, LayoutGrid, 
  CheckCircle, Search, User as UserIcon, X, Save,
  Droplets, Clock, AlertTriangle, GraduationCap, ChevronRight, HelpCircle, Sprout, BookOpen
} from "lucide-react";
import { useAuth } from "../AuthContext";
import GovernmentSchemes from "../components/GovernmentSchemes";

interface CropSchema {
  _id?: string;
  name: string;
  season: string;
  imageUrl: string;
  howToGrow: {
    soilType: string;
    waterRequirements: string;
    duration: string;
    steps: string[];
  };
  diseases: Array<{
    name: string;
    symptoms: string;
    causes: string;
    prevention: string;
    medicine: string;
    medicineUsage: string;
  }>;
  schemes: Array<{
    name: string;
    description: string;
    benefits: string;
    eligibility: string;
    applicationProcess: string[];
    link: string;
  }>;
}

const INITIAL_CROP: CropSchema = {
  name: "",
  season: "Winter",
  imageUrl: "",
  howToGrow: { soilType: "", waterRequirements: "", duration: "", steps: [""] },
  diseases: [],
  schemes: [],
};

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"crops" | "schemes">("crops");
  const [crops, setCrops] = useState<CropSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CropSchema>(INITIAL_CROP);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (activeTab === "crops") {
        const res = await fetch("/api/crops", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch crops: ${res.status}`);
        }
        const data = await res.json();
        setCrops(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Failed to load data");
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatus({ type: 'error', msg: 'Crop Common Name is required' });
      return;
    }
    const method = formData._id ? "PUT" : "POST";
    const url = formData._id ? `/api/crops/${formData._id}` : "/api/crops";
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditing(false);
        setFormData(INITIAL_CROP);
        fetchData();
        setStatus({ type: 'success', msg: 'Knowledge published successfully!' });
      } else {
        const err = await res.json();
        setStatus({ type: 'error', msg: err.error || 'Failed to save' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error occurred' });
    }
  };

  const deleteCrop = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/crops/${id}`, { 
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (crop: CropSchema) => {
    setFormData(crop);
    setIsEditing(true);
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-earth-500">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-harvest-50 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-earth-800">AgriGuide Admin</h1>
            <p className="text-earth-400">Control crop knowledge and manage schemes.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-harvest-100">
            <button
              onClick={() => setActiveTab("crops")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                activeTab === "crops" ? "bg-earth-900 text-white shadow-lg" : "text-earth-400 hover:text-earth-600"
              }`}
            >
              <Wheat size={18} /> Crops
            </button>
            <button
              onClick={() => setActiveTab("schemes")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                activeTab === "schemes" ? "bg-earth-900 text-white shadow-lg" : "text-earth-400 hover:text-earth-600"
              }`}
            >
              <BookOpen size={18} /> Schemes
            </button>
          </div>
        </header>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl font-bold flex items-center justify-between shadow-lg text-white ${
              status.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              {status.msg}
            </div>
            <button onClick={() => setStatus(null)}><X size={18}/></button>
          </motion.div>
        )}

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
            <button onClick={() => setError(null)}><X size={18}/></button>
          </motion.div>
        )}

        {activeTab === "crops" ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-earth-800">Crops Database</h2>
              <button 
                onClick={() => { setFormData(INITIAL_CROP); setIsEditing(true); }}
                className="bg-harvest-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-harvest-700 transition-all shadow-md"
              >
                <Plus size={20} /> Add New Crop
              </button>
            </div>

            <div className="bg-white rounded-[40px] border border-harvest-100 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-earth-900 text-harvest-100 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Product Info</th>
                    <th className="px-8 py-5">Seasonality</th>
                    <th className="px-8 py-5">Knowledge Base</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-harvest-50">
                  {crops.map((crop) => (
                    <tr key={crop._id} className="hover:bg-harvest-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={crop.imageUrl || `https://picsum.photos/seed/${crop.name}/100/100`} 
                            className="w-16 h-16 rounded-2xl object-cover border border-harvest-100 shadow-sm" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-earth-900 block text-lg">{crop.name}</span>
                            <span className="text-xs text-earth-400 font-medium">{crop.howToGrow?.soilType} Soil</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                          crop.season === 'Winter' ? 'bg-blue-100 text-blue-700' :
                          crop.season === 'Summer' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {crop.season}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-4">
                           <div className="text-center">
                              <p className="text-[10px] font-bold text-earth-300 uppercase">Diseases</p>
                              <p className="font-bold text-earth-800">{crop.diseases?.length || 0}</p>
                           </div>
                           <div className="text-center border-l border-harvest-100 pl-4">
                              <p className="text-[10px] font-bold text-earth-300 uppercase">Schemes</p>
                              <p className="font-bold text-earth-800">{crop.schemes?.length || 0}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => startEdit(crop)}
                            className="p-3 bg-harvest-50 text-harvest-600 rounded-xl hover:bg-harvest-600 hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 size={18}/>
                          </button>
                          <button 
                            onClick={() => deleteCrop(crop._id!)} 
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {crops.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Wheat size={48} className="mx-auto text-harvest-200 mb-4" />
                        <p className="text-earth-400 italic">No crops found. Start adding information.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <GovernmentSchemes onStatusChange={setStatus} />
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsEditing(false)}
               className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm shadow-2xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
              <header className="px-10 py-8 border-b border-harvest-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-earth-800">
                    {formData._id ? "Update Knowledge" : "Fresh Agriculture Intel"}
                  </h2>
                  <p className="text-earth-400 text-sm">Provide accurate data for our farmers.</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-3 hover:bg-harvest-50 rounded-2xl text-earth-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </header>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-12">
                {/* Basic Section */}
                <section>
                  <h3 className="text-sm font-black text-harvest-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <LayoutGrid size={16} /> Basic Specifications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-earth-400 ml-1">Crop Common Name</label>
                      <input 
                        className="w-full bg-harvest-50/50 border border-harvest-100 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-harvest-100 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Alphonso Mango"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-earth-400 ml-1">Optimum Season</label>
                      <select 
                        className="w-full bg-harvest-50/50 border border-harvest-100 p-4 rounded-2xl focus:outline-none transition-all"
                        value={formData.season}
                        onChange={(e) => setFormData({...formData, season: e.target.value})}
                      >
                        <option>Winter</option>
                        <option>Summer</option>
                        <option>Rainy</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-earth-400 ml-1">Cover Image Source (Local/URL)</label>
                      <input 
                        className="w-full bg-harvest-50/50 border border-harvest-100 p-4 rounded-2xl focus:outline-none transition-all"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="Enter direct image URL"
                      />
                    </div>
                  </div>
                </section>

                {/* Cultivation Details */}
                <section>
                  <h3 className="text-sm font-black text-harvest-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Sprout size={16} /> Cultivation Science
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-earth-400 uppercase tracking-tighter">Soil Preference</p>
                      <input 
                        className="w-full border-b border-harvest-200 py-3 focus:outline-none focus:border-earth-800"
                        value={formData.howToGrow.soilType}
                        onChange={(e) => setFormData({...formData, howToGrow: {...formData.howToGrow, soilType: e.target.value}})}
                        placeholder="Loamy, Sandy..."
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-earth-400 uppercase tracking-tighter">Irrigation Needs</p>
                      <input 
                        className="w-full border-b border-harvest-200 py-3 focus:outline-none focus:border-earth-800"
                        value={formData.howToGrow.waterRequirements}
                        onChange={(e) => setFormData({...formData, howToGrow: {...formData.howToGrow, waterRequirements: e.target.value}})}
                        placeholder="Moderate, High..."
                      />
                    </div>
                     <div className="space-y-1">
                      <p className="text-[10px] font-bold text-earth-400 uppercase tracking-tighter">Harvest Cycle</p>
                      <input 
                        className="w-full border-b border-harvest-200 py-3 focus:outline-none focus:border-earth-800"
                        value={formData.howToGrow.duration}
                        onChange={(e) => setFormData({...formData, howToGrow: {...formData.howToGrow, duration: e.target.value}})}
                        placeholder="90-120 days..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-earth-400">Step-by-Step Instructions</p>
                    {formData.howToGrow.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-harvest-100 flex items-center justify-center text-xs font-bold text-earth-600 shrink-0">{i+1}</div>
                         <input 
                           className="flex-1 border-b border-harvest-100 pb-2 focus:outline-none"
                           value={step}
                           onChange={(e) => {
                             const ns = [...formData.howToGrow.steps];
                             ns[i] = e.target.value;
                             setFormData({...formData, howToGrow: {...formData.howToGrow, steps: ns}});
                           }}
                         />
                         <button 
                          type="button"
                          onClick={() => {
                            const ns = formData.howToGrow.steps.filter((_, idx) => idx !== i);
                            setFormData({...formData, howToGrow: {...formData.howToGrow, steps: ns}});
                          }}
                          className="text-red-300 hover:text-red-500"
                         >
                            <Trash2 size={16}/>
                         </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, howToGrow: {...formData.howToGrow, steps: [...formData.howToGrow.steps, ""]}})}
                      className="text-xs font-bold text-harvest-600 hover:underline flex items-center gap-1"
                    >
                      <Plus size={14}/> Add Growing Step
                    </button>
                  </div>
                </section>

                {/* Diseases Section */}
                <section className="bg-red-50/30 p-8 rounded-[40px] border border-red-100">
                  <header className="flex justify-between items-center mb-8">
                     <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertTriangle size={16} /> Pathology & Treatment
                     </h3>
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, diseases: [...formData.diseases, {
                         name: "", symptoms: "", causes: "", prevention: "", medicine: "", medicineUsage: ""
                       }]})}
                       className="text-xs font-bold bg-white text-red-600 px-4 py-2 rounded-xl shadow-sm border border-red-100"
                     >
                       + Add Disease Record
                     </button>
                  </header>
                  
                  <div className="space-y-6">
                    {formData.diseases.map((d, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-red-50 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                           <input 
                             placeholder="Disease Name"
                             className="font-bold text-earth-800 text-lg border-b border-harvest-100 focus:outline-none flex-1"
                             value={d.name}
                             onChange={(e) => {
                               const nd = [...formData.diseases]; nd[i].name = e.target.value;
                               setFormData({...formData, diseases: nd});
                             }}
                           />
                           <button type="button" onClick={() => setFormData({...formData, diseases: formData.diseases.filter((_, idx) => idx !== i)})} className="text-red-300 hover:text-red-500 ml-4"><Trash2 size={18}/></button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           <textarea placeholder="Symptoms" value={d.symptoms} onChange={(e) => { const nd = [...formData.diseases]; nd[i].symptoms = e.target.value; setFormData({...formData, diseases: nd}); }} className="w-full bg-harvest-50/50 p-3 rounded-xl text-sm focus:outline-none min-h-[80px]" />
                           <textarea placeholder="Causes" value={d.causes} onChange={(e) => { const nd = [...formData.diseases]; nd[i].causes = e.target.value; setFormData({...formData, diseases: nd}); }} className="w-full bg-harvest-50/50 p-3 rounded-xl text-sm focus:outline-none min-h-[80px]" />
                           <textarea placeholder="Prevention" value={d.prevention} onChange={(e) => { const nd = [...formData.diseases]; nd[i].prevention = e.target.value; setFormData({...formData, diseases: nd}); }} className="w-full bg-harvest-50/50 p-3 rounded-xl text-sm focus:outline-none min-h-[80px]" />
                           <div className="space-y-3">
                              <input placeholder="Recommended Medicine" value={d.medicine} onChange={(e) => { const nd = [...formData.diseases]; nd[i].medicine = e.target.value; setFormData({...formData, diseases: nd}); }} className="w-full bg-red-50 p-3 rounded-xl text-sm font-bold placeholder:text-red-300 focus:outline-none" />
                              <textarea placeholder="Medicine Usage Details" value={d.medicineUsage} onChange={(e) => { const nd = [...formData.diseases]; nd[i].medicineUsage = e.target.value; setFormData({...formData, diseases: nd}); }} className="w-full bg-red-50 p-3 rounded-xl text-xs italic focus:outline-none min-h-[60px]" />
                           </div>
                        </div>
                      </div>
                    ))}
                    {formData.diseases.length === 0 && <p className="text-center py-6 text-earth-300 font-medium italic text-sm">No disease records listed.</p>}
                  </div>
                </section>

                {/* Schemes Section */}
                <section className="bg-emerald-50/30 p-8 rounded-[40px] border border-emerald-100">
                  <header className="flex justify-between items-center mb-8">
                     <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <GraduationCap size={16} /> Gov Support & Welfare
                     </h3>
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, schemes: [...formData.schemes, {
                         name: "", description: "", benefits: "", eligibility: "", applicationProcess: [""], link: ""
                       }]})}
                       className="text-xs font-bold bg-white text-emerald-600 px-4 py-2 rounded-xl shadow-sm border border-emerald-100"
                     >
                        + List Scheme
                     </button>
                  </header>

                  <div className="space-y-8">
                     {formData.schemes.map((s, i) => (
                       <div key={i} className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-md space-y-6">
                         <div className="flex justify-between gap-4">
                            <input 
                              placeholder="Scheme Name (e.g. PM-Fasal)"
                              className="font-bold text-earth-900 text-xl border-b border-harvest-100 focus:outline-none flex-1 transition-all focus:border-emerald-500"
                              value={s.name}
                              onChange={(e) => { const ns = [...formData.schemes]; ns[i].name = e.target.value; setFormData({...formData, schemes: ns}); }}
                            />
                            <button type="button" onClick={() => setFormData({...formData, schemes: formData.schemes.filter((_, idx) => idx !== i)})} className="text-red-300 hover:text-red-500"><Trash2 size={24}/></button>
                         </div>
                         
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <div>
                                  <p className="text-[10px] font-bold text-earth-400 uppercase mb-1">Details</p>
                                  <textarea value={s.description} onChange={(e) => { const ns = [...formData.schemes]; ns[i].description = e.target.value; setFormData({...formData, schemes: ns}); }} className="w-full bg-harvest-50/50 p-4 rounded-2xl text-sm focus:outline-none min-h-[100px]" placeholder="Broad description..." />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-earth-400 uppercase mb-1">Eligibility Criteria</p>
                                  <input value={s.eligibility} onChange={(e) => { const ns = [...formData.schemes]; ns[i].eligibility = e.target.value; setFormData({...formData, schemes: ns}); }} className="w-full bg-harvest-50/50 p-4 rounded-2xl text-sm focus:outline-none" placeholder="Small farmers, Specific regions..." />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-earth-400 uppercase mb-1">Official Resource Link</p>
                                  <input value={s.link} onChange={(e) => { const ns = [...formData.schemes]; ns[i].link = e.target.value; setFormData({...formData, schemes: ns}); }} className="w-full bg-harvest-50/50 p-4 rounded-2xl text-xs font-mono focus:outline-none" placeholder="https://..." />
                               </div>
                            </div>

                            <div className="space-y-4">
                               <div className="bg-emerald-50 p-4 rounded-2xl">
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Benefits Provided</p>
                                  <textarea value={s.benefits} onChange={(e) => { const ns = [...formData.schemes]; ns[i].benefits = e.target.value; setFormData({...formData, schemes: ns}); }} className="w-full bg-white p-3 rounded-xl text-sm focus:outline-none font-bold text-earth-700 min-h-[80px]" placeholder="Summarize financial or asset aid..." />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-earth-400 uppercase mb-2">Application Steps</p>
                                  {(s.applicationProcess || []).map((step, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                       <span className="text-xs font-bold text-earth-300 shrink-0">{idx+1}.</span>
                                       <input 
                                         className="flex-1 text-sm border-b border-harvest-50 focus:outline-none"
                                         value={step}
                                         onChange={(e) => {
                                           const ns = [...formData.schemes];
                                           ns[i].applicationProcess[idx] = e.target.value;
                                           setFormData({...formData, schemes: ns});
                                         }}
                                       />
                                       <button type="button" onClick={() => {
                                         const ns = [...formData.schemes];
                                         ns[i].applicationProcess = ns[i].applicationProcess.filter((_, nidx) => nidx !== idx);
                                         setFormData({...formData, schemes: ns});
                                       }} className="text-red-200"><X size={14}/></button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={() => {
                                    const ns = [...formData.schemes];
                                    ns[i].applicationProcess = [...ns[i].applicationProcess, ""];
                                    setFormData({...formData, schemes: ns});
                                  }} className="text-[10px] font-black text-emerald-600">+ Add Process Step</button>
                               </div>
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </section>

                <footer className="pt-10 flex gap-4">
                   <button 
                     type="submit"
                     className="flex-1 bg-earth-900 text-white p-6 rounded-[32px] font-bold text-xl flex items-center justify-center gap-3 hover:bg-earth-800 transition-all shadow-xl active:scale-95"
                   >
                     <Save size={24} /> {formData._id ? "Commit Updates" : "Publish to Farmers"}
                   </button>
                   <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-6 border-2 border-harvest-100 rounded-[32px] font-bold text-earth-400 hover:bg-harvest-50 transition-all"
                   >
                     Discard
                   </button>
                </footer>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
