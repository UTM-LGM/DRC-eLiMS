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
    public class UipSampleRunNoesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public UipSampleRunNoesController(ElimsContext context)
        {
            _context = context;
        }

        private static readonly SemaphoreSlim _mutex = new SemaphoreSlim(1);

        [HttpPut("{year}")]
        public async Task<IActionResult> PutUipSampleRunNo([FromRoute] string year)
        {
            try
            {
                await _mutex.WaitAsync(); // Wait for the mutex, ensuring only one request proceeds at a time.

                var runData = await _context.UipSampleRunNos
                    .Where(x => x.Year == year)
                    .FirstOrDefaultAsync();

                if (runData == null)
                {
                    UipSampleRunNo newRunNo = new UipSampleRunNo
                    {
                        RunNo = 1,
                        Year = year,
                    };
                    _context.UipSampleRunNos.Add(newRunNo);
                    await _context.SaveChangesAsync();
                    return Ok(newRunNo); // Return the newly created runNo.
                }
                else
                {
                    runData.RunNo = runData.RunNo + 1;
                    await _context.SaveChangesAsync();
                    return Ok(runData); // Return the updated runNo.
                }
            }
            finally
            {
                _mutex.Release(); // Release the mutex to allow other requests to proceed.
            }
        }
    }
}





        /*        [HttpPut("{year}")]
                public async Task<IActionResult> PutUipSampleRunNo([FromRoute] string year)
                {
                    var runData = await _context.UipSampleRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
                    if (runData == null)
                    {
                        UipSampleRunNo newRunNo = new UipSampleRunNo
                        {
                            RunNo = 1,
                            Year = year,
                        }; _context.UipSampleRunNos.Add(newRunNo); await _context.SaveChangesAsync();
                        runData = await _context.UipSampleRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
                        return Ok(runData);
                    }
                    else
                    {
                        runData.RunNo = runData.RunNo + 1;
                        await _context.SaveChangesAsync();
                        return Ok(runData);

                    }
                    //return Ok(runData);

                }
            }
            */

        /*     // GET: api/UipSampleRunNoes
            [HttpGet]
            public async Task<ActionResult<IEnumerable<UipSampleRunNo>>> GetUipSampleRunNos()
            {
                if (_context.UipSampleRunNos == null)
                {
                    return NotFound();
                }
                return await _context.UipSampleRunNos.ToListAsync();
            }

            // GET: api/UipSampleRunNoes/5
            [HttpGet("{id}")]
            public async Task<ActionResult<UipSampleRunNo>> GetUipSampleRunNo(int id)
            {
                if (_context.UipSampleRunNos == null)
                {
                    return NotFound();
                }
                var uipSampleRunNo = await _context.UipSampleRunNos.FindAsync(id);

                if (uipSampleRunNo == null)
                {
                    return NotFound();
                }

                return uipSampleRunNo;
            }

            // PUT: api/UipSampleRunNoes/5
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPut("{id}")]
            public async Task<IActionResult> PutUipSampleRunNo(int id, UipSampleRunNo uipSampleRunNo)
            {
                if (id != uipSampleRunNo.Id)
                {
                    return BadRequest();
                }

                _context.Entry(uipSampleRunNo).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UipSampleRunNoExists(id))
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

            // POST: api/UipSampleRunNoes
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPost]
            public async Task<ActionResult<UipSampleRunNo>> PostUipSampleRunNo(UipSampleRunNo uipSampleRunNo)
            {
                if (_context.UipSampleRunNos == null)
                {
                    return Problem("Entity set 'ElimsContext.UipSampleRunNos'  is null.");
                }
                _context.UipSampleRunNos.Add(uipSampleRunNo);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUipSampleRunNo", new { id = uipSampleRunNo.Id }, uipSampleRunNo);
            }

            // DELETE: api/UipSampleRunNoes/5
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteUipSampleRunNo(int id)
            {
                if (_context.UipSampleRunNos == null)
                {
                    return NotFound();
                }
                var uipSampleRunNo = await _context.UipSampleRunNos.FindAsync(id);
                if (uipSampleRunNo == null)
                {
                    return NotFound();
                }

                _context.UipSampleRunNos.Remove(uipSampleRunNo);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            private bool UipSampleRunNoExists(int id)
            {
                return (_context.UipSampleRunNos?.Any(e => e.Id == id)).GetValueOrDefault();
            }*/
    