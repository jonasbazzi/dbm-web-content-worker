import fetch from 'node-fetch';
import './config.js';
import { getProductsAuthToken } from './productsAuth.js';

export async function fetchProducts(env) {
  const token = await getProductsAuthToken(env);
  if (!token) {
    return [];
  }

  const url = `${env.DBM_BASE_URL}${env.DBM_PRODUCTS_PATH}`;
  try {
    const response = await fetch(url, {
      headers: {
        Token: token,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Product API error status=${response.status}, error=${errorText}`);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching from products API: ", err);
    return [];
  }
}
