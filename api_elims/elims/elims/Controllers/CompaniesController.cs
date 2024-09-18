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
    public class CompaniesController : Controller
    {
        private readonly ElimsContext _context;

        public CompaniesController(ElimsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var Companies = await _context.Companies.Select(x => new
            {
                companyId = x.CompanyId,
                name = x.Name,
                address = x.Address,
                postcode = x.Postcode,
                tel = x.Tel,
                email = x.Email,
                fax = x.Fax,
                contactPerson = x.ContactPerson,
                code = x.Code,
                username = x.Username,
                password = x.Password,
                smkImportersCode = x.SmkimportersCode,
                isNorthen = x.IsNorthen,
                LicenseNo=x.LicenseNo

            }).ToListAsync();

            return Ok(Companies);
        }

        [HttpGet("{forwarderId}")]
        public async Task<IActionResult> GetCompanies([FromRoute] int forwarderId)
        {
            var companies = await _context.CompanyForwarders.Where(x => x.ForwarderId == forwarderId).Select(x => new
            {
                companyId = x.CompanyId,
                forwarderId = x.ForwarderId,
                importerName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                importerAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                code = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Code).FirstOrDefault(),
                smkImportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                LicenseNo  = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.LicenseNo).FirstOrDefault(),

            }).ToListAsync();

            return Ok(companies);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyId([FromRoute] int id)
        {
            var Company = await _context.Companies.Where(x => x.CompanyId == id).Select(x => new
            {
                companyId = x.CompanyId,
                name = x.Name,
                address = x.Address,
                postcode = x.Postcode,
                tel = x.Tel,
                email = x.Email,
                fax = x.Fax,
                contactPerson = x.ContactPerson,
                isNorthen = x.IsNorthen,
                code = x.Code,
                licenseNo = x.LicenseNo,

            }).FirstOrDefaultAsync();

            return Ok(Company);

        }


        [HttpPut("{companyId}")]

        public async Task<IActionResult> PutCompanyProfile([FromRoute] int companyId, [FromBody] Company updateProfileRequest)
        {
            var company = await _context.Companies.Where(x => x.CompanyId == companyId).FirstOrDefaultAsync();

            if (company == null)
            {
                return NotFound();
            }

            company.Name = updateProfileRequest.Name;
            company.Address = updateProfileRequest.Address;
            company.Postcode = updateProfileRequest.Postcode;
            company.Tel = updateProfileRequest.Tel;
            company.Email = updateProfileRequest.Email;
            company.Fax = updateProfileRequest.Fax;
            company.ContactPerson = updateProfileRequest.ContactPerson;
            company.SmkimportersCode = updateProfileRequest.SmkimportersCode;
            company.LicenseNo = updateProfileRequest.LicenseNo;
            await _context.SaveChangesAsync();

            return Ok(company);

        }


        [HttpGet("{code}")]
        public async Task<IActionResult> GetCompaniesbySMKImportersCode([FromRoute] string code)
        {
            var companies = await _context.CompanyForwarders
               .Where(x => _context.Forwarders.Any(y => y.ForwarderId == x.ForwarderId && y.Code.Contains(code)))
                .Select(x => new
                {
                    companyId = x.CompanyId,
                    forwarderId = x.ForwarderId,
                    importerName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                    importerAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                    code = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Code).FirstOrDefault(),
                    smkimportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                    licenseNo = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.LicenseNo).FirstOrDefault(),
                })
                .ToListAsync();

            return Ok(companies);
        }


        [HttpGet("{smkimportercode}")]
        public async Task<IActionResult> GetForwardersbySMKImportersCode([FromRoute] string smkImporterCode)
        {
            var forwarders = await _context.CompanyForwarders
               .Where(x => _context.Companies.Any(y => y.CompanyId == x.CompanyId && y.SmkimportersCode == smkImporterCode))
                .Select(x => new
                {
                    companyId = x.CompanyId,
                    forwarderId = x.ForwarderId,
                    importerName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                    importerAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                    code = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Code).FirstOrDefault(),
                    smkimportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                    licenseNo = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.LicenseNo).FirstOrDefault(),
                })
                .ToListAsync();

            return Ok(forwarders);
        }

    }




    /* [HttpGet("{smkimportersCode}")]
     public async Task<IActionResult> GetCompaniesbySMKImportersCode([FromRoute] string smkimportersCode)
     {
         var companies = await _context.CompanyForwarders
            .Where(x => _context.Companies.Any(y => y.CompanyId == x.CompanyId && y.SmkimportersCode == smkimportersCode))
             .Select(x => new
             {
                 companyId = x.CompanyId,
                 forwarderId = x.ForwarderId,
                 importerName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                 importerAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                 code = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Code).FirstOrDefault(),
                 smkimportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
             })
             .ToListAsync();

         return Ok(companies);
     }*/



    /*        [HttpGet("{codes}")]
            public async Task<IActionResult> GetCompaniesbySMKImportersCode([FromRoute] string codes)
            {
                // Split the input string of codes into an array of individual codes
                var codeArray = codes.Split(',');

                var companies = await _context.CompanyForwarders
                    .Where(x => _context.Forwarders.Any(y => y.ForwarderId == x.ForwarderId && codeArray.Contains(y.Code)))
                    .Select(x => new
                    {
                        companyId = x.CompanyId,
                        forwarderId = x.ForwarderId,
                        importerName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                        importerAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                        code = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Code).FirstOrDefault(),
                        smkimportersCode = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.SmkimportersCode).FirstOrDefault(),
                        licenseNo = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.LicenseNo).FirstOrDefault(),
                    })
                    .ToListAsync();

                return Ok(companies);
            }*/



}