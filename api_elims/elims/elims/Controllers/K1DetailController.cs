using elims.DTOs;
using elims.elims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.ComponentModel.Design;
using System.Data;
using System.Diagnostics.Metrics;
using System.IO;
using System.Net.Mail;
using System.Reflection.PortableExecutable;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class K1DetailController : Controller
    {
        private readonly ElimsContext _context;
        private readonly IWebHostEnvironment _environment;
        private object countCreatedOn;
        private object countSentOn;
        private object countVerifiedOn;
        private object countReceivedOn;
        private object countInLabOn;
        private object countTestedOn;
        private object countApprovedOn;
        private object countResultSentOn;
        public K1DetailController(IWebHostEnvironment environment, ElimsContext context)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSamples()
        {
            var ElimsContext = await _context.K1Details.Select(x => new
            {
                k1DetailID = x.K1DetailId,
                k1HeaderID = x.K1HeaderId,
                batchId = x.BatchId,
                labRefNo = x.LabRefNo,
                customNo = x.CustomNo,
                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                statusCodeId = x.StatusCodeId,
                createdOn = x.CreatedOn,
                createdBy = x.CreatedBy,
                forwarderId = x.ForwarderId,
                samplePropose = x.SamplePropose,
                drc = x.Drc,
                dryWeight = x.DryWeight,
                country = x.Country,
                remarks = x.Remarks,
                evidence = x.Evidence,
                hsCode = x.HsCode,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
          /*      sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),*/

                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),

                /* sampleCode = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleCode).FirstOrDefault(),
                 sampleCategory = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleCategory).FirstOrDefault(),*/

                sampleCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCategory).FirstOrDefault(),

                itemDescription = x.ItemDescription,
                isSMK = x.IsSmk,
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                registrationSeqNo = x.RegistrationSeqNo,
                sampleRunNo = x.SampleRunNo,

                creatorRoleId = x.CreatorRoleId,
                dateSampleReceived = x.DateSampleReceived,

            }).ToListAsync();
            return Ok(ElimsContext);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllLateSamples(DateTime startDate, DateTime endDate)
        {
            // Fetch the relevant data from the database
            var lateSamples = await _context.K1Details
                .Join(_context.K1Headers,
                      detail => detail.K1HeaderId,
                      header => header.K1HeaderId,
                      (detail, header) => new { detail, header })
                .Where(x => x.header.ImportedDate >= startDate && x.header.ImportedDate <= endDate)
                .Select(x => new
                {
                    k1DetailID = x.detail.K1DetailId,
                    k1HeaderID = x.detail.K1HeaderId,
                    batchId = x.detail.BatchId,
                    labRefNo = x.detail.LabRefNo,
                    customNo = x.detail.CustomNo,
                    quantity = x.detail.Quantity,
                    companyId = x.detail.CompanyId,
                    companyName = _context.Companies
                        .Where(y => y.CompanyId == x.detail.CompanyId)
                        .Select(y => y.Name)
                        .FirstOrDefault(),
                    companyAddress = _context.Companies
                        .Where(y => y.CompanyId == x.detail.CompanyId)
                        .Select(y => y.Address)
                        .FirstOrDefault(),
                    statusCodeId = x.detail.StatusCodeId,
                    createdOn = x.detail.CreatedOn,
                    sentOn = x.detail.SentOn,
                    receivedOn = x.detail.ReceivedOn,
                    createdBy = x.detail.CreatedBy,
                    forwarderId = x.detail.ForwarderId,
                    samplePropose = x.detail.SamplePropose,
                    drc = x.detail.Drc,
                    dryWeight = x.detail.DryWeight,
                    country = x.detail.Country,
                    remarks = x.detail.Remarks,
                    evidence = x.detail.Evidence,
                    hsCode = x.detail.HsCode,
                    rubberTypeId = x.detail.RubberTypeId,
                    rubberType = _context.RefRubberTypes
                        .Where(y => y.Id == x.detail.RubberTypeId)
                        .Select(y => y.RubberType)
                        .FirstOrDefault(),
                    typeCodeId = x.detail.TypeCodeId,
                    typeCode = _context.TypeCodes
                        .Where(y => y.Id == x.detail.TypeCodeId)
                        .Select(y => y.SampleType)
                        .FirstOrDefault(),
                    sampleCode = _context.TypeCodes
                        .Where(y => y.Id == x.detail.TypeCodeId)
                        .Select(y => y.SampleCode)
                        .FirstOrDefault(),
                    sampleCategory = _context.TypeCodes
                        .Where(y => y.Id == x.detail.TypeCodeId)
                        .Select(y => y.SampleCategory)
                        .FirstOrDefault(),
                    itemDescription = x.detail.ItemDescription,
                    isSMK = x.detail.IsSmk,
                    importerName = x.detail.ImporterName,
                    agentName = x.detail.AgentName,
                    importerAddress = x.detail.ImporterAddress,
                    smkimporterCode = x.detail.SmkimportersCode,
                    registrationSeqNo = x.detail.RegistrationSeqNo,
                    sampleRunNo = x.detail.SampleRunNo,
                    creatorRoleId = x.detail.CreatorRoleId,
                    dateSampleReceived = x.detail.DateSampleReceived,
                    importedDate = x.header.ImportedDate,
                    status = _context.StatusCodes
                        .Where(y => y.StatusCodeId == x.detail.StatusCodeId)
                        .Select(y => y.Status)
                        .FirstOrDefault(),
                    // Calculate duration in days as null-safe
                    totalDaysFromImportToReceived = EF.Functions.DateDiffDay(x.header.ImportedDate, x.detail.ReceivedOn) + 1
                })
                .ToListAsync();

            // Filter late samples based on a 12-day threshold
            var filteredSamples = lateSamples
                .Where(sample => sample.receivedOn.HasValue &&
                                 sample.receivedOn > sample.importedDate &&
                                 sample.totalDaysFromImportToReceived > 12) // Filter samples exceeding 12 days
                .ToList();

            return Ok(filteredSamples);
        }









        [HttpPost]
        public async Task<IActionResult> PostK1DetailSample([FromBody] K1Detail k1Detail)
        {

            k1Detail.CreatedOn = DateTime.Now;

            _context.K1Details.Add(k1Detail);
            await _context.SaveChangesAsync();

            return Ok(k1Detail);
        }



        [HttpPost("{k1DetailId}")]
        public async Task<IActionResult> UploadFile([FromRoute] int k1DetailId, IFormFile file)
        {
            var details = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No K1Details");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{k1DetailId}_{details.Evidence}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\evidence", fileName);
                    // var filePath = Path.Combine(_environment.WebRootPath, @"wwwroot\evidence", fileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    return Ok();
                }

                return BadRequest("No file was provided.");
            }
        }


      

        [HttpGet]
        public async Task<IActionResult> GetElimsSamplesByUsername(int statusCodeId, string username)
        {
            var elimsContext = await _context.K1Details.Where(x => x.StatusCodeId == statusCodeId && x.CreatedBy == username).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                batchId = x.BatchId,
                customNo = x.CustomNo,
                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                registrationSeqNo = x.RegistrationSeqNo,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
/*                sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),
*/
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),

                isSMK = x.IsSmk,
                remarks = x.Remarks,
                evidence = x.Evidence,
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                Transport = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.Transport).FirstOrDefault(),
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                supplierName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.SupplierName).FirstOrDefault(),
                driverName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.DriverName).FirstOrDefault(),
                icDriver = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.IcDriver).FirstOrDefault(),
                sampleRunNo = x.SampleRunNo,
                labRefNo = x.LabRefNo,
                creatorRoleId = x.CreatorRoleId,
                forwarderId = x.ForwarderId,
                forwarderName = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                forwarderAddress = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).FirstOrDefault(),
                dateSampleReceived = x.DateSampleReceived,
                dateReceivedInLab = x.DateReceivedInLab,


            }).ToListAsync();
            return Ok(elimsContext);
        }





        [HttpPut("{k1DetailId}")]

        public async Task<IActionResult> PutK1DetailSample([FromRoute] int k1DetailId, [FromBody] K1Detail updateSampleRequest)
        {
            var sample = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();

            if (sample == null)
            {
                return NotFound();
            }

            sample.CustomNo = updateSampleRequest.CustomNo;
            sample.ItemDescription = updateSampleRequest.ItemDescription;
            sample.Remarks = updateSampleRequest.Remarks;
            sample.Evidence = updateSampleRequest.Evidence;
            sample.Drc = updateSampleRequest.Drc;
            sample.HsCode = updateSampleRequest.HsCode;
            sample.Quantity = updateSampleRequest.Quantity;
            sample.CompanyId = updateSampleRequest.CompanyId;
            sample.SamplePropose = updateSampleRequest.SamplePropose;
            sample.Country = updateSampleRequest.Country;
            sample.RubberTypeId = updateSampleRequest.RubberTypeId;
            sample.SampleTypeId = updateSampleRequest.SampleTypeId;
            sample.TypeCodeId = updateSampleRequest.TypeCodeId;
            sample.ImporterName = updateSampleRequest.ImporterName;
           


            await _context.SaveChangesAsync();

            return Ok(sample);

        }






        [HttpGet("{k1DetailId}")]
        public async Task<IActionResult> GetElimsSample(int k1DetailId)
        {
            var ElimsContext = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                batchId = x.BatchId,
                itemDescription = x.ItemDescription,
                customNo = x.CustomNo,
                labRefNo = x.LabRefNo,
                inLabOn = x.InLabOn,
                inLabBy = x.InLabBy,
                verifiedOn = x.VerifiedOn,
                verifiedBy = x.VerifiedBy,
                testedOn = x.TestedOn,
                testedBy = x.TestedBy,
                sentOn = x.SentOn,
                receivedOn = x.ReceivedOn,
                receivedBy = x.ReceivedBy,
                approvedBy = x.ApprovedBy,
                approvedOn = x.ApprovedOn,
                resultSentBy = x.ResultSentBy,
                resultSentOn = x.ResultSentOn,
                resultLetterApprovedBy = x.ResultLetterApprovedBy,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),
                quantity = x.Quantity,
                companyId = x.CompanyId,
                importerName = x.ImporterName,
                agentName = x.AgentName,
                smkimporterCode = x.SmkimportersCode,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                customOffice = _context.CustomOffices.Where(y => y.Id == (_context.Forwarders.Where(z => z.Id == x.ForwarderId).Select(z => z.Id).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),
                customAddress = _context.CustomOffices.Where(y => y.Id == (_context.Forwarders.Where(z => z.Id == x.ForwarderId).Select(z => z.Id).FirstOrDefault())).Select(y => y.Address).FirstOrDefault(),
                customPostcode = _context.CustomOffices.Where(y => y.Id == (_context.Forwarders.Where(z => z.Id == x.ForwarderId).Select(z => z.Id).FirstOrDefault())).Select(y => y.Postcode).FirstOrDefault(),
                forwarderPostcode = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Postcode).FirstOrDefault(),           
                forwarderId = x.ForwarderId,

                forwarderName = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                forwarderAddress = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).FirstOrDefault(),
                importerAddress = x.ImporterAddress,
                samplePropose = x.SamplePropose,
                drc = x.Drc,
                dryWeight = x.DryWeight,
                country = x.Country,
                remarks = x.Remarks,
                evidence = x.Evidence,
                hsCode = x.HsCode,
                isSMK = x.IsSmk,
                statusCodeId = x.StatusCodeId,
                status = _context.StatusCodes.Where(y => y.StatusCodeId == x.StatusCodeId).Select(y => y.Status).FirstOrDefault(),
                registrationSeqNo = x.RegistrationSeqNo,
                sampleRunNo = x.SampleRunNo,
                creatorRoleId = x.CreatorRoleId,
                dateSampleReceived = x.DateSampleReceived,
                worksheetTestOn = x.WorksheetTestOn,
                penimbang = x.Penimbang,
                oven = x.Oven,

                id = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.K1HeaderId).FirstOrDefault(),
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate.Value.Date).FirstOrDefault(),
                transport = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.Transport).FirstOrDefault(),
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                exporterAddress = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ExporterAddress).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                supplierName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.SupplierName).FirstOrDefault(),
                driverName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.DriverName).FirstOrDefault(),
                icDriver = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.IcDriver).FirstOrDefault(),
                bankName = _context.BankCodes.Where(y => y.BankCode1 == (_context.Batches.Where(z => z.BatchId == x.BatchId).Select(z => z.BankCode).FirstOrDefault())).Select(y => y.BankName).FirstOrDefault(),
                uipRegNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.UipRegNo).FirstOrDefault(),
                dateSampleDelivered = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.DateSampleDelivered).FirstOrDefault(),
                delivery = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Delivery).FirstOrDefault(),
                courierServices = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.CourierServices).FirstOrDefault(),
                trackingNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TrackingNo).FirstOrDefault(),
                chequeNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeNo).FirstOrDefault(),
                chequeAmount = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeAmount).FirstOrDefault(),
                date = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Date).FirstOrDefault(),
                transactionNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TransactionNo).FirstOrDefault(),
                receipt = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Receipt).FirstOrDefault(),
                isFastTrack = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.IsFastTrack).FirstOrDefault(),
                testMethodId = _context.RefTestMethods.Where(y => y.Id == (_context.Batches.Where(z => z.BatchId == x.BatchId).Select(z => z.TestMethodId).FirstOrDefault())).Select(y => y.Id).FirstOrDefault(),
                testMethod = _context.RefTestMethods.Where(y => y.Id == (_context.Batches.Where(z => z.BatchId == x.BatchId).Select(z => z.TestMethodId).FirstOrDefault())).Select(y => y.TestMethod).FirstOrDefault(),
                staffPosition = _context.Staffs.Where(s => s.StaffName == x.ResultLetterApprovedBy).Select(s => s.Position).FirstOrDefault(),
                IkmNo = _context.Staffs.Where(s => s.StaffName == x.ResultLetterApprovedBy).Select(s => s.Ikmno).FirstOrDefault(),
                result = _context.Results.Where(s => s.K1DetailId == x.K1DetailId).Select(s => s.Result1).FirstOrDefault(),
                staffName = _context.Staffs.Where(s => s.Username.Trim() == x.CreatedBy.Trim()).Select(s => s.StaffName).FirstOrDefault(),
                totalDaysFromImportToReceived = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => EF.Functions.DateDiffDay(y.ImportedDate, x.ReceivedOn) + 1).FirstOrDefault(),
                totalDaysFromSentToReceived = EF.Functions.DateDiffDay(x.SentOn, x.ReceivedOn) + 1,
                dateReceivedInLab = x.DateReceivedInLab,
                noLaporanTuan = x.NoLaporanTuan,


            }).FirstOrDefaultAsync();

            return Ok(ElimsContext);
        }


        [HttpGet]
        public async Task<IActionResult> GetSampleCountByStatusCode()
        {
            // Calculate sample count for StatusCodeId = 6
            var sampleCount4 = await _context.K1Details
                .Where(x => x.StatusCodeId == 4)
                .CountAsync();

            // Calculate sample count for StatusCodeId = 7 or 8
            var sampleCount5And6 = await _context.K1Details
                .Where(x => x.StatusCodeId == 5 || x.StatusCodeId == 6)
                .CountAsync();

            // Prepare the result
            var result = new
            {
                StatusCode4 = sampleCount4,
                StatusCode5And6 = sampleCount5And6
            };

            return Ok(result);
        }




        [HttpGet]
        public async Task<IActionResult> GetSampleCountDate(DateTime fromDate, DateTime toDate)
        {

            var createdOnSampleCounts = await _context.K1Details
                .Where(x => x.CreatedOn != null && x.CreatedOn >= fromDate && x.CreatedOn <= toDate)
                .CountAsync();


            var sentOnSampleCounts = await _context.K1Details
                .Where(x => x.SentOn != null && x.SentOn >= fromDate && x.SentOn <= toDate)
                .CountAsync();

            // Combine results
            var result = new
            {
                TotalCreatedOnCount = createdOnSampleCounts,
                TotalSentOnCount = sentOnSampleCounts
            };

            return Ok(result);
        }



        [HttpGet]
        public async Task<IActionResult> CountSamplesOry(DateTime? startDate, DateTime? endDate, int? rubberTypeId, int? typeCodeId)
        {
            try
            {
                IQueryable<K1Detail> query = _context.K1Details; // Base query without date filter

                // Apply date filter if start and end dates are provided
                if (startDate.HasValue && endDate.HasValue)
                {
                    // Adjust the end date to be inclusive by adding one day
                    endDate = endDate.Value.AddDays(1);

                    // Validate the date range
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }
                     countCreatedOn = await query.Where(s => s.CreatedOn != null && s.CreatedOn >= startDate && s.CreatedOn < endDate).CountAsync();
                     countSentOn = await query.Where(s => s.SentOn != null && s.SentOn >= startDate && s.SentOn < endDate).CountAsync();
                     countReceivedOn = await query.Where(s => s.ReceivedOn != null && s.ReceivedOn >= startDate && s.ReceivedOn < endDate).CountAsync();
                     countInLabOn = await query.Where(s => s.InLabOn != null && s.InLabOn >= startDate && s.InLabOn < endDate).CountAsync();
                     countTestedOn = await query.Where(s => s.TestedOn != null && s.TestedOn >= startDate && s.TestedOn < endDate).CountAsync();
                     countVerifiedOn = await query.Where(s => s.VerifiedOn != null && s.VerifiedOn >= startDate && s.VerifiedOn < endDate).CountAsync();
                     countApprovedOn = await query.Where(s => s.ApprovedOn != null && s.ApprovedOn >= startDate && s.ApprovedOn < endDate).CountAsync();

                    // Apply date filter to the query
                    //query = query.Where(s => s.CreatedOn >= startDate && s.CreatedOn < endDate);
                }

                // Apply rubber type filter if rubber type id is provided
                if (rubberTypeId.HasValue)
                {
                    query = query.Where(s => s.RubberTypeId == rubberTypeId);
                     countCreatedOn = await query.Where(s => s.CreatedOn != null).CountAsync();
                     countSentOn = await query.Where(s => s.SentOn != null).CountAsync();
                     countReceivedOn = await query.Where(s => s.ReceivedOn != null).CountAsync();
                     countInLabOn = await query.Where(s => s.InLabOn != null).CountAsync();
                     countTestedOn = await query.Where(s => s.TestedOn != null).CountAsync();
                     countVerifiedOn = await query.Where(s => s.VerifiedOn != null).CountAsync();
                     countApprovedOn = await query.Where(s => s.ApprovedOn != null).CountAsync();
                }

                // Apply type code filter if type code id is provided
                if (typeCodeId.HasValue)
                {
                    query = query.Where(s => s.TypeCodeId == typeCodeId);
                    countCreatedOn = await query.Where(s => s.CreatedOn != null).CountAsync();
                    countSentOn = await query.Where(s => s.SentOn != null).CountAsync();
                     countReceivedOn = await query.Where(s => s.ReceivedOn != null).CountAsync();
                     countInLabOn = await query.Where(s => s.InLabOn != null).CountAsync();
                     countTestedOn = await query.Where(s => s.TestedOn != null).CountAsync();
                     countVerifiedOn = await query.Where(s => s.VerifiedOn != null).CountAsync();
                     countApprovedOn = await query.Where(s => s.ApprovedOn != null).CountAsync();
                }

                // Count samples for each timestamp with applied date filter
             

                var counts = new
                {
                    CountCreatedOn = countCreatedOn,
                    CountSentOn = countSentOn,
                    CountVerifiedOn = countVerifiedOn,
                    CountReceivedOn = countReceivedOn,
                    CountInLabOn = countInLabOn,
                    CountTestedOn = countTestedOn,
                    CountApprovedOn = countApprovedOn
                };

                return Ok(counts);
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet]
        public async Task<IActionResult> CountSamples(DateTime? startDate, DateTime? endDate, int? rubberTypeId, int? typeCodeId)
        {
            try
            {
                IQueryable<K1Detail> baseQuery = _context.K1Details;

                // Apply date filter first
                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1); // Inclusive end date
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }

                    // Apply date filters separately for each date field
                    var createdOnQuery = baseQuery.Where(s => s.CreatedOn >= startDate && s.CreatedOn < endDate);
                    var sentOnQuery = baseQuery.Where(s => s.SentOn >= startDate && s.SentOn < endDate);
                    var receivedOnQuery = baseQuery.Where(s => s.ReceivedOn >= startDate && s.ReceivedOn < endDate);
                    var inLabOnQuery = baseQuery.Where(s => s.InLabOn >= startDate && s.InLabOn < endDate);
                    var testedOnQuery = baseQuery.Where(s => s.TestedOn >= startDate && s.TestedOn < endDate);
                    var verifiedOnQuery = baseQuery.Where(s => s.VerifiedOn >= startDate && s.VerifiedOn < endDate);
                    var approvedOnQuery = baseQuery.Where(s => s.ApprovedOn >= startDate && s.ApprovedOn < endDate);


                    // Apply rubber type filter
                    if (rubberTypeId.HasValue)
                    {
                        createdOnQuery = createdOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        sentOnQuery = sentOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        receivedOnQuery = receivedOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        inLabOnQuery = inLabOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        testedOnQuery = testedOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        verifiedOnQuery = verifiedOnQuery.Where(s => s.RubberTypeId == rubberTypeId);
                        approvedOnQuery = approvedOnQuery.Where(s => s.RubberTypeId == rubberTypeId);



                    }

                    // Apply type code filter
                    if (typeCodeId.HasValue)
                    {
                        createdOnQuery = createdOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        sentOnQuery = sentOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        receivedOnQuery = receivedOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        inLabOnQuery = inLabOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        testedOnQuery = testedOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        verifiedOnQuery = verifiedOnQuery.Where(s => s.TypeCodeId == typeCodeId);
                        approvedOnQuery = approvedOnQuery.Where(s => s.TypeCodeId == typeCodeId);

                    }

                    // Calculate counts for each date field
                    var counts = new
                    {
                        CountCreatedOn = await createdOnQuery.Where(s => s.CreatedOn != null).CountAsync(),
                        CountSentOn = await sentOnQuery.Where(s => s.SentOn != null).CountAsync(),
                        CountReceivedOn = await receivedOnQuery.Where(s => s.ReceivedOn != null).CountAsync(),
                        CountInLabOn = await inLabOnQuery.Where(s => s.InLabOn != null).CountAsync(),
                        CountTestedOn = await testedOnQuery.Where(s => s.TestedOn != null).CountAsync(),
                        CountVerifiedOn = await verifiedOnQuery.Where(s => s.VerifiedOn != null).CountAsync(),
                        CountApprovedOn = await approvedOnQuery.Where(s => s.ApprovedOn != null).CountAsync(),


                    /* CountReceivedOn = await baseQuery.Where(s => s.ReceivedOn >= startDate && s.ReceivedOn < endDate && s.ReceivedOn != null).CountAsync(),
                        CountInLabOn = await baseQuery.Where(s => s.InLabOn >= startDate && s.InLabOn < endDate && s.InLabOn != null).CountAsync(),
                        CountTestedOn = await baseQuery.Where(s => s.TestedOn >= startDate && s.TestedOn < endDate && s.TestedOn != null).CountAsync(),
                        CountVerifiedOn = await baseQuery.Where(s => s.VerifiedOn >= startDate && s.VerifiedOn < endDate && s.VerifiedOn != null).CountAsync(),
                        CountApprovedOn = await baseQuery.Where(s => s.ApprovedOn >= startDate && s.ApprovedOn < endDate && s.ApprovedOn != null).CountAsync()*/
                    };

                    return Ok(counts);
                }

                // If no date range is provided, just filter by rubberTypeId and typeCodeId
                if (rubberTypeId.HasValue)
                {
                    baseQuery = baseQuery.Where(s => s.RubberTypeId == rubberTypeId);
                }

                if (typeCodeId.HasValue)
                {
                    baseQuery = baseQuery.Where(s => s.TypeCodeId == typeCodeId);
                }

                var defaultCounts = new
                {
                    CountCreatedOn = await baseQuery.Where(s => s.CreatedOn != null).CountAsync(),
                    CountSentOn = await baseQuery.Where(s => s.SentOn != null).CountAsync(),
                    CountReceivedOn = await baseQuery.Where(s => s.ReceivedOn != null).CountAsync(),
                    CountInLabOn = await baseQuery.Where(s => s.InLabOn != null).CountAsync(),
                    CountTestedOn = await baseQuery.Where(s => s.TestedOn != null).CountAsync(),
                    CountVerifiedOn = await baseQuery.Where(s => s.VerifiedOn != null).CountAsync(),
                    CountApprovedOn = await baseQuery.Where(s => s.ApprovedOn != null).CountAsync()
                };

                return Ok(defaultCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        /*      [HttpGet]
              public async Task<IActionResult> CountSamplesByInLabOn(DateTime? startDate, DateTime? endDate, string tester = null)
              {
                  try
                  {
                      if (startDate.HasValue && endDate.HasValue)
                      {
                          // Adjust the end date to be inclusive by adding one day
                          endDate = endDate.Value.AddDays(1);

                          // Validate the date range
                          if (endDate < startDate)
                          {
                              return BadRequest("End date must be greater than or equal to start date.");
                          }
                      }

                      IQueryable<K1Detail> baseQuery = _context.K1Details;

                      // Apply date filter if start and end dates are provided
                      if (startDate.HasValue && endDate.HasValue)
                      {
                          baseQuery = baseQuery.Where(s =>
                              (s.ReceivedOn >= startDate && s.ReceivedOn < endDate) ||
                              (s.InLabOn >= startDate && s.InLabOn < endDate) ||
                              (s.TestedOn >= startDate && s.TestedOn < endDate) ||
                              (s.VerifiedOn >= startDate && s.VerifiedOn < endDate) ||
                              (s.ResultSentOn >= startDate && s.ResultSentOn < endDate) ||
                              (s.ApprovedOn >= startDate && s.ApprovedOn < endDate)
                          );
                      }

                     *//* // Apply name filter if provided
                      if (!string.IsNullOrEmpty(name))
                      {
                          baseQuery = baseQuery.Where(s =>
                              (string.IsNullOrEmpty(s.ReceivedBy) || (s.ReceivedBy.Contains(name) && s.ReceivedOn >= startDate && s.ReceivedOn < endDate)) &&
                              (string.IsNullOrEmpty(s.InLabBy) || (s.InLabBy.Contains(name) && s.InLabOn >= startDate && s.InLabOn < endDate)) &&
                              (string.IsNullOrEmpty(s.TestedBy) || (s.TestedBy.Contains(name) && s.TestedOn >= startDate && s.TestedOn < endDate)) &&
                              (string.IsNullOrEmpty(s.VerifiedBy) || (s.VerifiedBy.Contains(name) && s.VerifiedOn >= startDate && s.VerifiedOn < endDate)) &&
                              (string.IsNullOrEmpty(s.ResultSentBy) || (s.ResultSentBy.Contains(name) && s.ApprovedOn >= startDate && s.ApprovedOn < endDate))
                          );
                      }*//*

                      // Calculate counts based on the filtered query
                      var counts = new
                      {
                          CountReceivedOn = await baseQuery.CountAsync(s => s.ReceivedOn != null && s.ReceivedBy.Contains(tester)),
                          CountInLabOn = await baseQuery.CountAsync(s => s.InLabOn != null && s.InLabBy.Contains(tester)),
                          CountTestedOn = await baseQuery.CountAsync(s => s.TestedOn != null && s.TestedBy.Contains(tester)),
                          CountVerifiedOn = await baseQuery.CountAsync(s => s.VerifiedOn != null && s.VerifiedBy.Contains(tester)),
                          CountResultSentOn = await baseQuery.CountAsync(s => s.ResultSentOn != null && s.ResultSentBy.Contains(tester)),
                          CountApprovedOn = await baseQuery.CountAsync(s => s.ApprovedOn != null && s.ResultSentBy.Contains(tester))
                      };

                      return Ok(counts);
                  }
                  catch (Exception ex)
                  {
                      // Handle exceptions appropriately
                      return StatusCode(500, $"Internal server error: {ex.Message}");
                  }
              }*/




        [HttpGet]
        public async Task<IActionResult> CountSamplesByInLabOn(DateTime? startDate, DateTime? endDate, string tester = null)
        {
            try
            {
                if (startDate.HasValue && endDate.HasValue)
                {
                    // Adjust the end date to be inclusive by adding one day
                    endDate = endDate.Value.AddDays(1);

                    // Validate the date range
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }
                }

                // Assume you have a DbContext named _context and a DbSet named K1Details
                var receivedQuery = _context.K1Details.AsQueryable();
                var inLabQuery = _context.K1Details.AsQueryable();
                var testedQuery = _context.K1Details.AsQueryable();
                var verifiedQuery = _context.K1Details.AsQueryable();
                var resultSentQuery = _context.K1Details.AsQueryable();
                var approvedQuery = _context.K1Details.AsQueryable();
                var printedQuery = _context.K1Details.AsQueryable();


                if (startDate.HasValue)
                {
                    receivedQuery = receivedQuery.Where(s => s.ReceivedOn >= startDate.Value);
                    inLabQuery = inLabQuery.Where(s => s.InLabOn >= startDate.Value);
                    testedQuery = testedQuery.Where(s => s.TestedOn >= startDate.Value);
                    verifiedQuery = verifiedQuery.Where(s => s.VerifiedOn >= startDate.Value);
                    resultSentQuery = resultSentQuery.Where(s => s.ResultSentOn >= startDate.Value);
                    approvedQuery = approvedQuery.Where(s => s.ApprovedOn >= startDate.Value);
                    printedQuery = printedQuery.Where(s => s.PrintedOn >= startDate.Value);

                }

                if (endDate.HasValue)
                {
                    receivedQuery = receivedQuery.Where(s => s.ReceivedOn < endDate.Value);
                    inLabQuery = inLabQuery.Where(s => s.InLabOn < endDate.Value);
                    testedQuery = testedQuery.Where(s => s.TestedOn < endDate.Value);
                    verifiedQuery = verifiedQuery.Where(s => s.VerifiedOn < endDate.Value);
                    resultSentQuery = resultSentQuery.Where(s => s.ResultSentOn < endDate.Value);
                    approvedQuery = approvedQuery.Where(s => s.ApprovedOn < endDate.Value);
                    printedQuery = printedQuery.Where(s => s.PrintedOn < endDate.Value);

                }

                if (!string.IsNullOrEmpty(tester))
                {
                    receivedQuery = receivedQuery.Where(s => s.ReceivedBy.Contains(tester));
                    inLabQuery = inLabQuery.Where(s => s.InLabBy.Contains(tester));
                    testedQuery = testedQuery.Where(s => s.TestedBy.Contains(tester));
                    verifiedQuery = verifiedQuery.Where(s => s.VerifiedBy.Contains(tester));
                    resultSentQuery = resultSentQuery.Where(s => s.ResultSentBy.Contains(tester));
                    approvedQuery = approvedQuery.Where(s => s.ApprovedBy.Contains(tester));
                    printedQuery = printedQuery.Where(s => s.PrintedBy.Contains(tester));

                }

                var countReceivedOn = await receivedQuery.CountAsync();
                var countInLabOn = await inLabQuery.CountAsync();
                var countTestedOn = await testedQuery.CountAsync();
                var countVerifiedOn = await verifiedQuery.CountAsync();
                var countResultSentOn = await resultSentQuery.CountAsync();
                var countApprovedOn = await approvedQuery.CountAsync();
                var countPrintedOn = await printedQuery.CountAsync();


                return Ok(new
                {
                    CountReceivedOn = countReceivedOn,
                    CountInLabOn = countInLabOn,
                    CountTestedOn = countTestedOn,
                    CountVerifiedOn = countVerifiedOn,
                    CountResultSentOn = countResultSentOn,
                    CountApprovedOn = countApprovedOn,
                    CountPrintedOn = countPrintedOn

                });
            }
            catch (Exception ex)
            {
                // Log the exception (if you have logging configured)
                // _logger.LogError(ex, "An error occurred while counting samples.");

                return StatusCode(500, "Internal server error");
            }
        }







        [HttpGet]
        public async Task<IActionResult> CountLevelEfficiency(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                // Validate that startDate is provided
                if (!startDate.HasValue)
                {
                    return BadRequest("Start date is required.");
                }

                // Set endDate to 5 working days after startDate if not provided
                if (!endDate.HasValue)
                {
                    endDate = startDate.Value.AddDays(5);
                }
                else
                {
                    // Adjust endDate to be inclusive
                    endDate = endDate.Value.AddDays(1);
                }

                // Validate date range
                if (endDate < startDate)
                {
                    return BadRequest("End date must be greater than or equal to start date.");
                }

                // Query K1Details and join with Batches table to include DateSampleDelivered
                var k1DetailsList = await _context.K1Details
                    .Where(k => k.ReceivedOn >= startDate && k.VerifiedOn <= endDate)
                    .Join(
                        _context.Batches,
                        k => k.BatchId,
                        b => b.BatchId,
                        (k, b) => new { k, b.DateSampleDelivered, b.PostResultOn }
                    )
                    .Select(joined => new K1DetailDto
                    {
                        K1DetailId = joined.k.K1DetailId,
                        BatchId = joined.k.BatchId,
                        CustomNo = joined.k.CustomNo,
                        TestedBy = joined.k.TestedBy,
                        TestedOn = joined.k.TestedOn,
                        InLabBy = joined.k.InLabBy,
                        InLabOn = joined.k.InLabOn,
                        ApprovedOn = joined.k.ApprovedOn,
                        PrintedOn = joined.k.PrintedOn,
                        ForwarderId = joined.k.ForwarderId,
                        ReceivedOn = joined.k.ReceivedOn,
                        VerifiedOn = joined.k.VerifiedOn,
                        DateSampleDelivered = joined.DateSampleDelivered,
                        PostResultOn = joined.PostResultOn
                    })
                    .ToListAsync();

                // Fetch all forwarders to lookup names in memory
                var forwarderNames = await _context.Forwarders.ToDictionaryAsync(f => f.ForwarderId, f => f.Name);

                // Assign ForwarderName in memory
                foreach (var k1Detail in k1DetailsList)
                {
                    if (forwarderNames.TryGetValue(k1Detail.ForwarderId, out var forwarderName))
                    {
                        k1Detail.ForwarderName = forwarderName;
                    }
                }

                // Initialize dictionary to hold categorized K1Details
                var workingDayCounts = new Dictionary<string, List<K1DetailDto>>
                {
                    { "Count5WorkingDays", new List<K1DetailDto>() },
                    { "Count6To10WorkingDays", new List<K1DetailDto>() },
                    { "Count11To14WorkingDays", new List<K1DetailDto>() },
                    { "CountMoreThan15WorkingDays", new List<K1DetailDto>() }
                };

                // Categorize K1Details based on working days
                foreach (var k1Detail in k1DetailsList)
                {
                    if (k1Detail.ReceivedOn.HasValue && k1Detail.VerifiedOn.HasValue)
                    {
                        int workingDays = CalculateWorkingDays(k1Detail.ReceivedOn.Value, k1Detail.VerifiedOn.Value);
                        if (workingDays <= 5)
                            workingDayCounts["Count5WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 10)
                            workingDayCounts["Count6To10WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 14)
                            workingDayCounts["Count11To14WorkingDays"].Add(k1Detail);
                        else
                            workingDayCounts["CountMoreThan15WorkingDays"].Add(k1Detail);
                    }
                }

                // Create a dictionary for sample counts
                var sampleCounts = workingDayCounts.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Count);

                // Construct result
                var result = new
                {
                    WorkingDayCounts = workingDayCounts,
                    SampleCounts = sampleCounts
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpGet]
        public async Task<IActionResult> CountLevelEfficiencyLatex(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                // Validate that startDate is provided
                if (!startDate.HasValue)
                {
                    return BadRequest("Start date is required.");
                }

                // Set endDate to 5 working days after startDate if not provided
                if (!endDate.HasValue)
                {
                    endDate = startDate.Value.AddDays(5);
                }
                else
                {
                    // Adjust endDate to be inclusive
                    endDate = endDate.Value.AddDays(1);
                }

                // Validate date range
                if (endDate < startDate)
                {
                    return BadRequest("End date must be greater than or equal to start date.");
                }

                // Query K1Details and join with Batches table to include DateSampleDelivered
                var k1DetailsList = await _context.K1Details
                    .Where(k => k.ReceivedOn >= startDate && k.VerifiedOn <= endDate && k.RubberTypeId == 1)
                    .Join(
                        _context.Batches,
                        k => k.BatchId,
                        b => b.BatchId,
                        (k, b) => new { k, b.DateSampleDelivered, b.PostResultOn }
                    )
                    .Select(joined => new K1DetailDto
                    {
                        K1DetailId = joined.k.K1DetailId,
                        BatchId = joined.k.BatchId,
                        CustomNo = joined.k.CustomNo,
                        TestedBy = joined.k.TestedBy,
                        TestedOn = joined.k.TestedOn,
                        InLabBy = joined.k.InLabBy,
                        InLabOn = joined.k.InLabOn,
                        ApprovedOn = joined.k.ApprovedOn,
                        PrintedOn = joined.k.PrintedOn,
                        ForwarderId = joined.k.ForwarderId,
                        ReceivedOn = joined.k.ReceivedOn,
                        VerifiedOn = joined.k.VerifiedOn,
                        DateSampleDelivered = joined.DateSampleDelivered,
                        PostResultOn = joined.PostResultOn
                    })
                    .ToListAsync();

                // Fetch all forwarders to lookup names in memory
                var forwarderNames = await _context.Forwarders.ToDictionaryAsync(f => f.ForwarderId, f => f.Name);

                // Assign ForwarderName in memory
                foreach (var k1Detail in k1DetailsList)
                {
                    if (forwarderNames.TryGetValue(k1Detail.ForwarderId, out var forwarderName))
                    {
                        k1Detail.ForwarderName = forwarderName;
                    }
                }

                // Initialize dictionary to hold categorized K1Details
                var workingDayCounts = new Dictionary<string, List<K1DetailDto>>
        {
            { "Count5WorkingDays", new List<K1DetailDto>() },
            { "Count6To10WorkingDays", new List<K1DetailDto>() },
            { "Count11To14WorkingDays", new List<K1DetailDto>() },
            { "CountMoreThan15WorkingDays", new List<K1DetailDto>() }
        };

                // Categorize K1Details based on working days
                foreach (var k1Detail in k1DetailsList)
                {
                    if (k1Detail.ReceivedOn.HasValue && k1Detail.VerifiedOn.HasValue)
                    {
                        int workingDays = CalculateWorkingDays(k1Detail.ReceivedOn.Value, k1Detail.VerifiedOn.Value);
                        if (workingDays <= 5)
                            workingDayCounts["Count5WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 10)
                            workingDayCounts["Count6To10WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 14)
                            workingDayCounts["Count11To14WorkingDays"].Add(k1Detail);
                        else
                            workingDayCounts["CountMoreThan15WorkingDays"].Add(k1Detail);
                    }
                }

                // Create a dictionary for sample counts
                var sampleCounts = workingDayCounts.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Count);

                // Construct result
                var result = new
                {
                    WorkingDayCounts = workingDayCounts,
                    SampleCounts = sampleCounts
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpGet]
        public async Task<IActionResult> CountLevelEfficiencyBlockRubber(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                // Validate that startDate is provided
                if (!startDate.HasValue)
                {
                    return BadRequest("Start date is required.");
                }

                // Set endDate to 5 working days after startDate if not provided
                if (!endDate.HasValue)
                {
                    endDate = startDate.Value.AddDays(5);
                }
                else
                {
                    // Adjust endDate to be inclusive
                    endDate = endDate.Value.AddDays(1);
                }

                // Validate date range
                if (endDate < startDate)
                {
                    return BadRequest("End date must be greater than or equal to start date.");
                }

                // Query K1Details and join with Batches table to include DateSampleDelivered
                var k1DetailsList = await _context.K1Details
                    .Where(k => k.ReceivedOn >= startDate && k.VerifiedOn <= endDate && k.RubberTypeId == 2)
                    .Join(
                        _context.Batches,
                        k => k.BatchId,
                        b => b.BatchId,
                        (k, b) => new { k, b.DateSampleDelivered, b.PostResultOn }
                    )
                    .Select(joined => new K1DetailDto
                    {
                        K1DetailId = joined.k.K1DetailId,
                        BatchId = joined.k.BatchId,
                        CustomNo = joined.k.CustomNo,
                        TestedBy = joined.k.TestedBy,
                        TestedOn = joined.k.TestedOn,
                        InLabBy = joined.k.InLabBy,
                        InLabOn = joined.k.InLabOn,
                        ApprovedOn = joined.k.ApprovedOn,
                        PrintedOn = joined.k.PrintedOn,
                        ForwarderId = joined.k.ForwarderId,
                        ReceivedOn = joined.k.ReceivedOn,
                        VerifiedOn = joined.k.VerifiedOn,
                        DateSampleDelivered = joined.DateSampleDelivered,
                        PostResultOn = joined.PostResultOn
                    })
                    .ToListAsync();

                // Fetch all forwarders to lookup names in memory
                var forwarderNames = await _context.Forwarders.ToDictionaryAsync(f => f.ForwarderId, f => f.Name);

                // Assign ForwarderName in memory
                foreach (var k1Detail in k1DetailsList)
                {
                    if (forwarderNames.TryGetValue(k1Detail.ForwarderId, out var forwarderName))
                    {
                        k1Detail.ForwarderName = forwarderName;
                    }
                }

                // Initialize dictionary to hold categorized K1Details
                var workingDayCounts = new Dictionary<string, List<K1DetailDto>>
        {
            { "Count5WorkingDays", new List<K1DetailDto>() },
            { "Count6To10WorkingDays", new List<K1DetailDto>() },
            { "Count11To14WorkingDays", new List<K1DetailDto>() },
            { "CountMoreThan15WorkingDays", new List<K1DetailDto>() }
        };

                // Categorize K1Details based on working days
                foreach (var k1Detail in k1DetailsList)
                {
                    if (k1Detail.ReceivedOn.HasValue && k1Detail.VerifiedOn.HasValue)
                    {
                        int workingDays = CalculateWorkingDays(k1Detail.ReceivedOn.Value, k1Detail.VerifiedOn.Value);
                        if (workingDays <= 5)
                            workingDayCounts["Count5WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 10)
                            workingDayCounts["Count6To10WorkingDays"].Add(k1Detail);
                        else if (workingDays <= 14)
                            workingDayCounts["Count11To14WorkingDays"].Add(k1Detail);
                        else
                            workingDayCounts["CountMoreThan15WorkingDays"].Add(k1Detail);
                    }
                }

                // Create a dictionary for sample counts
                var sampleCounts = workingDayCounts.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Count);

                // Construct result
                var result = new
                {
                    WorkingDayCounts = workingDayCounts,
                    SampleCounts = sampleCounts
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }





        [HttpGet]
        public async Task<IActionResult> CountReportKgkSamples(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                // Validate that startDate is provided
                if (!startDate.HasValue)
                {
                    return BadRequest("Start date is required.");
                }

                // Set endDate to 5 days after startDate if not provided
                if (!endDate.HasValue)
                {
                    endDate = startDate.Value.AddDays(5);
                }
                else
                {
                    // Adjust endDate to be inclusive
                    endDate = endDate.Value.AddDays(1);
                }

                // Validate date range
                if (endDate < startDate)
                {
                    return BadRequest("End date must be greater than or equal to start date.");
                }

                // Query K1Details and apply date filters
                var k1DetailsList = await _context.K1Details
                    .Where(k => k.ReceivedOn >= startDate && k.PrintedOn <= endDate)
                    .Select(k => new K1DetailDto
                    {
                        K1DetailId = k.K1DetailId,
                        BatchId = k.BatchId,
                        Drc = k.Drc,
                        CustomNo = k.CustomNo,
                        TestedBy = k.TestedBy,
                        TestedOn = k.TestedOn,
                        InLabBy = k.InLabBy,
                        InLabOn = k.InLabOn,
                        ApprovedOn = k.ApprovedOn,
                        PrintedOn = k.PrintedOn,
                        ForwarderId = k.ForwarderId,
                        ReceivedOn = k.ReceivedOn,
                        Result = _context.Results.Where(r => r.K1DetailId == k.K1DetailId).Select( r => r.Result1).FirstOrDefault()
                    })
                    .ToListAsync();

                // Fetch all forwarders to lookup names in memory
                var forwarderNames = await _context.Forwarders.ToDictionaryAsync(f => f.ForwarderId, f => f.Name);

                // Assign ForwarderName in memory
                foreach (var k1Detail in k1DetailsList)
                {
                    if (forwarderNames.TryGetValue(k1Detail.ForwarderId, out var forwarderName))
                    {
                        k1Detail.ForwarderName = forwarderName;
                    }
                }

                // Calculate the total number of samples
                var totalSamples = k1DetailsList.Count;

                // Construct result
                var result = new
                {
                    TotalSamples = totalSamples,
                    K1Details = k1DetailsList
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }





        // Function to calculate working days between two dates
        private int CalculateWorkingDays(DateTime startDate, DateTime endDate)
        {
            int totalDays = (int)(endDate - startDate).TotalDays;
            int workingDays = 0;
            for (int i = 0; i <= totalDays; i++)
            {
                DateTime currentDate = startDate.AddDays(i);
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    workingDays++;
                }
            }
            return workingDays;
        }




        [HttpGet]
        public async Task<IActionResult> CountSamplesByTesterName(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                IQueryable<K1Detail> query = _context.K1Details;

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1); // To include the end date
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }
                }

                var staffWithRoleId4Usernames = _context.Staffs
                    .Where(s => _context.StaffRoles.Any(sr => sr.StaffId == s.StaffId && sr.StaffRole1 == 4))
                    .ToList(); // Materialize the query result into a list

                var staffCounts = new List<object>();

                foreach (var staff in staffWithRoleId4Usernames)
                {
                    var countReceivedBy = query
                        .Where(s => s.ReceivedBy == staff.Username && (!startDate.HasValue || (s.ReceivedOn >= startDate && s.ReceivedOn < endDate)))
                        .Count();

                    var countApprovedBy = query
                        .Where(s => s.ApprovedBy == staff.Username && (!startDate.HasValue || (s.ApprovedOn >= startDate && s.ApprovedOn < endDate)))
                        .Count();

                    var countVerifiedBy = query
                        .Where(s => s.VerifiedBy == staff.Username && (!startDate.HasValue || (s.VerifiedOn >= startDate && s.VerifiedOn < endDate)))
                        .Count();

                    var countPrintedBy = query
                       .Where(s => s.PrintedBy == staff.Username && (!startDate.HasValue || (s.PrintedOn >= startDate && s.PrintedOn < endDate)))
                       .Count();

                    var countResultSentBy = query
                    .Where(s => s.ResultSentBy == staff.Username && (!startDate.HasValue || (s.ResultSentOn >= startDate && s.ResultSentOn < endDate)))
                    .Count();

                    /*var countPrintedBy = query
                      .Where(s => s.PrintedBy == staff.Username && (!startDate.HasValue || (s.PrintedOn >= startDate && s.PrintedOn < endDate)))
                      .Count();*/

                    var countInLabBy = query
                        .Where(s => s.InLabBy == staff.Username && (!startDate.HasValue || (s.InLabOn >= startDate && s.InLabOn < endDate)))
                        .Count();

                    var countTestedBy = query
                        .Where(s => s.TestedBy == staff.Username && (!startDate.HasValue || (s.TestedOn >= startDate && s.TestedOn < endDate)))
                        .Count();

               /*     var countRetest = query
                        .Where(s => s.NoOfRetest.HasValue && s.NoOfRetest.Value == staff.StaffId && (!startDate.HasValue || (s.Retest >= startDate && s.Retest < endDate)))
                        .Count();*/

                    var totalSamples = countReceivedBy + countApprovedBy + countVerifiedBy + countInLabBy + countTestedBy + countPrintedBy + countResultSentBy;

                    var staffCount = new
                    {
                        StaffName = staff.StaffName,
                        CountReceivedBy = countReceivedBy,
                        CountApprovedBy = countApprovedBy,
                        CountVerifiedBy = countVerifiedBy,
                        CountInLabBy = countInLabBy,
                        CountTestedBy = countTestedBy,
                        CountPrintedBy = countPrintedBy,
                        CountResultSentBy = countResultSentBy
,

                        //CountRetest = countRetest,
                        TotalSamples = totalSamples // Total count of samples
                    };

                    staffCounts.Add(staffCount);
                }

                return Ok(staffCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }







        [HttpGet]
        public async Task<IActionResult> CountSamplesByApproval(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                IQueryable<K1Detail> query = _context.K1Details;

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1); // Include the end date
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }

                    // Filter the query for ApprovedOn date within the selected date range
                    query = query.Where(s => s.ApprovedOn >= startDate && s.ApprovedOn < endDate);
                }

                var staffWithRoleId4Usernames = _context.Staffs
                    .Join(_context.StaffRoles.Where(sr => sr.StaffRole1 == 3),
                        s => s.StaffId,
                        sr => sr.StaffId,
                        (s, sr) => s)
                    .ToList(); // Materialize the query result into a list

                var staffCounts = new List<object>();

                foreach (var staff in staffWithRoleId4Usernames)
                {
                    var countReceivedMap = query.Count(s => s.ReceivedBy == staff.Username);
                    var countApprovedMap = query.Count(s => s.ApprovedBy == staff.Username); // Filtered by date
                    var countVerifiedBy = query.Count(s => s.VerifiedBy == staff.Username);
                    var countInLabBy = query.Count(s => s.InLabBy == staff.Username);
                    var countTestedBy = query.Count(s => s.TestedBy == staff.Username);
                    var countRetest = query.Count(s => s.NoOfRetest.HasValue && s.NoOfRetest.Value == staff.StaffId);
                    var countResultLetterApprovedBy = query.Count(s => s.ResultLetterApprovedBy == staff.StaffName);
                    var totalSamples = countApprovedMap + countVerifiedBy + countInLabBy + countTestedBy + countRetest + countResultLetterApprovedBy;

                    var staffCount = new
                    {
                        StaffName = staff.StaffName,
                        CountReceivedBy = countReceivedMap,
                        CountApprovedBy = countApprovedMap,
                        CountVerifiedBy = countVerifiedBy,
                        CountInLabBy = countInLabBy,
                        CountTestedBy = countTestedBy,
                        CountRetest = countRetest,
                        CountResultLetterApprovedBy = countResultLetterApprovedBy,
                        TotalSamples = totalSamples
                        // Add counts for other fields here
                    };

                    staffCounts.Add(staffCount);
                }
                return Ok(staffCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }





        [HttpGet]
        public async Task<IActionResult> CountSamplesByForwarder(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                IQueryable<K1Detail> query = _context.K1Details;

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1);
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }

                }

                var forwarderCounts = _context.Forwarders
                    .GroupJoin(query,
                        forwarder => forwarder.ForwarderId,
                        k1 => k1.ForwarderId,
                        (forwarder, k1Details) => new
                        {
                            Forwarder = forwarder,
                            CreatedOn = k1Details.Count(k => k.CreatedOn >= startDate && k.CreatedOn <= endDate),
                            SentOn = k1Details.Count(k => k.SentOn >= startDate && k.SentOn <= endDate),
                            ReceivedOn = k1Details.Count(k => k.ReceivedOn >= startDate && k.ReceivedOn <= endDate),
                            InLabOn = k1Details.Count(k => k.InLabOn >= startDate && k.InLabOn <= endDate),
                            TestedOn = k1Details.Count(k => k.TestedOn >= startDate && k.TestedOn <= endDate),
                            VerifiedOn = k1Details.Count(k => k.VerifiedOn >= startDate && k.VerifiedOn <= endDate),
                            ApprovedOn = k1Details.Count(k => k.ApprovedOn >= startDate && k.ApprovedOn <= endDate),


                        })
                    .Select(x => new
                    {
                        ForwarderId = x.Forwarder.ForwarderId,
                        ForwarderName = x.Forwarder.Name,
                        ForwarderAddress = x.Forwarder.Address,
                        CreatedOn = x.CreatedOn,
                        SentOn = x.SentOn,
                        ReceivedOn = x.ReceivedOn,
                        InLabOn = x.InLabOn,
                        TestedOn = x.TestedOn,
                        VerifiedOn = x.VerifiedOn,
                         ApprovedOn = x.ApprovedOn,
                        TotalSamples = x.CreatedOn + x.SentOn + x.ReceivedOn + x.InLabOn + x.TestedOn + x.VerifiedOn + x.ApprovedOn


                    })
                    .ToList();


                var totalCounts = new
                {
                    TotalCreatedOn = forwarderCounts.Sum(x => x.CreatedOn),
                    TotalSentOn = forwarderCounts.Sum(x => x.SentOn),
                    TotalReceivedOn = forwarderCounts.Sum(x => x.ReceivedOn),
                    TotalInLabOn = forwarderCounts.Sum(x => x.InLabOn),
                    TotalTestedOn = forwarderCounts.Sum(x => x.TestedOn),
                    TotalVerifiedOn = forwarderCounts.Sum(x => x.VerifiedOn),
                    TotalApprovedOn = forwarderCounts.Sum(x => x.ApprovedOn),
                    TotalSamples = forwarderCounts.Sum(x => x.TotalSamples)
                };

                return Ok(new { forwarderCounts = forwarderCounts, totalCounts = totalCounts });
            

                //return Ok(forwarderCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }



        [HttpGet]
        public async Task<IActionResult> CountSamplesByCustomOffice(DateTime? startDate, DateTime? endDate)
        {
            try
            {
                IQueryable<K1Detail> query = _context.K1Details;

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1);
                    if (endDate < startDate)
                    {
                        return BadRequest("End date must be greater than or equal to start date.");
                    }

                    query = query.Where(k => (k.SentOn >= startDate && k.SentOn <= endDate) || (k.ReceivedOn >= startDate && k.ReceivedOn <= endDate));
                }

                var customOfficeCounts = _context.CustomOffices
                    .GroupJoin(_context.Forwarders,
                        customOffice => customOffice.Id,
                        forwarder => forwarder.CustomOfficeId,
                        (customOffice, forwarders) => new
                        {
                            CustomOffice = customOffice,
                            Forwarders = forwarders
                        })
                    .SelectMany(
                        x => x.Forwarders.DefaultIfEmpty(),
                        (customOffice, forwarder) => new
                        {
                            CustomOfficeId = customOffice.CustomOffice.Id,
                            CustomOfficeAddress = customOffice.CustomOffice.Address,
                            ForwarderId = forwarder != null ? forwarder.ForwarderId : (int?)null
                        })
                    .GroupBy(x => new { x.CustomOfficeId, x.CustomOfficeAddress }) // Group by CustomOfficeId and CustomOfficeAddress
                    .Select(group => new
                    {
                        CustomOfficeId = group.Key.CustomOfficeId,
                        CustomOfficeAddress = group.Key.CustomOfficeAddress,
                        SentOn = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.SentOn.HasValue)),
                        ReceivedOn = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.ReceivedOn.HasValue)),
                        LateksPekat = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 1)),
                        LateksLadang = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 2)),
                        GetahSekerapBuku = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 3)),
                        GetahBukuSkim = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 4)),
                        GetahTidakBerasap = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 5)),
                        GetahKrip = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 6)),
                        GetahAsapBerbunga = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 7)),
                        Tsr = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId && k.TypeCodeId == 8)),
                        TotalSamples = query.Count(k => group.Any(g => g.ForwarderId == k.ForwarderId) &&
                            ((k.SentOn >= startDate && k.SentOn <= endDate) || (k.ReceivedOn >= startDate && k.ReceivedOn <= endDate)))
                    })
                    .ToList();

                return Ok(customOfficeCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }







        [HttpGet()]
        public async Task<IActionResult> CountSamples1(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null || endDate == null)
            {
                return BadRequest("Start date and end date are required.");
            }

            // Calculate the number of days between start date and end date
            var daysCount = (endDate.Value - startDate.Value).Days;

            // Fetch the imported date from K1Headers table
            var importedDate = await _context.K1Headers
                .Where(k => k.ImportedDate != null && k.ImportedDate <= startDate)
                .OrderByDescending(k => k.ImportedDate)
                .Select(k => k.ImportedDate)
                .FirstOrDefaultAsync();

            if (importedDate == null)
            {
                return BadRequest("No imported date found on or before the start date.");
            }

            // Fetch the received date from K1Details table
            var receivedDate = await _context.K1Details
                .Where(k => k.ReceivedOn != null && k.ReceivedOn <= endDate)
                .OrderByDescending(k => k.ReceivedOn)
                .Select(k => k.ReceivedOn)
                .FirstOrDefaultAsync();

            if (receivedDate == null)
            {
                return BadRequest("No received date found on or before the end date.");
            }

            // Calculate the number of days between imported date and received date
            var daysFromImportedToReceived = (receivedDate.Value - importedDate.Value).Days;

            return Ok(new { DaysFromImportedToReceived = daysFromImportedToReceived, TotalDays = daysCount });
        }
    





    [HttpGet("{username}")]
        public async Task<IActionResult> getElimsSearchSample([FromRoute] string username, int? k1HeaderId = null, string? labRefNo = null,
            string? customNo = null, int? batchId = null, int? rubberTypeId = null, string? driverName = null, string? icDriver = null, int? quantity = null, int? drc = null, string? hsCode = null, int? statusCodeId = null,
              DateTime? fromDate = null, DateTime? toDate = null, string? bankCode = null, int? companyId = null, int? forwarderId = null)
        {
            var query = _context.K1Details.AsQueryable();
           //var query2 = _context.K1Headers.AsQueryable();

            if (k1HeaderId != null)
            {
                query = query.Where(x => x.K1HeaderId == k1HeaderId.Value);
            }

            if (!string.IsNullOrEmpty(labRefNo))
            {
                query = query.Where(x => x.LabRefNo == labRefNo);
            }

            if (!string.IsNullOrEmpty(customNo))
            {
                query = query.Where(x => EF.Functions.Like(x.CustomNo, $"%{customNo}%"));
            }

            if (batchId != null)
            {
                query = query.Where(x => x.BatchId == batchId.Value);
            }

            if (rubberTypeId != null)
            {
                query = query.Where(x => x.RubberTypeId == rubberTypeId);
            }

            if (quantity != null)
            {
                query = query.Where(x => x.Quantity == quantity.Value);
            }

            if (drc != null)
            {
                query = query.Where(x => x.Drc == drc.Value);
            }


            if (!string.IsNullOrEmpty(hsCode))
            {
                query = query.Where(x => x.HsCode == hsCode);
            }

            if (companyId != null)
            {
                query = query.Where(x => x.CompanyId == companyId.Value);
            }

            if (statusCodeId != null)
            {
                query = query.Where(x => x.StatusCodeId == statusCodeId.Value);
            }

     /*       if (!string.IsNullOrEmpty(driverName))
            {
                // Filter K1Details based on the specified driverName by joining with K1Headers
                query = query.Join(
                    _context.K1Headers,
                    detail => detail.K1HeaderId,
                    header => header.K1HeaderId,
                    (detail, header) => new { Detail = detail, Header = header }
                )
                .Where(joinedData => joinedData.Header.DriverName == driverName)
                .Select(joinedData => joinedData.Detail); // Select only the K1Details part
            }*/


            if (!string.IsNullOrEmpty(driverName))
            {
                query = query.Where(x => _context.K1Headers.Any(header => header.K1HeaderId == x.K1HeaderId && header.DriverName == driverName));
            }




            /* if (!string.IsNullOrEmpty(icDriver))
             {
                 // Filter K1Details based on the specified icDriver by joining with K1Headers
                 query = query.Join(
                     _context.K1Headers,
                     detail => detail.K1HeaderId,
                     header => header.K1HeaderId,
                     (detail, header) => new { Detail = detail, Header = header }
                 )
                 .Where(joinedData => joinedData.Header.IcDriver == icDriver)
                 .Select(joinedData => joinedData.Detail); // Select only the K1Details part
             }*/

            if (!string.IsNullOrEmpty(icDriver))
            {
                query = query.Where(x => _context.K1Headers.Any(header => header.K1HeaderId == x.K1HeaderId && header.IcDriver == icDriver));
            }


            /*  if (fromDate != null && toDate != null)
              {
                  query = query.Join(
                      _context.K1Headers,
                      detail => detail.K1HeaderId,
                      header => header.K1HeaderId,
                      (detail, header) => new { Detail = detail, Header = header }
                  )
                  .Where(joinedData => joinedData.Header.ImportedDate >= fromDate && joinedData.Header.ImportedDate <= toDate)
                  .Select(joinedData => joinedData.Detail); // Select only the K1Details part
              }


              if (!string.IsNullOrEmpty(bankCode))
              {
                  query = query.Join(
                      _context.Batches,
                      detail => detail.BatchId,
                      header => header.BatchId,
                      (detail, header) => new { Detail = detail, Header = header }
                  )
                  .Where(joinedData => joinedData.Header.BankCode == bankCode)
                  .Select(joinedData => joinedData.Detail); // Select only the K1Details part
              }*/


            if (fromDate != null && toDate != null)
            {
                query = query.Where(x => _context.K1Headers.Any(header => header.K1HeaderId == x.K1HeaderId && header.ImportedDate >= fromDate && header.ImportedDate <= toDate));
            }

            if (!string.IsNullOrEmpty(bankCode))
            {
                query = query.Where(x => _context.Batches.Any(header => header.BatchId == x.BatchId && header.BankCode == bankCode));
            }



            var elimsContext = await query.Where(x => x.CreatedBy == username).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                batchId = x.BatchId,
                customNo = x.CustomNo,
                labRefNo = x.LabRefNo,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),

                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),

                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                drc = x.Drc,
                dryWeight = x.DryWeight,
                country = x.Country,
                remarks = x.Remarks,
                evidence = x.Evidence,
                hsCode = x.HsCode,
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                registrationSeqNo = x.RegistrationSeqNo,
                creatorRoleId = x.CreatorRoleId,
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                status = _context.StatusCodes.Where(y => y.StatusCodeId == x.StatusCodeId).Select(y => y.Status).FirstOrDefault(),
                driverName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.DriverName).FirstOrDefault(),
                result = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Result1).FirstOrDefault(),
                icDriver = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.IcDriver).FirstOrDefault(),
                bankName = _context.BankCodes.Where( y => y.BankCode1 == (_context.Batches.Where(z => z.BatchId == x.BatchId).Select( z => z.BankCode).FirstOrDefault())).Select(y => y.BankName).FirstOrDefault(),

            }).ToListAsync();

            if (elimsContext.Count == 0)
            {
                // No records found
                return NotFound();
            }

            return Ok(elimsContext);
        }


        [HttpGet]
        public async Task<IActionResult> GetElimsSearchSamples( int? k1HeaderId = null, string? labRefNo = null,
          string? customNo = null, int? batchId = null, int? rubberTypeId = null, int? typeCodeId = null, string? driverName = null, string? samplePropose = null, string? typeCode = null, string? icDriver = null, int? quantity = null, int? drc = null, string? hsCode = null, int? statusCodeId = null,
            DateTime? fromDate = null, DateTime? toDate = null, string? bankCode = null, int? companyId = null, int? forwarderId = null, string? noLaporanTuan = null)
        {
            var query = _context.K1Details.AsQueryable();

            if (k1HeaderId != null)
            {
                query = query.Where(x => x.K1HeaderId == k1HeaderId.Value);
            }

            if (!string.IsNullOrEmpty(labRefNo))
            {
                query = query.Where(x => x.LabRefNo == labRefNo);
            }

            if (!string.IsNullOrEmpty(customNo))
            {
                query = query.Where(x => EF.Functions.Like(x.CustomNo, $"%{customNo}%"));
            }

            if (batchId != null)
            {
                query = query.Where(x => x.BatchId == batchId.Value);
            }


            if (rubberTypeId != null)
            {
                query = query.Where(x => x.RubberTypeId == rubberTypeId);
            }

            if (quantity != null)
            {
                query = query.Where(x => x.Quantity == quantity.Value);
            }

            if (drc != null)
            {
                query = query.Where(x => x.Drc == drc.Value);
            }


            if (!string.IsNullOrEmpty(hsCode))
            {
                query = query.Where(x => x.HsCode == hsCode);
            }

            if (!string.IsNullOrEmpty(noLaporanTuan))
            {
                query = query.Where(x => x.NoLaporanTuan == noLaporanTuan);
            }


            if (companyId != null)
            {
                query = query.Where(x => x.CompanyId == companyId.Value);
            }

            if (statusCodeId != null)
            {
                query = query.Where(x => x.StatusCodeId == statusCodeId.Value);
            }

            if (!string.IsNullOrEmpty(samplePropose))
            {
                query = query.Where(x => x.SamplePropose == samplePropose);
            }


            if (typeCodeId != null)
            {
                query = query.Where(x => x.TypeCodeId == typeCodeId.Value);

            }


            if (!string.IsNullOrEmpty(driverName))
            {
                // Filter K1Details based on the specified driverName by joining with K1Headers
                query = query.Join(
                    _context.K1Headers,
                    detail => detail.K1HeaderId,
                    header => header.K1HeaderId,
                    (detail, header) => new { Detail = detail, Header = header }
                )
                .Where(joinedData => joinedData.Header.DriverName == driverName)
                .Select(joinedData => joinedData.Detail); // Select only the K1Details part
            }

            if (!string.IsNullOrEmpty(icDriver))
            {
                // Filter K1Details based on the specified icDriver by joining with K1Headers
                query = query.Join(
                    _context.K1Headers,
                    detail => detail.K1HeaderId,
                    header => header.K1HeaderId,
                    (detail, header) => new { Detail = detail, Header = header }
                )
                .Where(joinedData => joinedData.Header.IcDriver == icDriver)
                .Select(joinedData => joinedData.Detail); // Select only the K1Details part
            }

            if (fromDate != null && toDate != null)
            {
                query = query.Join(
                    _context.K1Headers,
                    detail => detail.K1HeaderId,
                    header => header.K1HeaderId,
                    (detail, header) => new { Detail = detail, Header = header }
                )
                .Where(joinedData => joinedData.Header.ImportedDate >= fromDate && joinedData.Header.ImportedDate <= toDate)
                .Select(joinedData => joinedData.Detail); // Select only the K1Details part
            }


            if (!string.IsNullOrEmpty(bankCode))
            {
                query = query.Join(
                    _context.Batches,
                    detail => detail.BatchId,
                    header => header.BatchId,
                    (detail, header) => new { Detail = detail, Header = header }
                )
                .Where(joinedData => joinedData.Header.BankCode == bankCode)
                .Select(joinedData => joinedData.Detail); // Select only the K1Details part
            }


            if (forwarderId.HasValue)
            {
                query = query.Where(x => x.ForwarderId == forwarderId.Value);
            }

            // Continue with further operations on 'query'


            var elimsContext = await query.Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                batchId = x.BatchId,
                customNo = x.CustomNo,
                labRefNo = x.LabRefNo,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),

                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),

                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                drc = x.Drc,
                dryWeight = x.DryWeight,
                country = x.Country,
                remarks = x.Remarks,
                evidence = x.Evidence,
                hsCode = x.HsCode,
                noLaporanTuan = x.NoLaporanTuan,
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                registrationSeqNo = x.RegistrationSeqNo,
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                status = _context.StatusCodes.Where(y => y.StatusCodeId == x.StatusCodeId).Select(y => y.Status).FirstOrDefault(),
                driverName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.DriverName).FirstOrDefault(),
                result = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Result1).FirstOrDefault(),
                icDriver = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.IcDriver).FirstOrDefault(),
                bankName = _context.BankCodes.Where(y => y.BankCode1 == (_context.Batches.Where(z => z.BatchId == x.BatchId).Select(z => z.BankCode).FirstOrDefault())).Select(y => y.BankName).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(y => y.ForwarderId == forwarderId).Select(y => y.Name).FirstOrDefault(),

            }).ToListAsync();

            if (elimsContext.Count == 0)
            {
                // No records found
                return NotFound();
            }

            return Ok(elimsContext);
        }

        //sama dengan cetak lembaran kerja
        [HttpPut("{id}")]
        public async Task<IActionResult> Putk1DetailLabelTelahDicetak(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 2;
            existingsample.LabelPrintedOn = k1Detail.LabelPrintedOn;
            existingsample.LabelPrintedBy = k1Detail.LabelPrintedBy;
            existingsample.LabelPrinted = k1Detail.LabelPrinted;
            existingsample.LabelPrintedOn = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        /*        [HttpPut("{id}")]
                public async Task<IActionResult> PutElimsSampleBatchId([FromRoute] int id, [FromBody] K1Detail k1Detail)
                {
                    var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
                    if (existingsample != null)
                    {

                        existingsample.BatchId = k1Detail.BatchId;
                        existingsample.SentOn = k1Detail.SentOn;
                        existingsample.SentBy = k1Detail.SentBy;
                        existingsample.StatusCodeId = k1Detail.StatusCodeId;

                        existingsample.SampleRunNo = k1Detail.SampleRunNo;

                        await _context.SaveChangesAsync();
                    }

                    return Ok(existingsample);
                }*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutElimsSampleBatchId([FromRoute] int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample != null)
            {

                existingsample.BatchId = k1Detail.BatchId;
                existingsample.SentOn = k1Detail.SentOn;
                existingsample.SentBy = k1Detail.SentBy;
                existingsample.StatusCodeId = 3;
                existingsample.SampleRunNo = k1Detail.SampleRunNo;
                existingsample.SentOn = DateTime.Now;

                await _context.SaveChangesAsync();
            }

            return Ok(existingsample);
        }

        [HttpPut]
        public async Task<IActionResult> PutSampleUipRefRunNo([FromBody] K1Detail k1Detail)
        {
            var existingBatch = await _context.K1Details.Where(x => x.K1DetailId == k1Detail.K1DetailId).FirstOrDefaultAsync();
            //var existingBatch = await _context.Batches.FirstOrDefaultAsync();

            if (existingBatch != null)
            {
                existingBatch.SampleRunNo = k1Detail.SampleRunNo;
            }

            await _context.SaveChangesAsync();

            return Ok(existingBatch);

        }


       
        [HttpDelete("{k1DetailId}")]
        public async Task<IActionResult> DeleteElimsSample(int k1DetailId)
        {
            var sample = await _context.K1Details.Where( x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();

            if (sample == null)
            {
                return NotFound();
            }

            _context.K1Details.Remove(sample);
            await _context.SaveChangesAsync();

            return Ok(sample);
        }



        [HttpGet("{batchId}")]
        public async Task<IActionResult> GetElimsSamplesByBatchId(int batchId)
        {
            var k1Details = await _context.K1Details.Where(x => x.BatchId == batchId).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                statusCodeId = x.StatusCodeId,
                batchId = x.BatchId,
                customNo = x.CustomNo,
                quantity = x.Quantity,
                labRefNo = x.LabRefNo,
                receivedOn = x.ReceivedOn,
                receivedBy = x.ReceivedBy,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                bankCode = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.BankCode).FirstOrDefault(),
                chequeNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeNo).FirstOrDefault(),
                chequeAmount = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeAmount).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                sampleRunNo = x.SampleRunNo,
                creatorRoleId = x.CreatorRoleId,
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),
                sampleCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCategory).FirstOrDefault(),

                sentOn = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.SentOn).FirstOrDefault(),
                uipRegNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.UipRegNo).FirstOrDefault(),
                testMethodId = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault(),
                testMethod = _context.RefTestMethods.Where(z => z.Id == (_context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault())).Select(y => y.TestMethod).FirstOrDefault(),

                transactionNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TransactionNo).FirstOrDefault(),
                date = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Date).FirstOrDefault(),
                receipt = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Receipt).FirstOrDefault(),
                isFastTrack = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.IsFastTrack).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                staffName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.StaffName).FirstOrDefault(),
                position = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Position).FirstOrDefault(),
                office = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Office).FirstOrDefault(),
                hpNo = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.HpNo).FirstOrDefault(),
                unitName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.UnitName).FirstOrDefault(),

            }).OrderBy(x => x.sampleRunNo).ToListAsync();


            if (k1Details == null)
            {
                return NotFound("Batch not found");
            }

            return Ok(k1Details);
        }


        [HttpGet("{customNo}")]
        public async Task<IActionResult> GetElimsSamplesByCustomNo(string customNo)
        {
            var k1Details = await _context.K1Details.Where(x => x.CustomNo == customNo).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                statusCodeId = x.StatusCodeId,
                batchId = x.BatchId,
                customNo = x.CustomNo,
                quantity = x.Quantity,
                labRefNo = x.LabRefNo,
                receivedOn = x.ReceivedOn,
                receivedBy = x.ReceivedBy,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                bankCode = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.BankCode).FirstOrDefault(),
                chequeNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeNo).FirstOrDefault(),
                chequeAmount = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeAmount).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                sampleRunNo = x.SampleRunNo,
                creatorRoleId = x.CreatorRoleId,
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                importerName = x.ImporterName,
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),
                sampleCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCategory).FirstOrDefault(),

                sentOn = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.SentOn).FirstOrDefault(),
                uipRegNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.UipRegNo).FirstOrDefault(),
                testMethodId = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault(),
                testMethod = _context.RefTestMethods.Where(z => z.Id == (_context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault())).Select(y => y.TestMethod).FirstOrDefault(),

                transactionNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TransactionNo).FirstOrDefault(),
                date = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Date).FirstOrDefault(),
                receipt = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Receipt).FirstOrDefault(),
                isFastTrack = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.IsFastTrack).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                staffName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.StaffName).FirstOrDefault(),
                position = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Position).FirstOrDefault(),
                office = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Office).FirstOrDefault(),
                hpNo = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.HpNo).FirstOrDefault(),
                unitName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.UnitName).FirstOrDefault(),

            }).OrderBy(x => x.sampleRunNo).ToListAsync();


            if (k1Details == null)
            {
                return NotFound("Batch not found");
            }

            return Ok(k1Details);
        }


        [HttpGet("{batchId}/{staffId}")]
        public async Task<IActionResult> getElimsSampleForStaff([FromRoute] int batchId, [FromRoute] int staffId)
        {
            var k1Details = await _context.K1Details
                .Where(x => x.BatchId == batchId)
                .ToListAsync();


            var rubber = await _context.RefSampleTypes
           .Where(x => x.RubberTypeId == k1Details[0].RubberTypeId)
           .FirstOrDefaultAsync();

            var rubber1 = await _context.TypeCodes
         .Where(x => x.RubberTypeId == k1Details[0].RubberTypeId)
         .FirstOrDefaultAsync();


            var rubberType = await _context.RefRubberTypes
             .Where(x => x.Id == k1Details[0].RubberTypeId).Select(y => y.RubberType)
             .FirstOrDefaultAsync();


            var staffData = await _context.Staffs
                .Where(x => x.StaffId == staffId)
            .FirstOrDefaultAsync();

            if (k1Details == null || staffData == null)
            {
                return NotFound(); // or return a specific error response
            }

            // Assuming you want to return both data
            var result = new
            {
                K1Detail = k1Details,
                rub = rubber,
                rub1 = rubber1,
                Staff = staffData,
                rubberTypeName = rubberType,
            };

            return Ok(result);
        }


        /* [HttpGet("{batchId}/{staffId}")]
         public async Task<IActionResult> getElimsSampleForStaff([FromRoute] int batchId, [FromRoute] int staffId)
         {
             var k1Details = await _context.K1Details.Where(x => x.BatchId == batchId).Select(x => new
             {
                 k1DetailId = x.K1DetailId,
                 k1HeaderId = x.K1HeaderId,
                 batchId = x.BatchId,
                 customNo = x.CustomNo,
                 quantity = x.Quantity,
                 companyId = x.CompanyId,
                 companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                 companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                 bankCode = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.BankCode).ToList(),
                 chequeNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeNo).ToList(),
                 chequeAmount = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.ChequeAmount).ToList(),
                 samplePropose = x.SamplePropose,
                 sampleRunNo = x.SampleRunNo,
                 creatorRoleId = x.CreatorRoleId,
                 importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).ToList(),
                 importerName = x.ImporterName,
                 importerAddress = x.ImporterAddress,
                 rubberTypeId = x.RubberTypeId,
                 rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                 sampleTypeId = x.SampleTypeId,
                 sampleType = _context.RefSampleTypes.Where(y => y.RubberTypeId == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),
                 sampleCode = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleCode).FirstOrDefault(),
                 sampleCategory = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleCategory).FirstOrDefault(),

             }).OrderBy(x => x.sampleRunNo).ToListAsync();



             var staffData = await _context.Staffs
                 .Where(x => x.StaffId == staffId)
             .FirstOrDefaultAsync();

             if (k1Details == null || staffData == null)
             {
                 return NotFound(); // or return a specific error response
             }

             // Assuming you want to return both data
             var result = new
             {
                 K1Detail = k1Details,
                 Staff = staffData,
             };

             return Ok(result);
         }*/

      

        private async Task<bool> existCustomNo(string customNo)
        {
            return await _context.K1Details.AnyAsync(x => x.CustomNo.ToLower().Trim() == customNo.ToLower().Trim());
        }


        [HttpGet("{customNo}")]
        public async Task<IActionResult> GetK1DetailByCustomNo([FromRoute] string customNo)
        {
            var k1Details = await _context.K1Details.Where(x => x.CustomNo == customNo).Select(x => new
            {
                itemDescription = x.ItemDescription,
                creatorRoleId = x.CreatorRoleId,

            }).ToListAsync();

            return Ok(k1Details);
        }



        [HttpPut("{k1HeaderId}")]
        public async Task<IActionResult> Putk1HeaderLabelTelahDicetak(int k1HeaderId)
        {
            var k1Detail = await _context.K1Details.Where(x => x.K1HeaderId == k1HeaderId).FirstOrDefaultAsync();
            if (k1Detail == null) { return BadRequest(); }

            k1Detail.StatusCodeId = 2;


            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut]
        public async Task<IActionResult> PutSampleUipbkhRefRunNo([FromBody] K1Detail k1Detail)
        {
            var existingBatch = await _context.K1Details.Where(x => x.K1DetailId == k1Detail.K1DetailId).FirstOrDefaultAsync();
            //var existingBatch = await _context.Batches.FirstOrDefaultAsync();

            if (existingBatch != null)
            {
                existingBatch.SampleRunNo = k1Detail.SampleRunNo;
            }

            await _context.SaveChangesAsync();

            return Ok(k1Detail);



                    /* [HttpGet]
         public async Task<IActionResult> getElimsSampleByStatus(int statusCodeId)
         {
             var ElimsContext = await _context.K1Details.Where(x => x.StatusCodeId == statusCodeId).Select(x => new
             {
                 k1DetailId = x.K1DetailId,
                 k1HeaderId = x.K1HeaderId,
                 batchId = x.BatchId,
                 customNo = x.CustomNo,
                 quantity = x.Quantity,
                 companyId = x.CompanyId,
                 companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                 samplePropose = x.SamplePropose,
                 importerName = x.ImporterName,
                 importerAddress = x.ImporterAddress,
                 rubberTypeId = x.RubberTypeId,
                 rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                 sampleTypeId = x.SampleTypeId,
                 sampleType = _context.RefSampleTypes.Where(y => y.Id == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),
                 isSMK = x.IsSmk,
                 registrationSeqNo = x.RegistrationSeqNo,
                 importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                 Transport = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.Transport).FirstOrDefault(),
                 lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                 trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                 supplierName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.SupplierName).FirstOrDefault(),
                 driverName = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.DriverName).FirstOrDefault(),
                 icDriver = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.IcDriver).FirstOrDefault(),


             }).ToListAsync();
             return Ok(ElimsContext);
         }*/


        }


        //[HttpPut("{customNo}")]
        //public async Task<IActionResult> PutDaftarTerimaSampel1([FromRoute] string customNo, [FromBody] Staff staff)
        //{
        //    var existingsample = await _context.K1Details.Where( x => x.CustomNo == customNo).FirstOrDefaultAsync();
        //    if (existingsample == null) { return BadRequest(); }

        //    existingsample.StatusCodeId = 6;
        //    existingsample.ReceivedOn = DateTime.Now;
        //    existingsample.ReceivedBy = staff.Username;


        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //test

/*        [HttpPut("{customNo}")]
        public async Task<IActionResult> PutDaftarTerimaSampel([FromRoute] string customNo, [FromBody] K1Detail k1Detail)
        {
            var existingSamples = await _context.K1Details.Where(x => x.CustomNo == customNo).ToListAsync();

            if (existingSamples == null || !existingSamples.Any())
            {
                return BadRequest("No samples found with the provided CustomNo.");
            }

            foreach (var sample in existingSamples)
            {
                sample.StatusCodeId = 4;
                sample.ReceivedOn = DateTime.Now;
                sample.LabRefNo = k1Detail.LabRefNo;\\
                sample.ReceivedBy = k1Detail.ReceivedBy;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }*/



        [HttpPut("{customNo}")]
        public async Task<IActionResult> PutDaftarTerimaSampel([FromRoute] string customNo, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.CustomNo == customNo).FirstOrDefaultAsync();

            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 4;
            existingsample.ReceivedOn = DateTime.Now;
            existingsample.LabRefNo = k1Detail.LabRefNo;
            existingsample.ReceivedBy = k1Detail.ReceivedBy;


            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipment(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.Penimbang = k1Detail.Penimbang;
            existingsample.Oven = k1Detail.Oven;

            await _context.SaveChangesAsync();

            return NoContent();

        }



        [HttpPut()]
        public async Task<IActionResult> PutSampleLabRefNo( [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == k1Detail.K1DetailId).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.LabRefNo = k1Detail.LabRefNo;


            await _context.SaveChangesAsync();

            return Ok();
        }

        


        [HttpPut("{id}")]
        public async Task<IActionResult> PutCetakLembaranKerja(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 5;


            await _context.SaveChangesAsync();

            return NoContent();

        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorksheetTestOn(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.WorksheetTestOn = k1Detail.WorksheetTestOn;

            await _context.SaveChangesAsync();

            return NoContent();

        }



        [HttpPut("{k1DetailId}")]
        public async Task<IActionResult> PutDateReceivedInLab(int k1DetailId, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.DateReceivedInLab = k1Detail.DateReceivedInLab;

            await _context.SaveChangesAsync();

            return Ok(existingsample);

        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutResultLetterApprovedBy(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.ResultLetterApprovedBy = k1Detail.ResultLetterApprovedBy;
            existingsample.NoLaporanTuan = k1Detail.NoLaporanTuan;
            //existingsample.TestedOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();

        }


        /*
                [HttpPut("{id}")]
                public async Task<IActionResult> PutRetest(int id, [FromBody] K1Detail k1Detail)
                {
                    var existingSample = await _context.K1Details.FirstOrDefaultAsync(x => x.K1DetailId == id);
                    if (existingSample == null)
                    {
                        return BadRequest();
                    }

                    existingSample.StatusCodeId = 5;

                    existingSample.TestedOn = null;
                    existingSample.TestedBy = null;
                    existingSample.VerifiedOn = null;
                    existingSample.VerifiedBy = null;

                    // Update TestedBy if provided in the request
                    //existingSample.TestedBy = k1Detail.TestedBy;

                    // Increment NoOfRetest by 1
                    existingSample.NoOfRetest += 1;

                    await _context.SaveChangesAsync();

                    return NoContent();


                }*/

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRetest(int id, [FromBody] K1Detail k1Detail)
        {
            // Find the existing K1Detail by id
            var existingSample = await _context.K1Details.FirstOrDefaultAsync(x => x.K1DetailId == id);
            if (existingSample == null)
            {
                return BadRequest("K1Detail not found.");
            }

            // Update the status code
            existingSample.StatusCodeId = 5;

            // Reset testing and verification fields
            existingSample.TestedOn = null;
            existingSample.TestedBy = null;
            existingSample.VerifiedOn = null;
            existingSample.VerifiedBy = null;
            existingSample.NoOfRetest = existingSample.NoOfRetest ?? 0;
            existingSample.NoOfRetest++;



            // Save changes to the database
            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutRetestApproval(int id, [FromBody] K1Detail k1Detail)
        {
            var existingSample = await _context.K1Details.FirstOrDefaultAsync(x => x.K1DetailId == id);
            if (existingSample == null)
            {
                return BadRequest();
            }

            existingSample.NoOfRetest += 1;
            existingSample.StatusCodeId = 5;

            // Reset TestedOn, TestedBy, VerifiedOn, and VerifiedBy to null if they already have values
            existingSample.TestedOn = null;
            existingSample.TestedBy = null;
            existingSample.VerifiedOn = null;
            existingSample.VerifiedBy = null;

            // Increment NoOfRetest by 1

            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutUlangCetakKeputusanUjian(int id, [FromBody] K1Detail k1Detail)
        {
            var existingSample = await _context.K1Details.FirstOrDefaultAsync(x => x.K1DetailId == id);
            if (existingSample == null)
            {
                return BadRequest();
            }

            existingSample.StatusCodeId = 9;

            existingSample.PrintedOn = null;
            existingSample.PrintedBy = null;
            //existingSample.ResultLetterApprovedBy = null;

            existingSample.RepeatPrintKeputusan = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }




        [HttpPut("{id}")]
        public async Task<IActionResult> PutUlangCetakLembaranKerja(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 5;

            await _context.SaveChangesAsync();

            return NoContent();

        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutCheckOut(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 6;
            existingsample.InLabOn = k1Detail.InLabOn;
            existingsample.InLabBy = k1Detail.InLabBy;
            existingsample.InLabOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutResult(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 7;
            existingsample.TestedOn = k1Detail.TestedOn;
            existingsample.TestedBy = k1Detail.TestedBy;
            existingsample.TestedOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerifiedResult(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 8;
            existingsample.VerifiedOn = k1Detail.VerifiedOn;
            existingsample.VerifiedBy = k1Detail.VerifiedBy;
            existingsample.VerifiedOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutApproved(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 9;
            existingsample.ApprovedOn = k1Detail.ApprovedOn;
            existingsample.ApprovedBy = k1Detail.ApprovedBy;
            existingsample.ApprovedOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutCetakKeputusan(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 10;
            existingsample.PrintedOn = k1Detail.PrintedOn;
            existingsample.PrintedBy = k1Detail.PrintedBy;
            existingsample.PrintedOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrintResult(int id, [FromBody] K1Detail k1Detail)
        {
            var existingsample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
            if (existingsample == null) { return BadRequest(); }

            existingsample.StatusCodeId = 11;

            existingsample.ResultSentOn = k1Detail.ResultSentOn;
            existingsample.ResultSentBy = k1Detail.ResultSentBy;
            existingsample.ResultSentOn = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();


        }

       


        /* [HttpPut("{id}")]
         public async Task<IActionResult> PutRetest(int id, [FromBody] K1Detail k1Detail)
         {
             var existingSample = await _context.K1Details.Where(x => x.K1DetailId == id).FirstOrDefaultAsync();
             if (existingSample == null)
             {
                 return BadRequest();
             }

             // Check if NoOfRetest has been incremented
             if (existingSample.NoOfRetest != k1Detail.NoOfRetest)
             {
                 existingSample.StatusCodeId = 6;
                 existingSample.TestedOn = DateTime.Now; // Reset TestedOn
             }

             existingSample.TestedBy = k1Detail.TestedBy;
             existingSample.NoOfRetest = k1Detail.NoOfRetest;

             await _context.SaveChangesAsync();

             return NoContent();
         }*/



        [HttpGet("{customNo}")]
        public async Task<IActionResult> GetSamplesByCustomNo(string customNo)
        {
           
            var k1Detail = await _context.K1Details.Where(x => x.CustomNo == customNo).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                statusCodeId = x.StatusCodeId,
                labRefNo = x.LabRefNo,

                customNo = x.CustomNo,
                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),

                samplePropose = x.SamplePropose,
                sampleRunNo = x.SampleRunNo,
                creatorRoleId = x.CreatorRoleId,
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),
                sampleCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCategory).FirstOrDefault(),
            }).ToListAsync();
            return Ok(new { k1Detail });
        }



        [HttpGet("{customNo}/{statusCodeId}")]
        public async Task<IActionResult> GetResultsByCustomNo(string customNo, int statusCodeId)
        {

            var k1Detail = await _context.K1Details.Where(x => x.CustomNo == customNo && x.StatusCodeId == statusCodeId).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                batchId = x.BatchId,
                statusCodeId = x.StatusCodeId,
                labRefNo = x.LabRefNo,
                testedOn = x.TestedOn,
                testedBy = x.TestedBy,
                inLabOn = x.InLabOn,
                inLabBy = x.InLabBy,
                customNo = x.CustomNo,
                quantity = x.Quantity,
                companyId = x.CompanyId,
                companyName = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Name).FirstOrDefault(),
                companyAddress = _context.Companies.Where(y => y.CompanyId == x.CompanyId).Select(y => y.Address).FirstOrDefault(),
                samplePropose = x.SamplePropose,
                sampleRunNo = x.SampleRunNo,
                creatorRoleId = x.CreatorRoleId,
                lorryNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.LorryNo).FirstOrDefault(),
                trailerNo = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.TrailerNo).FirstOrDefault(),
                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).FirstOrDefault(),
                agentName = x.AgentName,
                importerAddress = x.ImporterAddress,
                smkimporterCode = x.SmkimportersCode,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                typeCodeId = x.TypeCodeId,
                typeCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleType).FirstOrDefault(),
                sampleCode = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCode).FirstOrDefault(),
                sampleCategory = _context.TypeCodes.Where(y => y.Id == x.TypeCodeId).Select(y => y.SampleCategory).FirstOrDefault(),
                testMethodId = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault(),
                testMethod = _context.RefTestMethods.Where(z => z.Id == (_context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TestMethodId).FirstOrDefault())).Select(y => y.TestMethod).FirstOrDefault(),

                //results
                wet1 = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Wet1).FirstOrDefault(),
                wet2 = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Wet2).FirstOrDefault(),
                dry1 = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Dry1).FirstOrDefault(),
                dry2 = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Dry2).FirstOrDefault(),
                result = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Result1).FirstOrDefault(),
                catatan = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Catatan).FirstOrDefault(),
                prove = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Prove).FirstOrDefault(),
                verifiedOn = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.VerifiedOn).FirstOrDefault(),
                verifiedBy = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.VerifiedBy).FirstOrDefault(),
                repeat = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Repeat).FirstOrDefault(),
                decisionOn = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.DecisionOn).FirstOrDefault(),
                decisionBy = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.DecisionBy).FirstOrDefault(),
                decision = _context.Results.Where(y => y.K1DetailId == x.K1DetailId).Select(y => y.Decision).FirstOrDefault(),

            }).ToListAsync();
            return Ok(k1Detail);
        }





    }
}
