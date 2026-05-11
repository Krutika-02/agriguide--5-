import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Sprout, Droplets, Clock, AlertTriangle, Pill, 
  HelpCircle, User as UserIcon, Phone, History, GraduationCap, ChevronLeft
} from "lucide-react";

interface CropDetail {
  _id: string;
  name: string;
  season: string;
  imageUrl: string;
  howToGrow: {
    soilType: string;
    waterRequirements: string;
    duration: string;
    steps: string[]; // step-by-step
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
    link?: string;
  }>;
}

export default function CropDetail() {
  const { id } = useParams();
  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/crops/${id}`);
        const data = await res.json();
        setCrop(data);
      } catch (err) {
        console.error("Failed to fetch detail");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Sprout className="text-earth-400 animate-spin" size={48} />
    </div>
  );

  if (!crop) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="font-serif text-3xl mb-4 text-earth-800">Crop not found</h2>
      <Link to="/" className="text-harvest-600 font-bold underline">Go Back Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-harvest-50">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-earth-500 hover:text-earth-800 font-medium mb-8 bg-white px-4 py-2 rounded-full shadow-sm">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-sm border border-harvest-100 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-80 md:h-96 border-r border-harvest-50 relative">
                  <img 
                    src={crop.imageUrl || `https://picsum.photos/seed/${crop.name}/1200/800`} 
                    alt={crop.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-earth-600 border border-harvest-100 shadow-sm">
                      {crop.season} Season
                    </span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <h1 className="font-serif text-5xl md:text-6xl font-bold text-earth-900 mb-6">{crop.name}</h1>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-earth-600 text-sm bg-harvest-50 px-4 py-2 rounded-full">
                       <HelpCircle size={16} /> {crop.howToGrow?.soilType}
                    </div>
                    <div className="flex items-center gap-2 text-earth-600 text-sm bg-harvest-50 px-4 py-2 rounded-full">
                       <Clock size={16} /> {crop.howToGrow?.duration} 
                    </div>
                     <div className="flex items-center gap-2 text-earth-600 text-sm bg-harvest-50 px-4 py-2 rounded-full">
                       <Droplets size={16} /> {crop.howToGrow?.waterRequirements} 
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Growing Details */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-harvest-100">
              <h2 className="font-serif text-3xl font-bold mb-8 flex items-center gap-3 text-earth-900">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Sprout size={24}/></div>
                How to Grow
              </h2>
              <div className="space-y-6">
                {crop.howToGrow?.steps?.length > 0 ? (
                  <div className="relative border-l-2 border-harvest-100 ml-4 pl-8 space-y-8">
                    {crop.howToGrow.steps.map((step, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[44px] top-0 w-8 h-8 rounded-full bg-earth-800 text-white flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <p className="text-earth-700 leading-relaxed text-lg">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-earth-500 italic">No instructions provided.</p>
                )}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-harvest-100">
              <h2 className="font-serif text-3xl font-bold mb-8 flex items-center gap-3 text-earth-900">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24}/></div>
                Disease Protection
              </h2>
              <div className="space-y-6">
                {crop.diseases?.length > 0 ? crop.diseases.map((d, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-harvest-50 border border-harvest-100">
                    <h3 className="font-bold text-2xl text-earth-800 mb-6">{d.name}</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold text-earth-400 uppercase tracking-widest mb-1">Symptoms</p>
                          <p className="text-earth-700 text-sm leading-relaxed">{d.symptoms}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-earth-400 uppercase tracking-widest mb-1">Causes</p>
                          <p className="text-earth-700 text-sm leading-relaxed">{d.causes}</p>
                        </div>
                         <div>
                          <p className="text-xs font-bold text-earth-400 uppercase tracking-widest mb-1">Prevention</p>
                          <p className="text-earth-700 text-sm leading-relaxed">{d.prevention}</p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-harvest-100 shadow-sm">
                        <div className="bg-harvest-50 p-4 rounded-xl mb-4 border border-harvest-100">
                           <p className="text-harvest-600 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                             <Pill size={14} /> Recommended Medicine
                           </p>
                           <p className="text-earth-800 font-bold text-lg">{d.medicine}</p>
                        </div>
                        <p className="text-earth-500 text-xs font-bold uppercase mb-1">Usage Details</p>
                        <p className="text-earth-600 text-sm italic">{d.medicineUsage}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                   <p className="text-earth-500 italic">No disease data found.</p>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <section className="bg-earth-900 text-white p-8 rounded-[40px] shadow-xl">
              <h2 className="font-serif text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-harvest-500 text-earth-900 rounded-xl"><GraduationCap size={24}/></div>
                Schemes
              </h2>
              <div className="space-y-10">
                {crop.schemes?.length > 0 ? crop.schemes.map((s, i) => (
                  <div key={i} className="space-y-4 border-b border-earth-700 pb-8 last:border-0 last:pb-0">
                    <h3 className="font-bold text-harvest-400 text-xl">{s.name}</h3>
                    <p className="text-sm text-earth-300 leading-relaxed">{s.description}</p>
                    
                    <div className="bg-earth-800 p-4 rounded-2xl">
                       <p className="text-[10px] font-bold text-earth-400 uppercase tracking-widest mb-2">Benefits</p>
                       <p className="text-sm text-harvest-100 font-semibold">{s.benefits}</p>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-earth-400 uppercase tracking-widest mb-1">Application Process</p>
                       {s.applicationProcess?.map((step, idx) => (
                         <div key={idx} className="flex gap-3 text-sm text-earth-200">
                            <span className="text-harvest-500 font-bold">{idx + 1}</span>
                            <span>{step}</span>
                         </div>
                       ))}
                    </div>

                    {s.link && (
                      <a 
                        href={s.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-center border border-earth-700 py-3 rounded-2xl text-xs font-bold hover:bg-earth-800 transition-colors"
                      >
                         View Details Online
                      </a>
                    )}
                  </div>
                )) : (
                   <p className="text-earth-500 italic">No schemes available.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
