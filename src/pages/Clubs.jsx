// src/pages/Clubs.jsx - Static clubs page

import React from 'react';
import { Users, ExternalLink } from 'lucide-react';

const CLUBS = [
    {
        id: 1, name: 'Club Informatique & IA', emoji: '🤖', members: 142, description: 'Exploration de l\'intelligence artificielle, du machine learning et du développement logiciel. Hackathons mensuels et ateliers pratiques.',
        tags: ['Python', 'Machine Learning', 'Web Dev'], color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    },
    {
        id: 2, name: 'Club Mathématiques', emoji: '📐', members: 89, description: 'Résolution de problèmes, préparation aux olympiades mathématiques et vulgarisation des concepts avancés.',
        tags: ['Analyse', 'Algèbre', 'Olympiades'], color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    },
    {
        id: 3, name: 'Club Sciences Physiques', emoji: '⚗️', members: 67, description: 'Expériences en laboratoire, découverte de la physique quantique, électronique et astrophysique.',
        tags: ['Quantum', 'Électronique', 'Astro'], color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    },
    {
        id: 4, name: 'Club Entrepreneuriat', emoji: '🚀', members: 104, description: 'Développement de startups étudiantes, pitch competitions, mentorat et networking avec des professionnels.',
        tags: ['Startup', 'Business', 'Innovation'], color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    },
    {
        id: 5, name: 'Club Langues & Culture', emoji: '🌍', members: 78, description: 'Échanges culturels, apprendre de nouvelles langues, cercles de conversation et traductions académiques.',
        tags: ['Anglais', 'Français', 'Culture'], color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    },
    {
        id: 6, name: 'Club Arts & Créativité', emoji: '🎨', members: 55, description: 'Design graphique, illustration, photographie et expression artistique pour étudiants de toutes filières.',
        tags: ['Design', 'Photographie', 'Art'], color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    },
];

export default function Clubs() {
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
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <span className="font-bold text-white">{CLUBS.length}</span> clubs actifs ·
                    <span className="font-bold text-white">{CLUBS.reduce((s, c) => s + c.members, 0)}</span> membres au total
                </div>
            </div>

            {/* Club grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CLUBS.map(club => (
                    <div key={club.id} className="post-card glass rounded-2xl p-5 border border-white/5 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                                style={{ background: club.bg, border: `1px solid ${club.color}30` }}>
                                {club.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{club.name}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{club.members} membres</p>
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
                        <button className="mt-4 w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 active:scale-95"
                            style={{ background: `${club.color}20`, color: club.color, border: `1px solid ${club.color}30` }}>
                            Rejoindre le club
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
