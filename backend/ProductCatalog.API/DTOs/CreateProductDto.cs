using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace ProductCatalog.API.DTOs
{
    public class CreateProductDto
    {
        // ProductName
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(200, ErrorMessage = "Product name cannot exceed 200 characters")]
        [CustomValidation(typeof(ProductValidations), nameof(ProductValidations.ValidateProductName))]
        public string ProductName { get; set; } = string.Empty;


        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Price must have up to 2 decimal places")]
        public decimal Price { get; set; }

        // Description
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        // Category
        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string? Category { get; set; }
    }

    public static class ProductValidations
    {
        public static ValidationResult ValidateProductName(string productName, ValidationContext context)
        {
            if (string.IsNullOrWhiteSpace(productName))
                return ValidationResult.Success; // Let [Required] handle this

            if (productName.Length < 2)
                return new ValidationResult("Product name must be at least 2 characters");

            if (Regex.IsMatch(productName, @"[<>]"))
                return new ValidationResult("Product name cannot contain HTML tags");

            return ValidationResult.Success;
        }
    }
}