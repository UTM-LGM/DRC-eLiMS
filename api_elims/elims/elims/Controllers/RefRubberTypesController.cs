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
    public class RefRubberTypesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefRubberTypesController(ElimsContext context)
        {
            _context = context;
        }


        // GET: api/RefRubberTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefRubberType>>> GetRefRubberTypes()
        {
          if (_context.RefRubberTypes == null)
          {
              return NotFound();
          }
            return await _context.RefRubberTypes.ToListAsync();
        }

    }
}
