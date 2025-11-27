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
    }
}
