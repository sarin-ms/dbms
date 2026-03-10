import React, { useEffect, useState } from 'react';
import { getCandidates } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

            if (!topCandidate || candidate.votes > topCandidate?.votes) {
                topCandidate = candidate;
            }
        });

        // Sort candidates within groups by votes descending
        Object.keys(groups).forEach(position => {
            groups[position].sort((a, b) => b.votes - a.votes);
        });

        setGroupedData(groups);
        setStats({ totalVotes: total, leadingCandidate: topCandidate });
    };

    // Flatten and sort for the leaderboard
    const allCandidatesSorted = [...candidates].sort((a, b) => {
        if (a.position === b.position) {
            return b.votes - a.votes;
        }
        return a.position.localeCompare(b.position);
    });

    const getPositionTotal = (position) => {
        return groupedData[position]?.reduce((sum, c) => sum + c.votes, 0) || 0;
    };

    const isWinner = (candidate) => {
        const posGroup = groupedData[candidate.position];
        if (!posGroup || posGroup.length === 0 || candidate.votes === 0) return false;
        // Since posGroup is sorted descending, index 0 is the highest votes
        return posGroup[0].id === candidate.id && candidate.votes === posGroup[0].votes;
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 md:mt-10 pb-12 font-sans tracking-wide">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 md:p-8">

                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Election Results Dashboard</h2>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white border text-gray-800 p-5 rounded-lg shadow-sm border-l-4 border-l-blue-600 flex justify-between items-center transition-transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Total Votes Cast</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalVotes}</p>
                        </div>
                        <div className="text-blue-600 p-3 bg-blue-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive"><rect width="20" height="5" x="2" y="4" rx="1" /><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" /><path d="M10 13h4" /></svg>
                        </div>
                    </div>

                    <div className="bg-white border text-gray-800 p-5 rounded-lg shadow-sm border-l-4 border-l-green-500 flex justify-between items-center transition-transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Active Positions</h3>
                            <p className="text-3xl font-bold text-gray-800">{Object.keys(groupedData).length}</p>
                        </div>
                        <div className="text-green-600 p-3 bg-green-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation"><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
                        </div>
                    </div>

                    <div className="bg-white border text-gray-800 p-5 rounded-lg shadow-sm border-l-4 border-l-purple-600 flex justify-between items-center transition-transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Leading Candidate</h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.leadingCandidate ? stats.leadingCandidate.name : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats.leadingCandidate ? `${stats.leadingCandidate.votes} votes` : ''}
                            </p>
                        </div>
                        <div className="text-purple-600 p-3 bg-purple-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {Object.keys(groupedData).length === 0 ? (
                        <p className="text-center text-gray-500 col-span-2">No results available yet.</p>
                    ) : (
                        Object.entries(groupedData).map(([position, candidatesList]) => (
                            <div
                                key={position}
                                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <h3 className="text-lg font-bold mb-6 text-gray-800">{position} Results</h3>

                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={candidatesList}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                                            barSize={60}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={true}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                dx={-10}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar
                                                dataKey="votes"
                                                fill="#2563EB"
                                                radius={[2, 2, 0, 0]}
                                                animationDuration={1000}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Candidate Leaderboard */}
                {allCandidatesSorted.length > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Candidate Leaderboard</h3>

                        <div className="space-y-6">
                            {allCandidatesSorted.map(candidate => {
                                const posTotal = getPositionTotal(candidate.position);
                                const percentage = posTotal === 0 ? 0 : Math.round((candidate.votes / posTotal) * 100);
                                const winner = isWinner(candidate);

                                return (
                                    <div key={candidate.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 group">
                                        <div className="w-full md:w-48 shrink-0">
                                            <p className="font-bold text-gray-800">{candidate.name}</p>
                                            <p className="text-xs text-gray-500">{candidate.position}</p>
                                        </div>

                                        <div className="flex-grow flex items-center gap-4">
                                            <div className="w-24 shrink-0 text-gray-600 text-sm font-medium flex items-center gap-2">
                                                {candidate.votes} {candidate.votes === 1 ? 'vote' : 'votes'}
                                                {winner && (
                                                    <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block leading-tight">
                                                        Winner
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-grow flex items-center gap-4">
                                                <div className="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="w-12 text-right text-gray-600 font-medium text-sm shrink-0">
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsView;
