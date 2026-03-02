// src/pages/Profile.jsx - Student profile page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, updateUser, getPosts } from '../utils/storage';
import PostCard from '../components/posts/PostCard';
import { Edit2, Award, Zap, BookOpen, Calendar, Star, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FILIERES = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Électronique', 'Génie Civil', 'Économie', 'Droit', 'Médecine', 'Autre'];
const ANNEES = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', 'Master 1', 'Master 2', 'Doctorat'];

const BADGE_COLORS = {
    '🏆': '#f59e0b', '⚡': '#8b5cf6', '📚': '#3b82f6', '🎯': '#ef4444',
    '📐': '#10b981', '🌟': '#f59e0b', '🎖': '#6366f1', '🥇': '#f59e0b',
};

export default function Profile() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    const isOwn = currentUser?.id === id;

    useEffect(() => {
        const u = getUserById(id);
        if (!u) { navigate('/'); return; }
        setUser(u);
        setEditForm({ name: u.name, filiere: u.filiere, annee: u.annee, bio: u.bio || '' });
        const userPosts = getPosts().filter(p => p.authorId === id);
        setPosts(userPosts);
    }, [id]);

    async function saveProfile() {
        if (!editForm.name.trim()) { toast.error('Nom requis'); return; }
        setSaving(true);
        const updated = updateUser(id, { name: editForm.name.trim(), filiere: editForm.filiere, annee: editForm.annee, bio: editForm.bio });
        setUser(updated);
        setEditing(false);
        setSaving(false);
        toast.success('Profil mis à jour ! ✅');
    }

    if (!user) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
            {/* Profile card */}
            <div className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                {/* Background gradient decoration */}
                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at top right, ${user.avatarColor}, transparent 60%)` }} />

                <div className="relative z-10">
                    {/* Top row: avatar + actions */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
                                style={{ background: `linear-gradient(135deg, ${user.avatarColor}, ${user.avatarColor}99)`, border: `3px solid ${user.avatarColor}66` }}>
                                {initials}
                            </div>
                            {/* Name & info */}
                            <div>
                                {editing ? (
                                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                        className="input-focus text-xl font-bold text-white bg-transparent border-b border-blue-500 pb-1 focus:outline-none w-48" />
                                ) : (
                                    <h1 className="text-xl font-bold text-white">{user.name}</h1>
                                )}
                                {editing ? (
                                    <div className="flex gap-2 mt-2">
                                        <select value={editForm.filiere} onChange={e => setEditForm(f => ({ ...f, filiere: e.target.value }))}
                                            className="text-xs text-slate-300 rounded-lg px-2 py-1"
                                            style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {FILIERES.map(f => <option key={f} value={f} className="bg-slate-800">{f}</option>)}
                                        </select>
                                        <select value={editForm.annee} onChange={e => setEditForm(f => ({ ...f, annee: e.target.value }))}
                                            className="text-xs text-slate-300 rounded-lg px-2 py-1"
                                            style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {ANNEES.map(a => <option key={a} value={a} className="bg-slate-800">{a}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm mt-0.5">{user.filiere} · {user.annee}</p>
                                )}
                            </div>
                        </div>

                        {/* Edit button */}
                        {isOwn && (
                            <div className="flex gap-2">
                                {editing ? (
                                    <>
                                        <button onClick={saveProfile} disabled={saving}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white transition-all hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                            <Save size={12} /> Enregistrer
                                        </button>
                                        <button onClick={() => setEditing(false)}
                                            className="p-2 rounded-xl text-slate-400 hover:bg-white/5 transition-all">
                                            <X size={15} />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditing(true)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all">
                                        <Edit2 size={12} /> Modifier
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="mt-4">
                        {editing ? (
                            <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                                placeholder="Parlez de vous..." rows={2} className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-300 placeholder-slate-500 resize-none"
                                style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        ) : (
                            <p className="text-sm text-slate-300 leading-relaxed">{user.bio || 'Aucune bio renseignée.'}</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-4 gap-3">
                        {[
                            { value: user.points || 0, label: 'Points', icon: Star, color: '#f59e0b' },
                            { value: user.postsCount || posts.length, label: 'Posts', icon: BookOpen, color: '#3b82f6' },
                            { value: user.challengesWon || 0, label: 'Défis gagnés', icon: Zap, color: '#8b5cf6' },
                            { value: user.badges?.length || 0, label: 'Badges', icon: Award, color: '#10b981' },
                        ].map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="glass-light rounded-2xl p-3 text-center border border-white/5">
                                    <Icon size={16} className="mx-auto mb-1" style={{ color: s.color }} />
                                    <div className="text-lg font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Badges */}
                    {user.badges && user.badges.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-medium text-slate-400 mb-2">Badges</p>
                            <div className="flex flex-wrap gap-2">
                                {user.badges.map((badge, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(37,99,235,0.3))', border: '1px solid rgba(99,102,241,0.3)' }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 glass rounded-2xl p-1.5 border border-white/5">
                {[
                    { key: 'posts', label: `Posts (${posts.length})` },
                    { key: 'participations', label: 'Participations' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                        style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #2563eb, #4f46e5)' } : {}}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Posts tab */}
            {activeTab === 'posts' && (
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                            <p>{isOwn ? 'Vous n\'avez pas encore publié de post.' : 'Aucun post publié.'}</p>
                        </div>
                    ) : (
                        posts.map(post => <PostCard key={post.id} post={post} />)
                    )}
                </div>
            )}

            {/* Participations tab */}
            {activeTab === 'participations' && (
                <div className="glass rounded-2xl p-8 text-center border border-white/5">
                    <Zap size={40} className="mx-auto mb-3 text-amber-400 opacity-50" />
                    <p className="text-slate-400">Historique des participations aux défis</p>
                    <p className="text-sm text-slate-500 mt-1">{user.challengesWon} défi{user.challengesWon !== 1 ? 's' : ''} remporté{user.challengesWon !== 1 ? 's' : ''} · {user.points} points accumulés</p>
                </div>
            )}
        </div>
    );
}
