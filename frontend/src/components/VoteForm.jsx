import React, { useState, useEffect } from 'react';
import { getCandidates, vote } from '../api';
import { User, ChevronDown } from 'lucide-react';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Reset candidate_id if position changes
        if (e.target.name === 'position') {
            setFormData({ ...formData, [e.target.name]: e.target.value, candidate_id: '' });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleCandidateSelect = (id) => {
        setFormData({ ...formData, candidate_id: id });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.candidate_id) {
            setError('Please select a candidate before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            await vote(formData);
            setMessage('Vote recorded successfully!');
            // Reset form completely after successful vote
            setFormData({
                user_name: '',
                admission_number: '',
                position: '',
                candidate_id: ''
            });
            setTimeout(() => setMessage(''), 5000); // Clear success message after 5 seconds
        } catch (err) {
            setError(err.response?.data?.error || 'Voting failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter candidates by selected position
    const filteredCandidates = candidates.filter(c => c.position === formData.position);

    // Get unique positions
    const positions = [...new Set(candidates.map(c => c.position))];

    return (
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 md:p-10 font-sans border border-slate-100/50">
            <h2 className="text-[28px] font-[900] mb-8 text-center text-slate-800 tracking-tight">Cast Your Vote</h2>

            {message && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-center text-sm font-medium">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-center text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Input */}
                <div>
                    <label className="block text-slate-800 font-semibold text-sm mb-2 pl-1">Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full border-2 border-blue-100 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {/* Admission Number Input */}
                <div>
                    <label className="block text-slate-800 font-semibold text-sm mb-2 pl-1">Admission Number</label>
                    <input
                        type="text"
                        name="admission_number"
                        value={formData.admission_number}
                        onChange={handleChange}
                        required
                        placeholder="e.g., CHN24AM001"
                        className="w-full border-2 border-blue-100 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {/* Position Select */}
                <div>
                    <label className="block text-slate-800 font-semibold text-sm mb-2 pl-1">Position</label>
                    <div className="relative">
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="w-full border-2 border-blue-100 p-3 pr-10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 appearance-none bg-white cursor-pointer"
                        >
                            <option value="" disabled>Select Position</option>
                            {positions.map((pos, idx) => (
                                <option key={idx} value={pos}>{pos}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <ChevronDown size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Candidate Selection Grid */}
                {formData.position && (
                    <div className="pt-2 pb-2">
                        <label className="block text-slate-800 font-semibold text-sm mb-3 pl-1">
                            Candidates for {formData.position}
                        </label>

                        {filteredCandidates.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredCandidates.map(candidate => {
                                    const isSelected = formData.candidate_id === candidate.id;

                                    return (
                                        <div
                                            key={candidate.id}
                                            onClick={() => handleCandidateSelect(candidate.id)}
                                            className={`
                                                relative border-2 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
                                                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            {/* Avatar Circle */}
                                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                                <User size={32} strokeWidth={1.5} />
                                            </div>

                                            {/* Candidate Name */}
                                            <p className="font-semibold text-slate-800 text-center mb-4 line-clamp-2 min-h-[40px] flex items-center">
                                                {candidate.name}
                                            </p>

                                            {/* Select Button Indicator */}
                                            <button
                                                type="button"
                                                className={`
                                                    w-full py-2 px-4 rounded-lg text-sm font-bold transition-colors
                                                    ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                                        : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                                                    }
                                                `}
                                            >
                                                {isSelected ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                                No candidates found for this position.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.candidate_id}
                        className={`
                            w-full py-3.5 rounded-xl font-bold text-white transition-all
                            ${isSubmitting || !formData.candidate_id
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-[#4B93FF] hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]'
                            }
                        `}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default VoteForm;
