// auth_service/generate_token.js
const jwt = require('jsonwebtoken');

const secretKey = 'gedeon';  // Replace with your secret key

const payload = {
  id: '6765c77fa748aab3850c25c8',
  email: 'test@example.com',
};

const options = {
  expiresIn: '1h',  // Token expires in 1 hour
};

const token = jwt.sign(payload, secretKey, options);
console.log(token);