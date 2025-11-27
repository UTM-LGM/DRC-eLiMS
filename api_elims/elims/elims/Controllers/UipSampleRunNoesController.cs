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

