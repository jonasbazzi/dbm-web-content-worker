import { renewContent } from "@dbm/core/src/contentRenewal.js";

export default {

  async scheduled(event, env, ctx) {
    console.log("Running scheduled job...");
    try {
      ctx.waitUntil(renewContent(env));
      console.log("Scheduled job finished...");
    } catch (err) {
      console.error('Error renewing content:', err);
    }
  },

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
