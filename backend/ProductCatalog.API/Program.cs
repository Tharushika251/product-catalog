using Microsoft.EntityFrameworkCore;
using ProductCatalog.API.Data;
using ProductCatalog.API.Services;

/* uses - EF Core with SQL Server, 
   Swagger - for API documentation, 
   CORS - to allow requests from a React frontend,  
   DI - for service classes.
configures middleware, 
ensures the database is created automatically, 
ensures whether ready for CRUD operations with proper security and logging */

// Initializes the web application builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers(); // Registers controllers for handling HTTP requests
builder.Services.AddEndpointsApiExplorer(); // Enables endpoint discovery for Swagger
builder.Services.AddSwaggerGen(); // Adds Swagger generation for API documentation

// Add DbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    //Configures SQL Server using connection string from appsettings.json
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS - to allow requests from frontend application
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Product Service
builder.Services.AddScoped<IProductService, ProductService>();
// Sanitization Service
builder.Services.AddScoped<ISanitizationService, SanitizationService>();

//Builds the middleware pipeline
var app = builder.Build();

// Configure the HTTP request pipeline by enabling Swagger in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Applies the defined CORS policy
app.UseCors("AllowFrontend");
// middleware for authentication/authorization
app.UseAuthorization();
// maps attribute-routed controllers
app.MapControllers();

// Create database automatically with initial seed data, if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();

