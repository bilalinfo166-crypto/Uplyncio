// TOTP 2FA API - generate secret & QR, verify code
import crypto from 'crypto';

function base32Encode(buffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  let bits = 0, value = 0;
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) result += alphabet[(value << (5 - bits)) & 31];
  return result;
}

function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  str = str.toUpperCase().replace(/=+$/, '');
  let bits = 0, value = 0;
  const output = [];
  for (let i = 0; i < str.length; i++) {
    const idx = alphabet.indexOf(str[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) { output.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(output);
}

function generateTOTP(secret, timeStep = 30, digits = 6) {
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / timeStep);
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % Math.pow(10, digits);
  return code.toString().padStart(digits, '0');
}

function verifyTOTP(secret, token, window = 1) {
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    const c = counter + i;
    const buf = Buffer.alloc(8);
    buf.writeBigInt64BE(BigInt(c));
    const hmac = crypto.createHmac('sha1', key).update(buf).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
    if (code.toString().padStart(6, '0') === token) return true;
  }
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, secret, token } = req.body;

  if (action === 'generate') {
    // Generate new TOTP secret
    const rawSecret = crypto.randomBytes(20);
    const b32Secret = base32Encode(rawSecret);
    const issuer = 'Uplyncio';
    const label = encodeURIComponent(`${issuer}:${email}`);
    const otpauthUrl = `otpauth://totp/${label}?secret=${b32Secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
    // QR via Google Charts API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
    return res.status(200).json({ success: true, secret: b32Secret, qrUrl, otpauthUrl });
  }

  if (action === 'verify') {
    if (!secret || !token) return res.status(400).json({ error: 'Missing secret or token' });
    const valid = verifyTOTP(secret, token.toString().replace(/\s/g, ''));
    return res.status(200).json({ success: true, valid });
  }

  return res.status(400).json({ error: 'Invalid action' });
}
