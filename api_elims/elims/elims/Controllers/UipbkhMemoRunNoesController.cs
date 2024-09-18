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
    public class UipbkhMemoRunNoesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public UipbkhMemoRunNoesController(ElimsContext context)
        {
            _context = context;
        }
 

        [HttpPut("{year}")]
        public async Task<IActionResult> PutUipbkhMemoRunNo([FromRoute] string year)
        {
            var runData = await _context.UipbkhMemoRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
            if (runData == null)
            {
                UipbkhMemoRunNo newRunNo = new UipbkhMemoRunNo
                {
                    RunNo = 1,
                    Year = year,
                }; _context.UipbkhMemoRunNos.Add(newRunNo); await _context.SaveChangesAsync();
                runData = await _context.UipbkhMemoRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
            }
            else
            {
                runData.RunNo++;
                await _context.SaveChangesAsync();

            }
            return Ok(runData);

        }



/*        [HttpGet]
        public async Task<IActionResult> GetUipbkhMemoRunNo(int batchId, int runNoTypeId)
        {
            var uipbkhRefRunNo = await _context.uipbkhMemoRunNo.Where(x => x.BatchId == batchId && x.RunNoTypeId == runNoTypeId).Select(x => new
            {
                id = x.Id,
                year = x.Year,
                runNo = x.RunNo,
                runNoTypeId = x.RunNoTypeId,
                batchId = x.BatchId,
                month = x.Month,
                addOn = x.AddOn,
                sampleCode = _context.RefSampleTypes.Where(y => y.Id == (_context.K1Details.Where(z => z.BatchId == batchId).Select(x => x.SampleTypeId).FirstOrDefault())).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.RefSampleTypes.Where(y => y.Id == (_context.K1Details.Where(z => z.BatchId == batchId).Select(x => x.SampleTypeId).FirstOrDefault())).Select(y => y.SampleCategory).FirstOrDefault(),


            })
                .ToListAsync();

            if (uipbkhMemoRunNo == null)
            {
                return NotFound();
            }

            return Ok(uipbkhMemoRunNo);
        }*/



        // GET: api/UipbkhMemoRunNoes
     /*   [HttpGet]
        public async Task<ActionResult<IEnumerable<UipbkhMemoRunNo>>> GetUipbkhMemoRunNos()
        {
          if (_context.UipbkhMemoRunNos == null)
          {
              return NotFound();
          }
            return await _context.UipbkhMemoRunNos.ToListAsync();
        }*/

        // GET: api/UipbkhMemoRunNoes/5
       /* [HttpGet("{id}")]
        public async Task<ActionResult<UipbkhMemoRunNo>> GetUipbkhMemoRunNo(int id)
        {
          if (_context.UipbkhMemoRunNos == null)
          {
              return NotFound();
          }
            var uipbkhMemoRunNo = await _context.UipbkhMemoRunNos.FindAsync(id);

            if (uipbkhMemoRunNo == null)
            {
                return NotFound();
            }

            return uipbkhMemoRunNo;
        }*/

        // PUT: api/UipbkhMemoRunNoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
      /*  [HttpPut("{id}")]
        public async Task<IActionResult> PutUipbkhMemoRunNo(int id, UipbkhMemoRunNo uipbkhMemoRunNo)
        {
            if (id != uipbkhMemoRunNo.Id)
            {
                return BadRequest();
            }

            _context.Entry(uipbkhMemoRunNo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UipbkhMemoRunNoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*/

        // POST: api/UipbkhMemoRunNoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
     /*   [HttpPost]
        public async Task<ActionResult<UipbkhMemoRunNo>> PostUipbkhMemoRunNo(UipbkhMemoRunNo uipbkhMemoRunNo)
        {
          if (_context.UipbkhMemoRunNos == null)
          {
              return Problem("Entity set 'ElimsContext.UipbkhMemoRunNos'  is null.");
          }
            _context.UipbkhMemoRunNos.Add(uipbkhMemoRunNo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUipbkhMemoRunNo", new { id = uipbkhMemoRunNo.Id }, uipbkhMemoRunNo);
        }

        // DELETE: api/UipbkhMemoRunNoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUipbkhMemoRunNo(int id)
        {
            if (_context.UipbkhMemoRunNos == null)
            {
                return NotFound();
            }
            var uipbkhMemoRunNo = await _context.UipbkhMemoRunNos.FindAsync(id);
            if (uipbkhMemoRunNo == null)
            {
                return NotFound();
            }

            _context.UipbkhMemoRunNos.Remove(uipbkhMemoRunNo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UipbkhMemoRunNoExists(int id)
        {
            return (_context.UipbkhMemoRunNos?.Any(e => e.Id == id)).GetValueOrDefault();
        }*/
    }
}
