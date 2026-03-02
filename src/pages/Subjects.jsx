// src/pages/Subjects.jsx - Static subjects/matières page

import React from 'react';
import { BookOpen } from 'lucide-react';

const SUBJECTS = [
    { name: 'Informatique', emoji: '💻', desc: 'Algorithmes, structures de données, IA, développement web et logiciel.', posts: 48, challenges: 15, color: '#3b82f6', topics: ['Python', 'Java', 'React', 'Machine Learning', 'BD'] },
    { name: 'Mathématiques', emoji: '📐', desc: 'Analyse, algèbre, probabilités, statistiques et mathématiques discrètes.', posts: 35, challenges: 22, color: '#8b5cf6', topics: ['Analyse', 'Algèbre Linéaire', 'Probabilités', 'Géométrie'] },
    { name: 'Physique', emoji: '⚛️', desc: 'Mécanique, thermodynamique, électromagnétisme et physique quantique.', posts: 28, challenges: 10, color: '#10b981', topics: ['Mécanique', 'Optique', 'Quantum', 'Électromagnétisme'] },
    { name: 'Chimie', emoji: '🧪', desc: 'Chimie organique, inorganique, thermochimie et réactions en solution.', posts: 20, challenges: 8, color: '#f59e0b', topics: ['Organique', 'Inorganique', 'Thermochimie', 'Spectro'] },
    { name: 'Biologie', emoji: '🧬', desc: 'Biologie cellulaire, génétique, écologie et physiologie animale/végétale.', posts: 18, challenges: 6, color: '#ef4444', topics: ['Génétique', 'Cellulaire', 'Écologie', 'Physiologie'] },
    { name: 'Électronique', emoji: '⚡', desc: 'Circuits analogiques et numériques, systèmes embarqués, FPGA.', posts: 22, challenges: 11, color: '#ec4899', topics: ['Analogique', 'Numérique', 'Arduino', 'FPGA'] },
    { name: 'Génie Civil', emoji: '🏗️', desc: 'Résistance des matériaux, béton armé, hydraulique et topographie.', posts: 14, challenges: 5, color: '#6366f1', topics: ['RDM', 'Béton Armé', 'Hydraulique', 'Topo'] },
    { name: 'Économie', emoji: '📊', desc: 'Microéconomie, macroéconomie, finance et gestion d\'entreprise.', posts: 16, challenges: 4, color: '#14b8a6', topics: ['Micro', 'Macro', 'Finance', 'Marketing'] },
];

export default function Subjects() {
    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Matières</h1>
                        <p className="text-sm text-slate-400">Explorez les ressources par discipline</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                    <span><span className="font-bold text-white">{SUBJECTS.length}</span> matières</span>
                    <span><span className="font-bold text-white">{SUBJECTS.reduce((s, m) => s + m.posts, 0)}</span> ressources</span>
                    <span><span className="font-bold text-white">{SUBJECTS.reduce((s, m) => s + m.challenges, 0)}</span> défis</span>
                </div>
            </div>

            {/* Subject grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUBJECTS.map(subject => (
                    <div key={subject.name} className="post-card glass rounded-2xl p-5 border border-white/5 group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                style={{ background: `${subject.color}15`, border: `1px solid ${subject.color}25` }}>
                                {subject.emoji}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{subject.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span>{subject.posts} posts</span>
                                    <span>·</span>
                                    <span style={{ color: subject.color }}>{subject.challenges} défis</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">{subject.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {subject.topics.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-full text-xs"
                                    style={{ background: `${subject.color}10`, color: subject.color, border: `1px solid ${subject.color}20` }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 h-1 rounded-full overflow-hidden bg-white/5">
                            <div className="h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, (subject.posts / 50) * 100)}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}99)` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
