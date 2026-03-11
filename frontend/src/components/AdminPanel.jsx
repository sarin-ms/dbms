import React, { useState, useEffect } from 'react';
import { getCandidates, addCandidate, deleteCandidate, updateCandidate, resetData } from '../api';
import { Eye, EyeOff, LogOut, Edit, Trash2, AlertTriangle, UserCircle } from 'lucide-react';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [newCandidate, setNewCandidate] = useState({ name: '', admissionNumber: '', position: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', position: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            loadCandidates();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid Password');
        }
    };

    const loadCandidates = async () => {
        const data = await getCandidates();
        setCandidates(data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        // The backend currently only processes name and position, but we include admissionNumber
        // in the request to match the UI if backend is ever updated.
        await addCandidate(newCandidate);
        setNewCandidate({ name: '', admissionNumber: '', position: '' });
        loadCandidates();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this candidate?')) {
            await deleteCandidate(id);
            loadCandidates();
        }
    };

    const startEdit = (candidate) => {
        setEditingId(candidate.id);
        setEditForm({ name: candidate.name, position: candidate.position });
    };

    const handleUpdate = async () => {
        await updateCandidate(editingId, editForm);
        setEditingId(null);
        loadCandidates();
    };

    const handleReset = async () => {
        if (window.confirm('WARNING: This will delete all votes and reset candidate scores. Are you sure?')) {
            await resetData();
            loadCandidates();
            alert('Election data has been reset.');
        }
    };

    const getPositionPillColor = (position) => {
        if (!position) return 'bg-gray-100 text-gray-800';
        const posLower = position.toLowerCase();
        if (posLower.includes('female')) return 'bg-pink-400 text-white';
        if (posLower.includes('male') || posLower.includes('men')) return 'bg-blue-500 text-white';
        return 'bg-gray-200 text-gray-800';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-100 to-blue-200 flex flex-col justify-between items-center font-sans tracking-wide">
                <div className="flex-1 w-full flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
                        <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Admin Login</h2>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-gray-800 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full border-2 p-3 pl-4 pr-12 rounded-lg outline-none transition-colors ${error ? 'border-red-400 focus:border-red-500' : 'border-blue-200 focus:border-blue-500'}`}
                                        placeholder="Enter admin password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                Login
                            </button>

                            <div className="text-center mt-4">
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot Password?</a>
                            </div>
                        </form>
                    </div>
                </div>

                <footer className="w-full text-center py-6 text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} College Election System. All rights reserved.
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-wide">Voting System</h1>
                    <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 bg-blue-700/50 px-3 py-1.5 rounded-full">
                            <UserCircle size={20} className="text-blue-200" />
                            <span className="font-medium text-blue-50">Admin User</span>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="border-b border-gray-100 bg-white p-6">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Election Admin Panel</h2>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* Left Side: Add Candidate Form */}
                        <div className="w-full lg:w-1/3">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Add Candidate</h3>

                            <form onSubmit={handleAdd} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5 pl-1">Name</label>
                                    <input
                                        type="text"
                                        value={newCandidate.name}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5 pl-1">Admission Number</label>
                                    <input
                                        type="text"
                                        value={newCandidate.admissionNumber}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, admissionNumber: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5 pl-1">Position</label>
                                    <select
                                        value={newCandidate.position}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select Position</option>
                                        <option value="Male Rep">Male Rep</option>
                                        <option value="Female Rep">Female Rep</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 shadow-sm"
                                >
                                    Add Candidate
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Candidate List & Controls */}
                        <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-12 pt-8 lg:pt-0">

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-gray-100/70 text-gray-700 font-semibold border-b border-gray-200">
                                            <th className="py-3 px-4 rounded-tl-lg">ID</th>
                                            <th className="py-3 px-4">Name</th>
                                            <th className="py-3 px-4">Position</th>
                                            <th className="py-3 px-4">Votes</th>
                                            <th className="py-3 px-4 rounded-tr-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {candidates.length > 0 ? candidates.map((candidate, index) => (
                                            <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors text-gray-800">
                                                <td className="py-4 px-4">{candidate.id}</td>

                                                <td className="py-4 px-4">
                                                    {editingId === candidate.id ? (
                                                        <input
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="border border-gray-300 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full min-w-30"
                                                        />
                                                    ) : candidate.name}
                                                </td>

                                                <td className="py-4 px-4">
                                                    {editingId === candidate.id ? (
                                                        <input
                                                            value={editForm.position}
                                                            onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                                            className="border border-gray-300 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-full min-w-25"
                                                        />
                                                    ) : (
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPositionPillColor(candidate.position)}`}>
                                                            {candidate.position}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-4">{candidate.votes}</td>

                                                <td className="py-4 px-4">
                                                    {editingId === candidate.id ? (
                                                        <div className="flex items-center space-x-3">
                                                            <button onClick={handleUpdate} className="text-sm text-blue-600 font-medium hover:text-blue-800">Save</button>
                                                            <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 font-medium hover:text-gray-700">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-3 text-gray-400">
                                                            <button onClick={() => startEdit(candidate)} className="hover:text-blue-600 transition-colors flex items-center space-x-1">
                                                                <Edit size={16} /> <span className="text-xs font-medium text-blue-600">Edit</span>
                                                            </button>
                                                            <span className="text-gray-300">/</span>
                                                            <button onClick={() => handleDelete(candidate.id)} className="hover:text-red-600 transition-colors text-red-500">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-500 italic">No candidates found. Add one on the left.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded transition-colors shadow-sm text-sm"
                                >
                                    <AlertTriangle size={16} />
                                    <span>Reset Election</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 text-slate-400 text-center py-5 text-sm">
                &copy; {new Date().getFullYear()} Voting System. All rights reserved.
            </footer>
        </div>
    );
};

export default AdminPanel;
