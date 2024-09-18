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
    public class RefSampleTypesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public RefSampleTypesController(ElimsContext context)
        {
            _context = context;
        }


        // GET: api/RefSampleTypes/5
        [HttpGet("{rubberTypeId}")]
        public async Task<IActionResult> GetRefSampleTypeByRubberType([FromRoute]int rubberTypeId)
        {
            if (_context.RefSampleTypes == null)
            {
                return NotFound();
            }
            var refSampleType = await _context.RefSampleTypes.Where( x => x.RubberTypeId== rubberTypeId ).ToListAsync();

            if (refSampleType == null)
            {
                return NotFound();
            }

            return Ok(refSampleType);
        }


    }
}
