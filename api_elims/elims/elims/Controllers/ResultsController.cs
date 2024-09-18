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
    public class ResultsController : ControllerBase
    {
        private readonly ElimsContext _context;

        public ResultsController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/Results
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Result>>> GetResults()
        {
          if (_context.Results == null)
          {
              return NotFound();
          }
            return await _context.Results.ToListAsync();
        }


        [HttpGet("{k1DetailId}")]
        public async Task<IActionResult> GetResultbySampleId(int k1DetailId)
        {
            var results = await _context.Results.Where(x => x.K1DetailId == k1DetailId).Select(x => new
            {

                labRefNo = _context.K1Details.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.LabRefNo).FirstOrDefault(),
                id = x.Id,
                k1DetailId = x.K1DetailId,
                testMethod = x.TestMethod,
                wet1 = x.Wet1,
                wet2 = x.Wet2,
                dry1 = x.Dry1,
                dry2 = x.Dry2,
                result1 = x.Result1,
                catatan = x.Catatan,
                verifiedOn = x.VerifiedOn,
                verifiedBy = x.VerifiedBy,
                repeat = x.Repeat,
                decisionOn = x.DecisionOn,
                decisionBy = x.DecisionBy,
                decision = x.Decision,
                prove = x.Prove,


            }).FirstOrDefaultAsync();

            return Ok(results);

        }


        [HttpGet("{customNo}")]
        public async Task<IActionResult> GetResultbyCustomNo(int customNo)
        {
            var results = await _context.Results.Where(x => x.K1DetailId == customNo).Select(x => new
            {

                labRefNo = _context.K1Details.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.LabRefNo).FirstOrDefault(),
                id = x.Id,
                k1DetailId = x.K1DetailId,
                testMethod = x.TestMethod,
                wet1 = x.Wet1,
                wet2 = x.Wet2,
                dry1 = x.Dry1,
                dry2 = x.Dry2,
                result1 = x.Result1,
                catatan = x.Catatan,
                verifiedOn = x.VerifiedOn,
                verifiedBy = x.VerifiedBy,
                repeat = x.Repeat,
                decisionOn = x.DecisionOn,
                decisionBy = x.DecisionBy,
                decision = x.Decision,
                prove = x.Prove,


            }).FirstOrDefaultAsync();

            return Ok(results);

        }


        [HttpPost("{k1DetailId}")]
        public async Task<IActionResult> UploadProve([FromRoute] int k1DetailId, IFormFile file)
        {
            var details = await _context.Results.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No batch");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{k1DetailId}_{details.Prove}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\prove", fileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    return Ok();
                }

                return BadRequest("No file was provided.");
            }


        }

        /* [HttpGet("{customNo}")]
         public async Task<IActionResult> GetResultSamplebyCustomNo(string customNo)
         {
             var results = await _context.Results.Where(x => x.CustomNo == customNo).Select(x => new
             {

                 labRefNo = _context.K1Details.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.LabRefNo).FirstOrDefault(),
                 id = x.Id,
                 k1DetailId = x.K1DetailId,
                 testMethod = x.TestMethod,
                 wet1 = x.Wet1,
                 wet2 = x.Wet2,
                 dry1 = x.Dry1,
                 dry2 = x.Dry2,
                 result1 = x.Result1,
                 catatan = x.Catatan,
                 verifiedOn = x.VerifiedOn,
                 verifiedBy = x.VerifiedBy,
                 repeat = x.Repeat,
                 decisionOn = x.DecisionOn,
                 decisionBy = x.DecisionBy,
                 decision = x.Decision,

             }).ToListAsync();

             return Ok(results);


         }
 */












        // GET: api/Results/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Result>> GetResult(int id)
        {
          if (_context.Results == null)
          {
              return NotFound();
          }
            var result = await _context.Results.FindAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        // PUT: api/Results/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResult(int id, Result result)
        {
            if (id != result.Id)
            {
                return BadRequest();
            }

            _context.Entry(result).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResultExists(id))
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



        [HttpPut("{k1DetailId}")]
        public async Task<IActionResult> PutResultbyK1DetailId( [FromRoute] int k1DetailId, [FromBody] Result updateResultRequest)
        {
            var result = await _context.Results.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();

            if (result == null)
            {
                return NotFound();
            }


            result.K1DetailId = updateResultRequest.K1DetailId;
            result.TestMethod = updateResultRequest.TestMethod;
            result.Wet1 = updateResultRequest.Wet1;
            result.Wet2 = updateResultRequest.Wet2;
            result.Dry1 = updateResultRequest.Dry1;
            result.Dry2 = updateResultRequest.Dry2;
            result.Result1 = updateResultRequest.Result1;
            result.Catatan = updateResultRequest.Catatan;
            result.VerifiedOn = updateResultRequest.VerifiedOn;
            result.VerifiedOn = DateTime.Now;
            result.VerifiedBy = updateResultRequest.VerifiedBy;
            result.Repeat = updateResultRequest.Repeat;
            result.DecisionOn = updateResultRequest.DecisionOn;
            result.DecisionBy = updateResultRequest.DecisionBy;
            result.Decision = updateResultRequest.Decision;

            await _context.SaveChangesAsync();

            return Ok(result);
        }


        [HttpPut("{k1DetailId}")]
        public async Task<IActionResult> ResetResult([FromRoute] int k1DetailId)
        {
            // Find the result by K1DetailId
            var result = await _context.Results.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();

            // If the result is not found, return a NotFound response
            if (result == null)
            {
                return NotFound();
            }

            // Reset Wet1 and Wet2 values
            result.Wet1 = null; // or null, depending on your requirements
            result.Wet2 = null; // or null, depending on your requirements
            result.Dry1 = null;
            result.Dry2 = null;
            result.Result1 = null;
            result.VerifiedOn = null;
            result.VerifiedBy = null;

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return the updated result
            return Ok(result);
        }



        // POST: api/Results
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpPost]
        public async Task<ActionResult<Result>> PostResult(Result result)
        {
            if (_context.Results == null)
            {
                return Problem("Entity set 'ElimsContext.Results' is null.");
            }


            var existingResult = await _context.Results.Where(x => x.K1DetailId == result.K1DetailId).FirstOrDefaultAsync();

            if (existingResult == null)
            {

                _context.Results.Add(result);
            }
            else
            {
                // If the result with the same K1DetailId exists, update it
                /*_context.Entry(existingResult).CurrentValues.SetValues(result);*/
                existingResult.Catatan = result.Catatan;
                existingResult.Dry1 = result.Dry1;
                existingResult.Dry2 = result.Dry2;
                existingResult.K1DetailId = result.K1DetailId;
                existingResult.Prove = result.Prove;
                existingResult.Result1 = result.Result1;
                existingResult.TestMethod = result.TestMethod;
                existingResult.Wet1 = result.Wet1;
                existingResult.Wet2 = result.Wet2;

            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetResult", new { id = result.Id }, result);
        }



        /*    [HttpPost]
            public async Task<ActionResult<Result>> PostResult(Result result)
            {
                if (_context.Results == null)
                {
                    return Problem("Entity set 'ElimsContext.Results'  is null.");
                }
                _context.Results.Add(result);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetResult", new { id = result.Id }, result);
            }*/



        // DELETE: api/Results/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResult(int id)
        {
            if (_context.Results == null)
            {
                return NotFound();
            }
            var result = await _context.Results.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            _context.Results.Remove(result);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ResultExists(int id)
        {
            return (_context.Results?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
