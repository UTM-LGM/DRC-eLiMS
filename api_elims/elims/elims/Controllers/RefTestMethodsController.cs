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
    public class RefTestMethodsController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefTestMethodsController(ElimsContext context)
        {
            _context = context;
        }


        // GET: api/RefTestMethods/5
        [HttpGet("{rubberTypeId}")]
        public async Task<IActionResult> GetRefTestMethodByRubberType([FromRoute] int rubberTypeId)
        {
            if (_context.RefTestMethods == null)
            {
                return NotFound();
            }
            var RefTestMethod = await _context.RefTestMethods.Where(x => x.RubberTypeId == rubberTypeId).ToListAsync();

            if (RefTestMethod == null)
            {
                return NotFound();
            }


            return Ok(RefTestMethod);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRefTestMethods()
        {
            if (_context.RefTestMethods == null)
            {
                return NotFound();
            }
            var RefTestMethod = await _context.RefTestMethods.ToListAsync();

            if (RefTestMethod == null)
            {
                return NotFound();
            }


            return Ok(RefTestMethod);
        }




        /*// GET: api/RefTestMethods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefTestMethod>>> GetRefTestMethods()
        {
          if (_context.RefTestMethods == null)
          {
              return NotFound();
          }
            return await _context.RefTestMethods.ToListAsync();
        }

        // GET: api/RefTestMethods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RefTestMethod>> GetRefTestMethod(int id)
        {
          if (_context.RefTestMethods == null)
          {
              return NotFound();
          }
            var refTestMethod = await _context.RefTestMethods.FindAsync(id);

            if (refTestMethod == null)
            {
                return NotFound();
            }

            return refTestMethod;
        }*/

        // PUT: api/RefTestMethods/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefTestMethod(int id, RefTestMethod refTestMethod)
        {
            if (id != refTestMethod.Id)
            {
                return BadRequest();
            }

            _context.Entry(refTestMethod).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefTestMethodExists(id))
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

        // POST: api/RefTestMethods
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RefTestMethod>> PostRefTestMethod(RefTestMethod refTestMethod)
        {
          if (_context.RefTestMethods == null)
          {
              return Problem("Entity set 'ElimsContext.RefTestMethods'  is null.");
          }
            _context.RefTestMethods.Add(refTestMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefTestMethod", new { id = refTestMethod.Id }, refTestMethod);
        }

        // DELETE: api/RefTestMethods/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefTestMethod(int id)
        {
            if (_context.RefTestMethods == null)
            {
                return NotFound();
            }
            var refTestMethod = await _context.RefTestMethods.FindAsync(id);
            if (refTestMethod == null)
            {
                return NotFound();
            }

            _context.RefTestMethods.Remove(refTestMethod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RefTestMethodExists(int id)
        {
            return (_context.RefTestMethods?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
