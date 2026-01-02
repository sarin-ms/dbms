import React, { useState, useEffect } from 'react';
import { getCandidates, addCandidate, deleteCandidate, updateCandidate, resetData } from '../api';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [newCandidate, setNewCandidate] = useState({ name: '', position: '' });
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

    // ... (rest of handlers: handleAdd, handleDelete, startEdit, handleUpdate, handleReset) ...

    const handleAdd = async (e) => {
        e.preventDefault();
        await addCandidate(newCandidate);
        setNewCandidate({ name: '', position: '' });
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

    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter admin password"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto mt-6 md:mt-10 p-4 md:p-6 bg-white shadow-lg rounded-lg"
        >
            {/* ... (rest of dashboard JSX) ... */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <div className="flex gap-2 w-full md:w-auto">
                    <motion.button
                        onClick={() => setIsAuthenticated(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex-1 md:flex-none"
                    >
                        Logout
                    </motion.button>
                    <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex-1 md:flex-none"
                    >
                        Reset Election
                    </motion.button>
                </div>
            </div>

            {/* Add Candidate Form */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 p-4 bg-gray-50 rounded border"
            >
                <h3 className="text-lg font-semibold mb-4">Add New Candidate</h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        required
                        className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Position"
                        value={newCandidate.position}
                        onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                        required
                        className="border p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Add
                    </motion.button>
                </form>
            </motion.div>

            {/* Candidates List */}
            <div>
                <h3 className="text-xl font-bold mb-4">Candidate List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-3 px-4 border-b">ID</th>
                                <th className="py-3 px-4 border-b">Name</th>
                                <th className="py-3 px-4 border-b">Position</th>
                                <th className="py-3 px-4 border-b">Votes</th>
                                <th className="py-3 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate, index) => (
                                <motion.tr
                                    key={candidate.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4 border-b">{candidate.id}</td>

                                    <td className="py-3 px-4 border-b">
                                        {editingId === candidate.id ? (
                                            <input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="border p-1 rounded w-full"
                                            />
                                        ) : candidate.name}
                                    </td>

                                    <td className="py-3 px-4 border-b">
                                        {editingId === candidate.id ? (
                                            <input
                                                value={editForm.position}
                                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                                className="border p-1 rounded w-full"
                                            />
                                        ) : candidate.position}
                                    </td>

                                    <td className="py-3 px-4 border-b">{candidate.votes}</td>

                                    <td className="py-3 px-4 border-b space-x-2">
                                        {editingId === candidate.id ? (
                                            <>
                                                <button onClick={handleUpdate} className="text-green-600 hover:text-green-800 font-medium">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(candidate)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                                                <button onClick={() => handleDelete(candidate.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                            </>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminPanel;
