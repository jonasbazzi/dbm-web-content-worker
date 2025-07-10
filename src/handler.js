import { validateToken } from './tokenValidation.js';
import { fetchProducts } from './productService.js';

export const handler = async (event) => {
  try {
    validateToken(event.headers);

    const products = await fetchProducts();

    return {
      statusCode: 200,
      body: JSON.stringify({
        products: products,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: err.statusCode || 500 };
  }
};
