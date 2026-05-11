import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, CloudRain, Sun, ArrowRight, Sprout, Filter } from "lucide-react";
import { useAuth } from "../AuthContext";

interface Crop {
  _id: string;
  name: string;
  season: string;
  imageUrl: string;
  howToGrow: {
    soilType: string;
    duration: string;
  };
}

export default function Home() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [season, setSeason] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, [season]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const url = season ? `/api/crops?season=${season}` : "/api/crops";
      const res = await fetch(url);
      const data = await res.json();
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch crops");
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const seasons = [
    { name: "Winter", icon: Sprout, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Summer", icon: Sun, color: "bg-orange-50 text-orange-600 border-orange-100" },
    { name: "Rainy", icon: CloudRain, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-earth-800 mb-2"
          >
            Welcome, {user?.name}!
          </motion.h1>
          <p className="text-earth-500 font-medium">Find the best crops for your local season and soil.</p>
        </header>

        {/* Season Selection */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-earth-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Filter size={16} /> Choose Season
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {seasons.map((s) => (
              <button
                key={s.name}
                onClick={() => setSeason(season === s.name ? "" : s.name)}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${
                  season === s.name 
                    ? `${s.color} border-current ring-4 ring-current/10` 
                    : "bg-white border-harvest-200 text-earth-500 hover:border-harvest-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${season === s.name ? "bg-white/50" : "bg-harvest-50 group-hover:bg-harvest-100"}`}>
                    <s.icon size={28} />
                  </div>
                  <span className="text-xl font-serif font-bold">{s.name}</span>
                </div>
                {season === s.name && <motion.div layoutId="active" className="w-2 h-2 rounded-full bg-current" />}
              </button>
            ))}
          </div>
        </section>

        {/* Search & Results */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="font-serif text-3xl font-bold text-earth-800">
              {season ? `${season} Crops` : "All Recommended Crops"}
            </h3>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-3 text-earth-300" size={20} />
              <input
                type="text"
                placeholder="Search crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-harvest-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-harvest-400 shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Sprout className="text-harvest-300 animate-bounce" size={48} />
            </div>
          ) : filteredCrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCrops.map((crop, idx) => (
                <motion.div
                  key={crop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-harvest-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={crop.imageUrl || "https://picsum.photos/seed/farm/800/600"} 
                      alt={crop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-earth-600 border border-harvest-100">
                      {crop.season}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="font-serif text-2xl font-bold text-earth-800 mb-2">{crop.name}</h4>
                    <div className="flex gap-4 mb-6">
                      <div className="text-xs text-earth-500">
                        <p className="font-bold uppercase tracking-tighter opacity-50">Soil</p>
                        <p className="font-semibold">{crop.howToGrow.soilType}</p>
                      </div>
                      <div className="h-8 w-px bg-harvest-100" />
                      <div className="text-xs text-earth-500">
                        <p className="font-bold uppercase tracking-tighter opacity-50">Duration</p>
                        <p className="font-semibold">{crop.howToGrow.duration}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/crop/${crop._id}`}
                      className="inline-flex items-center gap-2 text-harvest-600 font-bold group-hover:gap-3 transition-all"
                    >
                      View Details <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-harvest-200">
              <Sprout className="mx-auto text-harvest-200 mb-4" size={48} />
              <p className="text-earth-500 font-serif text-xl italic">No crops found for this criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
