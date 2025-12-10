using ProductCatalog.API.DTOs;

namespace ProductCatalog.API.Services
{
    /* defines three asynchronous operations: 
    - retrieving all products, creating a product, and checking if a product exists. 
    - ensures loose coupling and allows easy testing and mocking */
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<bool> ProductExistsAsync(string productName);
    }
}