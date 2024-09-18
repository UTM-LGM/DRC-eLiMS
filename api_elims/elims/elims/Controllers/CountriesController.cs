using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using elims.elims;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CountriesController : Controller
    {
        private readonly ElimsContext _context;

        public CountriesController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCountries()
        {
            var Countries = await _context.Countries.Select(x => new
            {
                id = x.Id,
                country = x.Country1,

            }).ToListAsync();

            return Ok(Countries);
        }
    }
}
