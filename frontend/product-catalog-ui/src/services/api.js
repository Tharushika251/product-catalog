const API_BASE_URL = 'http://localhost:5000/api';

export const productService = {
    // Get all products
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);

            // Parse response as text first to see what we get
            const responseText = await response.text();

            if (!response.ok) {
                let errorMessage = `Failed to fetch products: ${response.status}`;

                try {
                    // Try to parse as JSON for error details
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If not JSON, use the text
                    errorMessage = responseText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            // Parse successful response as JSON
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Add a new product
    async addProduct(product) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: product.product_name,
                    price: parseFloat(product.price),
                    description: product.description || '',
                    category: product.category || ''
                })
            });

            // Parse response as text first
            const responseText = await response.text();
            let data = {};

            try {
                data = JSON.parse(responseText);
            } catch {
                // If not JSON, use empty object
            }

            if (!response.ok) {
                // Handle 409 Conflict (duplicate product)
                if (response.status === 409) {
                    // Get message from backend response
                    const errorMessage = data.message || 'Product with this name already exists';
                    throw new Error(errorMessage);
                }

                // Handle other errors
                const errorMessage = data.message || `Failed to add product: ${response.status}`;
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }
};