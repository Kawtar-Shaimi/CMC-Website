// src/pages/Challenges.jsx - TakwineHub — Challenges & Leaderboard

import React, { useState } from 'react';
import { getPosts, getUsers } from '../utils/storage';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import { Zap, Trophy, Plus, Clock, Star, Target } from 'lucide-react';

function Leaderboard() {
    const users = getUsers().sort((a, b) => (b.points || 0) - (a.points || 0));
    const medals = ['🥇', '🥈', '🥉'];
    const colors = ['#f59e0b', '#94a3b8', '#cd7c0a'];

    return (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                <h2 className="font-bold text-white">Classement Global</h2>
            </div>
            <div className="divide-y divide-white/5">
                {users.map((user, i) => {
                    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const isTop3 = i < 3;
                    return (
                        <div key={user.id}
                            className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/3 ${isTop3 ? '' : ''}`}
                            style={isTop3 ? { background: `${colors[i]}08` } : {}}>
                            <span className="text-lg w-8 text-center flex-shrink-0">
                                {isTop3 ? medals[i] : <span className="text-slate-500 text-sm font-bold">#{i + 1}</span>}
                            </span>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ background: user.avatarColor }}>
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.filiere} · {user.challengesWon || 0} défis gagnés</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold" style={{ color: isTop3 ? colors[i] : '#64748b' }}>{user.points || 0}</p>
                                <p className="text-xs text-slate-600">pts</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Challenges() {
    const [challenges, setChallenges] = useState(() => getPosts().filter(p => p.type === 'challenge'));
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('active');

    const active = challenges.filter(c => !c.deadline || new Date(c.deadline) > Date.now());
    const expired = challenges.filter(c => c.deadline && new Date(c.deadline) <= Date.now());
    const shown = filter === 'active' ? active : filter === 'expired' ? expired : challenges;

    function handleCreated(post) {
        if (post.type === 'challenge') setChallenges(prev => [post, ...prev]);
    }

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                                <Zap size={18} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">TakwineHub</h1>
                        </div>
                        <p className="text-sm text-slate-400">Relevez des défis, proposez des solutions, gagnez des points !</p>
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                        <Plus size={15} /> Créer un défi
                    </button>
                </div>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                        { value: challenges.length, label: 'Défis totaux', icon: Target, color: '#f59e0b' },
                        { value: active.length, label: 'En cours', icon: Clock, color: '#10b981' },
                        { value: getUsers().reduce((sum, u) => sum + (u.challengesWon || 0), 0), label: 'Solutions gagnantes', icon: Star, color: '#8b5cf6' },
                    ].map(s => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="glass-light rounded-xl p-3 text-center border border-white/5">
                                <Icon size={16} className="mx-auto mb-1" style={{ color: s.color }} />
                                <div className="text-lg font-bold text-white">{s.value}</div>
                                <div className="text-xs text-slate-500">{s.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-5 flex-col lg:flex-row">
                {/* Challenges list */}
                <div className="flex-1 space-y-4">
                    {/* Filter tabs */}
                    <div className="flex gap-1 glass rounded-xl p-1 border border-white/5">
                        {[['all', 'Tous'], ['active', '🟢 Actifs'], ['expired', '🔴 Terminés']].map(([val, lbl]) => (
                            <button key={val} onClick={() => setFilter(val)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${filter === val ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                                style={filter === val ? { background: 'linear-gradient(135deg, #f59e0b40, #f9731640)' } : {}}>
                                {lbl}
                            </button>
                        ))}
                    </div>

                    {shown.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <Zap size={40} className="mx-auto mb-3 opacity-30" />
                            <p>Aucun défi {filter === 'active' ? 'actif' : filter === 'expired' ? 'terminé' : ''} pour l'instant</p>
                            <button onClick={() => setShowCreate(true)}
                                className="mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                                <Plus size={14} /> Créer le premier défi
                            </button>
                        </div>
                    ) : (
                        shown.map(post => <PostCard key={post.id} post={post} />)
                    )}
                </div>

                {/* Leaderboard sidebar */}
                <div className="lg:w-72 xl:w-80 flex-shrink-0">
                    <Leaderboard />
                </div>
            </div>

            {showCreate && (
                <CreatePost onPostCreated={handleCreated} onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
}
