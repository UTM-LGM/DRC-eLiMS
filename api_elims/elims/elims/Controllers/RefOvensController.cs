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
    public class RefOvensController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefOvensController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/RefOvens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefOven>>> GetRefOvens()
        {
          if (_context.RefOvens == null)
          {
              return NotFound();
          }
            return await _context.RefOvens.ToListAsync();
        }

        // GET: api/RefOvens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RefOven>> GetRefOven(int id)
        {
          if (_context.RefOvens == null)
          {
              return NotFound();
          }
            var refOven = await _context.RefOvens.FindAsync(id);

            if (refOven == null)
            {
                return NotFound();
            }

            return refOven;
        }

        // PUT: api/RefOvens/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefOven(int id, RefOven refOven)
        {
            if (id != refOven.Id)
            {
                return BadRequest();
            }

            _context.Entry(refOven).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefOvenExists(id))
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

        // POST: api/RefOvens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RefOven>> PostRefOven(RefOven refOven)
        {
          if (_context.RefOvens == null)
          {
              return Problem("Entity set 'ElimsContext.RefOvens'  is null.");
          }
            _context.RefOvens.Add(refOven);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefOven", new { id = refOven.Id }, refOven);
        }

        // DELETE: api/RefOvens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefOven(int id)
        {
            if (_context.RefOvens == null)
            {
                return NotFound();
            }
            var refOven = await _context.RefOvens.FindAsync(id);
            if (refOven == null)
            {
                return NotFound();
            }

            _context.RefOvens.Remove(refOven);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RefOvenExists(int id)
        {
            return (_context.RefOvens?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
