import React, { useContext } from 'react';
import { Heart, Sparkles, Clock, Calendar } from 'lucide-react';
import { HugContext } from '../context/HugContext';
import { format } from 'date-fns';

export default function PichuView() {
  const { tokens, requestHug, history } = useContext(HugContext);

  const totalHugs = history.length;
  const recentHugs = history.slice(-3).reverse();

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-brand-dark flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-400" />
          Token of Appreciation
          <Sparkles className="text-yellow-400" />
        </h1>
        <p className="text-purple-600 font-medium">Pichu's personal hug treasury 💜</p>
      </div>

      {/* Token Counter */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-purple-200 text-center border-4 border-purple-100">
        <h2 className="text-xl font-bold text-gray-500 mb-4">Tokens Remaining</h2>
        {/* Added flex-wrap just in case on smaller screens */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          {[...Array(7)].map((_, i) => (
            <Heart 
              key={i} 
              size={36} 
              className={i < tokens ? "fill-brand text-brand animate-pulse" : "fill-gray-200 text-gray-200"} 
            />
          ))}
        </div>
        
        <button 
          onClick={requestHug}
          disabled={tokens === 0}
          className="w-full bg-brand hover:bg-brand-dark disabled:bg-purple-300 text-white font-bold text-xl py-4 rounded-2xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          {tokens > 0 ? 'Claim a Hug! 🧸' : 'Out of tokens! Wait for Big Sis ⏳'}
        </button>
      </div>

      {/* Weekly Status Report */}
      <div className="bg-white/80 rounded-3xl p-6 shadow-md border-2 border-purple-100">
        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
          <Calendar size={20} /> Weekly Hug Report
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <span className="block text-3xl font-black text-brand">{totalHugs}</span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Received</span>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <span className="block text-3xl font-black text-brand">{tokens}</span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Tokens Left</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Recent Hugs</p>
            {recentHugs.map((hug) => (
              <div key={hug.id} className="flex items-center gap-3 bg-purple-50 p-3 rounded-xl text-sm text-brand-dark">
                <Clock size={16} className="text-brand" />
                <span>{format(new Date(hug.accepted_at), "EEEE 'at' h:mm a")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}