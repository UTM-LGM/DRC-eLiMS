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

    }
}
