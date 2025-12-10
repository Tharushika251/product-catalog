using Microsoft.EntityFrameworkCore; // ORM used for database operations
using ProductCatalog.API.Models; // Entity Framework can map product model to a database table

namespace ProductCatalog.API.Data
{
    /* Acts as the bridge between the API and database. 
    DbContext manages: 
    - DB connections, Queries, Migrations, Table mappings */
    public class ApplicationDbContext : DbContext
    {
        // constructor - (EF Core injects database configuration using dependency injection)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Product model → Products table
        public DbSet<Product> Products { get; set; }

        /* Overrides EF Core’s table configuration.
        Allows defining: constraints, indexes, relationships, seed data */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /* Add unique constraint on ProductName 
            - EF will throw a DbUpdateException, which service handles as a conflict(409)*/
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.ProductName)
                .IsUnique();

            // Seed initial data
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    ProductName = "Sample Laptop",
                    Price = 999.99m,
                    Description = "High-performance laptop for professionals",
                    Category = "Electronics",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = 2,
                    ProductName = "Running Shoes",
                    Price = 89.99m,
                    Description = "Comfortable shoes for running",
                    Category = "Sports",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                { 
                    Id = 3,
                    ProductName = "Coffee Maker",
                    Price = 49.99m,
                    Category = "Home & Garden",
                    CreatedAt = DateTime.UtcNow
                },
                new Product { Id = 4, ProductName = "Wireless Headphones", Price = 129.99m, Description = "Noise-cancelling Bluetooth headphones", Category = "Electronics", CreatedAt = DateTime.UtcNow },
                new Product { Id = 5, ProductName = "Winter Jacket", Price = 89.99m, Description = "Waterproof jacket with thermal lining", Category = "Clothing", CreatedAt = DateTime.UtcNow },
                new Product { Id = 6, ProductName = "Programming Book", Price = 39.99m, Description = "Complete guide to modern web development", Category = "Books", CreatedAt = DateTime.UtcNow },
                new Product { Id = 7, ProductName = "Yoga Mat", Price = 29.99m, Description = "Non-slip yoga mat with carrying strap", Category = "Sports", CreatedAt = DateTime.UtcNow },
                new Product { Id = 8, ProductName = "Building Blocks", Price = 49.99m, Description = "Educational building block set", Category = "Toys", CreatedAt = DateTime.UtcNow },
                new Product { Id = 9, ProductName = "Smartphone", Price = 799.99m, Description = "Latest model with 128GB storage", Category = "Electronics", CreatedAt = DateTime.UtcNow },
                new Product { Id = 10, ProductName = "Plant Pot Set", Price = 34.99m, Description = "Set of 3 ceramic plant pots", Category = "Home & Garden", CreatedAt = DateTime.UtcNow }
            );
        }
    }
}