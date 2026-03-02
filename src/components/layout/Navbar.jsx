// src/components/layout/Navbar.jsx - Top navigation bar

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, LogOut, User, ChevronDown, BookOpen } from 'lucide-react';

function Avatar({ user, size = 'sm' }) {
    const sizeClasses = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base';
    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
    return (
        <div
            className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white avatar-ring flex-shrink-0`}
            style={{ background: user?.avatarColor || '#6366f1' }}
        >
            {initials}
        </div>
    );
}

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const dropRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handler(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function handleLogout() {
        logout();
        navigate('/login');
        setDropdownOpen(false);
    }

    const notifications = [
        { id: 1, text: 'Karim a liké votre post sur les algorithmes', time: '2min', icon: '❤️' },
        { id: 2, text: 'Lina a commenté votre défi', time: '15min', icon: '💬' },
        { id: 3, text: 'Nouveau défi posté en Mathématiques !', time: '1h', icon: '🏆' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <span className="font-display font-bold text-xl gradient-text hidden sm:block">Takwine</span>
                    </Link>

                    {/* Search */}
                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Rechercher posts, défis, étudiants..."
                                className="input-focus w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(v => !v)}
                                className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                            >
                                <Bell size={20} />
                                <span className="notif-dot"></span>
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slide-down z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <h3 className="font-semibold text-sm text-slate-200">Notifications</h3>
                                    </div>
                                    {notifications.map(n => (
                                        <div key={n.id} className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-start gap-3 transition-colors">
                                            <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                                                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 border-t border-white/5 text-center">
                                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Voir tout</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User dropdown */}
                        <div className="relative" ref={dropRef}>
                            <button
                                onClick={() => setDropdownOpen(v => !v)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                            >
                                <Avatar user={currentUser} size="sm" />
                                <span className="text-sm font-medium text-slate-200 hidden sm:block max-w-[100px] truncate">
                                    {currentUser?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-12 w-56 glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-slide-down z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-sm font-semibold text-slate-200">{currentUser?.name}</p>
                                        <p className="text-xs text-slate-400">{currentUser?.filiere} · {currentUser?.annee}</p>
                                    </div>
                                    <Link
                                        to={`/profile/${currentUser?.id}`}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors"
                                    >
                                        <User size={15} />
                                        Mon profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-white/5"
                                    >
                                        <LogOut size={15} />
                                        Se déconnecter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export { Avatar };
