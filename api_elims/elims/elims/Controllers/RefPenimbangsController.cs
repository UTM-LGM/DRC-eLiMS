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
    public class RefPenimbangsController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefPenimbangsController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/RefPenimbangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefPenimbang>>> GetRefPenimbangs()
        {
          if (_context.RefPenimbangs == null)
          {
              return NotFound();
          }
            return await _context.RefPenimbangs.ToListAsync();
        }

        // GET: api/RefPenimbangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RefPenimbang>> GetRefPenimbang(int id)
        {
          if (_context.RefPenimbangs == null)
          {
              return NotFound();
          }
            var refPenimbang = await _context.RefPenimbangs.FindAsync(id);

            if (refPenimbang == null)
            {
                return NotFound();
            }

            return refPenimbang;
        }

        // PUT: api/RefPenimbangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefPenimbang(int id, RefPenimbang refPenimbang)
        {
            if (id != refPenimbang.Id)
            {
                return BadRequest();
            }

            _context.Entry(refPenimbang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefPenimbangExists(id))
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

        // POST: api/RefPenimbangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RefPenimbang>> PostRefPenimbang(RefPenimbang refPenimbang)
        {
          if (_context.RefPenimbangs == null)
          {
              return Problem("Entity set 'ElimsContext.RefPenimbangs'  is null.");
          }
            _context.RefPenimbangs.Add(refPenimbang);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefPenimbang", new { id = refPenimbang.Id }, refPenimbang);
        }

        // DELETE: api/RefPenimbangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefPenimbang(int id)
        {
            if (_context.RefPenimbangs == null)
            {
                return NotFound();
            }
            var refPenimbang = await _context.RefPenimbangs.FindAsync(id);
            if (refPenimbang == null)
            {
                return NotFound();
            }

            _context.RefPenimbangs.Remove(refPenimbang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RefPenimbangExists(int id)
        {
            return (_context.RefPenimbangs?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
