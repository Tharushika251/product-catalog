import React from 'react';

const ProductList = ({ products, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary loading-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Error loading products: {error}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-box-seam display-1 text-muted"></i>
                <h3 className="mt-3 text-muted">No products yet</h3>
                <p className="text-muted">Add your first product using the form!</p>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <div>
            <h2 className="mb-4 text-primary">
                <i className="bi bi-grid me-2"></i>
                Product Catalog ({products.length})
            </h2>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {products.map((product, index) => (
                    <div key={index} className="col">
                        <div className="card product-card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title mb-0">{product.product_name}</h5>
                                    <span className="badge bg-secondary">{product.category || 'Uncategorized'}</span>
                                </div>

                                <p className="price-tag fs-4 mb-3">
                                    {formatPrice(product.price)}
                                </p>

                                {product.description && (
                                    <p className="card-text text-muted">
                                        <small>{product.description}</small>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;