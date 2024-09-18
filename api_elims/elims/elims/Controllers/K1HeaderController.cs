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
    public class K1HeaderController : Controller
    {
        private readonly ElimsContext _context;

        public K1HeaderController(ElimsContext context)
        {
            _context = context;

        }


        [HttpGet]
        public async Task<IActionResult> GetAllSamples()
        {
            var ElimsContext = await _context.K1Headers.Select(x => new
            {
                k1HeaderId = x.K1HeaderId,
                customNo = x.CustomNo,
                importedDate = x.ImportedDate,
                transport = x.Transport,
                lorryNo = x.LorryNo,
                trailerNo = x.TrailerNo,
                supplierName = x.SupplierName,
                exporterAddress = x.ExporterAddress,
                driverName = x.DriverName,
                idDriver = x.IcDriver,
                isSMK = x.IsSmk,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),

            }).ToListAsync();
            return Ok(ElimsContext);
        }

        [HttpPost]
        public async Task<IActionResult> PostK1HeaderSample([FromBody] K1Header k1Header)
        {
           // if (await existCustomNo(k1Header.CustomNo)) return BadRequest("Custom number existed");
           if (await existCustomNo(k1Header.CustomNo))
            {
                var sample = await _context.K1Headers.Where(x => x.CustomNo == k1Header.CustomNo).FirstOrDefaultAsync();
                sample.SupplierName = k1Header.SupplierName;
                sample.ImportedDate = k1Header.ImportedDate;
                sample.Transport = k1Header.Transport;
                sample.LorryNo = k1Header.LorryNo;
                sample.TrailerNo = k1Header.TrailerNo;
                sample.DriverName = k1Header.DriverName;
                sample.IcDriver = k1Header.IcDriver;
                sample.ExporterAddress = k1Header.ExporterAddress;
                await _context.SaveChangesAsync();

                return Ok(sample);
            }
            else
            {
                _context.K1Headers.Add(k1Header); 
                await _context.SaveChangesAsync();
            }
            
          

            return Ok(k1Header);
        }


        [HttpGet("{customNo}")]
        public async Task<IActionResult> GetK1HeaderByCustomNo([FromRoute] string customNo)
        {
            var k1Headers = await _context.K1Headers.Where(x => x.CustomNo == customNo).Select(x => new
            {
                k1HeaderId = x.K1HeaderId,
                customNo = x.CustomNo,
                importedDate = x.ImportedDate,
                transport = x.Transport,
                lorryNo = x.LorryNo,
                trailerNo = x.TrailerNo,
                supplierName = x.SupplierName,
                exporterAddress = x.ExporterAddress,
                driverName = x.DriverName,
                icDriver = x.IcDriver,

            }).FirstOrDefaultAsync();

            return Ok(k1Headers);
        }


        [HttpPut]
        public async Task<IActionResult> PutK1HeaderSample([FromBody] K1Header updateSampleRequest)
        {
            var sample = await _context.K1Headers.Where(x => x.K1HeaderId == updateSampleRequest.K1HeaderId).FirstOrDefaultAsync();

            if (sample == null)
            {
                return NotFound();
            }

            sample.CustomNo = updateSampleRequest.CustomNo;
            sample.SupplierName = updateSampleRequest.SupplierName;
            sample.ImportedDate = updateSampleRequest.ImportedDate;
            sample.Transport = updateSampleRequest.Transport;
            sample.LorryNo = updateSampleRequest.LorryNo;
            sample.TrailerNo = updateSampleRequest.TrailerNo;
            sample.DriverName = updateSampleRequest.DriverName;
            sample.IcDriver = updateSampleRequest.IcDriver;
            sample.K1HeaderId=updateSampleRequest.K1HeaderId;
            sample.ExporterAddress= updateSampleRequest.ExporterAddress;
            sample.IsSmk=updateSampleRequest.IsSmk;
            sample.CompanyId=updateSampleRequest.CompanyId;

            await _context.SaveChangesAsync();

            return Ok(sample);
        }

        private async Task<bool> existCustomNo(string customNo)
        {
            return await _context.K1Headers.AnyAsync(x => x.CustomNo.ToLower().Trim() == customNo.ToLower().Trim());
        }


    }
}
