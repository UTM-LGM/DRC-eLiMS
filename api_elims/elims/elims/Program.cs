using elims.elims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // Allow specific origin (e.g., www5.lgm.gov.my)
        //policy.WithOrigins("https://www5.lgm.gov.my") // You can also use "*" for any origin
        policy.WithOrigins("*")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Swagger/OpenAPI for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add response compression (optional)
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true; // Optional: Enable compression for HTTPS requests
    options.MimeTypes = new[] { "application/json" }; // Only compress JSON responses
});

// Set up Entity Framework Core to use SQL Server
builder.Services.AddDbContext<ElimsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("elims")));

// Build the app
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();  // Redirect HTTP requests to HTTPS
app.UseCors();  // Apply CORS policy
app.UseResponseCompression();  // Use response compression
app.UseAuthorization();  // Enable authorization
app.MapControllers();  // Map API controllers

// Add custom error handling for Internal Server Errors (500)
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Log the exception here (you can use a logging framework like Serilog)
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("Internal Server Error: " + ex.Message);
    }
});

app.Run();
