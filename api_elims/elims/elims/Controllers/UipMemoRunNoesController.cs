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
    public class UipMemoRunNoesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public UipMemoRunNoesController(ElimsContext context)
        {
            _context = context;
        }


        [HttpPut("{year}")]
        public async Task<IActionResult> PutUipMemoRunNo([FromRoute] string year)
        {
            var runData = await _context.UipMemoRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
            if (runData == null)
            {
                UipMemoRunNo newRunNo = new UipMemoRunNo
                {
                    RunNo = 1,
                    Year = year,
                }; _context.UipMemoRunNos.Add(newRunNo); await _context.SaveChangesAsync();
                runData = await _context.UipMemoRunNos.Where(x => x.Year == year).FirstOrDefaultAsync();
            }
            else
            {
                runData.RunNo++;
                await _context.SaveChangesAsync();

            }
            return Ok(runData);

        }





      /*  // GET: api/UipMemoRunNoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UipMemoRunNo>>> GetUipMemoRunNos()
        {
          if (_context.UipMemoRunNos == null)
          {
              return NotFound();
          }
            return await _context.UipMemoRunNos.ToListAsync();
        }

        // GET: api/UipMemoRunNoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UipMemoRunNo>> GetUipMemoRunNo(int id)
        {
          if (_context.UipMemoRunNos == null)
          {
              return NotFound();
          }
            var uipMemoRunNo = await _context.UipMemoRunNos.FindAsync(id);

            if (uipMemoRunNo == null)
            {
                return NotFound();
            }

            return uipMemoRunNo;
        }

        // PUT: api/UipMemoRunNoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        *//*[HttpPut("{id}")]
        public async Task<IActionResult> PutUipMemoRunNo(int id, UipMemoRunNo uipMemoRunNo)
        {
            if (id != uipMemoRunNo.Id)
            {
                return BadRequest();
            }

            _context.Entry(uipMemoRunNo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UipMemoRunNoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*//*

        // POST: api/UipMemoRunNoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UipMemoRunNo>> PostUipMemoRunNo(UipMemoRunNo uipMemoRunNo)
        {
          if (_context.UipMemoRunNos == null)
          {
              return Problem("Entity set 'ElimsContext.UipMemoRunNos'  is null.");
          }
            _context.UipMemoRunNos.Add(uipMemoRunNo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUipMemoRunNo", new { id = uipMemoRunNo.Id }, uipMemoRunNo);
        }

        // DELETE: api/UipMemoRunNoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUipMemoRunNo(int id)
        {
            if (_context.UipMemoRunNos == null)
            {
                return NotFound();
            }
            var uipMemoRunNo = await _context.UipMemoRunNos.FindAsync(id);
            if (uipMemoRunNo == null)
            {
                return NotFound();
            }

            _context.UipMemoRunNos.Remove(uipMemoRunNo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UipMemoRunNoExists(int id)
        {
            return (_context.UipMemoRunNos?.Any(e => e.Id == id)).GetValueOrDefault();
        }*/
    }
}
