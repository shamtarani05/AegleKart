const BASE_URL = 'http://localhost:3000/api';

// Product API calls
export const productService = {
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params if provided
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.category && filters.category !== 'All Products') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) queryParams.append('search', filters.search);
    
    const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  createProduct: async (productData) => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    
    return response.json();
  },
  
  // Add other product related API methods here (update, delete, etc.)
};

export default {
  productService,
  // Add other services here as needed
};
