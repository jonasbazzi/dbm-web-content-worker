import { validateToken } from './tokenValidation.js';
import { fetchReviews } from './reviewsService.js';
import { isOriginAllowed, getCorsHeaders, maybeHandleCorsPreflight } from "./cors.js"

export const handler = async (event) => {
  const preflightResponse = maybeHandleCorsPreflight(event);
  if (preflightResponse) return preflightResponse;

  const origin = event.headers.origin || event.headers.Origin || '';
  if (!isOriginAllowed(origin)) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Forbidden origin" })
    };
  }

  try {
    validateToken(event.headers);

    const reviews = await fetchReviews();
    const headers = {
      ...getCorsHeaders(origin),
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=43200"
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        reviews: reviews.slice(0, 10),
      }),
      headers: headers
    };
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return { statusCode: err.statusCode || 500 };
  }
};
