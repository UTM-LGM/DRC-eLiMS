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
    public class TypeCodesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public TypeCodesController(ElimsContext context)
        {
            _context = context;
        }


        // GET: api/RefSampleTypes/5
        [HttpGet("{rubberTypeId}")]
        public async Task<IActionResult> GetRefSampleTypeByRubberType([FromRoute] int rubberTypeId)
        {
            if (_context.TypeCodes == null)
            {
                return NotFound();
            }
            var typeCodes = await _context.TypeCodes.Where(x => x.RubberTypeId == rubberTypeId).ToListAsync();

            if (typeCodes == null)
            {
                return NotFound();
            }

            return Ok(typeCodes);
        }

        // GET: api/RefSampleTypes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOldSystemIdbyId([FromRoute] int id)
        {
            if (_context.TypeCodes == null)
            {
                return NotFound();
            }
            var typeCodes = await _context.TypeCodes.Where(x => x.Id == id).FirstOrDefaultAsync();

            if (typeCodes == null)
            {
                return NotFound();
            }

            return Ok(typeCodes);
        }

    }
}
