import fetch from 'node-fetch';
import './config.js';

export async function getProductsAuthToken(env) {
  try {
    const url = `${env.DBM_BASE_URL}${env.DBM_AUTH_PATH}`;
    const credentials = {
      username: env.DBM_USERNAME,
      password: env.DBM_PASSWORD,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Authentication API error: ${response.status}, ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.data.token;
  } catch (err) {
    console.error('Error fetching auth token:', err);
    return null;
  }
}
