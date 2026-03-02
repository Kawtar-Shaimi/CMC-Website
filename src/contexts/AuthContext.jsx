// src/contexts/AuthContext.jsx - Authentication context for Takwine

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signToken, decodeToken } from '../utils/jwt';
import { getUserByEmail, saveUser, initStorage, generateId } from '../utils/storage';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize storage and restore session on mount
    useEffect(() => {
        initStorage();
        const token = localStorage.getItem('takwine_token');
        if (token) {
            const payload = decodeToken(token);
            if (payload) {
                setCurrentUser(payload);
            } else {
                localStorage.removeItem('takwine_token');
            }
        }
        setLoading(false);
    }, []);

    // ─── Signup ──────────────────────────────────────────────────
    async function signup({ name, email, password, filiere, annee, bio }) {
        // Validate
        if (!name || !email || !password || !filiere || !annee) {
            throw new Error('Veuillez remplir tous les champs obligatoires.');
        }
        if (password.length < 6) {
            throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
        }
        if (getUserByEmail(email)) {
            throw new Error('Un compte avec cet email existe déjà.');
        }

        const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        const user = {
            id: generateId(),
            name,
            email,
            password,
            filiere,
            annee,
            bio: bio || '',
            avatar: null,
            avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
            points: 0,
            badges: ['🌟 Nouveau'],
            postsCount: 0,
            challengesWon: 0,
            joinedAt: new Date().toISOString(),
        };

        saveUser(user);

        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            filiere: user.filiere,
            annee: user.annee,
            avatarColor: user.avatarColor,
        };
        const token = await signToken(tokenPayload);
        localStorage.setItem('takwine_token', token);
        setCurrentUser(tokenPayload);
        return user;
    }

    // ─── Login ───────────────────────────────────────────────────
    async function login({ email, password }) {
        if (!email || !password) {
            throw new Error('Email et mot de passe requis.');
        }
        const user = getUserByEmail(email);
        if (!user || user.password !== password) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            filiere: user.filiere,
            annee: user.annee,
            avatarColor: user.avatarColor,
        };
        const token = await signToken(tokenPayload);
        localStorage.setItem('takwine_token', token);
        setCurrentUser(tokenPayload);
        return user;
    }

    // ─── Logout ──────────────────────────────────────────────────
    function logout() {
        localStorage.removeItem('takwine_token');
        setCurrentUser(null);
        toast.success('Déconnexion réussie. À bientôt ! 👋');
    }

    // ─── Update current user ──────────────────────────────────────
    async function refreshCurrentUser() {
        const token = localStorage.getItem('takwine_token');
        if (token) {
            const payload = decodeToken(token);
            if (payload) setCurrentUser(payload);
        }
    }

    return (
        <AuthContext.Provider value={{ currentUser, loading, signup, login, logout, refreshCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
