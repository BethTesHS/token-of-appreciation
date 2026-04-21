import React, { useContext, useState } from 'react';
import { HeartHandshake, CheckCircle2, RotateCcw, Delete, Lock, Calendar, Clock } from 'lucide-react';
import { HugContext } from '../context/HugContext.js';
import { format } from 'date-fns';

export default function BigSisDashboard() {
  const { isLoading, requests, acceptHug, history, refreshTokens, tokens } = useContext(HugContext);

  // --- PIN PAD STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  const CORRECT_PIN = '1202';

  const handlePress = (num) => {
    if (pin.length >= 4) return;

    const nextPin = pin + num;
    setPin(nextPin);
    setIsError(false);

    if (nextPin.length === 4) {
      if (nextPin === CORRECT_PIN) {
        // Let the 4th dot fill before transitioning
        setTimeout(() => setIsAuthenticated(true), 150);
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 min-h-[80vh] flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="bg-white/70 p-6 rounded-full inline-block relative border border-purple-100 shadow-lg animate-bounce">
          <HeartHandshake className="text-brand w-12 h-12 drop-shadow" />
        </div>
        <p className="text-xl font-extrabold text-purple-700">Polishing the dashboard... 👑✨</p>
      </div>
    );
  }

  // --- PIN PAD SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 pt-24 space-y-8 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-white/80 p-4 rounded-full inline-block shadow-lg border border-purple-100 mb-2">
            <Lock className="text-brand w-8 h-8 drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-extrabold">
            <span className="toa-title-gradient drop-shadow-sm">Just Bethhhh!</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="toa-badge">Enter your secret PIN</span>
            <span className="toa-badge">🔐</span>
          </div>
        </div>

        {/* PIN Indicator Dots */}
        <div className={`flex gap-6 my-8 ${isError ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                pin.length > index 
                  ? (isError ? 'bg-red-400 border-red-400' : 'bg-brand border-brand shadow-[0_0_10px_rgba(168,85,247,0.5)]')
                  : 'border-purple-200 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Custom Numpad Grid */}
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-16 h-16 rounded-full bg-white/80 backdrop-blur text-brand-dark text-2xl font-extrabold shadow-lg shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center border border-purple-100 hover:bg-white"
            >
              {num}
            </button>
          ))}
          {/* Bottom row: Empty space, Zero, Delete */}
          <div className="w-16 h-16"></div> 
          <button
            onClick={() => handlePress('0')}
            className="w-16 h-16 rounded-full bg-white/80 backdrop-blur text-brand-dark text-2xl font-extrabold shadow-lg shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center border border-purple-100 hover:bg-white"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-[color:var(--color-candy-soft)] text-brand-dark shadow-lg shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center hover:bg-pink-100 border border-pink-100"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Calculate Report Data
  const totalHugs = history.length;
  const recentHugs = history.slice(-3).reverse();

  // --- MAIN DASHBOARD ---
  return (
    <div className="max-w-md mx-auto p-6 pt-12 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold">
          <span className="toa-title-gradient drop-shadow-sm">Just Bethhh’s Dashboard</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="toa-badge">Managing Pichu’s hugs</span>
          <span className="toa-badge">👑</span>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="toa-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-extrabold text-purple-500 uppercase tracking-wider">Pichu’s Tokens</p>
          <p className="text-2xl font-black text-brand-dark">{tokens} / 7</p>
        </div>
        <button 
          onClick={refreshTokens}
          disabled={tokens === 7}
          className="toa-btn bg-white/70 hover:bg-white border border-purple-100 shadow-sm text-brand-dark px-4 py-2 rounded-xl font-extrabold"
        >
          <RotateCcw size={18} /> Refresh
        </button>
      </div>

      {/* Pending Requests */}
      <div className="toa-card p-6">
        <h2 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          <HeartHandshake className="text-brand drop-shadow-sm" /> 
          Pending ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic">
            No pending requests right now.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between bg-white/70 p-4 rounded-2xl border border-purple-100 shadow-sm">
                <div>
                  <p className="font-bold text-brand-dark">Hug Requested!</p>
                  <p className="text-xs text-purple-500">
                    {format(new Date(req.requested_at), "h:mm a - MMM do")}
                  </p>
                </div>
                <button 
                  onClick={() => acceptHug(req.id)}
                  className="toa-btn-primary px-4 py-2 rounded-xl"
                >
                  <CheckCircle2 size={18} /> Give
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Report */}
      <div className="toa-card-soft p-6">
        <h3 className="text-lg font-extrabold text-brand-dark mb-4 flex items-center gap-2">
          <Calendar size={20} /> Hug Report
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/70 rounded-2xl p-4 text-center border border-purple-100 shadow-sm">
            <span className="block text-3xl font-black text-brand drop-shadow-sm">{totalHugs}</span>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Total Given</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 text-center border border-purple-100 shadow-sm">
            <span className="block text-3xl font-black text-brand drop-shadow-sm">{tokens}</span>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Tokens Left</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-extrabold text-purple-500 uppercase tracking-wider mb-2">Recent Hugs Given</p>
            {recentHugs.map((hug) => (
              <div key={hug.id} className="flex items-center gap-3 bg-white/70 p-3 rounded-2xl text-sm text-brand-dark border border-purple-100 shadow-sm">
                <Clock size={16} className="text-brand drop-shadow-sm" />
                <span>{format(new Date(hug.accepted_at), "EEEE 'at' h:mm a")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Logout button */}
      <div className="flex justify-center mt-4">
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setPin(''); // This is the magic line that clears the dots!
            }}
            className="text-xs text-purple-500 hover:text-purple-700 font-extrabold flex items-center gap-1"
          >
            <Lock size={12} /> Lock Dashboard
          </button>
      </div>
    </div>
  );
}