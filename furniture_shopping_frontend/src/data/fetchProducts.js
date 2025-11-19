import mockProducts from './mockProducts';

// PUBLIC_INTERFACE
export async function fetchAllProducts() {
  const base = process.env.REACT_APP_API_BASE;
  if (base) {
    try {
      const resp = await fetch(`${base.replace(/\/$/, '')}/products`);
      if (!resp.ok) throw new Error('Fetch failed');
      return await resp.json();
    } catch (e) {
      // Fallback to mock data
      return mockProducts;
    }
  }
  return mockProducts;
}

// PUBLIC_INTERFACE
export async function fetchProductById(id) {
  const base = process.env.REACT_APP_API_BASE;
  if (base) {
    try {
      const resp = await fetch(`${base.replace(/\/$/, '')}/products/${id}`);
      if (!resp.ok) throw new Error('Fetch failed');
      return await resp.json();
    } catch (e) {
      return mockProducts.find(p => `${p.id}` === `${id}`);
    }
  }
  return mockProducts.find(p => `${p.id}` === `${id}`);
}
