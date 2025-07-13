import { fetchProducts } from "./productService.js";
import { fetchReviews } from "./reviewsService.js";
import { store as storeFile, fetchJson as fetchFile } from "./storageService.js";
import "./config.js";

export async function renewContent(env) {
  const currentContent = await getCurrentContent(env);
  const updatedProducts = await fetchProducts(env);
  const updatedReviews = await fetchReviews(env);

  const newContent = {
    products: updatedProducts ?? currentContent.products,
    reviews: updatedReviews ?? currentContent.reviews,
  }
  await storeNewContent(newContent, env);
  invalidateCache();
}

async function getCurrentContent(env) {
  const contentFileName = env.CONTENT_FILE_NAME;
  try {
    const currentContentFile = await fetchFile(contentFileName, env);
    return currentContentFile == null ?
      { products: [], reviews: [] }
      : JSON.parse(currentContentFile);
  } catch (e) {
    console.error('Error trying to get current content', e);
    return { products: [], reviews: [] }
  }
}

async function storeNewContent(content, env) {
  const contentFileName = env.CONTENT_FILE_NAME;
  await storeFile(contentFileName, JSON.stringify(content), env);
}

function invalidateCache() {

}
