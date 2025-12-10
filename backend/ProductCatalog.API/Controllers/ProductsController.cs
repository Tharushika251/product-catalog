using Microsoft.AspNetCore.Mvc;
using ProductCatalog.API.DTOs;
using ProductCatalog.API.Services;

namespace ProductCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    /* follows clean architecture using dependency injection.
    It exposes three endpoints:
    • GET /api/products - returns all products
    • POST /api/products - creates a new product with validation and duplicate handling
    • GET /api/products/check/{name} - checks if a product already exists.
    Business logic is abstracted into the IProductService layer.
    The controller handles validation, logs exceptions, and returns appropriate HTTP responses (200, 201, 400, 409, 500).
    All methods are asynchronous for better scalability and performance.*/

    public class ProductsController : ControllerBase
    {    
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        // Constructor Dependency Injection - ASP.NET Core automatically injects the required services
        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving products.",
                    error = ex.Message
                });
            }
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new // 400 Bad Request
                {
                    message = "Invalid product data",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            try
            {
                var product = await _productService.CreateProductAsync(createProductDto);
                return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product); 
            }
            catch (InvalidOperationException ex) //If product already exists
            {
                // Handle duplicate product error - return 409 Conflict
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the product.",
                    error = ex.Message
                });
            }
        }

        // GET: api/products/check/{productName}
        [HttpGet("check/{productName}")]
        public async Task<ActionResult<bool>> CheckProductExists(string productName)
        {
            try
            {
                var exists = await _productService.ProductExistsAsync(productName);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking product existence");
                return StatusCode(500, new
                {
                    message = "An error occurred while checking product existence.",
                    error = ex.Message
                });
            }
        }
    }
}