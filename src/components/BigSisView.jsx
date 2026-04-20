import React, { useContext, useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, RotateCcw, Delete, Lock, Calendar, Clock } from 'lucide-react';
import { HugContext } from '../context/HugContext';
import { format } from 'date-fns';

export default function BigSisDashboard() {
  const { isLoading, requests, acceptHug, history, refreshTokens, tokens } = useContext(HugContext);

  // --- PIN PAD STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  const CORRECT_PIN = '1202';

  // Check the PIN every time it changes
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        // Success! Wait a tiny fraction of a second so they see the 4th dot fill up
        setTimeout(() => setIsAuthenticated(true), 150);
      } else {
        // Wrong PIN! Show error state and clear it
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 500);
      }
    }
  }, [pin]);

  const handlePress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setIsError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 min-h-[80vh] flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="bg-purple-100 p-6 rounded-full inline-block relative animate-bounce">
          <HeartHandshake className="text-brand w-12 h-12" />
        </div>
        <p className="text-xl font-bold text-purple-600">Polishing the dashboard... 👑✨</p>
      </div>
    );
  }

  // --- PIN PAD SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 pt-24 space-y-8 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-white p-4 rounded-full inline-block shadow-md border-2 border-purple-100 mb-2">
            <Lock className="text-brand w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Just Bethhhh!</h1>
          <p className="text-purple-600 font-medium">Enter your secret PIN</p>
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
              className="w-16 h-16 rounded-full bg-white text-brand-dark text-2xl font-bold shadow-md shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center border border-purple-50 hover:bg-purple-50"
            >
              {num}
            </button>
          ))}
          {/* Bottom row: Empty space, Zero, Delete */}
          <div className="w-16 h-16"></div> 
          <button
            onClick={() => handlePress('0')}
            className="w-16 h-16 rounded-full bg-white text-brand-dark text-2xl font-bold shadow-md shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center border border-purple-50 hover:bg-purple-50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-purple-100 text-brand-dark shadow-md shadow-purple-100 active:scale-95 transition-transform flex items-center justify-center hover:bg-purple-200"
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
        <h1 className="text-2xl font-bold text-brand-dark">Just Bethhh's Dashboard</h1>
        <p className="text-purple-600">Managing Pichu's hugs</p>
      </div>

      {/* Admin Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-purple-400 uppercase tracking-wider">Pichu's Tokens</p>
          <p className="text-2xl font-black text-brand-dark">{tokens} / 7</p>
        </div>
        <button 
          onClick={refreshTokens}
          disabled={tokens === 7}
          className="bg-purple-100 hover:bg-purple-200 disabled:opacity-50 text-brand-dark px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <RotateCcw size={18} /> Refresh
        </button>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <HeartHandshake className="text-brand" /> 
          Pending ({requests.length})
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic">
            No pending requests right now.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div>
                  <p className="font-bold text-brand-dark">Hug Requested!</p>
                  <p className="text-xs text-purple-500">
                    {format(new Date(req.requested_at), "h:mm a - MMM do")}
                  </p>
                </div>
                <button 
                  onClick={() => acceptHug(req.id)}
                  className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
                >
                  <CheckCircle2 size={18} /> Give
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Report */}
      <div className="bg-white/80 rounded-3xl p-6 shadow-md border-2 border-purple-100">
        <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
          <Calendar size={20} /> Hug Report
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <span className="block text-3xl font-black text-brand">{totalHugs}</span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Given</span>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <span className="block text-3xl font-black text-brand">{tokens}</span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Tokens Left</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Recent Hugs Given</p>
            {recentHugs.map((hug) => (
              <div key={hug.id} className="flex items-center gap-3 bg-purple-50 p-3 rounded-xl text-sm text-brand-dark">
                <Clock size={16} className="text-brand" />
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
            className="text-xs text-purple-400 hover:text-purple-600 font-medium flex items-center gap-1"
          >
            <Lock size={12} /> Lock Dashboard
          </button>
      </div>
    </div>
  );
}