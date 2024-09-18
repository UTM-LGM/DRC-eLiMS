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
    public class StationCodesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public StationCodesController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/StationCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StationCode>>> GetStationCodes()
        {
          if (_context.StationCodes == null)
          {
              return NotFound();
          }
            return await _context.StationCodes.ToListAsync();
        }

        // GET: api/StationCodes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StationCode>> GetStationCode(int id)
        {
          if (_context.StationCodes == null)
          {
              return NotFound();
          }
            var stationCode = await _context.StationCodes.FindAsync(id);

            if (stationCode == null)
            {
                return NotFound();
            }

            return stationCode;
        }

        [HttpGet("{kodStesen}")]
        public async Task<IActionResult> GetKeteranganByKodStesen([FromRoute] string kodStesen)
        {
            var keterangan = await _context.StationCodes.Where(x => x.KodStesen == kodStesen).FirstOrDefaultAsync();
            return Ok(keterangan);
        }

        // PUT: api/StationCodes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStationCode(int id, StationCode stationCode)
        {
            if (id != stationCode.Id)
            {
                return BadRequest();
            }

            _context.Entry(stationCode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationCodeExists(id))
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

        // POST: api/StationCodes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StationCode>> PostStationCode(StationCode stationCode)
        {
          if (_context.StationCodes == null)
          {
              return Problem("Entity set 'ElimsContext.StationCodes'  is null.");
          }
            _context.StationCodes.Add(stationCode);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStationCode", new { id = stationCode.Id }, stationCode);
        }

        // DELETE: api/StationCodes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStationCode(int id)
        {
            if (_context.StationCodes == null)
            {
                return NotFound();
            }
            var stationCode = await _context.StationCodes.FindAsync(id);
            if (stationCode == null)
            {
                return NotFound();
            }

            _context.StationCodes.Remove(stationCode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StationCodeExists(int id)
        {
            return (_context.StationCodes?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
