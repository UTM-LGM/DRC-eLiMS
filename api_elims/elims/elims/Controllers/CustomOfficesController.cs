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
    public class CustomOfficesController : Controller
    {
        private readonly ElimsContext _context;

        public CustomOfficesController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomOffice([FromRoute] int id)
        {
            var CustomOffices = await _context.CustomOffices.Where(x => x.Id == id).Select(x => new
            {
                id = x.Id,
                name = x.Name,
                address = x.Address,
                postcode = x.Postcode,
                tel = x.Tel,
                email = x.Email,
                fax = x.Fax,
                contactPerson = x.ContactPerson,
                refNo = x.Refno,
                isNorthen = x.IsNorthen,
                codeStation = x.CodeStation,


            }).FirstOrDefaultAsync();

            return Ok(CustomOffices);
        }
    }
}
