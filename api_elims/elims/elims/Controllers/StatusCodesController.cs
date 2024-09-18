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
    public class StatusCodesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public StatusCodesController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/StatusCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatusCode>>> GetStatusCodes()
        {
          if (_context.StatusCodes == null)
          {
              return NotFound();
          }
            return await _context.StatusCodes.ToListAsync();
        }

        // GET: api/StatusCodes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StatusCode>> GetStatusCode(int id)
        {
          if (_context.StatusCodes == null)
          {
              return NotFound();
          }
            var statusCode = await _context.StatusCodes.FindAsync(id);

            if (statusCode == null)
            {
                return NotFound();
            }

            return statusCode;
        }

        // PUT: api/StatusCodes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatusCode(int id, StatusCode statusCode)
        {
            if (id != statusCode.StatusCodeId)
            {
                return BadRequest();
            }

            _context.Entry(statusCode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatusCodeExists(id))
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

        // POST: api/StatusCodes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StatusCode>> PostStatusCode(StatusCode statusCode)
        {
          if (_context.StatusCodes == null)
          {
              return Problem("Entity set 'ElimsContext.StatusCodes'  is null.");
          }
            _context.StatusCodes.Add(statusCode);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StatusCodeExists(statusCode.StatusCodeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStatusCode", new { id = statusCode.StatusCodeId }, statusCode);
        }

        // DELETE: api/StatusCodes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatusCode(int id)
        {
            if (_context.StatusCodes == null)
            {
                return NotFound();
            }
            var statusCode = await _context.StatusCodes.FindAsync(id);
            if (statusCode == null)
            {
                return NotFound();
            }

            _context.StatusCodes.Remove(statusCode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StatusCodeExists(int id)
        {
            return (_context.StatusCodes?.Any(e => e.StatusCodeId == id)).GetValueOrDefault();
        }
    }
}
