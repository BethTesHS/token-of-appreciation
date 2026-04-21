import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HugProvider } from './context/HugProvider';
import PichuView from './components/PichuView';
import BigSisDashboard from './components/BigSisView';

function App() {
  return (
    <HugProvider>
      <BrowserRouter>
        <div className="min-h-screen relative pb-16 toa-bg overflow-hidden">
          {/* Decorative background blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--color-candy)]/25 blur-3xl toa-float" />
            <div className="absolute top-10 -right-28 h-80 w-80 rounded-full bg-[color:var(--color-brand)]/20 blur-3xl toa-float [animation-delay:-1.6s]" />
            <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[color:var(--color-mint)]/18 blur-3xl toa-float [animation-delay:-2.2s]" />
          </div>
          
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