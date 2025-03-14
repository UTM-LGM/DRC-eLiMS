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

    public class K1DetailController : Controller
    {
        private readonly DataKastam2023Context _context;

        public K1DetailController(DataKastam2023Context context)
        {
            _context = context;
        }

        [HttpGet("{customRegistrationNo}")]

        public async Task<IActionResult> getK1Detail([FromRoute] string customRegistrationNo)
        {
            var DataKastam2023Context = await _context.K1Details.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
                id = x.K1DetailId,
                itemDescription = x.ItemDescription,
                quantityStatistics = x.QuantityStatistics,
                tariffCodeNew = x.TariffCodeNew,
                countryOfOrigin = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,
                cif = x.Cif,
                fob = x.Fob,
                agentCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                agentName = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                importerCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode).FirstOrDefault(),

            }).ToListAsync();
            return Ok(DataKastam2023Context);
        }


        [HttpGet("{customRegistrationNo}/{agentCode}")]
        public async Task<IActionResult> getK1Detail([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
        {
            var DataKastam2023Context = await _context.K1Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.K1DetailId,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                    cif = x.Cif,
                    fob = x.Fob,
                    agentCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                    importerCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode).FirstOrDefault()
                })
                .ToListAsync();

            if (DataKastam2023Context.Count == 0)
            {
                return NotFound();
            } 
            else 
            if (DataKastam2023Context.Any() && DataKastam2023Context.First().agentCode == agentCode)
            {
                return Ok(DataKastam2023Context);
            }
             
            else
            {
                // Unauthorized response if the agent codes do not match
                return Unauthorized();
            }
        }



        [HttpGet("{customRegistrationNo}/{importerCode}")]
        public async Task<IActionResult> getK1DetailByImporterCode([FromRoute] string customRegistrationNo, [FromRoute] string importerCode)
        {
            var DataKastam2023Context = await _context.K1Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.K1DetailId,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                    cif = x.Cif,
                    fob = x.Fob,
                    agentCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                    importerCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode.Trim()).FirstOrDefault() // Trim the importerCode here
                })
                .ToListAsync();

            // Check if the provided agentCode matches the agentCode associated with the customNo
            if (DataKastam2023Context.Any() && DataKastam2023Context.First().importerCode == importerCode.Trim()) // Trim the importerCode here
            {
                return Ok(DataKastam2023Context);
            }
            else
            {
                // Unauthorized response if the agent codes do not match
                return Unauthorized();
            }
        }




        /*
                [HttpGet("{customRegistrationNo}/{agentCode}")]
                public async Task<IActionResult> getDataByCustomNoAndAgentCode([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
                {
                    var k1Headers = await _context.K1Headers
                        .Where(x => x.CustomRegistrationNo == customRegistrationNo && x.AgentCode == agentCode)
                        .Select(x => new
                        {
                            customNo = x.CustomRegistrationNo,
                            supplierName = x.ExporterName,
                            ExporterAddress = x.ExporterAddress,
                            importerName = x.ImporterName,
                            ImporterAddress = x.ImporterAddress,
                            importedDate = x.DateOfImport,
                            lorryNo = x.VehicleLorryNo,
                            trailerNo = x.TrailerNo,
                            grossWeight = x.GrossWeight,
                            ImporterCode = x.ImporterCode,
                            AgentCode = x.AgentCode,
                            AgentName = x.AgentName,
                        })
                        .FirstOrDefaultAsync();

                    if (k1Headers == null)
                    {
                        return NotFound();
                    }

                    return Ok(k1Headers);
                }
        */


        [HttpGet("{id}")]
        public async Task<IActionResult> getK1Detail1([FromRoute] int id)
        {
            var k1Details = await _context.K1Details.Where(x => x.K1DetailId == id).Select(x => new
            {
                id = x.K1DetailId,
                itemDescription = x.ItemDescription,
                quantity = x.QuantityStatistics,
                hsCode = x.TariffCodeNew,
                country = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,
                cif = x.Cif,
                fob = x.Fob,
                agentCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                importerCode = _context.K1Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode).FirstOrDefault()


            }).FirstOrDefaultAsync();



            return Ok(k1Details);
        }

    }
}
