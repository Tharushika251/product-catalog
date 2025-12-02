# Install the correct version for .NET 9
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 9.0.0

# Install Entity Framework Tools
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 9.0.0

# Install Swagger (already in your csproj)
dotnet add package Swashbuckle.AspNetCore --version 7.2.0