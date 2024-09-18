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
    public class RetestsController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RetestsController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/Retests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Retest>>> GetRetests()
        {
          if (_context.Retests == null)
          {
              return NotFound();
          }
            return await _context.Retests.ToListAsync();
        }

        // GET: api/Retests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Retest>> GetRetest(int id)
        {
          if (_context.Retests == null)
          {
              return NotFound();
          }
            var retest = await _context.Retests.FindAsync(id);

            if (retest == null)
            {
                return NotFound();
            }

            return retest;
        }

        // PUT: api/Retests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRetest(int id, Retest retest)
        {
            if (id != retest.Id)
            {
                return BadRequest();
            }

            _context.Entry(retest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RetestExists(id))
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

        // POST: api/Retests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*        [HttpPost]
                public async Task<ActionResult<Retest>> PostRetest(Retest retest)
                {
                  if (_context.Retests == null)
                  {
                      return Problem("Entity set 'ElimsContext.Retests'  is null.");
                  }
                    _context.Retests.Add(retest);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction("GetRetest", new { id = retest.Id }, retest);
                }*/




        /*     [HttpPost]
             public async Task<IActionResult> PostRetest([FromBody] Retest retest)
             {
                 // Set the RejectedOn field to the current time

                 retest.RejectedOn = DateTime.Now;

                 // Increment the noofretest field
                 IncrementNoOfRetest();

                 // Add the retest to the database context
                 _context.Retests.Add(retest);

                 // Save the changes to the database
                 await _context.SaveChangesAsync();

                 // Return an OK response with the retest object
                 return Ok(retest);
             }

             // Method to increment the noofretest field
             private void IncrementNoOfRetest()
             {
                 var retestCount = _context.Retests.Count();
                 var currentRetest = _context.Retests.FirstOrDefault();

                 if (currentRetest != null)
                 {
                     currentRetest.NoOfRetest = retestCount + 1;
                 }
             }
     */

        [HttpPost]
        public async Task<IActionResult> PostRetest([FromBody] Retest retest)
        {
            // Set the RejectedOn field to the current time
            retest.RejectedOn = DateTime.Now;

            // Increment the noofretest field
            IncrementNoOfRetest(retest);

            // Add the retest to the database context
            _context.Retests.Add(retest);

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return an OK response with the retest object
            return Ok(retest);
        }

        // Method to increment the noofretest field based on k1DetailId
        private void IncrementNoOfRetest(Retest retest)
        {
            // Count the number of retests associated with the same k1DetailId
            var retestCount = _context.Retests.Count(r => r.K1DetailId == retest.K1DetailId);

            // Set the NoOfRetest field; start from 0
            retest.NoOfRetest = retestCount;
        }




        /*     [HttpPost]
             public async Task<IActionResult> PostRetest([FromBody] Retest retest)
             {

                 retest.RejectedOn = DateTime.Now;

                 _context.Retests.Add(retest);
                 await _context.SaveChangesAsync();

                 return Ok(retest);


             }
     */





        // DELETE: api/Retests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRetest(int id)
        {
            if (_context.Retests == null)
            {
                return NotFound();
            }
            var retest = await _context.Retests.FindAsync(id);
            if (retest == null)
            {
                return NotFound();
            }

            _context.Retests.Remove(retest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RetestExists(int id)
        {
            return (_context.Retests?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
