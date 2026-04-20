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

        </div>
      </BrowserRouter>
    </HugProvider>
  );
}

export default App;