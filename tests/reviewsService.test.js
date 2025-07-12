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
      console.log("debug:: ", url, "ops::", options)

      if (url.startsWith('https://reviews-test.com/reviews/auth')) {
        const body = { data: { widgets: { "reviews-user": { data: { public_widget_token: mockToken } } } } }
        return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
      }
      if (url.startsWith('https://reviews-reviews-test.com/reviews') && options.headers['x-widget-token'] === mockToken) {
        return Promise.resolve(new Response(JSON.stringify(mockReviews), { status: 200 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const reviews = await fetchReviews();
    expect(reviews).toEqual(mockReviews.result.data);
  });

  it('should return an empty array if auth fails', async () => {
    fetch.mockImplementation((url) => {
      if (url.startsWith('https://reviews-test.com/reviews/auth')) {
        return Promise.resolve(new Response('Unauthorized', { status: 401 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    });

    const reviews = await fetchReviews();
    expect(reviews).toEqual([]);
  });

  it('should return an empty array if review fetch fails', async () => {
    const mockToken = 'test-token';
    fetch.mockImplementation((url, _) => {
      if (url.startsWith('https://reviews-test.com/reviews/auth')) {
        const body = { data: { widgets: { "reviews-user": { data: { public_widget_token: mockToken } } } } }
        return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
      }

      if (url.startsWith('https://reviews-reviews-test.com/reviews')) {
        return Promise.resolve(new Response('Internal Server Error', { status: 500 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const reviews = await fetchReviews();
    expect(reviews).toEqual([]);
  });

  it('should return an empty array if there is a network error during auth', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    const reviews = await fetchReviews();
    expect(reviews).toEqual([]);
  });
});
