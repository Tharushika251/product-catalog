using Microsoft.EntityFrameworkCore;
using ProductCatalog.API.Data;
using ProductCatalog.API.DTOs;
using ProductCatalog.API.Models;

namespace ProductCatalog.API.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

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
            // Check if product already exists
            var existingProduct = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductName.ToLower() == createProductDto.ProductName.ToLower());

            if (existingProduct != null)
            {
                throw new InvalidOperationException($"A product with the name '{createProductDto.ProductName}' already exists.");
            }

            var product = new Product
            {
                ProductName = createProductDto.ProductName,
                Price = createProductDto.Price,
                Description = createProductDto.Description,
                Category = createProductDto.Category,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

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
            return await _context.Products
                .AnyAsync(p => p.ProductName.ToLower() == productName.ToLower());
        }
    }
}