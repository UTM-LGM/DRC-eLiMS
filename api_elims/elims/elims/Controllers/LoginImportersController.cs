using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using elims.DTOs;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoginImportersController : ControllerBase
    {
        private readonly ElimsContext _context;

        public LoginImportersController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/LoginImporters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoginImporter>>> GetLoginImporters()
        {
          if (_context.LoginImporters == null)
          {
              return NotFound();
          }
            return await _context.LoginImporters.ToListAsync();
        }


        [HttpGet("{username}")]
        public async Task<IActionResult> GetLoginImporterByUsername(string username)
        {
            var loginImporter = await _context.LoginImporters.Where(x => x.Username == username).Select(x => new
            {
                username = x.Username,
                password = x.Password,
                companyId = x.CompanyId,
                name = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                isNorthen = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.IsNorthen).FirstOrDefault(),
                address = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                smkimportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                postcode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Postcode).FirstOrDefault(),
                fax = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Fax).FirstOrDefault(),
                tel = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Tel).FirstOrDefault(),
                contactPerson = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.ContactPerson).FirstOrDefault(),
                email = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Email).FirstOrDefault(),
                licenseNo = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.LicenseNo).FirstOrDefault(),

                locked = x.Locked

            }).FirstOrDefaultAsync();

            if (loginImporter == null)
            {
                return NotFound();
            }

            return Ok(loginImporter);
        }



        [HttpPost("Login")]
        public async Task<IActionResult> Post([FromBody] LoginImporter loginImporter)
        {
            var existingUser = await _context.LoginImporters.SingleOrDefaultAsync(u => u.Username == loginImporter.Username && u.Password == loginImporter.Password);

            if (existingUser == null)
            {
                return BadRequest("Invalid username or password");
            }

            return Ok(existingUser);
        }
    }
}
