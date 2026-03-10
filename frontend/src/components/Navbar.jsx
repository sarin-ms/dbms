import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Menu, X, Home, BarChart2, Shield } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Vote', path: '/', icon: Home },
        { name: 'Results', path: '/results', icon: BarChart2 },
        { name: 'Admin', path: '/admin', icon: Shield }
    ];

    return (
        <nav className="bg-white w-full z-50">
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center py-4">

                <Link to="/" className="flex items-center space-x-3 group outline-none">
                    <img
                        src="/logo_landscape.png"
                        alt="Voting System Logo"
                        className="h-[50px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative px-5 py-2 rounded-full outline-none group"
                            >
                                <div className="flex items-center space-x-2 relative z-10">
                                    <Icon
                                        size={16}
                                        className={`transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className={`text-sm font-semibold transition-colors duration-200 ${isActive ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {link.name}
                                    </span>
                                </div>

                                {/* Active Pill Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navPill"
                                        className="absolute inset-0 bg-blue-50 rounded-full z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                {/* Hover Pill Background */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-slate-50 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Quick Action Button */}
                    <div className="pl-4 ml-4">
                        <Link to="/" className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all duration-200 active:scale-95 shadow-sm">
                            Cast Vote
                        </Link>
                    </div>
                </div>

                {/* Mobile Hamburger Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={20} strokeWidth={2.5} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="md:hidden bg-white border-b border-gray-100 shadow-xl overflow-hidden absolute w-full top-full"
                    >
                        <div className="container mx-auto px-6 py-4 flex flex-col space-y-1">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center space-x-4 p-4 rounded-xl font-bold transition-all duration-200
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                                            }
                                        `}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <span className="text-lg">{link.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="pt-4 mt-2">
                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex justify-center w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform"
                                >
                                    Cast Vote Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
