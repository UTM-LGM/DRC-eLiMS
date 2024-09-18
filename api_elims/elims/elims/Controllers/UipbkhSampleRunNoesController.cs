using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using System.Threading;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UipbkhSampleRunNoesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public UipbkhSampleRunNoesController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet("{year}")]
        public async Task<IActionResult> GetUipbkhSampleRunNo([FromRoute] string year)
        {
            var runData = await _context.UipbkhSampleRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();

            return Ok(runData);
        }

        private static readonly SemaphoreSlim _mutex = new SemaphoreSlim(1);

        [HttpPut("{year}")]
        public async Task<IActionResult> PutUipbkhSampleRunNo([FromRoute] string year)
        {
            try
            {
                await _mutex.WaitAsync(); // Wait for the mutex, ensuring only one request proceeds at a time.

                var runData = await _context.UipbkhSampleRunNos
                    .Where(x => x.Year == year)
                    .FirstOrDefaultAsync();

                if (runData == null)
                {
                    UipbkhSampleRunNo newRunNo = new UipbkhSampleRunNo
                    {
                        RunNo = 1,
                        Year = year,
                    };
                    _context.UipbkhSampleRunNos.Add(newRunNo);
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




        /* [HttpPut("{year}")]
         public async Task<IActionResult> PutUipbkhSampleRunNo([FromRoute] string year)
         {
             var runData = await _context.UipbkhSampleRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
             if (runData == null)
             {
                 UipbkhSampleRunNo newRunNo = new UipbkhSampleRunNo
                 {
                     RunNo = 1,
                     Year = year,
                 }; _context.UipbkhSampleRunNos.Add(newRunNo); await _context.SaveChangesAsync();
                 //runData = await GetUipbkhSampleRunNo(year);
                 runData = await _context.UipbkhSampleRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();

             }
             else
             {
                 runData.RunNo++;
                 await _context.SaveChangesAsync();

             }
             return Ok(runData);

         }*/









        /*  // GET: api/UipbkhSampleRunNoes
          [HttpGet]
          public async Task<ActionResult<IEnumerable<UipbkhSampleRunNo>>> GetUipbkhSampleRunNos()
          {
            if (_context.UipbkhSampleRunNos == null)
            {
                return NotFound();
            }
              return await _context.UipbkhSampleRunNos.ToListAsync();
          }

          // GET: api/UipbkhSampleRunNoes/5
          [HttpGet("{id}")]
          public async Task<ActionResult<UipbkhSampleRunNo>> GetUipbkhSampleRunNo(int id)
          {
            if (_context.UipbkhSampleRunNos == null)
            {
                return NotFound();
            }
              var uipbkhSampleRunNo = await _context.UipbkhSampleRunNos.FindAsync(id);

              if (uipbkhSampleRunNo == null)
              {
                  return NotFound();
              }

              return uipbkhSampleRunNo;
          }

          // PUT: api/UipbkhSampleRunNoes/5
          // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
          [HttpPut("{id}")]
          public async Task<IActionResult> PutUipbkhSampleRunNo(int id, UipbkhSampleRunNo uipbkhSampleRunNo)
          {
              if (id != uipbkhSampleRunNo.Id)
              {
                  return BadRequest();
              }

              _context.Entry(uipbkhSampleRunNo).State = EntityState.Modified;

              try
              {
                  await _context.SaveChangesAsync();
              }
              catch (DbUpdateConcurrencyException)
              {
                  if (!UipbkhSampleRunNoExists(id))
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

          // POST: api/UipbkhSampleRunNoes
          // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
          [HttpPost]
          public async Task<ActionResult<UipbkhSampleRunNo>> PostUipbkhSampleRunNo(UipbkhSampleRunNo uipbkhSampleRunNo)
          {
            if (_context.UipbkhSampleRunNos == null)
            {
                return Problem("Entity set 'ElimsContext.UipbkhSampleRunNos'  is null.");
            }
              _context.UipbkhSampleRunNos.Add(uipbkhSampleRunNo);
              await _context.SaveChangesAsync();

              return CreatedAtAction("GetUipbkhSampleRunNo", new { id = uipbkhSampleRunNo.Id }, uipbkhSampleRunNo);
          }

          // DELETE: api/UipbkhSampleRunNoes/5
          [HttpDelete("{id}")]
          public async Task<IActionResult> DeleteUipbkhSampleRunNo(int id)
          {
              if (_context.UipbkhSampleRunNos == null)
              {
                  return NotFound();
              }
              var uipbkhSampleRunNo = await _context.UipbkhSampleRunNos.FindAsync(id);
              if (uipbkhSampleRunNo == null)
              {
                  return NotFound();
              }

              _context.UipbkhSampleRunNos.Remove(uipbkhSampleRunNo);
              await _context.SaveChangesAsync();

              return NoContent();
          }

          private bool UipbkhSampleRunNoExists(int id)
          {
              return (_context.UipbkhSampleRunNos?.Any(e => e.Id == id)).GetValueOrDefault();
          }*/
    }
}
