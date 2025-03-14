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
    public class K3HeaderController : ControllerBase
    {
        private readonly DataKastam2023Context _context;

        public K3HeaderController(DataKastam2023Context context)
        {
            _context = context;
        }



       /* [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> getK3HeaderByCustomNo([FromRoute] string customRegistrationNo)
        {
            {
                var k3Header = await _context.K3Headers
                     .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                     .ToListAsync();

                return Ok(k3Header);
            }
        }*/



        [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> getK3HeaderByCustomNo([FromRoute] string customRegistrationNo)
        {
            var k3Headers = await _context.K3Headers.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
                customNo = x.CustomRegistrationNo,
                supplierName = x.ConsignorName,
                exporterAddress = x.ConsignorAddress1,
                importerName = x.ConsigneeName,
                importerAddress = x.ConsigneeAddress1,
                importedDate = x.DateOfDispatch,
                lorryNo = x.VehicleLorryNo,
                trailerNo = x.TrailerNo,
                grossWeight = x.GrossWeight,
                importerCode = x.ConsigneeCode,
                agentCode = x.AgentCode,
                agentName = x.AgentName,
                TariffCode = _context.K3Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCode).ToList(),
                ItemDescription = _context.K3Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ItemDescription).ToList(),
                CountryOfRegion = _context.K3Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.CountryOfOrigin).ToList(),
                QuantityStatistics = _context.K3Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.QuantityStatistics).ToList(),
                TariffCodeNew = _context.K3Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCodeNew).ToList(),
            }).FirstOrDefaultAsync();

            return Ok(k3Headers);


        } 




         [HttpGet("{customRegistrationNo}/{agentCode}")]
        public async Task<IActionResult> getK1Detail([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
        {
            var DataKastam2023Context = await _context.K1Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.K1DetailId,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                    cif = x.Cif,
                    fob = x.Fob,
                    agentCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                    importerCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode).FirstOrDefault()
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



            // GET: api/K3Header
            [HttpGet]
        public async Task<ActionResult<IEnumerable<K3Header>>> GetK3Headers()
        {
          if (_context.K3Headers == null)
          {
              return NotFound();
          }
            return await _context.K3Headers.ToListAsync();
        }

        // GET: api/K3Header/5
        [HttpGet("{id}")]
        public async Task<ActionResult<K3Header>> GetK3Header(string id)
        {
          if (_context.K3Headers == null)
          {
              return NotFound();
          }
            var k3Header = await _context.K3Headers.FindAsync(id);

            if (k3Header == null)
            {
                return NotFound();
            }

            return k3Header;
        }

        // PUT: api/K3Header/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutK3Header(string id, K3Header k3Header)
        {
            if (id != k3Header.CustomRegistrationNo)
            {
                return BadRequest();
            }

            _context.Entry(k3Header).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!K3HeaderExists(id))
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

        // POST: api/K3Header
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<K3Header>> PostK3Header(K3Header k3Header)
        {
          if (_context.K3Headers == null)
          {
              return Problem("Entity set 'DataKastam2023Context.K3Headers'  is null.");
          }
            _context.K3Headers.Add(k3Header);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (K3HeaderExists(k3Header.CustomRegistrationNo))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetK3Header", new { id = k3Header.CustomRegistrationNo }, k3Header);
        }

        // DELETE: api/K3Header/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteK3Header(string id)
        {
            if (_context.K3Headers == null)
            {
                return NotFound();
            }
            var k3Header = await _context.K3Headers.FindAsync(id);
            if (k3Header == null)
            {
                return NotFound();
            }

            _context.K3Headers.Remove(k3Header);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool K3HeaderExists(string id)
        {
            return (_context.K3Headers?.Any(e => e.CustomRegistrationNo == id)).GetValueOrDefault();
        }
    }
}
