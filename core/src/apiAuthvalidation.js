import { getBooleanFromEnv } from './config.js';

export function validateAuth(headers, env) {
  const apiKeyEnabled = getBooleanFromEnv(`${env.API_KEY_ENABLED}`, true);
  if (!apiKeyEnabled) return;

  const apiKey = headers['Authorization'];
  const validApiKey = env.API_KEY;
  if (!apiKey || apiKey !== validApiKey) {
    throw { statusCode: 401 };
  }
}
