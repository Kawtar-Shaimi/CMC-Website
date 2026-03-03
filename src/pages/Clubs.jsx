// src/pages/Clubs.jsx - Student clubs page with join/leave functionality

import React, { useState } from 'react';
import { Users, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { joinClub, leaveClub, isUserInClub } from '../utils/storage';
import toast from 'react-hot-toast';

const CLUBS = [
    {
        id: 1, name: 'Club Informatique & IA', emoji: '🤖', members: 142,
        description: 'Exploration de l\'intelligence artificielle, du machine learning et du développement logiciel. Hackathons mensuels et ateliers pratiques.',
        tags: ['Python', 'Machine Learning', 'Web Dev'], color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    },
    {
        id: 2, name: 'Club Mathématiques', emoji: '📐', members: 89,
        description: 'Résolution de problèmes, préparation aux olympiades mathématiques et vulgarisation des concepts avancés.',
        tags: ['Analyse', 'Algèbre', 'Olympiades'], color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    },
    {
        id: 3, name: 'Club Sciences Physiques', emoji: '⚗️', members: 67,
        description: 'Expériences en laboratoire, découverte de la physique quantique, électronique et astrophysique.',
        tags: ['Quantum', 'Électronique', 'Astro'], color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    },
    {
        id: 4, name: 'Club Entrepreneuriat', emoji: '🚀', members: 104,
        description: 'Développement de startups étudiantes, pitch competitions, mentorat et networking avec des professionnels.',
        tags: ['Startup', 'Business', 'Innovation'], color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    },
    {
        id: 5, name: 'Club Langues & Culture', emoji: '🌍', members: 78,
        description: 'Échanges culturels, apprendre de nouvelles langues, cercles de conversation et traductions académiques.',
        tags: ['Anglais', 'Français', 'Culture'], color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    },
    {
        id: 6, name: 'Club Arts & Créativité', emoji: '🎨', members: 55,
        description: 'Design graphique, illustration, photographie et expression artistique pour étudiants de toutes filières.',
        tags: ['Design', 'Photographie', 'Art'], color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    },
];

function ClubCard({ club, currentUser }) {
    // Initialize membership state from localStorage
    const [joined, setJoined] = useState(
        currentUser ? isUserInClub(currentUser.id, club.id) : false
    );
    const [memberCount, setMemberCount] = useState(club.members);
    const [loading, setLoading] = useState(false);

    function handleToggle() {
        if (!currentUser) {
            toast.error('Connectez-vous pour rejoindre un club 🔒');
            return;
        }
        setLoading(true);

        if (joined) {
            // Leave club
            leaveClub(currentUser.id, club.id);
            setJoined(false);
            setMemberCount(c => c - 1);
            toast('Vous avez quitté ' + club.name, { icon: '👋' });
        } else {
            // Join club
            joinClub(currentUser.id, club.id);
            setJoined(true);
            setMemberCount(c => c + 1);
            toast.success(`Bienvenue dans le ${club.name} ! 🎉`);
        }

        setTimeout(() => setLoading(false), 300);
    }

    return (
        <div className={`post-card glass rounded-2xl p-5 border transition-all group ${joined ? 'border-opacity-50' : 'border-white/5'}`}
            style={{ borderColor: joined ? `${club.color}40` : undefined }}>

            {/* Joined ribbon */}
            {joined && (
                <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                    style={{ background: `${club.color}20`, color: club.color, border: `1px solid ${club.color}30` }}>
                    <CheckCircle size={11} /> Membre
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: club.bg, border: `1px solid ${club.color}30` }}>
                    {club.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{club.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Users size={10} /> {memberCount} membres
                    </p>
                </div>
            </div>

            <p className="mt-3 text-sm text-slate-400 leading-relaxed">{club.description}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {club.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${club.color}15`, color: club.color, border: `1px solid ${club.color}25` }}>
                        {tag}
                    </span>
                ))}
            </div>

            <button
                onClick={handleToggle}
                disabled={loading}
                className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60`}
                style={joined
                    ? { background: `${club.color}15`, color: club.color, border: `1px solid ${club.color}30` }
                    : { background: `linear-gradient(135deg, ${club.color}, ${club.color}cc)`, color: '#fff' }
                }
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : joined ? (
                    <><CheckCircle size={14} /> Membre — Quitter le club</>
                ) : (
                    <><LogIn size={14} /> Rejoindre le club</>
                )}
            </button>
        </div>
    );
}

export default function Clubs() {
    const { currentUser } = useAuth();

    // Count of joined clubs for the header
    const joinedCount = currentUser
        ? CLUBS.filter(c => isUserInClub(currentUser.id, c.id)).length
        : 0;

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <Users size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Clubs Étudiants</h1>
                        <p className="text-sm text-slate-400">Rejoignez une communauté passionnée</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                    <span><span className="font-bold text-white">{CLUBS.length}</span> clubs actifs</span>
                    <span><span className="font-bold text-white">{CLUBS.reduce((s, c) => s + c.members, 0)}</span> membres au total</span>
                    {currentUser && joinedCount > 0 && (
                        <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                            ✓ Vous êtes dans {joinedCount} club{joinedCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Club grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CLUBS.map(club => (
                    <ClubCard key={club.id} club={club} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
}
