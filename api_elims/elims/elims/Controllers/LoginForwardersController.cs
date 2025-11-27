using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using elims.DTOs;
using System.Text;
using System.Security.Cryptography;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoginForwardersController : Controller
    {
      
        private readonly ElimsContext _context;

        public LoginForwardersController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLoginForwarders()
        {
            var LoginForwarder = await _context.LoginForwarders.Select(x => new
            {
                username = x.Username,
                password = x.Password,
                forwarderId = x.ForwarderId,
                name = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).ToList(),
                address = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).ToList(),
                customOfficeId = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.CustomOfficeId).ToList(),
                locked = x.Locked,
                code = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Code).FirstOrDefault(),
                licenseNo = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.LicenseNo).FirstOrDefault(),

            }).ToListAsync();

            return Ok(LoginForwarder);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetLoginForwarderByUsername(string username)
        {
            var loginForwarder = await _context.LoginForwarders.Where(x => x.Username == username).Select(x => new
            {
                username = x.Username,
                password = x.Password,
                forwarderId = x.ForwarderId,
                name = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                customOfficeId = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.CustomOfficeId).FirstOrDefault(),
                address = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).FirstOrDefault(),
                code = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Code).FirstOrDefault(),
                licenseNo = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.LicenseNo).FirstOrDefault(),
                //smkimportersCode = _context.Companies.Where(y => y.CompanyId == (_context.Forwarders.Where(z => z.ForwarderId == x.ForwarderId).Select(z => z.ForwarderId).FirstOrDefault())).Select(y => y.SmkimportersCode).FirstOrDefault(),
                /*smkImporter = _context.CompanyForwarders.Where( y => y.ForwarderId == x.ForwarderId).Select( y => new
                {
                    importer = _context.Companies.Where( z => z.CompanyId == y.CompanyId).FirstOrDefault(),
                }).ToList(),*/
                /*     isNorthen = _context.CustomOffices.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.IsNorthen).ToList(),*/

                locked = x.Locked

            }).FirstOrDefaultAsync();

            if (loginForwarder == null)
            {
                return NotFound();
            }

            return Ok(loginForwarder);
        }


        [HttpGet("{code}")]
        public async Task<IActionResult> GetLoginForwarderByCode(string username)
        {
            var loginForwarder = await _context.LoginForwarders.Where(x => x.Username == username).Select(x => new
            {
                username = x.Username,
                password = x.Password,
                forwarderId = x.ForwarderId,
                name = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                customOfficeId = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.CustomOfficeId).FirstOrDefault(),
                address = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).FirstOrDefault(),
                code = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Code).FirstOrDefault(),
                smkimportersCode = _context.Forwarders.Where(y => y.ForwarderId == (_context.Companies.Where(z => z.CompanyId == x.ForwarderId).Select(z => z.CompanyId).FirstOrDefault())).Select(y => y.ForwarderId).FirstOrDefault(),
                /*     isNorthen = _context.CustomOffices.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.IsNorthen).ToList(),*/
                licenseNo = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.LicenseNo).FirstOrDefault(),
                locked = x.Locked
            })
                .FirstOrDefaultAsync();

            if (loginForwarder == null)
            {
                return NotFound();
            }

            return Ok(loginForwarder);
        }



        [HttpPost]
        public async Task<ActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.Username)) return BadRequest("Sorry, account already exists");
            if (await WrongCompanyNameInfo(registerDTO.ForwarderId, registerDTO.Code)) return BadRequest("Company name does not match the code company");
            if (await WrongCodeInfo(registerDTO.ForwarderId, registerDTO.Code)) return BadRequest("Company name does not match the code company");
            if (!NameExists(registerDTO.ForwarderId)) return BadRequest("Company name not found");
            if (!CodeExists(registerDTO.Code)) return BadRequest("Code company not found");


            var user = new LoginForwarder
            {
                Username = registerDTO.Username,
                Password = registerDTO.Password,
                ForwarderId = registerDTO.ForwarderId,

            };

            _context.LoginForwarders.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        private async Task<bool> UserExists(string username) //To check if username exist to avoid username redundancy
        {
            return await _context.LoginForwarders.AnyAsync(x => x.Username == username);

        }

        private async Task<bool> WrongCompanyNameInfo(int forwarderId, string code) //To check if user info correct in forwarders table
        {
            return await _context.Forwarders.AnyAsync(x => x.Code.ToLower() == code.ToLower() && x.ForwarderId != forwarderId);
        }

        private async Task<bool> WrongCodeInfo(int forwarderId, string code) //To check if user info correct in forwarders table
        {
            return await _context.Forwarders.AnyAsync(x => x.Code.ToLower() != code.ToLower() && x.ForwarderId == forwarderId);
        }

        private bool NameExists(int forwarderId) //To check if companyName exist in forwarders table
        {
            return _context.Forwarders.Any(x => x.ForwarderId == forwarderId);
        }

        private bool CodeExists(string code) //To check if code in forwarders table
        {
            return _context.Forwarders.Any(x => x.Code == code);


        }

        [HttpPost("Login")]
        public async Task<IActionResult> Post([FromBody] LoginDTO loginForwarder)
        {
            var existingUser = await _context.LoginForwarders.SingleOrDefaultAsync(u => u.Username == loginForwarder.Username && u.Password == loginForwarder.Password);

            if (existingUser == null)
            {
                return BadRequest("Invalid username or password");
            }

            return Ok(existingUser);
        }
    }
}
