using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CompanyForwardersController : ControllerBase
    {
        private readonly ElimsContext _context;

        public CompanyForwardersController(ElimsContext context)
        {
            _context = context;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyForwarderbyId([FromRoute] int id)
        {
            var Importer = await _context.CompanyForwarders.Where(x => x.ForwarderId == id).Select(x => new
            {
                companyId = x.CompanyId,
                forwarderId = x.ForwarderId,
                name = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                namaForwarder = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                smkimporterCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),

            }).ToListAsync();

            return Ok(Importer);
        }

        [HttpGet("{companyId}")]
        public async Task<IActionResult> GetForwarderbyCompanyId([FromRoute] int companyId)
        {
            var Importer = await _context.CompanyForwarders.Where(x => x.CompanyId == companyId).Select(x => new
            {
                companyId = x.CompanyId,
                forwarderId = x.ForwarderId,
                name = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                namaForwarder = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                smkimporterCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),

            }).ToListAsync();

            return Ok(Importer);
        }

    
    }
}
