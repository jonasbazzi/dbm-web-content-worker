const allowedOrigins = new Set([
  "https://www.dbmmotos.com.ar",
  "https://dbmmotos.com.ar",
  "http://localhost:2704",
  "http://127.0.0.1:2704"
]);

export function isOriginAllowed(origin) {
  return origin && allowedOrigins.has(origin);
}

export function getCorsHeaders(origin) {
  if (!isOriginAllowed(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Vary": "Origin"
  };
}

export function maybeHandleCorsPreflight(event) {
  const origin = event.headers.origin || event.headers.Origin || '';
  if (event.httpMethod === "OPTIONS" && allowedOrigins.has(origin)) {
    return {
      statusCode: 200,
      headers: getCorsHeaders(origin),
      body: ""
    };
  }
  return null;
}

