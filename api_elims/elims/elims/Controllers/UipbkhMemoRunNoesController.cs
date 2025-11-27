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

    }
}
