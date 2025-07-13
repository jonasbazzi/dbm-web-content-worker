import { fetchReviews } from '../src/reviewsService.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetch, { Response } from 'node-fetch';

vi.mock('node-fetch', () => ({
  default: vi.fn(),
  Response: vi.fn((body, init) => ({
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
  })),
}));

describe('fetchReviews', () => {
  const env = {
    REVIEWS_USERNAME: 'reviews-user',
    REVIEWS_AUTH_URL: 'https://reviews-test.com/reviews/auth',
    REVIEWS_REVIEWS_URL: 'https://reviews-reviews-test.com/reviews',
    GOOGLE_MAPS_STORE_ID: 'test-store-id',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return reviews if auth and review fetch are successful', async () => {
    const mockToken = 'test-token';
    const mockReviews =
    {
      "status": "success",
      "result": {
        "data": [
          {
            "reviewer_name": "Don Test"
          }
        ]
      }
    }

    fetch.mockImplementation((url, options) => {
      if (url.startsWith(env.REVIEWS_AUTH_URL)) {
        const body = { data: { widgets: { [env.REVIEWS_USERNAME]: { data: { public_widget_token: mockToken } } } } }
        return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
      }
      if (url.startsWith(env.REVIEWS_REVIEWS_URL) && options.headers['x-widget-token'] === mockToken) {
        return Promise.resolve(new Response(JSON.stringify(mockReviews), { status: 200 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const reviews = await fetchReviews(env);
    expect(reviews).toEqual(mockReviews.result.data);
  });

  it('should return an empty array if auth fails', async () => {
    fetch.mockImplementation((url) => {
      if (url.startsWith(env.REVIEWS_AUTH_URL)) {
        return Promise.resolve(new Response('Unauthorized', { status: 401 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    });

    const reviews = await fetchReviews(env);
    expect(reviews).toEqual([]);
  });

  it('should return an empty array if review fetch fails', async () => {
    const mockToken = 'test-token';
    fetch.mockImplementation((url, _) => {
      if (url.startsWith(env.REVIEWS_AUTH_URL)) {
        const body = { data: { widgets: { [env.REVIEWS_USERNAME]: { data: { public_widget_token: mockToken } } } } }
        return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
      }

      if (url.startsWith(env.REVIEWS_REVIEWS_URL)) {
        return Promise.resolve(new Response('Internal Server Error', { status: 500 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const reviews = await fetchReviews(env);
    expect(reviews).toEqual([]);
  });

  it('should return an empty array if there is a network error during auth', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    const reviews = await fetchReviews(env);
    expect(reviews).toEqual([]);
  });
});
