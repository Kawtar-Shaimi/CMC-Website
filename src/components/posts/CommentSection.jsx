// src/components/posts/CommentSection.jsx - Threaded comments

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Reply, Send, Award } from 'lucide-react';
import { getCommentsByPost, getReplies, addComment, toggleLikeComment, getUserById, getAllComments, generateId } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'maintenant';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}j`;
}

function CommentAvatar({ userId }) {
    const user = getUserById(userId);
    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
    return (
        <Link to={`/profile/${userId}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 hover:scale-110 transition-transform"
                style={{ background: user?.avatarColor || '#6366f1' }}>
                {initials}
            </div>
        </Link>
    );
}

function CommentItem({ comment, isChallenge, onReplyAdded }) {
    const { currentUser } = useAuth();
    const [liked, setLiked] = useState(comment.likedBy?.includes(currentUser?.id));
    const [likes, setLikes] = useState(comment.likes || 0);
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState(() => getReplies(comment.id));
    const author = getUserById(comment.authorId);

    function handleLike() {
        if (!currentUser) return;
        const updated = toggleLikeComment(comment.id, currentUser.id);
        if (updated) {
            setLiked(v => !v);
            setLikes(updated.likes);
        }
    }

    function submitReply() {
        if (!replyText.trim() || !currentUser) return;
        const reply = {
            id: generateId(),
            postId: comment.postId,
            parentId: comment.id,
            authorId: currentUser.id,
            content: replyText.trim(),
            likes: 0,
            likedBy: [],
            createdAt: new Date().toISOString(),
        };
        addComment(reply);
        setReplies(r => [...r, reply]);
        setReplyText('');
        setShowReply(false);
        onReplyAdded && onReplyAdded();
        toast.success('Réponse ajoutée ! 💬', { duration: 1500 });
    }

    return (
        <div className="flex gap-2.5 group">
            <CommentAvatar userId={comment.authorId} />
            <div className="flex-1 min-w-0">
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                        <Link to={`/profile/${comment.authorId}`} className="text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                            {author?.name || 'Inconnu'}
                        </Link>
                        <div className="flex items-center gap-1.5">
                            {isChallenge && likes > 3 && (
                                <span className="text-xs text-amber-400 flex items-center gap-0.5"><Award size={10} /> Top</span>
                            )}
                            <span className="text-xs text-slate-500">{timeAgo(comment.createdAt)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{comment.content}</p>
                </div>

                <div className="flex items-center gap-3 mt-1 ml-1">
                    <button onClick={handleLike}
                        className={`flex items-center gap-1 text-xs transition-all hover:scale-110 active:scale-95 ${liked ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Heart size={11} className={liked ? 'fill-current' : ''} /> {likes > 0 && likes}
                    </button>
                    <button onClick={() => setShowReply(v => !v)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
                        <Reply size={11} /> Répondre
                    </button>
                </div>

                {/* Reply input */}
                {showReply && (
                    <div className="mt-2 flex gap-2">
                        <input value={replyText} onChange={e => setReplyText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(); } }}
                            placeholder="Répondre..." autoFocus
                            className="input-focus flex-1 px-3 py-1.5 rounded-xl text-xs text-slate-200 placeholder-slate-500"
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <button onClick={submitReply}
                            className="px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-1 active:scale-95 transition-all"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                            <Send size={11} />
                        </button>
                    </div>
                )}

                {/* Nested replies */}
                {replies.length > 0 && (
                    <div className="mt-2 ml-2 space-y-2 border-l-2 border-white/5 pl-3">
                        {replies.map(reply => (
                            <ReplyItem key={reply.id} reply={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReplyItem({ reply }) {
    const { currentUser } = useAuth();
    const [liked, setLiked] = useState(reply.likedBy?.includes(currentUser?.id));
    const [likes, setLikes] = useState(reply.likes || 0);
    const author = getUserById(reply.authorId);

    function handleLike() {
        if (!currentUser) return;
        const updated = toggleLikeComment(reply.id, currentUser.id);
        if (updated) { setLiked(v => !v); setLikes(updated.likes); }
    }

    return (
        <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: author?.avatarColor || '#6366f1' }}>
                {author?.name?.[0] || '?'}
            </div>
            <div className="flex-1">
                <div className="rounded-xl rounded-tl-sm px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs font-semibold text-slate-300 mb-0.5">{author?.name}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{reply.content}</p>
                </div>
                <button onClick={handleLike}
                    className={`flex items-center gap-0.5 text-xs mt-1 ml-1 transition-all ${liked ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Heart size={10} className={liked ? 'fill-current' : ''} /> {likes > 0 && likes}
                </button>
            </div>
        </div>
    );
}

export default function CommentSection({ postId, postType, onCountChange }) {
    const { currentUser } = useAuth();
    const [comments, setComments] = useState(() => getCommentsByPost(postId));
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        onCountChange && onCountChange(getAllComments().filter(c => c.postId === postId).length);
    }, [comments]);

    function submitComment() {
        if (!newComment.trim() || !currentUser) return;
        setSubmitting(true);
        const comment = {
            id: generateId(),
            postId,
            parentId: null,
            authorId: currentUser.id,
            content: newComment.trim(),
            likes: 0,
            likedBy: [],
            createdAt: new Date().toISOString(),
        };
        addComment(comment);
        setComments(prev => [...prev, comment]);
        setNewComment('');
        toast.success('Commentaire ajouté ! 💬', { duration: 1500 });
        setTimeout(() => setSubmitting(false), 300);
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Add comment */}
            <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 avatar-ring"
                    style={{ background: currentUser?.avatarColor || '#6366f1' }}>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                </div>
                <div className="flex-1 flex gap-2">
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                        placeholder={postType === 'challenge' ? 'Postez votre solution...' : 'Ajoutez un commentaire...'}
                        rows={1} className="input-focus flex-1 px-4 py-2.5 rounded-2xl text-sm text-slate-200 placeholder-slate-500 resize-none"
                        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '42px', maxHeight: '120px' }} />
                    <button onClick={submitComment} disabled={!newComment.trim() || submitting}
                        className="px-4 py-2 rounded-2xl text-white text-sm flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                        <Send size={14} />
                    </button>
                </div>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                        {postType === 'challenge' ? 'Soyez le premier à proposer une solution !' : 'Aucun commentaire encore. Soyez le premier !'}
                    </p>
                ) : (
                    comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} isChallenge={postType === 'challenge'}
                            onReplyAdded={() => onCountChange && onCountChange(getAllComments().filter(c => c.postId === postId).length)} />
                    ))
                )}
            </div>
        </div>
    );
}
