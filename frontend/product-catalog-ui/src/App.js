import React, { useState, useEffect, useCallback } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Notification from './components/Notification';
import { productService } from './services/api';

const App = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({
        message: '',
        type: ''
    });

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const clearNotification = () => {
        setNotification({ message: '', type: '' });
    };

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message);
            showNotification('Failed to load products. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleProductAdded = async (productData) => {
        try {
            const newProduct = await productService.addProduct(productData);

            setProducts(prev => [newProduct, ...prev]);
            showNotification('Product added successfully!', 'success');

            return newProduct;
        } catch (err) {
            // Check for duplicate product error
            if (err.message.includes('already exists') || err.message.includes('duplicate')) {
                showNotification('Product with this name already exists!', 'error');
            } else {
                showNotification(err.message || 'Failed to add product', 'error');
            }
            throw err;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <header className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">
                            <i className="bi bi-shop me-3"></i>
                            Product Catalog Manager
                        </h1>
                        <p className="lead text-muted">
                            Manage your product inventory in one place
                        </p>
                    </header>
                </div>
            </div>

            {/* Notification */}
            <div className="row mb-4">
                <div className="col-12 col-lg-8 offset-lg-2">
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={clearNotification}
                    />
                </div>
            </div>

            <div className="row">
                {/* Product Form - Left Column */}
                <div className="col-12 col-lg-4 mb-4 mb-lg-0">
                    <ProductForm onProductAdded={handleProductAdded} />
                </div>

                {/* Product List - Right Column */}
                <div className="col-12 col-lg-8">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <ProductList
                            products={products}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            </div>

            <footer className="mt-5 pt-4 border-top text-center text-muted">
                <p className="mb-0">
                    Product Catalog Manager &copy; {new Date().getFullYear()}
                </p>
                <small>
                    All products are managed in real-time without page reloads
                </small>
            </footer>
        </div>
    );
};

export default App;