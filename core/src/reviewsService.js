import fetch from 'node-fetch';
import './config.js';
import { getReviewsToken } from './reviewsAuth.js';

export async function fetchReviews(env) {
  const token = await getReviewsToken(env);
  if (!token) {
    return [];
  }

  const storeId = env.GOOGLE_MAPS_STORE_ID
  const url = `${env.REVIEWS_REVIEWS_URL}?uris%5B%5D=${storeId}&filter_content=text_required&min_rating=4&page_length=100&order=date`

  try {
    const response = await fetch(url, {
      headers: {
        'x-widget-token': token,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Reviews API error: ${response.status}, ${errorText}`);
      console.error(`Reviews API request: ${url}`)
      return [];
    }

    const data = await response.json();
    return data.result.data || [];
  } catch (err) {
    console.error('Error fetching from reviews API:', err);
    return [];
  }
}
