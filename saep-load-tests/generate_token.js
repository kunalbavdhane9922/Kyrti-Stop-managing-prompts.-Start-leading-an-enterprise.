const crypto = require('crypto');

function base64urlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const header = {
    alg: 'HS256',
    typ: 'JWT'
};

const payload = {
    sub: 'perf-test-user@saep.com',
    tenantId: 't-load-test',
    roles: ['Owner'],
    type: 'user', // Gateway might need this if you changed it, but standard is fine
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours
};

const secret = 'z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA='; // JWT_SECRET from .env.example

const encodedHeader = base64urlEncode(JSON.stringify(header));
const encodedPayload = base64urlEncode(JSON.stringify(payload));
const signatureInput = `${encodedHeader}.${encodedPayload}`;

const signature = crypto.createHmac('sha256', Buffer.from(secret))
    .update(signatureInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const token = `${signatureInput}.${signature}`;
console.log(token);
