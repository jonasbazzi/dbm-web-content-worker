import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renewContent } from '../src/contentRenewal.js';
import { fetchProducts } from '../src/productService.js';
import { fetchReviews } from '../src/reviewsService.js';
import { store as storeFile, fetchJson } from '../src/storageService.js';

vi.mock('../src/productService.js', () => ({
  fetchProducts: vi.fn(),
}));

vi.mock('../src/reviewsService.js', () => ({
  fetchReviews: vi.fn(),
}));

vi.mock('../src/storageService.js', () => ({
  store: vi.fn(),
  fetchJson: vi.fn(),
}));

describe('Content Renewal', () => {
  const env = {
    CONTENT_FILE_NAME: 'test.json',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch products and reviews and store them', () => {
    const products = [{ id: 1, name: 'Product 1' }];
    const reviews = [{ id: 1, rating: 5 }];
    fetchProducts.mockReturnValue(products);
    fetchReviews.mockReturnValue(reviews);
    fetchJson.mockReturnValue(null);

    renewContent(env);

    expect(fetchProducts).toHaveBeenCalledWith(env);
    expect(fetchReviews).toHaveBeenCalledWith(env);
    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products, reviews }), env);
  });

  it('should use current products when fetchProducts returns null', () => {
    const currentProducts = [{ id: 2, name: 'Old Product' }];
    const reviews = [{ id: 1, rating: 5 }];
    fetchProducts.mockReturnValue(null);
    fetchReviews.mockReturnValue(reviews);
    fetchJson.mockReturnValue(JSON.stringify({ products: currentProducts, reviews: [] }));

    renewContent(env);

    expect(fetchProducts).toHaveBeenCalledWith(env);
    expect(fetchReviews).toHaveBeenCalledWith(env);
    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products: currentProducts, reviews }), env);
  });

  it('should use current reviews when fetchReviews returns null', () => {
    const products = [{ id: 1, name: 'Product 1' }];
    const currentReviews = [{ id: 2, rating: 4 }];
    fetchProducts.mockReturnValue(products);
    fetchReviews.mockReturnValue(null);
    fetchJson.mockReturnValue(JSON.stringify({ products: [], reviews: currentReviews }));

    renewContent(env);

    expect(fetchProducts).toHaveBeenCalledWith(env);
    expect(fetchReviews).toHaveBeenCalledWith(env);
    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products, reviews: currentReviews }), env);
  });

  it('should use current content when both fetchProducts and fetchReviews return null', () => {
    const currentProducts = [{ id: 2, name: 'Old Product' }];
    const currentReviews = [{ id: 2, rating: 4 }];
    fetchProducts.mockReturnValue(null);
    fetchReviews.mockReturnValue(null);
    fetchJson.mockReturnValue(JSON.stringify({ products: currentProducts, reviews: currentReviews }));

    renewContent(env);

    expect(fetchProducts).toHaveBeenCalledWith(env);
    expect(fetchReviews).toHaveBeenCalledWith(env);
    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products: currentProducts, reviews: currentReviews }), env);
  });

  it('should use default content when fetchJson returns null', () => {
    const products = [{ id: 1, name: 'Product 1' }];
    const reviews = [{ id: 1, rating: 5 }];
    fetchProducts.mockReturnValue(products);
    fetchReviews.mockReturnValue(reviews);
    fetchJson.mockReturnValue(null);

    renewContent(env);

    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products, reviews }), env);
  });

  it('should use default content when fetchJson throws an error', () => {
    const products = [{ id: 1, name: 'Product 1' }];
    const reviews = [{ id: 1, rating: 5 }];
    fetchProducts.mockReturnValue(products);
    fetchReviews.mockReturnValue(reviews);
    fetchJson.mockImplementation(() => {
      throw new Error('File not found');
    });

    renewContent(env);

    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products, reviews }), env);
  });

  it('should use default content when fetchJson returns invalid JSON', () => {
    const products = [{ id: 1, name: 'Product 1' }];
    const reviews = [{ id: 1, rating: 5 }];
    fetchProducts.mockReturnValue(products);
    fetchReviews.mockReturnValue(reviews);
    fetchJson.mockReturnValue('invalid json');

    renewContent(env);

    expect(storeFile).toHaveBeenCalledWith(env.CONTENT_FILE_NAME, JSON.stringify({ products, reviews }), env);
  });
});
