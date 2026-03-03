// src/utils/storage.js - LocalStorage CRUD helpers for Takwine

import { SEED_USERS, SEED_POSTS, SEED_COMMENTS } from './seedData';

const KEYS = {
    USERS: 'takwine_users',
    POSTS: 'takwine_posts',
    COMMENTS: 'takwine_comments',
    CLUBS: 'takwine_clubs',      // { userId: [clubId, ...] }
    INITIALIZED: 'takwine_initialized',
};

// ─── Initialization ──────────────────────────────────────────────
export function initStorage() {
    if (localStorage.getItem(KEYS.INITIALIZED)) return;
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(KEYS.POSTS, JSON.stringify(SEED_POSTS));
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
    localStorage.setItem(KEYS.INITIALIZED, '1');
}

// ─── Users ───────────────────────────────────────────────────────
export function getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

export function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
}

export function getUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function saveUser(user) {
    const users = getUsers();
    const existing = users.findIndex(u => u.id === user.id);
    if (existing >= 0) {
        users[existing] = user;
    } else {
        users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return user;
}

export function updateUser(id, updates) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx < 0) return null;
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return users[idx];
}

// ─── Posts ────────────────────────────────────────────────────────
export function getPosts() {
    return JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
}

export function getPostById(id) {
    return getPosts().find(p => p.id === id) || null;
}

export function savePost(post) {
    const posts = getPosts();
    posts.unshift(post); // newest first
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    return post;
}

export function updatePost(id, updates) {
    const posts = getPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx < 0) return null;
    posts[idx] = { ...posts[idx], ...updates };
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    return posts[idx];
}

export function deletePost(id) {
    const posts = getPosts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

export function toggleLikePost(postId, userId) {
    const posts = getPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx < 0) return null;
    const likedBy = posts[idx].likedBy || [];
    if (likedBy.includes(userId)) {
        posts[idx].likedBy = likedBy.filter(id => id !== userId);
        posts[idx].likes = Math.max(0, (posts[idx].likes || 0) - 1);
    } else {
        posts[idx].likedBy = [...likedBy, userId];
        posts[idx].likes = (posts[idx].likes || 0) + 1;
    }
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    return posts[idx];
}

export function toggleRsvpPost(postId, userId) {
    const posts = getPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx < 0) return null;
    const rsvpBy = posts[idx].rsvpBy || [];
    if (rsvpBy.includes(userId)) {
        posts[idx].rsvpBy = rsvpBy.filter(id => id !== userId);
        posts[idx].rsvpCount = Math.max(0, (posts[idx].rsvpCount || 0) - 1);
    } else {
        posts[idx].rsvpBy = [...rsvpBy, userId];
        posts[idx].rsvpCount = (posts[idx].rsvpCount || 0) + 1;
    }
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    return posts[idx];
}

// ─── Comments ─────────────────────────────────────────────────────
export function getAllComments() {
    return JSON.parse(localStorage.getItem(KEYS.COMMENTS) || '[]');
}

export function getCommentsByPost(postId) {
    return getAllComments().filter(c => c.postId === postId && !c.parentId);
}

export function getReplies(commentId) {
    return getAllComments().filter(c => c.parentId === commentId);
}

export function addComment(comment) {
    const comments = getAllComments();
    comments.push(comment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    return comment;
}

export function toggleLikeComment(commentId, userId) {
    const comments = getAllComments();
    const idx = comments.findIndex(c => c.id === commentId);
    if (idx < 0) return null;
    const likedBy = comments[idx].likedBy || [];
    if (likedBy.includes(userId)) {
        comments[idx].likedBy = likedBy.filter(id => id !== userId);
        comments[idx].likes = Math.max(0, (comments[idx].likes || 0) - 1);
    } else {
        comments[idx].likedBy = [...likedBy, userId];
        comments[idx].likes = (comments[idx].likes || 0) + 1;
    }
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    return comments[idx];
}

// ─── ID generator ─────────────────────────────────────────────────
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Club memberships ─────────────────────────────────────────────
// Stored as { [userId]: [clubId1, clubId2, ...] }
function getAllClubMemberships() {
    return JSON.parse(localStorage.getItem(KEYS.CLUBS) || '{}');
}

export function getUserClubs(userId) {
    return getAllClubMemberships()[userId] || [];
}

export function isUserInClub(userId, clubId) {
    return getUserClubs(userId).includes(clubId);
}

export function joinClub(userId, clubId) {
    const all = getAllClubMemberships();
    const current = all[userId] || [];
    if (!current.includes(clubId)) {
        all[userId] = [...current, clubId];
        localStorage.setItem(KEYS.CLUBS, JSON.stringify(all));
    }
}

export function leaveClub(userId, clubId) {
    const all = getAllClubMemberships();
    all[userId] = (all[userId] || []).filter(id => id !== clubId);
    localStorage.setItem(KEYS.CLUBS, JSON.stringify(all));
}
