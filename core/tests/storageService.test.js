import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchJson, store } from '../src/storageService.js';

describe('storageService', () => {
  let mockEnv;

  beforeEach(() => {
    mockEnv = {
      WEB_BUCKET: {
        get: vi.fn(),
        put: vi.fn(),
      },
      CONTENT_FILE_NAME: 'test.json',
    };
    vi.clearAllMocks();
  });

  describe('fetchJson', () => {
    it('should fetch and parse JSON from R2 bucket', async () => {
      const mockContent = '{"key":"value"}';
      mockEnv.WEB_BUCKET.get.mockResolvedValue({
        text: () => Promise.resolve(mockContent),
      });

      const result = await fetchJson('test.json', mockEnv);
      expect(mockEnv.WEB_BUCKET.get).toHaveBeenCalledWith('test.json');
      expect(result).toBe(mockContent);
    });

    it('should throw an error if file not found', async () => {
      mockEnv.WEB_BUCKET.get.mockResolvedValue(null);

      await expect(fetchJson('nonexistent.json', mockEnv)).rejects.toThrow('File nonexistent.json not found.');
    });

    it('should handle errors during fetch', async () => {
      mockEnv.WEB_BUCKET.get.mockRejectedValue(new Error('R2 get error'));

      await expect(fetchJson('test.json', mockEnv)).rejects.toThrow('R2 get error');
    });
  });

  describe('store', () => {
    it('should store content to R2 bucket', async () => {
      const fileName = 'new-file.json';
      const fileContent = '{"newKey":"newValue"}';

      await store(fileName, fileContent, mockEnv);

      expect(mockEnv.WEB_BUCKET.put).toHaveBeenCalledWith(fileName, fileContent);
    });

    it('should handle errors during store', async () => {
      const fileName = 'error-file.json';
      const fileContent = '{"errorKey":"errorValue"}';
      mockEnv.WEB_BUCKET.put.mockRejectedValue(new Error('R2 put error'));

      await expect(store(fileName, fileContent, mockEnv)).rejects.toThrow('R2 put error');
    });
  });
});