import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VoteForm from './components/VoteForm';
import AdminPanel from './components/AdminPanel';
import ResultsView from './components/ResultsView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<VoteForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/results" element={<ResultsView />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          &copy; {new Date().getFullYear()} Voting System. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
