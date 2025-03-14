using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataKastam.DataKastam2023;

namespace DataKastam.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class K3DetailController : ControllerBase
    {
        private readonly DataKastam2023Context _context;

        public K3DetailController(DataKastam2023Context context)
        {
            _context = context;
        }


/*        [HttpGet("{customRegistrationNo}")]

        public async Task<IActionResult> getK3DetailbyCustomNo([FromRoute] string customRegistrationNo)
        {
            var DataKastam2023Context = await _context.K3Details.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
               // id = x.K3DetailId,
                itemDescription = x.ItemDescription,
                quantityStatistics = x.QuantityStatistics,
                tariffCodeNew = x.TariffCodeNew,
                countryOfOrigin = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,

            }).ToListAsync();
            return Ok(DataKastam2023Context);
        }*/


        [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> getK3DetailbyCustomNo([FromRoute] string customRegistrationNo)
        {
            {
                var k3Detail = await _context.K3Details
                     .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                     .ToListAsync();

                return Ok(k3Detail);
            }
        }


        [HttpGet("{customRegistrationNo}/{agentCode}")]
        public async Task<IActionResult> getK3Detail([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
        {
            var DataKastam2023Context = await _context.K3Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.Id,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                   /* cif = x.Cif,
                    fob = x.Fob,*/
                    agentCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                    importerCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeCode).FirstOrDefault()
                })
                .ToListAsync();

            if (DataKastam2023Context.Count == 0)
            {
                return NotFound();
            }
            else
            if (DataKastam2023Context.Any() && DataKastam2023Context.First().agentCode == agentCode)
            {
                return Ok(DataKastam2023Context);
            }

            else
            {
                // Unauthorized response if the agent codes do not match
                return Unauthorized();
            }
        }




        /*[HttpGet("{customRegistrationNo}/{importerCode}")]
        public async Task<IActionResult> getK3DetailImporterCode([FromRoute] string customRegistrationNo, [FromRoute] string importerCode)
        {
            var DataKastam2023Context = await _context.K3Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.Id,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                    *//* cif = x.Cif,
                     fob = x.Fob,*/
        /* agentCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsignorName).FirstOrDefault(),
         agentName = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsignorCode).FirstOrDefault(),*//*
         importerName = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeName).FirstOrDefault(),
         importerCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeCode).FirstOrDefault()
     })
     .ToListAsync();

 if (DataKastam2023Context.Count == 0)
 {
     return NotFound();
 }
 else
 if (DataKastam2023Context.Any() && DataKastam2023Context.First().importerCode == importerCode)
 {
     return Ok(DataKastam2023Context);
 }

 else
 {
     // Unauthorized response if the agent codes do not match
     return Unauthorized();
 }
}
*/



        [HttpGet("{customRegistrationNo}/{importerCode}")]
        public async Task<IActionResult> getK3DetailByImporterCode([FromRoute] string customRegistrationNo, [FromRoute] string importerCode)
        {
            var DataKastam2023Context = await _context.K3Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.Id,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                    agentCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                    importerName = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeName).FirstOrDefault(),
                    importerCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeCode.Trim()).FirstOrDefault() // Trim the importerCode here
                })
                .ToListAsync();

            // Check if the provided agentCode matches the agentCode associated with the customNo
            if (DataKastam2023Context.Any() && DataKastam2023Context.First().importerCode == importerCode.Trim()) // Trim the importerCode here
            {
                return Ok(DataKastam2023Context);
            }
            else
            {
                // Unauthorized response if the agent codes do not match
                return Unauthorized();
            }
        }




        // GET: api/K3Detail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<K3Detail>>> GetK3Details()
        {
          if (_context.K3Details == null)
          {
              return NotFound();
          }
            return await _context.K3Details.ToListAsync();
        }

        // GET: api/K3Detail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<K3Detail>> GetK3Detail(int id)
        {
          if (_context.K3Details == null)
          {
              return NotFound();
          }
            var k3Detail = await _context.K3Details.FindAsync(id);

            if (k3Detail == null)
            {
                return NotFound();
            }

            return k3Detail;
        }

        // PUT: api/K3Detail/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutK3Detail(int id, K3Detail k3Detail)
        {
            if (id != k3Detail.Id)
            {
                return BadRequest();
            }

            _context.Entry(k3Detail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!K3DetailExists(id))
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

        // POST: api/K3Detail
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<K3Detail>> PostK3Detail(K3Detail k3Detail)
        {
          if (_context.K3Details == null)
          {
              return Problem("Entity set 'DataKastam2023Context.K3Details'  is null.");
          }
            _context.K3Details.Add(k3Detail);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (K3DetailExists(k3Detail.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetK3Detail", new { id = k3Detail.Id }, k3Detail);
        }

        // DELETE: api/K3Detail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteK3Detail(int id)
        {
            if (_context.K3Details == null)
            {
                return NotFound();
            }
            var k3Detail = await _context.K3Details.FindAsync(id);
            if (k3Detail == null)
            {
                return NotFound();
            }

            _context.K3Details.Remove(k3Detail);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> getK3Detail1([FromRoute] int id)
        {
            var k3Details = await _context.K3Details.Where(x => x.Id == id).Select(x => new
            {
                id = x.Id,
                itemDescription = x.ItemDescription,
                quantity = x.QuantityStatistics,
                hsCode = x.TariffCodeNew,
                country = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,
             /*   cif = x.Cif,
                fob = x.Fob,*/
                agentCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                importerCode = _context.K3Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ConsigneeCode).FirstOrDefault()


            }).FirstOrDefaultAsync();



            return Ok(k3Details);
        }



        private bool K3DetailExists(int id)
        {
            return (_context.K3Details?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
