using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DataKastam.DataKastam2023;

namespace DataKastam.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class K2HeaderController : Controller
    {
        private readonly DataKastam2023Context _context;

        public K2HeaderController(DataKastam2023Context context)
        {
            _context = context;
        }

        [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> getK2HeaderByCustomNo([FromRoute] string customRegistrationNo)
        {
            var k2Headers = await _context.K2Headers.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
                customNo = x.CustomRegistrationNo,
                supplierName = x.ExporterName,
                exporterAddress = x.ExporterAddress,
                importerName = x.ImporterName,
                importerAddress = x.ImporterAddress,
                exportedDate = x.DateOfExport,
                lorryNo = x.VehicleLorryNo,
                trailerNo = x.TrailerNo,
                finalDestination = x.FinalDestination,
                fob = x.Fob,
                ItemDescription = _context.K2Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ItemDescription).ToList(),
                TariffCode = _context.K2Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCode).ToList(),
                CountryOfRegion = _context.K2Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.CountryOfOrigin).ToList(),
                QuantityStatistics = _context.K2Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.QuantityStatistics).ToList(),
                TariffCodeNew = _context.K2Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCodeNew).ToList(),
            }).FirstOrDefaultAsync();

            return Ok(k2Headers);
        }

    }
}
