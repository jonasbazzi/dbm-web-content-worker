import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index.js';
import { renewContent } from '@dbm/core/src/contentRenewal.js';

vi.mock('@dbm/core/src/contentRenewal.js', () => ({
  renewContent: vi.fn(),
}));

describe('Content Renewal Worker', () => {
  let ctx;
  const env = {
    SOME_ENV_VAR: 'some-value',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    ctx = {
      waitUntil: vi.fn((promise) => promise),
    };
  });

  it('returns 204 when content renewal is successful', async () => {
    renewContent.mockResolvedValue(undefined);

    const result = await worker.fetch({}, env, ctx);

    expect(result.status).toBe(204);
    expect(ctx.waitUntil).toHaveBeenCalledOnce();
    expect(renewContent).toHaveBeenCalledWith(env);
  });

  it('returns 500 on unexpected error', async () => {
    const testError = new Error('Something broke');
    renewContent.mockImplementation(() => {
      throw testError;
    });

    const result = await worker.fetch({}, env, ctx);

    expect(result.status).toBe(500);
  });

  it('returns specific status code on error with statusCode', async () => {
    const testError = new Error('Unauthorized');
    testError.statusCode = 401;
    renewContent.mockImplementation(() => {
      throw testError;
    });

    const result = await worker.fetch({}, env, ctx);

    expect(result.status).toBe(401);
  });
});
