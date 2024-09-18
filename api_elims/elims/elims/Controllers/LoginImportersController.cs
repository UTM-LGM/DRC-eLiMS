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


       /* [HttpGet("{username}")]
        public async Task<IActionResult> GetLoginImporters(string username)
        {
            var LoginImporter = await _context.LoginImporters.Where(x => x.Username == username).Select(x => new
            {
                username = x.Username,
                password = x.Password,
                companyId = x.CompanyId,
                address = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                smkImportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                forwarderId = _context.Forwarders.Where(y => y.ForwarderId == x.CompanyId).Select(y => y.ForwarderId).FirstOrDefault(),
                locked = x.Locked

            }).FirstOrDefaultAsync();

            if (LoginImporter == null)
            {
                return NotFound();
            }

            return Ok(LoginImporter);
        }*/


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

            // User is authenticated, you can generate a token or set a session/cookie here

            return Ok(existingUser);
        }



        /* // GET: api/LoginImporters/5
         [HttpGet("{id}")]
         public async Task<ActionResult<LoginImporter>> GetLoginImporter(int id)
         {
           if (_context.LoginImporters == null)
           {
               return NotFound();
           }
             var loginImporter = await _context.LoginImporters.FindAsync(id);

             if (loginImporter == null)
             {
                 return NotFound();
             }

             return loginImporter;
         }

         // PUT: api/LoginImporters/5
         // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
         [HttpPut("{id}")]
         public async Task<IActionResult> PutLoginImporter(int id, LoginImporter loginImporter)
         {
             if (id != loginImporter.Id)
             {
                 return BadRequest();
             }

             _context.Entry(loginImporter).State = EntityState.Modified;

             try
             {
                 await _context.SaveChangesAsync();
             }
             catch (DbUpdateConcurrencyException)
             {
                 if (!LoginImporterExists(id))
                 {
                     return NotFound();
                 }
                 else
                 {
                     throw;
                 }
             }

             return NoContent();
         }

         // POST: api/LoginImporters
         // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
         [HttpPost]
         public async Task<ActionResult<LoginImporter>> PostLoginImporter(LoginImporter loginImporter)
         {
           if (_context.LoginImporters == null)
           {
               return Problem("Entity set 'ElimsContext.LoginImporters'  is null.");
           }
             _context.LoginImporters.Add(loginImporter);
             await _context.SaveChangesAsync();

             return CreatedAtAction("GetLoginImporter", new { id = loginImporter.Id }, loginImporter);
         }

         // DELETE: api/LoginImporters/5
         [HttpDelete("{id}")]
         public async Task<IActionResult> DeleteLoginImporter(int id)
         {
             if (_context.LoginImporters == null)
             {
                 return NotFound();
             }
             var loginImporter = await _context.LoginImporters.FindAsync(id);
             if (loginImporter == null)
             {
                 return NotFound();
             }

             _context.LoginImporters.Remove(loginImporter);
             await _context.SaveChangesAsync();

             return NoContent();
         }

         private bool LoginImporterExists(int id)
         {
             return (_context.LoginImporters?.Any(e => e.Id == id)).GetValueOrDefault();
         }*/
    }
}
