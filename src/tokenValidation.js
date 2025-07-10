import dotenv from 'dotenv';

if (process.env.ENV !== 'production') {
  dotenv.config();
}

export function validateToken(headers) {
  const apiKey = headers['Authorization'];
  const validApiKey = process.env.API_KEY;
  if (!apiKey || apiKey !== validApiKey) {
    throw { statusCode: 401 };
  }
}
