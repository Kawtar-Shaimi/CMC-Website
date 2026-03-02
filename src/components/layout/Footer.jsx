// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/5 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                            <BookOpen size={15} className="text-white" />
                        </div>
                        <div>
                            <span className="font-display font-bold text-lg gradient-text">Takwine</span>
                            <p className="text-xs text-slate-500">Plateforme éducative étudiante</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
                        <Link to="/" className="hover:text-slate-200 transition-colors">Accueil</Link>
                        <Link to="/challenges" className="hover:text-slate-200 transition-colors">Défis</Link>
                        <Link to="/events" className="hover:text-slate-200 transition-colors">Événements</Link>
                        <Link to="/clubs" className="hover:text-slate-200 transition-colors">Clubs</Link>
                        <Link to="/subjects" className="hover:text-slate-200 transition-colors">Matières</Link>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                            <Github size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <p>© 2026 Takwine · Tous droits réservés</p>
                    <p className="flex items-center gap-1">
                        Fait avec <Heart size={12} className="text-red-400 fill-current" /> pour les étudiants algériens
                    </p>
                </div>
            </div>
        </footer>
    );
}
