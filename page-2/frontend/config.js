const env = import.meta.env;
window.MW75_CONFIG = {
  apiBaseUrl: env.VITE_API_BASE_URL || '',
  productId: env.VITE_PRODUCT_ID || '',
};
