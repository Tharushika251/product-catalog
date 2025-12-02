using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.API.DTOs
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(200, ErrorMessage = "Product name cannot exceed 200 characters")]
        public string ProductName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Price must have up to 2 decimal places")]
        public decimal Price { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string? Category { get; set; }
    }
}