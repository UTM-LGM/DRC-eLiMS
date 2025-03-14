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
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddResponseCompression(options =>
    {
    options.EnableForHttps = true; // Optional: Enable compression for HTTPS requests
    options.MimeTypes = new[] { "application/json" }; // Optional: Only disable compression for specific content types
});

builder.Services.AddDbContext<ElimsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("elims")));


//mula
/*builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ClientIdPolicy", policy =>
    {
        policy.RequireClaim("client_id");
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Include security requirement (client ID) in Swagger UI
    c.AddSecurityDefinition("ClientIdSecurity", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        Name = "Client-ID",
        In = ParameterLocation.Header,
        Description = "Please enter your client ID.",
    });

    // Apply security requirement (client ID) globally to all endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ClientIdSecurity"
                }
            },
            new string[] {}
        }
    });
});
*/
//akhir
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//mula
// Middleware to validate client ID in incoming requests
/*app.Use(async (context, next) =>
{
    string clientId = context.Request.Headers["Client-ID"];

    var registeredClients = new Dictionary<string, string>
    {
        { "elims", "" }, // No client secret required
        // Add other registered clients...
    };

    if (registeredClients.ContainsKey(clientId))
    {
        await next();
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("Unauthorized. Invalid client ID.");
    }
});*/
//akhir
app.UseHttpsRedirection();

app.UseResponseCompression();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
