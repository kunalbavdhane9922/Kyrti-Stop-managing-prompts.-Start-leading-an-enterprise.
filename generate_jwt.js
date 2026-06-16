const jwt = require('jsonwebtoken');

const secret = 'z+y9w1XfR/qj5H+c8V2P4mK7s9tL6bN3yQ1w8Z4c5vA='; // From application.yml
const payload = {
  sub: '00000000-0000-0000-0000-000000000001', // User ID
  purpose: 'access',
  email: 'test@example.com', jti: require('crypto').randomUUID()
};

const token = jwt.sign(payload, secret);
console.log(token);
