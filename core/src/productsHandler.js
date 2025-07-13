import { validateAuth } from './apiAuthValidation.js';
import { fetchProducts } from './productService.js';
import { initCors } from "./cors.js"

export const handler = async (event, env) => {
  const cors = initCors(env);
  const preflightResponse = cors.maybeHandleCorsPreflight(event);
  if (preflightResponse) return preflightResponse;

  const forbiddenOriginResponse = cors.maybeForbiddenOrigin(event);
  if (forbiddenOriginResponse) return forbiddenOriginResponse;

  try {
    validateAuth(event.headers, env);

    const products = await fetchProducts(env);
    const headers = {
      ...cors.getCorsHeaders(event),
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=43200"
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        products: products,
      }),
      headers: headers,
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    return { statusCode: err.statusCode || 500 };
  }
};
