// src/pages/Events.jsx - TakwineLive — Events page

import React, { useState } from 'react';
import { getPosts } from '../utils/storage';
import PostCard from '../components/posts/PostCard';
import CreatePost from '../components/posts/CreatePost';
import { Calendar, Plus, Play, Users, Clock } from 'lucide-react';

function EventCalendarCard({ event }) {
    const date = event.eventDate ? new Date(event.eventDate) : null;
    const isPast = date && date < Date.now();
    const isToday = date && new Date(date).toDateString() === new Date().toDateString();

    return (
        <div className={`glass-light rounded-2xl p-4 border transition-all hover:bg-white/5 ${isToday ? 'border-green-500/30' : 'border-white/5'}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-center">
                    {date ? (
                        <div className="w-12 rounded-xl overflow-hidden" style={{ border: `1px solid ${isToday ? '#10b981' : 'rgba(255,255,255,0.1)'}` }}>
                            <div className="text-xs font-bold text-white py-0.5 px-1"
                                style={{ background: isToday ? '#10b981' : '#2563eb' }}>
                                {date.toLocaleDateString('fr-DZ', { month: 'short' }).toUpperCase()}
                            </div>
                            <div className="text-2xl font-black text-white py-1">{date.getDate()}</div>
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600/20">
                            <Calendar size={18} className="text-blue-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        {isToday && <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#10b981' }}>AUJOURD'HUI</span>}
                        {!isPast && !isToday && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">À VENIR</span>}
                        {isPast && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400">PASSÉ</span>}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 leading-snug">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        {date && <span className="flex items-center gap-1"><Clock size={10} /> {date.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })}</span>}
                        <span className="flex items-center gap-1"><Users size={10} /> {event.rsvpCount || 0} participants</span>
                    </div>
                </div>
                {event.videoLink && (
                    <a href={event.videoLink} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
                        <Play size={14} />
                    </a>
                )}
            </div>
        </div>
    );
}

export default function Events() {
    const [events, setEvents] = useState(() => getPosts().filter(p => p.type === 'event'));
    const [showCreate, setShowCreate] = useState(false);
    const [view, setView] = useState('feed');

    const upcoming = events.filter(e => !e.eventDate || new Date(e.eventDate) > Date.now());
    const past = events.filter(e => e.eventDate && new Date(e.eventDate) <= Date.now());

    function handleCreated(post) {
        if (post.type === 'event') setEvents(prev => [post, ...prev]);
    }

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <Calendar size={18} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">TakwineLive</h1>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white animate-pulse" style={{ background: '#ef4444' }}>
                                🔴 LIVE
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">Sessions live, ateliers, conférences — participez et apprenez !</p>
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <Plus size={15} /> Créer un événement
                    </button>
                </div>

                {/* Upcoming mini calendar */}
                {upcoming.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">À venir</p>
                        <div className="space-y-2">
                            {upcoming.slice(0, 3).map(ev => <EventCalendarCard key={ev.id} event={ev} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* View toggle */}
            <div className="flex gap-1 glass rounded-xl p-1 border border-white/5">
                {[['feed', '📋 Fil d\'actualité'], ['past', `📼 Archives (${past.length})`]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setView(val)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${view === val ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                        style={view === val ? { background: 'linear-gradient(135deg, #10b98140, #05996940)' } : {}}>
                        {lbl}
                    </button>
                ))}
            </div>

            {/* Events list */}
            <div className="space-y-4">
                {view === 'feed' ? (
                    upcoming.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                            <p>Aucun événement à venir</p>
                            <button onClick={() => setShowCreate(true)}
                                className="mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <Plus size={14} /> Créer le premier événement
                            </button>
                        </div>
                    ) : (
                        upcoming.map(post => <PostCard key={post.id} post={post} />)
                    )
                ) : (
                    past.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <Play size={40} className="mx-auto mb-3 opacity-30" />
                            <p>Aucun événement archivé</p>
                        </div>
                    ) : (
                        past.map(post => <PostCard key={post.id} post={post} />)
                    )
                )}
            </div>

            {showCreate && (
                <CreatePost onPostCreated={handleCreated} onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
}
