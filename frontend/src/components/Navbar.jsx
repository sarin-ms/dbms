import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Voting System</Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="hover:text-blue-200 transition">Vote</Link>
                    <Link to="/results" className="hover:text-blue-200 transition">Results</Link>
                    <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-blue-700 px-4 space-y-2 overflow-hidden"
                    >
                        <Link to="/" className="block hover:bg-blue-600 px-3 py-2 rounded mt-2" onClick={() => setIsOpen(false)}>Vote</Link>
                        <Link to="/results" className="block hover:bg-blue-600 px-3 py-2 rounded" onClick={() => setIsOpen(false)}>Results</Link>
                        <Link to="/admin" className="block hover:bg-blue-600 px-3 py-2 rounded mb-4" onClick={() => setIsOpen(false)}>Admin</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
