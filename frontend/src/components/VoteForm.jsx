import React, { useState, useEffect } from 'react';
import { getCandidates, vote } from '../api';
import { motion } from 'framer-motion';

const VoteForm = () => {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        user_name: '',
        admission_number: '',
        position: '',
        candidate_id: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            const data = await getCandidates();
            setCandidates(data);
        } catch (err) {
            setError('Failed to load candidates');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.candidate_id) {
            setError('Please select a candidate');
            return;
        }

        try {
            await vote(formData);
            setMessage('Vote recorded successfully!');
            setFormData({ ...formData, candidate_id: '' }); // Reset candidate selection
            loadCandidates(); // Refresh votes count (optional, or just to sync)
        } catch (err) {
            setError(err.response?.data?.error || 'Voting failed');
        }
    };

    // Filter candidates by selected position
    const filteredCandidates = candidates.filter(c => c.position === formData.position);

    // Get unique positions
    const positions = [...new Set(candidates.map(c => c.position))];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto mt-6 md:mt-10 bg-white p-4 md:p-6 rounded-lg shadow-md"
        >
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Cast Your Vote</h2>

            {message && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Admission Number</label>
                    <input
                        type="text"
                        name="admission_number"
                        value={formData.admission_number}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Position</label>
                    <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Position</option>
                        {positions.map((pos, idx) => (
                            <option key={idx} value={pos}>{pos}</option>
                        ))}
                    </select>
                </div>

                {formData.position && (
                    <div>
                        <label className="block text-gray-700">Candidate</label>
                        <select
                            name="candidate_id"
                            value={formData.candidate_id}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Candidate</option>
                            {filteredCandidates.map(candidate => (
                                <option key={candidate.id} value={candidate.id}>
                                    {candidate.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Vote
                </motion.button>
            </form>
        </motion.div>
    );
};

export default VoteForm;
