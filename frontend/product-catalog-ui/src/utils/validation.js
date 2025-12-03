export const sanitizeInput = (input) => {
    if (!input) return input;

    // Remove potentially harmful characters
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .replace(/\s+/g, ' '); // Normalize whitespace
};

export const validateCategory = (category) => {
    const validCategories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Other'
    ];

    if (!category) return { isValid: true, message: '' }; // Optional
    if (!validCategories.includes(category)) {
        return { isValid: false, message: 'Please select a valid category' };
    }
    return { isValid: true, message: '' };
};