// src/utils/jwt.js - JWT utility using HMAC-SHA256 manually (no external lib needed)

const SECRET_KEY = 'takwine-super-secret-key-2024-jwt';

// Base64url encode/decode
function base64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return null;
  }
}

// HMAC-SHA256 using SubtleCrypto (async)
async function hmacSHA256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const byteArray = Array.from(new Uint8Array(signature));
  return btoa(String.fromCharCode(...byteArray))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function signToken(payload) {
  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64urlEncode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  }));
  const sig = await hmacSHA256(`${header}.${body}`, SECRET_KEY);
  return `${header}.${body}.${sig}`;
}

export function decodeToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64urlDecode(parts[1]));
    if (!payload) return null;
    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenValid(token) {
  return decodeToken(token) !== null;
}
