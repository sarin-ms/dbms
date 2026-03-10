import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VoteForm from './components/VoteForm';
import AdminPanel from './components/AdminPanel';
import ResultsView from './components/ResultsView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Route outside the main layout */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* All other routes wrapped in the main layout */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full">
                  <Routes>
                    <Route path="/" element={<VoteForm />} />
                    <Route path="/results" element={<ResultsView />} />
                  </Routes>
                </div>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
