import React, { useEffect, useState } from 'react';
import { getCandidates } from '../api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsView = () => {
    const [candidates, setCandidates] = useState([]);
    const [groupedData, setGroupedData] = useState({});
    const [stats, setStats] = useState({ totalVotes: 0, leadingCandidate: null });

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const data = await getCandidates();
            setCandidates(data);
            processResults(data);
        } catch (error) {
            console.error('Failed to load results:', error);
        }
    };

    const processResults = (data) => {
        const groups = {};
        let total = 0;
        let topCandidate = null;

        data.forEach(candidate => {
            if (!groups[candidate.position]) {
                groups[candidate.position] = [];
            }
            groups[candidate.position].push(candidate);
            total += candidate.votes;

            if (!topCandidate || candidate.votes > topCandidate.votes) {
                topCandidate = candidate;
            }
        });

        setGroupedData(groups);
        setStats({ totalVotes: total, leadingCandidate: topCandidate });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto mt-6 md:mt-10 p-4 md:p-6 bg-white shadow-lg rounded-lg"
        >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Election Analysis</h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div className="bg-blue-50 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
                    <h3 className="text-gray-600 font-semibold">Total Votes Cast</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalVotes}</p>
                </motion.div>
                <motion.div className="bg-green-50 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
                    <h3 className="text-gray-600 font-semibold">Active Positions</h3>
                    <p className="text-3xl font-bold text-green-600">{Object.keys(groupedData).length}</p>
                </motion.div>
                <motion.div className="bg-purple-50 p-4 rounded-lg text-center" whileHover={{ scale: 1.02 }}>
                    <h3 className="text-gray-600 font-semibold">Top Candidate</h3>
                    <p className="text-xl font-bold text-purple-600">
                        {stats.leadingCandidate ? stats.leadingCandidate.name : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {stats.leadingCandidate ? `${stats.leadingCandidate.votes} votes` : ''}
                    </p>
                </motion.div>
            </div>

            {/* Charts Area */}
            <div className="space-y-12">
                {Object.keys(groupedData).length === 0 ? (
                    <p className="text-center text-gray-500">No results available yet.</p>
                ) : (
                    Object.entries(groupedData).map(([position, candidatesList], index) => (
                        <motion.div
                            key={position}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 p-6 rounded-lg border"
                        >
                            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{position} Results</h3>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={candidatesList} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="votes" name="Votes" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-8 text-center">
                <motion.button
                    onClick={loadResults}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow-md"
                >
                    Refresh Data
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ResultsView;
