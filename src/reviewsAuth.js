import fetch from 'node-fetch';
import './config.js';

export async function getReviewsToken() {
  const username = process.env.REVIEWS_USERNAME;
  const url = `${process.env.REVIEWS_AUTH_URL}?w=${username}&page=localhost:8080`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Reviews Authentication API error:',
        response.status, errorText
      );
      return null;
    }

    const username = process.env.REVIEWS_USERNAME;
    const data = await response.json();
    return data.data.widgets[username].data.public_widget_token;
  } catch (err) {
    console.error('Error fetching reviews auth token:', err);
    return null;
  }
}
