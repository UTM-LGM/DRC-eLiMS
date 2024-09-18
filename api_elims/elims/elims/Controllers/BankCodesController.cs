using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using elims.elims;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BankCodesController : Controller
    {
        private readonly ElimsContext _context;

        public BankCodesController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBankCodes()
        {
            var BankCodes = await _context.BankCodes.Select(x => new
            {
                bankCode = x.BankCode1,
                bankName = x.BankName,

            }).ToListAsync();

            return Ok(BankCodes);
        }

    }
}
