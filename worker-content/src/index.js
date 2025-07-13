import { renewContent } from "@dbm/core/src/contentRenewal.js";

export default {
  async fetch(request, env, ctx) {
    try {
      ctx.waitUntil(renewContent(env));
      return new Response(null, {
        status: 204,
      });
    } catch (err) {
      console.error('Error renewing content:', err);
      return new Response(err.message || 'Something went wrong', {
        status: err.statusCode || 500,
      });
    }
  }
};
