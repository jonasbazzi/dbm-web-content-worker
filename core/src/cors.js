import { getBooleanFromEnv } from './config.js';

export function initCors(env) {
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS?.split(',') ?? ['*'];
  const corsEnabled = getBooleanFromEnv(env.CORS_ENABLED, true);

  function isOriginAllowed(origin) {
    return origin && allowedOrigins.includes(origin);
  }

  function getOrigin(event) {
    return event.headers.origin || event.headers.Origin || '';
  }

  return {
    maybeForbiddenOrigin(event) {
      const origin = getOrigin(event);
      if (corsEnabled && !isOriginAllowed(origin)) {
        return {
          statusCode: 403,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Forbidden origin" })
        };
      }
      return null;
    },

    getCorsHeaders(event) {
      const origin = getOrigin(event);
      if (!corsEnabled || !isOriginAllowed(origin)) return {};

      return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Vary": "Origin"
      };
    },

    maybeHandleCorsPreflight(event) {
      const origin = getOrigin(event);
      if (corsEnabled && event.httpMethod === "OPTIONS" && isOriginAllowed(origin)) {
        return {
          statusCode: 200,
          headers: this.getCorsHeaders({ headers: { origin } }),
          body: ""
        };
      }
      return null;
    }
  };
}
