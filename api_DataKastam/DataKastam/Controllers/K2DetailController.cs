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
    public class K2DetailController : Controller
    {
        private readonly DataKastam2023Context _context;

        public K2DetailController(DataKastam2023Context context)
        {
            _context = context;
        }

        [HttpGet("{customRegistrationNo}")]

        public async Task<IActionResult> getK2Detail([FromRoute] string customRegistrationNo)
        {
            var DataKastam2023Context = await _context.K2Details.Where(x => x.CustomRegistrationNo == customRegistrationNo).Select(x => new
            {
                id = x.K2DetailId,
                itemDescription = x.ItemDescription,
                quantityStatistics = x.QuantityStatistics,
                tariffCodeNew = x.TariffCodeNew,
                countryOfOrigin = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,
/*                cif = x.Cif,
                fob = x.Fob,*/
                agentCode = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                agentName = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
                //importerCode = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.ImporterCode).FirstOrDefault(),
            }).ToListAsync();
            return Ok(DataKastam2023Context);
        }


     /*   [HttpGet("{customRegistrationNo}")]

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
        }*/


     


        [HttpGet("{customRegistrationNo}/{agentCode}")]
        public async Task<IActionResult> getK2Detail([FromRoute] string customRegistrationNo, [FromRoute] string agentCode)
        {
            var DataKastam2023Context = await _context.K2Details
                .Where(x => x.CustomRegistrationNo == customRegistrationNo)
                .Select(x => new
                {
                    id = x.K2DetailId,
                    itemDescription = x.ItemDescription,
                    quantityStatistics = x.QuantityStatistics,
                    tariffCodeNew = x.TariffCodeNew,
                    countryOfOrigin = x.CountryOfOrigin,
                    customNo = x.CustomRegistrationNo,
                    registrationSeqNo = x.RegistrationSeqNo,
                 /*   cif = x.Cif,
                    fob = x.Fob,*/
                    agentCode = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),
                    agentName = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentName).FirstOrDefault(),
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



        [HttpGet("{id}")]
        public async Task<IActionResult> getK2Detail1([FromRoute] int id)
        {
            var k2Details = await _context.K2Details.Where(x => x.K2DetailId == id).Select(x => new
            {
                id = x.K2DetailId,
                itemDescription = x.ItemDescription,
                quantity = x.QuantityStatistics,
                hsCode = x.TariffCodeNew,
                country = x.CountryOfOrigin,
                customNo = x.CustomRegistrationNo,
                registrationSeqNo = x.RegistrationSeqNo,
                agentCode = _context.K2Headers.Where(y => y.CustomRegistrationNo == x.CustomRegistrationNo).Select(y => y.AgentCode).FirstOrDefault(),

            }).FirstOrDefaultAsync();



            return Ok(k2Details);
        }

       

    }
}
