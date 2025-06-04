import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchLanding from './components/SearchLanding';
import Marketplace from './components/marketplace/Marketplace';
import Hub from './components/hub/Hub';
import DeepWiki from './components/deepwiki/DeepWiki';
import Analytics from './components/analytics/Analytics';
import Settings from './components/settings/Settings';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Toast, ToastContainer } from './components/ui/Toast';
import { useToastStore } from './lib/store';

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-20">
          <Routes>
            <Route path="/" element={<SearchLanding />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/deepwiki" element={<DeepWiki />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </ToastContainer>
      </div>
    </BrowserRouter>
  );
}

export default App;