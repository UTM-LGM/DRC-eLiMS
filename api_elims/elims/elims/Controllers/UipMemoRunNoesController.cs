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


    }
}
