// src/pages/Login.jsx - Login page for Takwine

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    function validate() {
        const e = {};
        if (!form.email) e.email = 'Email requis';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
        if (!form.password) e.password = 'Mot de passe requis';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login({ email: form.email, password: form.password });
            toast.success('Connexion réussie ! Bienvenue sur Takwine 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
            setErrors({ submit: err.message });
        } finally {
            setLoading(false);
        }
    }

    // Quick demo login
    async function loginDemo(email) {
        setLoading(true);
        try {
            await login({ email, password: 'password123' });
            toast.success('Connexion démo réussie ! 🚀');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
            {/* Left - decorative */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                    {/* Decorative circles */}
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
                    <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

                    <div className="relative z-10 text-center max-w-sm">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl mx-auto mb-8">
                            <BookOpen size={36} className="text-white" />
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white mb-4">Takwine</h1>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            La plateforme sociale éducative conçue pour les étudiants algériens.
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {[
                                { val: '500+', label: 'Étudiants' },
                                { val: '120', label: 'Défis' },
                                { val: '45', label: 'Événements' },
                            ].map(item => (
                                <div key={item.label} className="glass-light rounded-2xl p-3">
                                    <div className="text-2xl font-bold gradient-text">{item.val}</div>
                                    <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right - form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md animate-slide-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold gradient-text">Takwine</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Bon retour ! 👋</h2>
                    <p className="text-slate-400 text-sm mb-8">Connectez-vous pour accéder à votre espace</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                                    placeholder="votre@email.dz"
                                    className={`input-focus w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-500 ${errors.email ? 'border-red-500/50' : ''}`}
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                                    placeholder="••••••••"
                                    className={`input-focus w-full pl-10 pr-10 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-500 ${errors.password ? 'border-red-500/50' : ''}`}
                                    style={{ background: 'rgba(30,41,59,0.8)', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}
                                />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Se connecter <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    {/* Demo accounts */}
                    <div className="mt-6">
                        <p className="text-xs text-slate-500 text-center mb-3">— Comptes de démonstration —</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { name: 'Yasmine', email: 'yasmine@takwine.dz', color: '#6366f1' },
                                { name: 'Karim', email: 'karim@takwine.dz', color: '#f59e0b' },
                                { name: 'Lina', email: 'lina@takwine.dz', color: '#10b981' },
                            ].map(u => (
                                <button
                                    key={u.email}
                                    onClick={() => loginDemo(u.email)}
                                    disabled={loading}
                                    className="flex flex-col items-center p-3 rounded-xl border transition-all hover:bg-white/5 active:scale-95 disabled:opacity-60"
                                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-1"
                                        style={{ background: u.color }}>
                                        {u.name[0]}
                                    </div>
                                    <span className="text-xs text-slate-400">{u.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        Pas encore de compte ?{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            S'inscrire →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
