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
    public class ForwardersController : Controller
    {
        private readonly ElimsContext _context;

        public ForwardersController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetForwarders()
        {
            var Forwarder = await _context.Forwarders.Select(x => new
            {
                forwarderId = x.ForwarderId,
                name = x.Name,
                address = x.Address,
                postcode = x.Postcode,
                tel = x.Tel,
                email = x.Email,
                fax = x.Fax,
                contactPerson = x.ContactPerson,
                customOfficeId = x.CustomOfficeId,
                code = x.Code,

            }).OrderBy( x=> x.name).ToListAsync();

            return Ok(Forwarder);
        }

        [HttpGet ("{id}")]
        public async Task<IActionResult> GetForwarderId([FromRoute]int id )
        {
            var Forwarder = await _context.Forwarders.Where(x => x.ForwarderId == id).Select(x => new
            {
                forwarderId = x.ForwarderId,
                name = x.Name,
                address = x.Address,
                postcode = x.Postcode,
                tel = x.Tel,
                email = x.Email,
                fax = x.Fax,
                contactPerson = x.ContactPerson,
                customOfficeId = x.CustomOfficeId,
                code = x.Code,
                licenseNo = x.LicenseNo,

            }).FirstOrDefaultAsync();

            return Ok(Forwarder);
        }



        [HttpGet("{forwarderId}")]
        public async Task<IActionResult> GetEmailForwarder(int forwarderId)

        {
            var forwarders = await _context.Forwarders.Where(x => x.ForwarderId == forwarderId ).Select(x => new
            {
                staffId = x.ForwarderId,
                email = x.Email,

            }).FirstOrDefaultAsync();

            return Ok(forwarders);



        }

        [HttpPut("{forwarderId}")]

        public async Task<IActionResult> PutForwarderProfile([FromRoute] int forwarderId, [FromBody] Forwarder updateProfileRequest)
        {
            var forwarder = await _context.Forwarders.Where(x => x.ForwarderId == forwarderId).FirstOrDefaultAsync();

            if (forwarder == null)
            {
                return NotFound();
            }

            forwarder.Name = updateProfileRequest.Name;
            forwarder.Address = updateProfileRequest.Address;
            forwarder.Postcode = updateProfileRequest.Postcode;
            forwarder.Tel = updateProfileRequest.Tel;
            forwarder.Email = updateProfileRequest.Email;
            forwarder.Fax = updateProfileRequest.Fax;
            forwarder.ContactPerson = updateProfileRequest.ContactPerson;
            forwarder.Code = updateProfileRequest.Code;
            forwarder.LicenseNo = updateProfileRequest.LicenseNo;

            await _context.SaveChangesAsync();

            return Ok(forwarder);

        }

    }
}
