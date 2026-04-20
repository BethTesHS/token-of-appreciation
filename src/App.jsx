import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HugProvider } from './context/HugContext';
import PichuView from './components/PichuView';
import BigSisDashboard from './components/BigSisView';

function App() {
  return (
    <HugProvider>
      <BrowserRouter>
        <div className="min-h-screen relative pb-16">
          
          <Routes>
            {/* Pichu's Page is the default home route */}
            <Route path="/" element={<PichuView />} />
            
            {/* Big Sis Dashboard is on a separate route */}
            <Route path="/big-sis" element={<BigSisDashboard />} />
          </Routes>

          {/* Discreet navigation links at the bottom to jump between pages */}
          <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center gap-8 text-sm opacity-50 hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm">
            <Link to="/" className="text-purple-600 font-medium hover:underline">
              Pichu's View
            </Link>
            <Link to="/big-sis" className="text-purple-600 font-medium hover:underline">
              Big Sis View
            </Link>
          </div>

        </div>
      </BrowserRouter>
    </HugProvider>
  );
}

export default App;