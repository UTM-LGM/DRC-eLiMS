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
    public class RefCreatorRolesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefCreatorRolesController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/RefCreatorRoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefCreatorRole>>> GetRefCreatorRoles()
        {
          if (_context.RefCreatorRoles == null)
          {
              return NotFound();
          }
            return await _context.RefCreatorRoles.ToListAsync();
        }

        // GET: api/RefCreatorRoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RefCreatorRole>> GetRefCreatorRole(int id)
        {
          if (_context.RefCreatorRoles == null)
          {
              return NotFound();
          }
            var refCreatorRole = await _context.RefCreatorRoles.FindAsync(id);

            if (refCreatorRole == null)
            {
                return NotFound();
            }

            return refCreatorRole;
        }

        // PUT: api/RefCreatorRoles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefCreatorRole(int id, RefCreatorRole refCreatorRole)
        {
            if (id != refCreatorRole.Id)
            {
                return BadRequest();
            }

            _context.Entry(refCreatorRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefCreatorRoleExists(id))
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

        // POST: api/RefCreatorRoles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RefCreatorRole>> PostRefCreatorRole(RefCreatorRole refCreatorRole)
        {
          if (_context.RefCreatorRoles == null)
          {
              return Problem("Entity set 'ElimsContext.RefCreatorRoles'  is null.");
          }
            _context.RefCreatorRoles.Add(refCreatorRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefCreatorRole", new { id = refCreatorRole.Id }, refCreatorRole);
        }

        // DELETE: api/RefCreatorRoles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefCreatorRole(int id)
        {
            if (_context.RefCreatorRoles == null)
            {
                return NotFound();
            }
            var refCreatorRole = await _context.RefCreatorRoles.FindAsync(id);
            if (refCreatorRole == null)
            {
                return NotFound();
            }

            _context.RefCreatorRoles.Remove(refCreatorRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RefCreatorRoleExists(int id)
        {
            return (_context.RefCreatorRoles?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
