import React, { useState } from 'react';

const ProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        description: '',
        category: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Other'
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.product_name.trim()) {
            newErrors.product_name = 'Product name is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else {
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            if (!priceRegex.test(formData.price)) {
                newErrors.price = 'Price must be a positive number with up to 2 decimal places';
            } else if (parseFloat(formData.price) <= 0) {
                newErrors.price = 'Price must be greater than zero';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const productToSubmit = {
                ...formData,
                price: parseFloat(formData.price).toFixed(2)
            };

            await onProductAdded(productToSubmit);

            setFormData({
                product_name: '',
                price: '',
                description: '',
                category: ''
            });
            setErrors({});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container p-4">
            <h2 className="mb-4 text-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
            </h2>

            <form className='card h-100 shadow-sm p-4' onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="product_name" className="form-label fw-bold">
                        Product Name *
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.product_name ? 'is-invalid' : ''}`}
                        id="product_name"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />
                    {errors.product_name && (
                        <div className="invalid-feedback">
                            {errors.product_name}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label fw-bold">
                        Price ($) *
                    </label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    {errors.price && (
                        <div className="invalid-feedback d-block">
                            {errors.price}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label fw-bold">
                        Category
                    </label>
                    <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-bold">
                        Description
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Adding Product...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Product
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;