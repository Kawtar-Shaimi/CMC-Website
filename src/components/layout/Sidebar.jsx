// src/components/layout/Sidebar.jsx - Left sidebar navigation

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers } from '../../utils/storage';
import { Home, Zap, Calendar, Users, BookOpen, Trophy } from 'lucide-react';

const navItems = [
    { to: '/', icon: Home, label: 'Accueil', exact: true },
    { to: '/challenges', icon: Zap, label: 'Défis — TakwineHub' },
    { to: '/events', icon: Calendar, label: 'Événements' },
    { to: '/clubs', icon: Users, label: 'Clubs' },
    { to: '/subjects', icon: BookOpen, label: 'Matières' },
];

function LeaderboardMini() {
    const users = getUsers()
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 3);

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div className="mt-6 glass-light rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-amber-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Classement</span>
            </div>
            <div className="space-y-2">
                {users.map((user, i) => {
                    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                        <Link
                            to={`/profile/${user.id}`}
                            key={user.id}
                            className="flex items-center gap-2 hover:bg-white/5 rounded-xl p-2 transition-colors group"
                        >
                            <span className="text-base">{medals[i]}</span>
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: user.avatarColor }}
                            >
                                {initials.slice(0, 1)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-300 group-hover:text-slate-100 truncate transition-colors">
                                    {user.name.split(' ')[0]}
                                </p>
                            </div>
                            <span className="text-xs font-bold text-amber-400">{user.points || 0}</span>
                        </Link>
                    );
                })}
            </div>
            <Link
                to="/challenges"
                className="mt-3 w-full flex items-center justify-center text-xs text-blue-400 hover:text-blue-300 transition-colors pt-2 border-t border-white/5"
            >
                Voir le classement complet →
            </Link>
        </div>
    );
}

export default function Sidebar() {
    const { currentUser } = useAuth();

    return (
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-1">
                {/* Navigation */}
                <nav className="glass-light rounded-2xl p-2 border border-white/5">
                    {navItems.map(({ to, icon: Icon, label, exact }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'nav-item-active text-blue-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Mini leaderboard */}
                <LeaderboardMini />

                {/* Quick stats if own profile */}
                {currentUser && (
                    <div className="glass-light rounded-2xl p-4 border border-white/5">
                        <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-3 group mb-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white avatar-ring"
                                style={{ background: currentUser.avatarColor }}
                            >
                                {currentUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                                    {currentUser.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.filiere}</p>
                            </div>
                        </Link>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-white/5 rounded-xl p-2">
                                <p className="text-xs text-slate-400">Filière</p>
                                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{currentUser.filiere}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-2">
                                <p className="text-xs text-slate-400">Année</p>
                                <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{currentUser.annee}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
