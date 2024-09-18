using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using System.Collections;
using elims.Controllers;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LabRefNoRunningNoesController : ControllerBase
    {
        private readonly ElimsContext _context;
        private readonly K1DetailController _k1DetailController;

        public LabRefNoRunningNoesController(ElimsContext context)
        {
            _context = context;
          
        }

        private static readonly SemaphoreSlim _mutex = new SemaphoreSlim(1);

        [HttpPut("{monthyear}")]
        public async Task<IActionResult> PutLabRefNo([FromRoute] string monthyear, K1Detail k1Detail)
        {
            try
            {
                await _mutex.WaitAsync(); // Wait for the mutex, ensuring only one request proceeds at a time.

                var runData = await _context.LabRefNoRunningNos
                    .Where(x => x.Monthyear == monthyear)
                    .FirstOrDefaultAsync();

                if (runData == null)
                {
                    LabRefNoRunningNo newRunNo = new LabRefNoRunningNo
                    {
                        Runningno = 1,
                        Monthyear = monthyear,
                    };
                    _context.LabRefNoRunningNos.Add(newRunNo);
                    await _context.SaveChangesAsync();

                    return Ok(newRunNo); // Return the newly created runNo.
                }
                else
                {
                    runData.Runningno = runData.Runningno + 1;
                    await _context.SaveChangesAsync();
                    return Ok(runData); // Return the updated runNo.
                }
            }
            finally
            {
                _mutex.Release(); // Release the mutex to allow other requests to proceed.
            }
        }

       /* // GET: api/LabRefNoRunningNoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LabRefNoRunningNo>>> GetLabRefNoRunningNos()
        {
          if (_context.LabRefNoRunningNos == null)
          {
              return NotFound();
          }
            return await _context.LabRefNoRunningNos.ToListAsync();
        }

        // GET: api/LabRefNoRunningNoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LabRefNoRunningNo>> GetLabRefNoRunningNo(int id)
        {
          if (_context.LabRefNoRunningNos == null)
          {
              return NotFound();
          }
            var labRefNoRunningNo = await _context.LabRefNoRunningNos.FindAsync(id);

            if (labRefNoRunningNo == null)
            {
                return NotFound();
            }

            return labRefNoRunningNo;
        }

        // PUT: api/LabRefNoRunningNoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLabRefNoRunningNo(int id, LabRefNoRunningNo labRefNoRunningNo)
        {
            if (id != labRefNoRunningNo.Id)
            {
                return BadRequest();
            }

            _context.Entry(labRefNoRunningNo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabRefNoRunningNoExists(id))
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

        // POST: api/LabRefNoRunningNoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LabRefNoRunningNo>> PostLabRefNoRunningNo(LabRefNoRunningNo labRefNoRunningNo)
        {
          if (_context.LabRefNoRunningNos == null)
          {
              return Problem("Entity set 'ElimsContext.LabRefNoRunningNos'  is null.");
          }
            _context.LabRefNoRunningNos.Add(labRefNoRunningNo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLabRefNoRunningNo", new { id = labRefNoRunningNo.Id }, labRefNoRunningNo);
        }

        // DELETE: api/LabRefNoRunningNoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLabRefNoRunningNo(int id)
        {
            if (_context.LabRefNoRunningNos == null)
            {
                return NotFound();
            }
            var labRefNoRunningNo = await _context.LabRefNoRunningNos.FindAsync(id);
            if (labRefNoRunningNo == null)
            {
                return NotFound();
            }

            _context.LabRefNoRunningNos.Remove(labRefNoRunningNo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LabRefNoRunningNoExists(int id)
        {
            return (_context.LabRefNoRunningNos?.Any(e => e.Id == id)).GetValueOrDefault();
        }*/
    }
}
