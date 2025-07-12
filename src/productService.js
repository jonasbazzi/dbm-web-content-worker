import fetch from 'node-fetch';
import './config.js';
import { getProductsAuthToken } from './dbmAuth.js';

export async function fetchProducts() {
  const token = await getProductsAuthToken();
  if (!token) {
    return [];
  }

  const url = `${process.env.DBM_BASE_URL}${process.env.DBM_PRODUCTS_PATH}`;
  try {
    const response = await fetch(url, {
      headers: {
        Token: token,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Product API error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching from products API:', err);
    return [];
  }
}
