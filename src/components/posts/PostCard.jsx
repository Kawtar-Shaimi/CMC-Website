// src/components/posts/PostCard.jsx - Main post card component

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ExternalLink, Clock, Zap, Calendar, FileText, Play, ChevronDown, ChevronUp, Award, Users } from 'lucide-react';
import { toggleLikePost, toggleRsvpPost, getUserById, generateId } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

// ─── Avatar ──────────────────────────────────────────────────────
function Avatar({ userId, size = 'md' }) {
    const user = getUserById(userId);
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
    return (
        <Link to={`/profile/${userId}`}>
            <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white avatar-ring flex-shrink-0 hover:scale-105 transition-transform`}
                style={{ background: user?.avatarColor || '#6366f1' }}>
                {initials}
            </div>
        </Link>
    );
}

// ─── Type badge ──────────────────────────────────────────────────
function TypeBadge({ type }) {
    if (type === 'challenge') return (
        <span className="badge-challenge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white">
            <Zap size={10} /> Défi
        </span>
    );
    if (type === 'event') return (
        <span className="badge-event inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white">
            <Calendar size={10} /> Événement
        </span>
    );
    return (
        <span className="badge-resource inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white">
            <FileText size={10} /> Ressource
        </span>
    );
}

// ─── Time format ─────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
    return new Date(dateStr).toLocaleDateString('fr-DZ');
}

// ─── Media preview ───────────────────────────────────────────────
function MediaPreview({ post }) {
    if (post.imageUrl) {
        return <img src={post.imageUrl} alt="Post" className="w-full rounded-xl max-h-80 object-cover mt-3" />;
    }
    if (post.videoLink && post.type === 'event') {
        return (
            <a href={post.videoLink} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Play size={14} className="text-white ml-0.5" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-300">Rejoindre la session</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{post.videoLink}</p>
                </div>
                <ExternalLink size={14} className="text-slate-400 ml-auto flex-shrink-0" />
            </a>
        );
    }
    if (post.link) {
        return (
            <a href={post.link} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-violet-600/30 flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={14} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-300">Lien externe</p>
                    <p className="text-xs text-blue-400 truncate">{post.link}</p>
                </div>
            </a>
        );
    }
    return null;
}

// ─── Main PostCard ────────────────────────────────────────────────
export default function PostCard({ post: initialPost, onUpdate }) {
    const { currentUser } = useAuth();
    const [post, setPost] = useState(initialPost);
    const [showComments, setShowComments] = useState(false);
    const [likeAnim, setLikeAnim] = useState(false);
    const [rsvpLoading, setRsvpLoading] = useState(false);

    const author = getUserById(post.authorId);
    const isLiked = post.likedBy?.includes(currentUser?.id);
    const isRsvp = post.rsvpBy?.includes(currentUser?.id);

    function handleLike() {
        if (!currentUser) return toast.error('Connectez-vous pour liker');
        const updated = toggleLikePost(post.id, currentUser.id);
        if (updated) {
            setPost(updated);
            onUpdate && onUpdate(updated);
            setLikeAnim(true);
            setTimeout(() => setLikeAnim(false), 300);
            if (!isLiked) toast.success('Post liké ! ❤️', { duration: 1500 });
        }
    }

    function handleRsvp() {
        if (!currentUser) return toast.error('Connectez-vous pour participer');
        setRsvpLoading(true);
        const updated = toggleRsvpPost(post.id, currentUser.id);
        if (updated) {
            setPost(updated);
            onUpdate && onUpdate(updated);
            toast.success(isRsvp ? 'Participation annulée' : 'Vous participez ! 🎉');
        }
        setRsvpLoading(false);
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.origin + '/?post=' + post.id)
            .then(() => toast.success('Lien copié 📋'))
            .catch(() => toast.error('Impossible de copier'));
    }

    // Deadline countdown for challenges
    function getDeadline() {
        if (!post.deadline) return null;
        const diff = new Date(post.deadline) - Date.now();
        if (diff <= 0) return 'Terminé';
        const h = Math.floor(diff / 3600000);
        if (h < 24) return `${h}h restantes`;
        return `${Math.floor(h / 24)}j restants`;
    }

    return (
        <article className="post-card glass rounded-2xl p-5 border border-white/5 animate-slide-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar userId={post.authorId} />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link to={`/profile/${post.authorId}`}
                                className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                                {author?.name || 'Utilisateur inconnu'}
                            </Link>
                            {/* Filière badge */}
                            {post.filiere && (
                                <span className="text-xs px-2 py-0.5 rounded-full text-slate-400"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {post.filiere}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{author?.annee}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={10} /> {timeAgo(post.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <TypeBadge type={post.type} />
            </div>

            {/* Title */}
            {post.title && (
                <h3 className="mt-3 font-semibold text-slate-100 text-base leading-snug">{post.title}</h3>
            )}

            {/* Content */}
            <div className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content.length > 300
                    ? <ExpandableContent content={post.content} />
                    : post.content}
            </div>

            {/* Media */}
            <MediaPreview post={post} />

            {/* Challenge deadline */}
            {post.type === 'challenge' && post.deadline && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <Clock size={12} />
                    <span>{getDeadline()}</span>
                </div>
            )}

            {/* Event RSVP */}
            {post.type === 'event' && (
                <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 text-sm text-green-400">
                        <Users size={15} />
                        <span className="font-medium">{post.rsvpCount || 0} participants</span>
                        {post.eventDate && (
                            <>
                                <span className="text-green-600">·</span>
                                <span className="text-xs text-green-500">{new Date(post.eventDate).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                        )}
                    </div>
                    <button onClick={handleRsvp} disabled={rsvpLoading}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${isRsvp ? 'bg-green-500/30 text-green-300 border border-green-500/40' : 'text-white hover:opacity-90'}`}
                        style={!isRsvp ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : {}}>
                        {isRsvp ? '✓ Je participe' : 'Je participe'}
                    </button>
                </div>
            )}

            {/* Awards row for challenges */}
            {post.type === 'challenge' && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                    <Award size={12} /> <span>Solutions votées · Points récompensés</span>
                </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-1">
                {/* Like */}
                <button onClick={handleLike}
                    className={`like-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5 active:scale-95 ${isLiked ? 'liked' : 'text-slate-400 hover:text-slate-200'} ${likeAnim ? 'animate' : ''}`}>
                    <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                    <span>{post.likes || 0}</span>
                </button>

                {/* Comment */}
                <button onClick={() => setShowComments(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all active:scale-95">
                    <MessageCircle size={16} />
                    <span>{post.commentsCount || 0}</span>
                    {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {/* Share */}
                <button onClick={handleShare}
                    className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all active:scale-95">
                    <Share2 size={15} />
                    <span className="hidden sm:inline">Partager</span>
                </button>
            </div>

            {/* Comment section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <CommentSection postId={post.id} postType={post.type}
                        onCountChange={count => setPost(p => ({ ...p, commentsCount: count }))} />
                </div>
            )}
        </article>
    );
}

// ─── Expandable content ───────────────────────────────────────────
function ExpandableContent({ content }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            {expanded ? content : content.slice(0, 300) + '...'}
            <button onClick={() => setExpanded(v => !v)}
                className="text-blue-400 hover:text-blue-300 text-sm ml-1 transition-colors">
                {expanded ? ' Voir moins' : ' Voir plus'}
            </button>
        </>
    );
}
