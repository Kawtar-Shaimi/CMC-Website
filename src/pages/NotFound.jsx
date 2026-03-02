// src/pages/NotFound.jsx - 404 page

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
            <div className="text-center animate-fade-in px-8">
                <div className="text-8xl font-black gradient-text mb-4">404</div>
                <div className="text-6xl mb-6">🔍</div>
                <h1 className="text-2xl font-bold text-white mb-3">Page introuvable</h1>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all">
                        <ArrowLeft size={15} /> Retour
                    </button>
                    <Link to="/"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                        <Home size={15} /> Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
