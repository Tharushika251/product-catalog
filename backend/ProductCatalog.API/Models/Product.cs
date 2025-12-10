using System.ComponentModel.DataAnnotations; // to enforce data integrity before anything is saved to the database
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductCatalog.API.Models
{
    /* the Entity Model, representing the structure of the Product table in the database.
    EF Core maps this class directly to a database table*/
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // auto-increment
        public int Id { get; set; }

        // Product Name
        [Required]
        [StringLength(200)]
        public string ProductName { get; set; } = string.Empty;

        // Price
        [Required]
        [Column(TypeName = "decimal(18,2)")] // prevents floating-point errors
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        // Description
        [StringLength(1000)]
        public string? Description { get; set; }

        // Category
        [StringLength(100)]
        public string? Category { get; set; }

        // CreatedAt
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // UpdatedAt
        public DateTime? UpdatedAt { get; set; }
    }
}