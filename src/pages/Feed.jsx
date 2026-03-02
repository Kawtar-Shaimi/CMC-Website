// src/pages/Feed.jsx - TakwineBoard — Main feed page

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPosts } from '../utils/storage';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import { PenSquare, Filter, TrendingUp, Clock, Zap, Calendar, FileText, Search } from 'lucide-react';

const FILTERS = [
    { value: 'all', label: 'Tout', icon: null },
    { value: 'resource', label: 'Ressources', icon: FileText },
    { value: 'challenge', label: 'Défis', icon: Zap },
    { value: 'event', label: 'Événements', icon: Calendar },
];

const SORTS = [
    { value: 'recent', label: 'Récents', icon: Clock },
    { value: 'popular', label: 'Populaires', icon: TrendingUp },
];

const PAGE_SIZE = 5;

export default function Feed() {
    const { currentUser } = useAuth();
    const [allPosts, setAllPosts] = useState(() => getPosts());
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('recent');
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const loaderRef = useRef(null);

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleCount(c => c + PAGE_SIZE);
            }
        }, { threshold: 0.1 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, []);

    // Refresh posts when component mounts
    useEffect(() => { setAllPosts(getPosts()); }, [showCreate]);

    // Filter + sort + search
    const filtered = allPosts
        .filter(p => filter === 'all' || p.type === filter)
        .filter(p => !search || (p.title + p.content).toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sort === 'popular'
            ? (b.likes || 0) - (a.likes || 0)
            : new Date(b.createdAt) - new Date(a.createdAt));

    const visible = filtered.slice(0, visibleCount);

    function handlePostCreated(post) {
        setAllPosts(prev => [post, ...prev]);
    }

    function handlePostUpdate(updated) {
        setAllPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Create post box */}
            <div className="glass rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white avatar-ring flex-shrink-0"
                        style={{ background: currentUser?.avatarColor || '#6366f1' }}>
                        {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex-1 text-left px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-slate-300 transition-all hover:bg-white/5"
                        style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        Partagez quelque chose avec votre communauté...
                    </button>
                    <button onClick={() => setShowCreate(true)}
                        className="p-3 rounded-xl text-white flex items-center gap-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                        <PenSquare size={16} />
                        <span className="hidden sm:inline">Publier</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl px-4 py-3 border border-white/5">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Type filter tabs */}
                    <div className="flex gap-1 flex-wrap">
                        {FILTERS.map(f => {
                            const Icon = f.icon;
                            return (
                                <button key={f.value} onClick={() => { setFilter(f.value); setVisibleCount(PAGE_SIZE); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === f.value ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                    style={filter === f.value ? { background: 'linear-gradient(135deg, #2563eb, #4f46e5)' } : {}}>
                                    {Icon && <Icon size={12} />} {f.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher..."
                                className="input-focus pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-200 placeholder-slate-500 w-36 sm:w-48"
                                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        </div>

                        {/* Sort */}
                        <div className="flex gap-1">
                            {SORTS.map(s => {
                                const Icon = s.icon;
                                return (
                                    <button key={s.value} onClick={() => setSort(s.value)}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${sort === s.value ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}>
                                        <Icon size={12} /> {s.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-between px-1">
                <p className="text-xs text-slate-500">
                    {filtered.length} post{filtered.length !== 1 ? 's' : ''} {filter !== 'all' ? `· ${FILTERS.find(f => f.value === filter)?.label}` : ''}
                </p>
            </div>

            {/* Posts */}
            {visible.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-slate-400 font-medium">Aucun post trouvé</p>
                    <p className="text-slate-500 text-sm mt-1">Soyez le premier à partager quelque chose !</p>
                    <button onClick={() => setShowCreate(true)}
                        className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                        Créer un post
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {visible.map(post => (
                            <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
                        ))}
                    </div>

                    {/* Infinite scroll loader */}
                    <div ref={loaderRef} className="py-4 flex justify-center">
                        {visibleCount < filtered.length ? (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                Chargement...
                            </div>
                        ) : (
                            filtered.length > PAGE_SIZE && (
                                <p className="text-xs text-slate-600">Tous les posts ont été chargés 🎉</p>
                            )
                        )}
                    </div>
                </>
            )}

            {/* Create post modal */}
            {showCreate && (
                <CreatePost onPostCreated={handlePostCreated} onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
}
