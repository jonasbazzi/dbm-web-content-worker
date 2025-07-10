import fetch from 'node-fetch';
import 'dotenv/config';

export async function getProductsAuthToken() {
  const url = `${process.env.DBM_BASE_URL}${process.env.DBM_AUTH_PATH}`;
  const credentials = {
    username: process.env.DBM_USERNAME,
    password: process.env.DBM_PASSWORD,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Authentication API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.data.token;
  } catch (err) {
    console.error('Error fetching auth token:', err);
    return null;
  }
}
