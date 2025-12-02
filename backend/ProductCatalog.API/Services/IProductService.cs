using ProductCatalog.API.DTOs;

namespace ProductCatalog.API.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<bool> ProductExistsAsync(string productName);
    }
}