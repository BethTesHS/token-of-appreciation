import React, { useContext } from 'react';
import { Heart, Sparkles, Clock, Calendar } from 'lucide-react';
import { HugContext } from '../context/HugContext.js';
import { format } from 'date-fns';

export default function PichuView() {
  const { isLoading, tokens, requestHug, history } = useContext(HugContext);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 min-h-[80vh] flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="relative">
          <Heart size={64} className="fill-brand text-brand animate-bounce drop-shadow" />
          <Sparkles className="absolute -top-2 -right-4 text-yellow-400 toa-sparkle" size={24} />
        </div>
        <p className="text-xl font-extrabold text-purple-700">Gathering hugs... 🧸✨</p>
      </div>
    );
  }

  const totalHugs = history.length;
  const recentHugs = history.slice(-3).reverse();

  return (
    <div className="max-w-md mx-auto p-6 pt-24 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400 toa-sparkle" />
          <span className="toa-title-gradient drop-shadow-sm">Token of Appreciation</span>
          <Sparkles className="text-yellow-400 toa-sparkle" />
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="toa-badge">Pichu’s hug treasury</span>
          <span className="toa-badge">💜</span>
        </div>
      </div>

      {/* Token Counter */}
      <div className="toa-card p-8 text-center">
        <h2 className="text-lg font-extrabold text-purple-600 mb-4 tracking-tight">Tokens Remaining</h2>
        {/* Added flex-wrap just in case on smaller screens */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <Heart 
              key={i} 
              size={36} 
              className={i < tokens ? "fill-brand text-brand animate-pulse drop-shadow-sm" : "fill-gray-200 text-gray-200"} 
            />
          ))}
        </div>
        
        <button 
          onClick={requestHug}
          disabled={tokens === 0}
          className="w-full toa-btn-primary text-xl py-4"
        >
          {tokens > 0 ? 'Claim a Hug! 🧸' : 'Out of tokens! Wait for Big Sis ⏳'}
        </button>
      </div>

      {/*Status Report */}
      <div className="toa-card-soft p-6">
        <h3 className="text-lg font-extrabold text-brand-dark mb-4 flex items-center gap-2">
          <Calendar size={20} /> Hug Report
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/70 rounded-2xl p-4 text-center border border-purple-100 shadow-sm">
            <span className="block text-3xl font-black text-brand drop-shadow-sm">{totalHugs}</span>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Total Received</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 text-center border border-purple-100 shadow-sm">
            <span className="block text-3xl font-black text-brand drop-shadow-sm">{tokens}</span>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Tokens Left</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-extrabold text-purple-500 uppercase tracking-wider mb-2">Recent Hugs</p>
            {recentHugs.map((hug) => (
              <div key={hug.id} className="flex items-center gap-3 bg-white/70 p-3 rounded-2xl text-sm text-brand-dark border border-purple-100 shadow-sm">
                <Clock size={16} className="text-brand drop-shadow-sm" />
                <span>{format(new Date(hug.accepted_at), "EEEE 'at' h:mm a")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}