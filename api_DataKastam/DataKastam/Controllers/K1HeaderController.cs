using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DataKastam.DataKastam2023;

namespace DataKastam2023.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class K1HeaderController : Controller
    {
        private readonly DataKastam2023Context _context;

        public K1HeaderController(DataKastam2023Context context)
        {
            _context = context;
        }

        [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> getdataByCustomNo([FromRoute] string customRegistrationNo)
        {
            var k1Headers = await _context.K1Headers.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
                customNo = x.CustomRegistrationNo,
                supplierName = x.ExporterName,
                exporterAddress = x.ExporterAddress,
                importerName = x.ImporterName,
                importerAddress = x.ImporterAddress,
                importedDate = x.DateOfImport,
                lorryNo = x.VehicleLorryNo,
                trailerNo = x.TrailerNo,
                grossWeight = x.GrossWeight,
                importerCode = x.ImporterCode,
                agentCode =  x.AgentCode,
                agentName = x.AgentName,
                /*ItemDescription = _context.K1Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ItemDescription).ToList(),
                TariffCode = _context.K1Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCode).ToList(),
                CountryOfRegion = _context.K1Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.CountryOfOrigin).ToList(),
                QuantityStatistics = _context.K1Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.QuantityStatistics).ToList(),
                TariffCodeNew = _context.K1Details.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.TariffCodeNew).ToList(),*/
            }).FirstOrDefaultAsync();

            return Ok(k1Headers);
        }



            [HttpGet("{customRegistrationNo}/{agentCode}")]
            public async Task<IActionResult> getDataByCustomNoAndAgentCode([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
            {
                var k1Headers = await _context.K1Headers
                    .Where(x => x.CustomRegistrationNo == customRegistrationNo && x.AgentCode == agentCode)
                    .Select(x => new
                    {
                        customNo = x.CustomRegistrationNo,
                        supplierName = x.ExporterName,
                        exporterAddress = x.ExporterAddress,
                        importerName = x.ImporterName,
                        importerAddress = x.ImporterAddress,
                        importedDate = x.DateOfImport,
                        lorryNo = x.VehicleLorryNo,
                        trailerNo = x.TrailerNo,
                        grossWeight = x.GrossWeight,
                        importerCode = x.ImporterCode,
                        agentCode = x.AgentCode,
                        agentName = x.AgentName,
                    })
                    .FirstOrDefaultAsync();

                if (k1Headers == null)
                {
                    return NotFound();
                }

                return Ok(k1Headers);
            }

        [HttpGet("{importerName}")]
        public async Task<IActionResult> getDataByImporterName([FromRoute] string importerName)
        {
            var k1Headers = await _context.K1Headers
                 .Where(x => EF.Functions.Like(x.ImporterName, $"%{importerName}%"))
                .GroupBy(x => x.ImporterCode)
                .OrderBy(x => x.Key)
                .Select(x => x.Key)
                .ToListAsync();

            if (k1Headers == null || !k1Headers.Any())
            {
                return NotFound();
            }

            return Ok(k1Headers);
        }

        [HttpGet("{importerCode}")]
        public async Task<IActionResult> getDataByImporterCode([FromRoute] string importerCode)
        {
            var k1Headers = await _context.K1Headers
                .Where(x => x.ImporterCode == importerCode)
                .Select(x => new
                {
                    customNo = x.CustomRegistrationNo,
                    supplierName = x.ExporterName,
                    exporterAddress = x.ExporterAddress,
                    importerName = x.ImporterName,
                    importerAddress = x.ImporterAddress,
                    importedDate = x.DateOfImport,
                    lorryNo = x.VehicleLorryNo,
                    trailerNo = x.TrailerNo,
                    grossWeight = x.GrossWeight,
                    importerCode = x.ImporterCode,
                    agentCode = x.AgentCode,
                    agentName = x.AgentName,
                })
                .FirstOrDefaultAsync();

           /* if (k1Headers == null)
            {
                return null;
            }*/

            return Ok(k1Headers);
        }


    






        [HttpGet("{customRegistrationNo}/{importerCode}")]
        public async Task<IActionResult> getDataByCustomNoByImporterCode([FromRoute] string customRegistrationNo, [FromRoute] string importerCode)
        {
            var k1Headers = await _context.K1Headers
                .Where(x => x.CustomRegistrationNo == customRegistrationNo && x.ImporterCode == importerCode)
                .Select(x => new
                {
                    customNo = x.CustomRegistrationNo,
                    supplierName = x.ExporterName,
                    exporterAddress = x.ExporterAddress,
                    importerName = x.ImporterName,
                    importerAddress = x.ImporterAddress,
                    importedDate = x.DateOfImport,
                    lorryNo = x.VehicleLorryNo,
                    trailerNo = x.TrailerNo,
                    grossWeight = x.GrossWeight,
                    importerCode = x.ImporterCode,
                    agentCode = x.AgentCode,
                    agentName = x.AgentName,

                })
                .FirstOrDefaultAsync();

            if (k1Headers == null)
            {
                return NotFound();
            }

            return Ok(k1Headers);
        }

        [HttpGet("{customRegistrationNo}")]
        public async Task<IActionResult> GetDataByCustomNoAndImporterCodeArray(
    [FromRoute] string customRegistrationNo,
    [FromQuery] List<string> importerCodeArray)
        {
            var k1Headers = await _context.K1Headers
                .Where(x => x.CustomRegistrationNo == customRegistrationNo && importerCodeArray.Contains(x.ImporterCode))
                .Select(x => new
                {
                    customNo = x.CustomRegistrationNo,
                    supplierName = x.ExporterName,
                    exporterAddress = x.ExporterAddress,
                    importerName = x.ImporterName,
                    importerAddress = x.ImporterAddress,
                    importedDate = x.DateOfImport,
                    lorryNo = x.VehicleLorryNo,
                    trailerNo = x.TrailerNo,
                    grossWeight = x.GrossWeight,
                    importerCode = x.ImporterCode,
                    agentCode = x.AgentCode,
                    agentName = x.AgentName,
                })
                .FirstOrDefaultAsync();

            return Ok(k1Headers); // returns null or result as 200 OK
        }




    }





}
