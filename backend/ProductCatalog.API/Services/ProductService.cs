using Microsoft.EntityFrameworkCore;
using ProductCatalog.API.Data;
using ProductCatalog.API.DTOs;
using ProductCatalog.API.Models;

namespace ProductCatalog.API.Services
{
    public class ProductService : IProductService
    {
        // Constructor - (Injects the EF Core DbContext for database operations)
        private readonly ApplicationDbContext _context;
        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.CreatedAt) // newest first
                .ToListAsync();

            // Maps Product entities to ProductDto objects.
            // Mapping to DTOs ensures we don’t leak internal database structure to the frontend.
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                ProductName = p.ProductName,
                Price = p.Price,
                Description = p.Description,
                Category = p.Category,
                CreatedAt = p.CreatedAt
            });
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            // Sanitize inputs - Prevents harmful content (HTML, scripts, SQL characters)
            var sanitizedName = SanitizeInput(createProductDto.ProductName);
            var sanitizedDescription = SanitizeInput(createProductDto.Description);
            var sanitizedCategory = SanitizeInput(createProductDto.Category);
            var sanitizedPrice = SanitizePrice(createProductDto.Price);

            // Additional validations
            ValidateProductName(sanitizedName);
            ValidatePrice(sanitizedPrice);

            if (!string.IsNullOrEmpty(sanitizedDescription))
                ValidateDescription(sanitizedDescription);

            // Check if product already exists
            var existingProduct = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductName.ToLower() == sanitizedName.ToLower());

            if (existingProduct != null) // Case-insensitive duplicate check
            {
                throw new InvalidOperationException($"A product with the name '{sanitizedName}' already exists.");
            }

            // Create Product Entity
            var product = new Product
            {
                ProductName = sanitizedName,
                Price = sanitizedPrice,
                Description = sanitizedDescription,
                Category = sanitizedCategory,
                CreatedAt = DateTime.UtcNow
            };

            // Save to Database
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Services return DTOs, not database entities - to maintain separation of concerns
            return new ProductDto
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Price = product.Price,
                Description = product.Description,
                Category = product.Category,
                CreatedAt = product.CreatedAt
            };
        }

        public async Task<bool> ProductExistsAsync(string productName)
        {
            var sanitizedName = SanitizeInput(productName);
            return await _context.Products
                .AnyAsync(p => p.ProductName.ToLower() == sanitizedName.ToLower());
        }

        // ============ SANITIZATION & VALIDATION METHODS ============

        private string SanitizeInput(string? input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            // Remove HTML tags
            input = System.Text.RegularExpressions.Regex.Replace(input, @"<[^>]*>", string.Empty);

            // Remove potentially dangerous characters
            input = System.Text.RegularExpressions.Regex.Replace(input, @"[;""']", string.Empty);

            // Trim extra spaces
            return input.Trim();
        }

        private decimal SanitizePrice(decimal price)
        {
            // Ensure price is within reasonable bounds
            if (price < 0.01m)
                throw new ArgumentException("Price must be greater than 0.01");

            if (price > 1000000m)
                throw new ArgumentException("Price cannot exceed 1,000,000");

            // Round to 2 decimal places
            return Math.Round(price, 2, MidpointRounding.AwayFromZero);
        }

        private void ValidateProductName(string productName)
        {
            if (string.IsNullOrWhiteSpace(productName))
                throw new ArgumentException("Product name is required");

            if (productName.Length < 2)
                throw new ArgumentException("Product name must be at least 2 characters");

            if (productName.Length > 200)
                throw new ArgumentException("Product name cannot exceed 200 characters");

            // Check for HTML tags that might have slipped through
            if (System.Text.RegularExpressions.Regex.IsMatch(productName, @"[<>]"))
                throw new ArgumentException("Product name cannot contain HTML tags");
        }

        private void ValidatePrice(decimal price)
        {
            if (price <= 0)
                throw new ArgumentException("Price must be greater than 0");

            // Check decimal places
            var priceString = price.ToString();
            var decimalPart = priceString.Contains('.') ? priceString.Split('.')[1] : "";

            if (decimalPart.Length > 2)
                throw new ArgumentException("Price can have up to 2 decimal places");

            // Prevent extremely small prices that might be errors
            if (price < 0.10m)
                throw new ArgumentException("Price must be at least $0.10");
        }

        private void ValidateDescription(string description)
        {
            if (description.Length > 1000)
                throw new ArgumentException("Description cannot exceed 1000 characters");

            if (description.Split(' ').Length < 2 && description.Length > 20)
                throw new ArgumentException("Please provide a more descriptive product description");
        }
    }
}