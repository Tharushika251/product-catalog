// const API_BASE_URL = 'http://localhost:5000/api';

// export const productService = {
//     // Get all products
//     async getProducts() {
//         try {
//             const response = await fetch(`${API_BASE_URL}/products`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch products');
//             }
//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             throw error;
//         }
//     },

//     // Add a new product
//     async addProduct(product) {
//         try {
//             const response = await fetch(`${API_BASE_URL}/products`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(product)
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to add product');
//             }

//             return data;
//         } catch (error) {
//             console.error('Error adding product:', error);
//             throw error;
//         }
//     }
// };

// Mock API service for now
export const productService = {
    async getProducts() {
        // Return mock data
        return [
            {
                product_name: 'Sample Laptop',
                price: 999.99,
                description: 'High-performance laptop for professionals',
                category: 'Electronics'
            },
            {
                product_name: 'Running Shoes',
                price: 89.99,
                description: 'Comfortable shoes for running',
                category: 'Sports'
            },
            {
                product_name: 'Coffee Maker',
                price: 49.99,
                category: 'Home & Garden'
            }
        ];
    },

    async addProduct(product) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return the product with a mock ID
        return {
            ...product,
            id: Date.now() // Mock ID
        };
    }
};