// src/components/posts/CreatePost.jsx - Post creation form/modal

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { savePost, updateUser, getUserById, generateId } from '../../utils/storage';
import { X, Image, Link2, Zap, Calendar, FileText, Send, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Électronique', 'Génie Civil', 'Économie', 'Tous'];

const POST_TYPES = [
    { value: 'resource', label: 'Ressource', icon: FileText, color: '#3b82f6', desc: 'Cours, résumés, exercices' },
    { value: 'challenge', label: 'Défi', icon: Zap, color: '#f59e0b', desc: 'Challenge collaboratif' },
    { value: 'event', label: 'Événement', icon: Calendar, color: '#10b981', desc: 'Live, atelier, conférence' },
];

export default function CreatePost({ onPostCreated, onClose }) {
    const { currentUser } = useAuth();
    const [type, setType] = useState('resource');
    const [form, setForm] = useState({ title: '', content: '', subject: currentUser?.filiere || 'Tous', link: '', videoLink: '', deadline: '', eventDate: '' });
    const [loading, setLoading] = useState(false);

    function update(field, val) {
        setForm(f => ({ ...f, [field]: val }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.content.trim()) {
            toast.error('Le contenu ne peut pas être vide');
            return;
        }
        if (!form.title.trim()) {
            toast.error('Un titre est requis');
            return;
        }
        setLoading(true);
        try {
            const post = {
                id: generateId(),
                authorId: currentUser.id,
                type,
                subject: form.subject,
                filiere: form.subject,
                title: form.title.trim(),
                content: form.content.trim(),
                imageUrl: null,
                link: form.link.trim() || null,
                videoLink: form.videoLink.trim() || null,
                deadline: (type === 'challenge' && form.deadline) ? new Date(form.deadline).toISOString() : null,
                eventDate: (type === 'event' && form.eventDate) ? new Date(form.eventDate).toISOString() : null,
                likes: 0,
                likedBy: [],
                commentsCount: 0,
                rsvpBy: [],
                rsvpCount: 0,
                createdAt: new Date().toISOString(),
            };
            savePost(post);

            // Update user post count & points
            const user = getUserById(currentUser.id);
            if (user) {
                updateUser(currentUser.id, {
                    postsCount: (user.postsCount || 0) + 1,
                    points: (user.points || 0) + 10,
                });
            }

            onPostCreated && onPostCreated(post);
            toast.success('Post publié avec succès ! 🎉');
            onClose && onClose();
        } catch (err) {
            toast.error('Erreur lors de la publication');
        } finally {
            setLoading(false);
        }
    }

    const selectedType = POST_TYPES.find(t => t.value === type);

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-xl glass rounded-3xl shadow-2xl border border-white/10 animate-slide-up"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">Créer un post</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Type selector */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">Type de post</label>
                        <div className="grid grid-cols-3 gap-2">
                            {POST_TYPES.map(pt => {
                                const Icon = pt.icon;
                                return (
                                    <button key={pt.value} type="button" onClick={() => setType(pt.value)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${type === pt.value ? 'border-opacity-100 bg-opacity-20' : 'border-white/8 hover:bg-white/5'}`}
                                        style={{
                                            borderColor: type === pt.value ? pt.color : 'rgba(255,255,255,0.08)',
                                            background: type === pt.value ? `${pt.color}20` : undefined,
                                        }}>
                                        <Icon size={18} style={{ color: type === pt.value ? pt.color : '#64748b' }} />
                                        <span className="text-xs font-medium" style={{ color: type === pt.value ? pt.color : '#94a3b8' }}>{pt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-center">{selectedType?.desc}</p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Titre *</label>
                        <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                            placeholder="Donnez un titre accrocheur..." maxLength={120}
                            className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Contenu *</label>
                        <textarea value={form.content} onChange={e => update('content', e.target.value)}
                            placeholder={type === 'challenge' ? 'Décrivez le défi, les règles, les contraintes...' : type === 'event' ? 'Décrivez l\'événement, les sujets abordés...' : 'Partagez vos connaissances...'}
                            rows={5} className="input-focus w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-500 resize-none"
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Matière / Filière</label>
                        <select value={form.subject} onChange={e => update('subject', e.target.value)}
                            className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 appearance-none"
                            style={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {SUBJECTS.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                        </select>
                    </div>

                    {/* Link (resource) */}
                    {type === 'resource' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Lien externe (optionnel)</label>
                            <div className="relative">
                                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="url" value={form.link} onChange={e => update('link', e.target.value)}
                                    placeholder="https://..." className="input-focus w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                            </div>
                        </div>
                    )}

                    {/* Challenge deadline */}
                    {type === 'challenge' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Date limite (optionnel)</label>
                            <input type="datetime-local" value={form.deadline} onChange={e => update('deadline', e.target.value)}
                                className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
                        </div>
                    )}

                    {/* Event fields */}
                    {type === 'event' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Date de l'événement</label>
                                <input type="datetime-local" value={form.eventDate} onChange={e => update('eventDate', e.target.value)}
                                    className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Lien vidéo / Meet</label>
                                <input type="url" value={form.videoLink} onChange={e => update('videoLink', e.target.value)}
                                    placeholder="https://meet.google.com/..." className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all">
                            Annuler
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <><Send size={15} /> Publier</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
