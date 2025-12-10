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
    const [duplicateCheck, setDuplicateCheck] = useState({ checking: false, exists: false });
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    // Predefined categories for the dropdown
    const categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Other'
    ];

    const checkDuplicate = async (productName) => {
        if (!productName.trim() || productName.length < 2) return;

        setDuplicateCheck({ checking: true, exists: false });

        try {
            const response = await fetch(`http://localhost:5000/api/products/check/${encodeURIComponent(productName)}`);
            if (response.ok) {
                const exists = await response.json();
                setDuplicateCheck({ checking: false, exists });
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
            setDuplicateCheck({ checking: false, exists: false });
        }
    };

    const validatePrice = (price) => {
        if (!price) return { isValid: false, message: 'Price is required' };

        // Check if it's a valid number
        if (isNaN(price)) {
            return { isValid: false, message: 'Price must be a valid number' };
        }

        const numPrice = parseFloat(price);

        // Check if positive
        if (numPrice <= 0) {
            return { isValid: false, message: 'Price must be greater than zero' };
        }

        // Check decimal places
        const decimalPart = price.toString().split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
            return { isValid: false, message: 'Price can have up to 2 decimal places' };
        }

        // Check reasonable maximum
        if (numPrice > 1000000) {
            return { isValid: false, message: 'Price cannot exceed $1,000,000' };
        }

        // Check for too many digits (prevent overflow)
        if (price.toString().replace('.', '').length > 15) {
            return { isValid: false, message: 'Price is too large' };
        }

        return { isValid: true, message: '' };
    };

    const validateForm = () => {
        const newErrors = {};

        // Product Name
        if (!formData.product_name.trim()) {
            newErrors.product_name = 'Product name is required';
        } else if (formData.product_name.length < 2) {
            newErrors.product_name = 'Product name must be at least 2 characters';
        } else if (formData.product_name.length > 200) {
            newErrors.product_name = 'Product name cannot exceed 200 characters';
        }

        // Price
        const priceValidation = validatePrice(formData.price);
        if (!priceValidation.isValid) {
            newErrors.price = priceValidation.message;
        } else if (parseFloat(formData.price) > 1000000) {
            newErrors.price = 'Price cannot exceed $1,000,000';
        }

        // Description (if provided)
        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Sanitize input
        let sanitizedValue = value;
        if (name === 'product_name' || name === 'description') {
            sanitizedValue = value.replace(/[<>]/g, '');
        }

        // PRICE VALIDATION WHILE TYPING
        if (name === "price") {
            if (!/^\d*\.?\d*$/.test(value)) return;   // allow only numbers + decimal

            const parts = value.split(".");

            // Prevent >2 decimals
            if (parts[1] && parts[1].length > 2) {
                setErrors(prev => ({ ...prev, price: "Only 2 decimal places allowed" }));
                return;
            }

            // Prevent >1,000,000
            if (value && parseFloat(value) > 1000000) {
                setErrors(prev => ({ ...prev, price: "Price cannot exceed $1,000,000" }));
                return;
            }

            setErrors(prev => ({ ...prev, price: "" }));
        }

        // DESCRIPTION LIVE VALIDATION
        if (name === "description") {
            if (sanitizedValue.length > 1000) {
                setErrors(prev => ({ ...prev, description: "Description cannot exceed 1000 characters" }));
            } else {
                setErrors(prev => ({ ...prev, description: "" }));
            }
        }

        // PRODUCT NAME LIVE VALIDATION
        if (name === "product_name") {
            if (sanitizedValue.length < 2) {
                setErrors(prev => ({ ...prev, product_name: "Product name must be at least 2 characters" }));
            } else {
                setErrors(prev => ({ ...prev, product_name: "" }));
            }
        }

        // Update state
        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Real-time duplicate check
        if (name === 'product_name' && value.trim().length >= 2) {
            checkDuplicate(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stops page reload

        // Prevent rapid form submission
        const now = Date.now();
        if (now - lastSubmitTime < 2000) { // 2 second cool down
            alert('Please wait a moment before submitting again');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLastSubmitTime(now);
        setIsSubmitting(true);

        try {
            const productToSubmit = {
                ...formData,
                price: parseFloat(formData.price).toFixed(2)
            };

            const result = await onProductAdded(productToSubmit);

            // Only reset form if successful (result is truthy)
            if (result) {
                setFormData({
                    product_name: '',
                    price: '',
                    description: '',
                    category: ''
                });
                setErrors({});
            }
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

                    {errors.description && (
                        <div className="invalid-feedback d-block">
                            {errors.description}
                        </div>
                    )}
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