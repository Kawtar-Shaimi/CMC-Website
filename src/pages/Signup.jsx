// src/pages/Signup.jsx - Signup page for Takwine

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, User, GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FILIERES = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Électronique', 'Génie Civil', 'Économie', 'Droit', 'Médecine', 'Autre'];
const ANNEES = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', 'Master 1', 'Master 2', 'Doctorat'];

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', filiere: '', annee: '', bio: '' });
    const [errors, setErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    function update(field, val) {
        setForm(f => ({ ...f, [field]: val }));
        setErrors(e => ({ ...e, [field]: '' }));
    }

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Nom complet requis';
        else if (form.name.trim().length < 3) e.name = 'Nom trop court (min 3 caractères)';
        if (!form.email) e.email = 'Email requis';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email invalide';
        if (!form.password) e.password = 'Mot de passe requis';
        else if (form.password.length < 6) e.password = 'Min 6 caractères';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
        if (!form.filiere) e.filiere = 'Filière requise';
        if (!form.annee) e.annee = 'Année requise';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await signup({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                filiere: form.filiere,
                annee: form.annee,
                bio: form.bio.trim(),
            });
            toast.success('Compte créé avec succès ! Bienvenue sur Takwine 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    const passwordStrength = !form.password ? 0
        : form.password.length >= 10 && /[A-Z]/.test(form.password) && /\d/.test(form.password) ? 3
            : form.password.length >= 6 ? 2 : 1;
    const strengthLabels = ['', 'Faible', 'Moyen', 'Fort'];
    const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];

    return (
        <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                    <div className="absolute top-16 left-20 w-56 h-56 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
                    <div className="absolute bottom-20 right-16 w-72 h-72 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

                    <div className="relative z-10 max-w-sm">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl mb-8">
                            <BookOpen size={36} className="text-white" />
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white mb-4">Rejoins Takwine</h1>
                        <p className="text-slate-300 text-base leading-relaxed mb-8">
                            Partage tes ressources, relève des défis, participe à des événements et progresse avec ta communauté.
                        </p>
                        <div className="space-y-3">
                            {[
                                '✅ Accès à tous les défis collaboratifs',
                                '✅ Partage de ressources et résumés',
                                '✅ Événements et sessions live',
                                '✅ Système de points et badges',
                            ].map(item => (
                                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md animate-slide-up py-8">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold gradient-text">Takwine</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Créer un compte 🚀</h2>
                    <p className="text-slate-400 text-sm mb-8">Rejoins la communauté éducative algérienne</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nom complet *</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                                    placeholder="Ahmed Benali" className="input-focus w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }} />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                                    placeholder="votre@email.dz" className="input-focus w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }} />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Filière & Année */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Filière *</label>
                                <div className="relative">
                                    <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select value={form.filiere} onChange={e => update('filiere', e.target.value)}
                                        className="input-focus w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-200 appearance-none"
                                        style={{ background: 'rgba(30,41,59,0.95)', border: `1px solid ${errors.filiere ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}>
                                        <option value="" className="bg-slate-800">Choisir...</option>
                                        {FILIERES.map(f => <option key={f} value={f} className="bg-slate-800">{f}</option>)}
                                    </select>
                                </div>
                                {errors.filiere && <p className="text-red-400 text-xs mt-1">{errors.filiere}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Année *</label>
                                <select value={form.annee} onChange={e => update('annee', e.target.value)}
                                    className="input-focus w-full px-3 py-2.5 rounded-xl text-sm text-slate-200 appearance-none"
                                    style={{ background: 'rgba(30,41,59,0.95)', border: `1px solid ${errors.annee ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}>
                                    <option value="" className="bg-slate-800">Choisir...</option>
                                    {ANNEES.map(a => <option key={a} value={a} className="bg-slate-800">{a}</option>)}
                                </select>
                                {errors.annee && <p className="text-red-400 text-xs mt-1">{errors.annee}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Mot de passe *</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                                    placeholder="Min 6 caractères" className="input-focus w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }} />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="mt-1.5 flex items-center gap-2">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-1 flex-1 rounded-full transition-all"
                                                style={{ background: i <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.1)' }} />
                                        ))}
                                    </div>
                                    <span className="text-xs" style={{ color: strengthColors[passwordStrength] }}>
                                        {strengthLabels[passwordStrength]}
                                    </span>
                                </div>
                            )}
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmer le mot de passe *</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                                    placeholder="Répéter le mot de passe" className="input-focus w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500"
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.confirmPassword ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }} />
                                {form.confirmPassword && form.password === form.confirmPassword && (
                                    <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
                                )}
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Bio (optional) */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio <span className="text-slate-600">(optionnel)</span></label>
                            <textarea value={form.bio} onChange={e => update('bio', e.target.value)}
                                placeholder="Parlez-nous un peu de vous..." rows={2}
                                className="input-focus w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-500 resize-none"
                                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 mt-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <><ArrowRight size={16} /> Créer mon compte</>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        Déjà inscrit ?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Se connecter →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
