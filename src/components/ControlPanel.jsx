import React from 'react';
import { Compass, Accessibility, Umbrella, ShieldAlert, Construction, Navigation, AlertTriangle, Sparkles } from 'lucide-react';

export default function ControlPanel({
  locations,
  source,
  setSource,
  target,
  setTarget,
  constraints,
  setConstraints,
  onFindRoute,
  loading,
  errorMessage
}) {
  const toggleConstraint = (key) => {
    setConstraints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-[400px] h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
      <div>
        {/* App Title Header with Gradient */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800/80">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl text-slate-950 shadow-lg shadow-emerald-500/20">
            <Compass size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                Smart Campus
              </h1>
              <Sparkles size={16} className="text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-emerald-400/90 tracking-wide uppercase">Spatial Micro-Navigation</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs shadow-lg animate-shake">
            <AlertTriangle size={18} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={onFindRoute} className="space-y-4">
          {/* Start Location Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Start Location
            </label>
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-200 transition appearance-none shadow-inner"
              >
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc.id || loc.name} className="bg-slate-900 text-slate-200">
                    📍 {loc.name || loc.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Destination
            </label>
            <div className="relative">
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-200 transition appearance-none shadow-inner"
              >
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc.id || loc.name} className="bg-slate-900 text-slate-200">
                    🎯 {loc.name || loc.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Constraint UI Toggles */}
          <div className="pt-3 border-t border-slate-800/80">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Routing Constraints</span>
              <span className="text-[10px] text-emerald-400 font-normal lowercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">multi-weight logic</span>
            </h3>
            
            <div className="space-y-2.5">
              {/* Wheelchair */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${constraints.wheelchair ? 'bg-blue-500/10 border-blue-500/50 shadow-md shadow-blue-500/10' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'}`}>
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <div className={`p-1.5 rounded-lg ${constraints.wheelchair ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                    <Accessibility size={16} />
                  </div>
                  Wheelchair Friendly
                </span>
                <input
                  type="checkbox"
                  checked={constraints.wheelchair}
                  onChange={() => toggleConstraint('wheelchair')}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              {/* Rain Protected */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${constraints.rainProtected ? 'bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'}`}>
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <div className={`p-1.5 rounded-lg ${constraints.rainProtected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                    <Umbrella size={16} />
                  </div>
                  Rain Protected
                </span>
                <input
                  type="checkbox"
                  checked={constraints.rainProtected}
                  onChange={() => toggleConstraint('rainProtected')}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              {/* Night Safety */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${constraints.nightSafety ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'}`}>
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <div className={`p-1.5 rounded-lg ${constraints.nightSafety ? 'bg-amber-500 text-white' : 'bg-slate-800 text-amber-400'}`}>
                    <ShieldAlert size={16} />
                  </div>
                  Night Safety Lighting
                </span>
                <input
                  type="checkbox"
                  checked={constraints.nightSafety}
                  onChange={() => toggleConstraint('nightSafety')}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              {/* Avoid Construction */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${constraints.avoidConstruction ? 'bg-rose-500/10 border-rose-500/50 shadow-md shadow-rose-500/10' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'}`}>
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <div className={`p-1.5 rounded-lg ${constraints.avoidConstruction ? 'bg-rose-500 text-white' : 'bg-slate-800 text-rose-400'}`}>
                    <Construction size={16} />
                  </div>
                  Avoid Construction
                </span>
                <input
                  type="checkbox"
                  checked={constraints.avoidConstruction}
                  onChange={() => toggleConstraint('avoidConstruction')}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Button with Vibrant Gradient & Glow */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-xl shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Navigation size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Computing Optimal Path...' : 'Find Optimal Route'}
          </button>
        </form>
      </div>

      <div className="text-[11px] text-slate-500 text-center pt-4 border-t border-slate-800/80 font-medium">
        Spatial Architecture • Render Live Backend
      </div>
    </div>
  );
}