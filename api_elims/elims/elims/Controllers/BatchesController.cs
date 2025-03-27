using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileSystemGlobbing;
using Microsoft.AspNetCore.DataProtection.XmlEncryption;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BatchesController : Controller
    {
        private readonly ElimsContext _context;
        private readonly IWebHostEnvironment _environment;

        public BatchesController(ElimsContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        [HttpGet("{statusCodeId}")]
        public async Task<IActionResult> GetElimsAllBatch([FromRoute] int statusCodeId)
        {

            var Batches = await _context.Batches
                .Where(batch => batch.K1Details.Any(k1Detail => k1Detail.StatusCodeId == statusCodeId))
                .OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {
                    batch.BatchId,
                    batch.ChequeNo,
                    batch.ChequeAmount,
                    batch.BankCode,
                    batch.SentOn,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    //ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    //TestMethodId = batch.TestMethodId,
                    TestMethod = _context.RefTestMethods.FirstOrDefault(testMethod => testMethod.Id == batch.TestMethodId).TestMethod,
                    batch.IsFastTrack,
                    batch.Receipt,

                    batch.PostResultOn,
                    batch.PostResultDelivery,
                    batch.PostResultCourierServices,
                    batch.PostResultTrackingNo,

                    RubberTypeId = batch.K1Details.FirstOrDefault().RubberTypeId,
                    CreatorRoleId = batch.K1Details.FirstOrDefault().CreatorRoleId,
                    TypeCodeId = batch.K1Details.FirstOrDefault().TypeCodeId,
                    SampleCount = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId),
                    //SampleApproved = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.ApprovedBy != null),
                    countSampleBasedSameBatchId = _context.K1Details.Count(k1Detail => k1Detail.BatchId == batch.BatchId),
                    StatusCode = _context.StatusCodes.FirstOrDefault(statusCode => statusCode.StatusCodeId == batch.K1Details.FirstOrDefault().StatusCodeId).Status,
                    //ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,
                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.Username == batch.SentBy).StaffName,
                    ApprovedOn = batch.K1Details.FirstOrDefault().ApprovedOn,
                    //TestedOn = batch.K1Details.FirstOrDefault().TestedOn,
                    StatusCodeId = batch.K1Details.FirstOrDefault().StatusCodeId,
                    InLabBy = batch.K1Details.FirstOrDefault().InLabBy,
                    //noLaporanTuan = batch.K1Details.FirstOrDefault().NoLaporanTuan,
                    ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,
                    Samples = batch.K1Details
                                .Where(k1Detail => k1Detail.StatusCodeId == statusCodeId)
                                .Select(k1Detail => new
                                {
                                    k1Detail.BatchId,
                                    k1Detail.LabRefNo,
                                    k1Detail.ImporterName,
                                    k1Detail.StatusCodeId,
                                    k1Detail.CustomNo,
                                    k1Detail.K1DetailId,
                                    k1Detail.ReceivedOn,
                                    //k1Detail.ForwarderId,
                                    //k1Detail.TestedOn,
                                    //k1Detail.TypeCodeId,
                                    TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == k1Detail.TypeCodeId).SampleType,
                                    k1Detail.Quantity,
                                    ImportedDate = k1Detail.K1Header.ImportedDate,
                                    k1Detail.WorksheetTestOn,
                                    k1Detail.CreatorRoleId,
                                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.StaffName == batch.SentBy).StaffName,
                                    Result = _context.Results.Where(r => r.K1DetailId == k1Detail.K1DetailId).Select(r => r.Result1).FirstOrDefault()
                                }),
                })
                .ToListAsync();

            return Ok(Batches);
        }



       











        /*  [HttpGet("{statusCodeId}")]
          public async Task<IActionResult> GetElimsAllBatch10([FromRoute] int statusCodeId)
          {
              // Prefetch related data to avoid multiple database calls
              var forwarders = await _context.Forwarders.ToDictionaryAsync(f => f.ForwarderId, f => f.Name);
              var rubberTypes = await _context.RefRubberTypes.ToDictionaryAsync(r => r.Id, r => r.RubberType);
              var testMethods = await _context.RefTestMethods.ToDictionaryAsync(t => t.Id, t => t.TestMethod);
              var typeCodes = await _context.TypeCodes.ToDictionaryAsync(t => t.Id, t => t.SampleType);
              var staffs = await _context.Staffs.ToDictionaryAsync(s => s.Username, s => s.StaffName);

              var batches = await _context.Batches
                  .Include(batch => batch.K1Details)
                      .ThenInclude(k1Detail => k1Detail.K1Header)
                  .Where(batch => batch.K1Details.Any(k1Detail => k1Detail.StatusCodeId == statusCodeId))
                  .OrderBy(batch => batch.BatchId)
                  .Select(batch => new
                  {
                      batch.BatchId,
                      batch.ChequeNo,
                      batch.ChequeAmount,
                      batch.BankCode,
                      batch.SentOn,
                      ReceivedOn = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.ReceivedOn,
                      ForwarderName = forwarders.GetValueOrDefault(batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.ForwarderId ?? 0),
                      RubberType = rubberTypes.GetValueOrDefault(batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.RubberTypeId ?? 0),
                      TestMethod = testMethods.GetValueOrDefault(batch.TestMethodId ?? 0),
                      batch.IsFastTrack,
                      batch.Receipt,
                      batch.PostResultOn,
                      batch.PostResultDelivery,
                      batch.PostResultCourierServices,
                      batch.PostResultTrackingNo,
                      RubberTypeId = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.RubberTypeId,
                      CreatorRoleId = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.CreatorRoleId,
                      TypeCodeId = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.TypeCodeId,
                      SampleCount = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId),
                      countSampleBasedSameBatchId = batch.K1Details.Count,
                      StaffName = staffs.GetValueOrDefault(batch.SentBy),
                      ApprovedOn = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.ApprovedOn,
                      ImportedDate = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.StatusCodeId == statusCodeId)?.K1Header?.ImportedDate,
                      Samples = batch.K1Details
                          .Where(k1Detail => k1Detail.StatusCodeId == statusCodeId)
                          .Select(k1Detail => new
                          {
                              k1Detail.BatchId,
                              k1Detail.LabRefNo,
                              k1Detail.ImporterName,
                              k1Detail.StatusCodeId,
                              k1Detail.CustomNo,
                              k1Detail.K1DetailId,
                              k1Detail.ReceivedOn,
                              TypeCode = typeCodes.GetValueOrDefault(k1Detail.TypeCodeId ?? 0),
                              k1Detail.Quantity,
                              ImportedDate = k1Detail.K1Header?.ImportedDate,
                              k1Detail.WorksheetTestOn,
                              k1Detail.CreatorRoleId,
                              StaffName = staffs.GetValueOrDefault(batch.SentBy),
                              //Result = results.GetValueOrDefault(k1Detail.K1DetailId)

                          }).ToList()
                  })
                  .ToListAsync();

              return Ok(batches);
          }*/






        [HttpGet("{statusCodeId}")]
        public async Task<IActionResult> GetElimsAllBatch1([FromRoute] int statusCodeId)
        {


            var Batches = await _context.Batches
                .Where(batch => batch.K1Details.Any(k1Detail => k1Detail.StatusCodeId == statusCodeId))
                .OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {
                    batch.BatchId,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    batch.IsFastTrack,
                    //ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    batch.BankCode,
                    batch.ChequeNo,
                    batch.ChequeAmount,
                    batch.SentOn,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    //TestMethodId = batch.TestMethodId,
                    TestMethod = _context.RefTestMethods.FirstOrDefault(testMethod => testMethod.Id == batch.TestMethodId).TestMethod,
                    batch.Receipt,
                    SampleCount = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId),
                    ApprovedOn = batch.K1Details.FirstOrDefault().ApprovedOn,
                    //RubberTypeId = batch.K1Details.FirstOrDefault().RubberTypeId,
                    //CreatorRoleId = batch.K1Details.FirstOrDefault().CreatorRoleId,
                    batch.PostResultOn,
                    batch.PostResultDelivery,
                    batch.PostResultCourierServices,
                    batch.PostResultTrackingNo,
                    //StatusCodeId = batch.K1Details.FirstOrDefault().StatusCodeId,
                    /* //LabRefNo = batch.K1Details.FirstOrDefault().LabRefNo,
                     TypeCodeId = batch.K1Details.FirstOrDefault().TypeCodeId,
                     //SampleApproved = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.ApprovedBy != null),
                     countSampleBasedSameBatchId = _context.K1Details.Count(k1Detail => k1Detail.BatchId == batch.BatchId),
                     StatusCode = _context.StatusCodes.FirstOrDefault(statusCode => statusCode.StatusCodeId == batch.K1Details.FirstOrDefault().StatusCodeId).Status,
                     //ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,
                     StaffName = _context.Staffs.FirstOrDefault(staff => staff.Username == batch.SentBy).StaffName,
                     //TestedOn = batch.K1Details.FirstOrDefault().TestedOn,
                     InLabBy = batch.K1Details.FirstOrDefault().InLabBy,
                     ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,*/
                    Samples = batch.K1Details
                                .Where(k1Detail => k1Detail.StatusCodeId == statusCodeId)
                                .Select(k1Detail => new
                                {
                                    k1Detail.K1DetailId,
                                    k1Detail.BatchId,
                                    k1Detail.CustomNo,
                                    k1Detail.ImporterName,
                                    TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == k1Detail.TypeCodeId).SampleType,
                                    ImportedDate = k1Detail.K1Header.ImportedDate,
                                    k1Detail.Quantity,
                                    k1Detail.LabRefNo,
                                    k1Detail.ReceivedOn,
                               /*     
                                    k1Detail.WorksheetTestOn,
                                     k1Detail.StatusCodeId,
                                     k1Detail.K1DetailId,
                                     k1Detail.CreatorRoleId,
                                     StaffName = _context.Staffs.FirstOrDefault(staff => staff.StaffName == batch.SentBy).StaffName,
                                     Result = _context.Results.Where(r => r.K1DetailId == k1Detail.K1DetailId).Select(r => r.Result1).FirstOrDefault()*/
                                }),

                })
                .ToListAsync();

            return Ok(Batches);
        }


        [HttpPost]
        public async Task<IActionResult> GetElimsAllBatch2([FromBody] List<int> statusCodeIds)
        {
            if (statusCodeIds == null || !statusCodeIds.Any())
            {
                return BadRequest("StatusCodeIds cannot be null or empty.");
            }

            var Batches = await _context.Batches
                .Where(batch => batch.K1Details.Any(k1Detail => statusCodeIds.Contains(k1Detail.StatusCodeId.Value)))
                .OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {
                    batch.BatchId,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    batch.IsFastTrack,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    batch.BankCode,
                    batch.ChequeNo,
                    batch.ChequeAmount,
                    batch.SentOn,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    TestMethod = _context.RefTestMethods.FirstOrDefault(testMethod => testMethod.Id == batch.TestMethodId).TestMethod,
                    batch.Receipt,
                    SampleCount = batch.K1Details.Count(k1Detail => statusCodeIds.Contains(k1Detail.StatusCodeId.Value)),
                    ApprovedOn = batch.K1Details.FirstOrDefault().ApprovedOn,
                    Samples = batch.K1Details
                        .Where(k1Detail => statusCodeIds.Contains(k1Detail.StatusCodeId.Value))
                        .Select(k1Detail => new
                        {
                            k1Detail.K1DetailId,
                            k1Detail.BatchId,
                            k1Detail.CustomNo,
                            k1Detail.ImporterName,
                            TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == k1Detail.TypeCodeId).SampleType,
                            ImportedDate = k1Detail.K1Header.ImportedDate,
                            k1Detail.Quantity,
                            k1Detail.LabRefNo,
                            k1Detail.ReceivedOn
                        })
                })
                .ToListAsync();

            return Ok(Batches);
        }



        [HttpGet("{statusCodeId}")]
        public async Task<IActionResult> GetDateReceivedInLab([FromRoute] int statusCodeId)
        {
            var Batches = await _context.Batches
                .Where(batch => batch.K1Details.Any(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.DateReceivedInLab != null))
                .OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {
                    batch.BatchId,
                    batch.ChequeNo,
                    batch.ChequeAmount,
                    batch.BankCode,
                    batch.SentOn,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    DateReceivedInLab = batch.K1Details.FirstOrDefault(k1Detail => k1Detail.DateReceivedInLab != null).DateReceivedInLab,
                    ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    batch.DateSampleDelivered,
                    batch.Delivery,
                    batch.CourierServices,
                    batch.TrackingNo,
                    batch.SuratIringan,
                    TestMethodId = batch.TestMethodId,
                    DefaultTestMethod = batch.DefaultTestMethod,
                    TestMethod = _context.RefTestMethods.FirstOrDefault(testMethod => testMethod.Id == batch.TestMethodId).TestMethod,
                    batch.IsFastTrack,
                    batch.LetterPrinted,
                    batch.MemoPrinted,
                    batch.Receipt,

                    batch.PostResultOn,
                    batch.PostResultDelivery,
                    batch.PostResultCourierServices,
                    batch.PostResultTrackingNo,

                    RubberTypeId = batch.K1Details.FirstOrDefault().RubberTypeId,
                    CreatorRoleId = batch.K1Details.FirstOrDefault().CreatorRoleId,
                    LabRefNo = batch.K1Details.FirstOrDefault().LabRefNo,
                    TypeCodeId = batch.K1Details.FirstOrDefault().TypeCodeId,
                    SampleCount = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId),
                    SampleApproved = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.ApprovedBy != null),
                    StatusCodeId = batch.K1Details.FirstOrDefault().StatusCodeId,
                    StatusCode = _context.StatusCodes.FirstOrDefault(statusCode => statusCode.StatusCodeId == batch.K1Details.FirstOrDefault().StatusCodeId).Status,
                    ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,
                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.Username == batch.SentBy).StaffName,
                    ApprovedOn = batch.K1Details.FirstOrDefault().ApprovedOn,
                    Samples = batch.K1Details
                                .Where(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.DateReceivedInLab != null)
                                .Select(k1Detail => new
                                {
                                    k1Detail.BatchId,
                                    k1Detail.LabRefNo,
                                    k1Detail.ImporterName,
                                    k1Detail.StatusCodeId,
                                    k1Detail.CustomNo,
                                    k1Detail.K1DetailId,
                                    k1Detail.ReceivedOn,
                                    k1Detail.ForwarderId,
                                    //k1Detail.TypeCodeId,
                                    TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == k1Detail.TypeCodeId).SampleType,
                                    k1Detail.Quantity,
                                    ImportedDate = k1Detail.K1Header.ImportedDate,
                                    k1Detail.WorksheetTestOn,
                                    k1Detail.CreatorRoleId,
                                    k1Detail.DateReceivedInLab,
                                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.StaffName == batch.SentBy).StaffName,
                                }),

                })
                .ToListAsync();

            return Ok(Batches);
        }




        [HttpGet("{statusCodeId}")]
        public async Task<IActionResult> GetKeputusanUjian([FromRoute] int statusCodeId)
        {
            var Batches = await _context.Batches
                .Where(batch => batch.K1Details.Any(k1Detail => k1Detail.StatusCodeId == statusCodeId))
                .OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {
                    batch.BatchId,
                    batch.ChequeNo,
                    batch.ChequeAmount,
                    batch.BankCode,
                    batch.SentOn,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    batch.DateSampleDelivered,
         /*           batch.Delivery,
                    batch.CourierServices,
                    batch.TrackingNo,
                    batch.SuratIringan,
                    TestMethodId = batch.TestMethodId,
                    DefaultTestMethod = batch.DefaultTestMethod,
                    TestMethod = _context.RefTestMethods.FirstOrDefault(testMethod => testMethod.Id == batch.TestMethodId).TestMethod,
                    batch.IsFastTrack,
                    batch.LetterPrinted,*/
                    batch.MemoPrinted,
                    batch.Receipt,
                    RubberTypeId = batch.K1Details.FirstOrDefault().RubberTypeId,
                    CreatorRoleId = batch.K1Details.FirstOrDefault().CreatorRoleId,
                    LabRefNo = batch.K1Details.FirstOrDefault().LabRefNo,
                    TypeCodeId = batch.K1Details.FirstOrDefault().TypeCodeId,
                    SampleCount = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId),
                    SampleApproved = batch.K1Details.Count(k1Detail => k1Detail.StatusCodeId == statusCodeId && k1Detail.ApprovedBy != null),
                    StatusCodeId = batch.K1Details.FirstOrDefault().StatusCodeId,
                    StatusCode = _context.StatusCodes.FirstOrDefault(statusCode => statusCode.StatusCodeId == batch.K1Details.FirstOrDefault().StatusCodeId).Status,
                    ImportedDate = batch.K1Details.FirstOrDefault().K1Header.ImportedDate,
                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.Username == batch.SentBy).StaffName,
                    ApprovedOn = batch.K1Details.FirstOrDefault().ApprovedOn,
                    Samples = batch.K1Details
                                .Where(k1Detail => k1Detail.StatusCodeId == statusCodeId)
                                .Select(k1Detail => new
                                {
                                    k1Detail.BatchId,
                                    k1Detail.LabRefNo,
                                    k1Detail.ImporterName,
                                    k1Detail.StatusCodeId,
                                    k1Detail.CustomNo,
                                    k1Detail.K1DetailId,
                                    k1Detail.ReceivedOn,
                                    k1Detail.ForwarderId,
                                    StatusCode = _context.StatusCodes.FirstOrDefault(statusCode => statusCode.StatusCodeId == k1Detail.StatusCodeId).Status,
                                    TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == k1Detail.TypeCodeId).SampleType,
                                    k1Detail.Quantity,
                                    ImportedDate = k1Detail.K1Header.ImportedDate,
                                    k1Detail.WorksheetTestOn,
                                    k1Detail.CreatorRoleId,
                                    StaffName = _context.Staffs.FirstOrDefault(staff => staff.StaffName == batch.SentBy).StaffName,
                                    Result = _context.Results.FirstOrDefault(result => result.K1DetailId == k1Detail.K1DetailId).Result1,
                                }),

                })
                .ToListAsync();

            return Ok(Batches);
        }



        [HttpGet]
        public async Task<IActionResult> GetBatchByStatusCodeId([FromQuery] List<int?> statusCodeId)
        {
            var Batches = await _context.Batches
                //.Include("K1Details")
                .Where(batch => batch.K1Details.Any(detail => statusCodeId.Contains(detail.StatusCodeId)))
                //.OrderBy(batch => batch.BatchId)
                .Select(batch => new
                {

                    batch.BatchId,
                    ReceivedOn = batch.K1Details.FirstOrDefault().ReceivedOn,
                    ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                    ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                    RubberType = _context.RefRubberTypes.FirstOrDefault(rubberType => rubberType.Id == batch.K1Details.FirstOrDefault().RubberTypeId).RubberType,
                    batch.SentOn,
                    SampleCount = batch.K1Details.Count(detail => statusCodeId.Contains(detail.StatusCodeId)),

                    //Batch = batch,
                    Samples = batch.K1Details
                        .Where(detail => statusCodeId.Contains(detail.StatusCodeId))
                        .Select(detail => new
                        {
                            detail.BatchId,
                            detail.LabRefNo,
                            detail.ImporterName,
                            detail.StatusCodeId,
                            detail.CustomNo,
                            detail.K1DetailId,
                            detail.ReceivedOn,
                            TypeCode = detail.TypeCodeId != null ? _context.TypeCodes.FirstOrDefault(code => code.Id == detail.TypeCodeId).SampleType : null,
                            detail.Quantity,
                            ImportedDate = detail.K1Header.ImportedDate,
                            detail.WorksheetTestOn,
                            detail.CreatorRoleId,
                            StaffName = _context.Staffs.FirstOrDefault(s => s.StaffName == batch.SentBy).StaffName,
                            ForwarderId = batch.K1Details.FirstOrDefault().ForwarderId,
                            ForwarderName = _context.Forwarders.FirstOrDefault(forwarder => forwarder.ForwarderId == batch.K1Details.FirstOrDefault().ForwarderId).Name,
                            RubberTypeId = batch.K1Details.FirstOrDefault().RubberTypeId,
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(Batches);
        }





        [HttpGet("{statusCodeId}")]
        public async Task<IActionResult> SearchGetElimsAllBatch([FromRoute] int statusCodeId, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var query = _context.Batches
                .Where(x => _context.K1Details.Any(y => y.BatchId == x.BatchId && y.StatusCodeId == statusCodeId));

            // Apply filtering based on fromDate and toDate
            if (fromDate != null)
            {
                query = query.Where(x => x.SentOn >= fromDate);
            }
            if (toDate != null)
            {
                query = query.Where(x => x.SentOn <= toDate);
            }

            var Batches = await query.Select(x => new
            {
                batchId = x.BatchId,
                chequeNo = x.ChequeNo,
                // Other properties...
                samples = x.K1Details.Where(y => y.StatusCodeId == statusCodeId).Select(y => new
                {
                    // Sample properties...
                }),
            }).OrderBy(x => x.batchId).ToListAsync();

            return Ok(Batches);
        }





        [HttpGet("{statusCodeId}/{inLabBy}")]
        public async Task<IActionResult> GetBatchByInLabBy([FromRoute] int statusCodeId, [FromRoute] string inLabBy)
        {
            var Batches = await _context.Batches.Where(x => _context.K1Details.Any(y => y.BatchId == x.BatchId && y.InLabBy == inLabBy && y.StatusCodeId == statusCodeId))
                .Select(x => new
                {
                    batchId = x.BatchId,
                    chequeNo = x.ChequeNo,
                    chequeAmount = x.ChequeAmount,
                    bankCode = x.BankCode,
                    sentOn = x.SentOn,
                    forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                    forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),
                    importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                    statusCodeId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).FirstOrDefault(),
                    receivedOn = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ReceivedOn).FirstOrDefault(),
                    dateSampleDelivered = x.DateSampleDelivered,
                    delivery = x.Delivery,
                    courierServices = x.CourierServices,
                    trackingNo = x.TrackingNo,
                    //suratIringan = x.SuratIringan,
                    //testMethodId = x.TestMethodId,
                    //defaultTestMethod = x.DefaultTestMethod,
                    //testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                    //isFastTrack = x.IsFastTrack,
                    //letterPrinted = x.LetterPrinted,
                    //memoPrinted = x.MemoPrinted,
                    receipt = x.Receipt,
                    rubberTypeId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.RubberTypeId).FirstOrDefault(),
                    labRefNo = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.LabRefNo).FirstOrDefault(),
                    rubberType = _context.RefRubberTypes.Where(z => z.Id == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.RubberTypeId).FirstOrDefault())).Select(y => y.RubberType).FirstOrDefault(),
                    sampleCount = _context.K1Details.Count(y => y.BatchId == x.BatchId && y.StatusCodeId == statusCodeId),
                    samples = x.K1Details.Where(y => y.StatusCodeId == statusCodeId).Select(y => new
                    {
                        labRefNo = y.LabRefNo,
                        importerName = y.ImporterName,
                        statusCodeId = y.StatusCodeId,
                        customNo = y.CustomNo,
                        k1DetailId = y.K1DetailId,
                        TypeCode = _context.TypeCodes.FirstOrDefault(typeCode => typeCode.Id == y.TypeCodeId).SampleType,
                        quantity = y.Quantity,
                        receivedOn = y.ReceivedOn,
                        importedDate = y.K1Header.ImportedDate
                    })
                }).ToListAsync();

            return Ok(Batches);
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

            }).ToListAsync();
            return Ok(elimsContext);
        }


        [HttpGet("{sentby}")]
        public async Task<IActionResult> GetElimsBatchBySendBy([FromRoute] string sentby)
        {

            var Batches = await _context.Batches.Where(x => x.SentBy == sentby).Select(x => new

            {
                batchId = x.BatchId,
                chequeNo = x.ChequeNo,
                chequeAmount = x.ChequeAmount,
                bankCode = x.BankCode,
                sentOn = x.SentOn,
                uipRegNo = x.UipRegNo,
                forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),

                //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),
                importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                customNo = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CustomNo).FirstOrDefault(),
                /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                  companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).ToList(),

                dateSampleDelivered = x.DateSampleDelivered,
                delivery = x.Delivery,
                courierServices = x.CourierServices,
                trackingNo = x.TrackingNo,
                testMethodId = x.TestMethodId,
                defaultTestMethod = x.DefaultTestMethod,
                testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                isFastTrack = x.IsFastTrack,
                memoPrinted = x.MemoPrinted,

                samples = x.K1Details.Select(y => new
                {
                    labRefNo = y.LabRefNo,
                    importerName = y.ImporterName,
                    statusCodeId = y.StatusCodeId,
                    customNo = y.CustomNo,
                    k1DetailId = y.K1DetailId,
                    TypeCode = _context.TypeCodes.Where(z => z.Id == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.TypeCodeId).FirstOrDefault())).Select(y => y.SampleType).FirstOrDefault(),
                    quantity = y.Quantity,
                    receivedOn = y.ReceivedOn,
                    importedDate = y.K1Header.ImportedDate
                }),

            }).ToListAsync();

            return Ok(Batches);
        }





        [HttpGet("{sentby}")]
        public async Task<IActionResult> GetElimsBatchBySendByNull1([FromRoute] string sentby)
        {
            var Batches = await _context.Batches
                .Where(x => x.SentBy == sentby && x.CourierServices == null && x.BatchPrinted == null) // Check for null CourierServices
                .Select(x => new
                {
                    batchId = x.BatchId,
                    chequeNo = x.ChequeNo,
                    chequeAmount = x.ChequeAmount,
                    bankCode = x.BankCode,
                    sentOn = x.SentOn,
                    uipRegNo = x.UipRegNo,
                    forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                    forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),

                    //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),
                    importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                    customNo = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CustomNo).FirstOrDefault(),
                    /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                      companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                    statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).ToList(),


                    dateSampleDelivered = x.DateSampleDelivered,
                    delivery = x.Delivery,
                    courierServices = x.CourierServices,
                    trackingNo = x.TrackingNo,
                    /*                    testMethodId = x.TestMethodId,
                                        defaultTestMethod = x.DefaultTestMethod,
                                        testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                                        isFastTrack = x.IsFastTrack,
                                        memoPrinted = x.MemoPrinted,*/
                    samples = x.K1Details.Select(y => new
                    {
                        labRefNo = y.LabRefNo,
                        importerName = y.ImporterName,
                        statusCodeId = y.StatusCodeId,
                        customNo = y.CustomNo,
                        k1DetailId = y.K1DetailId,
                        TypeCode = _context.TypeCodes.Where(z => z.Id == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.TypeCodeId).FirstOrDefault())).Select(y => y.SampleType).FirstOrDefault(),
                        quantity = y.Quantity,
                        receivedOn = y.ReceivedOn,
                        importedDate = y.K1Header.ImportedDate
                    }),

                }).ToListAsync();

            return Ok(Batches);
        }





        [HttpGet("{sentby}")]
        public async Task<IActionResult> GetElimsBatchBySendByNotNull([FromRoute] string sentby)
        {

            var Batches = await _context.Batches
                .Where(x => x.SentBy == sentby && x.CourierServices != null && x.BatchPrinted == null) // Check for non-null CourierServices
                .Select(x => new
                {
                    batchId = x.BatchId,
                    chequeNo = x.ChequeNo,
                    chequeAmount = x.ChequeAmount,
                    bankCode = x.BankCode,
                    sentOn = x.SentOn,
                    uipRegNo = x.UipRegNo,
                    forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                    forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),

                    //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),
                    importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                    customNo = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CustomNo).FirstOrDefault(),
                    /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                      companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                    statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).ToList(),


                    dateSampleDelivered = x.DateSampleDelivered,
                    delivery = x.Delivery,
                    courierServices = x.CourierServices,
                    trackingNo = x.TrackingNo,
                    /*           testMethodId = x.TestMethodId,
                               defaultTestMethod = x.DefaultTestMethod,
                               testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                               isFastTrack = x.IsFastTrack,
                               memoPrinted = x.MemoPrinted,*/
                    samples = x.K1Details.Select(y => new
                    {
                        labRefNo = y.LabRefNo,
                        importerName = y.ImporterName,
                        statusCodeId = y.StatusCodeId,
                        customNo = y.CustomNo,
                        k1DetailId = y.K1DetailId,
                        TypeCode = _context.TypeCodes.Where(z => z.Id == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.TypeCodeId).FirstOrDefault())).Select(y => y.SampleType).FirstOrDefault(),
                        quantity = y.Quantity,
                        receivedOn = y.ReceivedOn,
                        importedDate = y.K1Header.ImportedDate
                    }),

                }).ToListAsync();

            return Ok(Batches);
        }



        [HttpPost]
        public async Task<IActionResult> PostElimsBatches([FromBody] Batch batch)
        {
            var batchData = new Batch
            {
                BankCode = batch.BankCode,
                ChequeAmount = batch.ChequeAmount,
                ChequeNo = batch.ChequeNo,
                Receipt = batch.Receipt,
                Date = batch.Date,
                TransactionNo = batch.TransactionNo,
                SentOn = DateTime.Now,
                SentBy = batch.SentBy,
                Memo = batch.Memo,
                TestMethodId = batch.TestMethodId,
                DefaultTestMethod = batch.DefaultTestMethod,
                //testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault()
                IsFastTrack = batch.IsFastTrack,
                LetterPrinted = batch.LetterPrinted,
                MemoPrinted = batch.MemoPrinted
            };
            _context.Batches.Add(batchData);
            await _context.SaveChangesAsync();

            return Ok(batchData);
        }




        [HttpGet("{batchId}")]
        public async Task<IActionResult> GetBatchByBatchId(int batchId)
        {
            var batches = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => new
            {
                batchId = x.BatchId,
                chequeNo = x.ChequeNo,
                chequeAmount = x.ChequeAmount,
                bankCode = x.BankCode,
                sentOn = x.SentOn,
                forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),

                //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),

                importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                  companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).FirstOrDefault(),

                dateSampleDelivered = x.DateSampleDelivered,
                delivery = x.Delivery,
                courierServices = x.CourierServices,
                trackingNo = x.TrackingNo,
                suratIringan = x.SuratIringan,
                testMethodId = x.TestMethodId,
                defaultTestMethod = x.DefaultTestMethod,
                testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                isFastTrack = x.IsFastTrack,
                memoPrinted = x.MemoPrinted,
            }).ToListAsync();

            return Ok(batches);
        }




        [HttpGet("{batchId}")]
        public async Task<IActionResult> GetSamplesByBatchId(int batchId)
        {
            var batches = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => new
            {
                batchId = x.BatchId,
                chequeNo = x.ChequeNo,
                chequeAmount = x.ChequeAmount,
                bankCode = x.BankCode,
                sentOn = x.SentOn,
                forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),

                //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),

                importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                  companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).FirstOrDefault(),

                dateSampleDelivered = x.DateSampleDelivered,
                delivery = x.Delivery,
                courierServices = x.CourierServices,
                trackingNo = x.TrackingNo,
                suratIringan = x.SuratIringan,
                testMethodId = x.TestMethodId,
                defaultTestMethod = x.DefaultTestMethod,
                testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                isFastTrack = x.IsFastTrack,
                memoPrinted = x.MemoPrinted,
                uipRegNo = x.UipRegNo,


                transactionNo = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.TransactionNo).FirstOrDefault(),
                date = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Date).FirstOrDefault(),
                receipt = _context.Batches.Where(y => y.BatchId == x.BatchId).Select(y => y.Receipt).FirstOrDefault(),
 
                staffName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.StaffName).FirstOrDefault(),
                position = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Position).FirstOrDefault(),
                office = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.Office).FirstOrDefault(),
                hpNo = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.HpNo).FirstOrDefault(),
                unitName = _context.Staffs.Where(s => s.Username == x.SentBy).Select(s => s.UnitName).FirstOrDefault(),
            }).FirstOrDefaultAsync();

            var k1Detail = await _context.K1Details.Where(x => x.BatchId == batchId).Select(x => new
            {
                k1DetailId = x.K1DetailId,
                k1HeaderId = x.K1HeaderId,
                statusCodeId = x.StatusCodeId,

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
            return Ok(new { batches , k1Detail });
        }




        [HttpPut]
        public async Task<IActionResult> PutBatchUipbkhRefRunNo([FromBody] Batch batch)
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batch.BatchId).FirstOrDefaultAsync();

            if (existingBatch != null)
            {
                existingBatch.UipRegNo = batch.UipRegNo;
            }

            await _context.SaveChangesAsync();

            return Ok(batch);


        }


        [HttpPut]
        public async Task<IActionResult> PutBatchUipRefRunNo([FromBody] Batch batch)
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batch.BatchId).FirstOrDefaultAsync();

            if (existingBatch != null)
            {
                existingBatch.UipRegNo = batch.UipRegNo;
            }

            await _context.SaveChangesAsync();

            return Ok(batch);


        }



        [HttpPut("{batchid}")]
        public async Task<IActionResult> PutMemoPrinted([FromRoute] int batchid  )
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batchid).FirstOrDefaultAsync();

            if (existingBatch != null)
            {
                existingBatch.MemoPrinted = true;
            }

            await _context.SaveChangesAsync();

            return Ok();

        }


        [HttpPut]
        public async Task<IActionResult> PostTarikhSampelDihantar([FromBody] Batch batch)
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batch.BatchId).FirstOrDefaultAsync();
            if (existingBatch != null)
            {
                // Update existing batch with new values
                existingBatch.DateSampleDelivered = batch.DateSampleDelivered;
                existingBatch.CourierServices = batch.CourierServices;
                existingBatch.TrackingNo = batch.TrackingNo;
                existingBatch.Delivery = batch.Delivery;
                existingBatch.Memo = batch.Memo;

            }
            else
            {
                // Add new batch to the database
                return NotFound();
                // _context.Batches.Add(batch);
            }

            await _context.SaveChangesAsync();

            return Ok(batch);
        }


        [HttpPut]
        public async Task<IActionResult> PutResultDate([FromBody] Batch batch)
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batch.BatchId).FirstOrDefaultAsync();
            if (existingBatch != null)
            {
                // Update existing batch with new values
                existingBatch.PostResultOn = batch.PostResultOn;
                existingBatch.PostResultDelivery = batch.PostResultDelivery;
                existingBatch.PostResultCourierServices = batch.PostResultCourierServices;
                existingBatch.PostResultTrackingNo = batch.PostResultTrackingNo;

            }
            else
            {
                // Add new batch to the database
                return NotFound();
                // _context.Batches.Add(batch);
            }

            await _context.SaveChangesAsync();

            return Ok(batch);
        }



        [HttpPut]
        public async Task<IActionResult> PostUipTarikhSampelDihantar([FromBody] Batch batch)
        {
            var existingBatch = await _context.Batches.Where(x => x.UipRegNo == batch.UipRegNo).FirstOrDefaultAsync();
            if (existingBatch != null)
            {
                // Update existing batch with new values
                existingBatch.DateSampleDelivered = batch.DateSampleDelivered;
                existingBatch.CourierServices = batch.CourierServices;
                existingBatch.TrackingNo = batch.TrackingNo;
                existingBatch.Delivery = batch.Delivery;
                existingBatch.Memo = batch.Memo;
            }
            else
            {
                // Add new batch to the database
                return NotFound();
            }

            await _context.SaveChangesAsync();

            return Ok(batch);

        }


        [HttpPost("{batchId}")]
        public async Task<IActionResult> UploadReceipt([FromRoute] int batchId, IFormFile file)
        {
            var details = await _context.Batches.Where(x => x.BatchId == batchId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No batch");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{batchId}_{details.Receipt}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\receipt", fileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    return Ok();
                }

                return BadRequest("No file was provided.");
            }
        }



        [HttpPost("{batchId}")]
        public async Task<IActionResult> SaveFile([FromRoute] int batchId, IFormFile file)
        {
            var details = await _context.Batches.Where(x => x.BatchId == batchId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No K1Details");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{batchId}_{details.Memo}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\memo", fileName);
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



        [HttpPost("{batchId}")]
        public async Task<IActionResult> UploadMemo([FromRoute] int batchId, IFormFile file)
        {
            var details = await _context.Batches.Where(x => x.BatchId == batchId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No batch");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{batchId}_{details.Receipt}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\memo", fileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    return Ok();
                }

                return BadRequest("No file was provided.");
            }
        }



        [HttpGet("{batchId}/{staffId}")]
        public async Task<IActionResult> GetBatchByBatchIdStaff([FromRoute] int batchId, [FromRoute] int staffId)
        {
            var elimsContext = await _context.Batches
                .Where(x => x.BatchId == batchId)
                .FirstOrDefaultAsync();

            var staffData = await _context.Staffs
                .Where(x => x.StaffId == staffId)
            .FirstOrDefaultAsync();

            if (elimsContext == null || staffData == null)
            {
                return NotFound(); // or return a specific error response
            }

            // Assuming you want to return both data
            var result = new
            {
                Batch = elimsContext,
                Staff = staffData
            };

            return Ok(result);
        }



        [HttpGet("{batchId}/{username}")]
        public async Task<IActionResult> GetSuratIringanByUsername([FromRoute] int batchId, [FromRoute] string username)
        {
            var elimsContext = await _context.Batches
                .Where(x => x.BatchId == batchId)
                .FirstOrDefaultAsync();

            var userData = await _context.LoginForwarders
                .Where(x => x.Username == username).Select(x => new
                {
                    username = x.Username,
                    password = x.Password,
                    forwarderId = x.ForwarderId,
                    name = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Name).FirstOrDefault(),
                    customOfficeId = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.CustomOfficeId).FirstOrDefault(),
                    address = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Address).FirstOrDefault(),
                    code = _context.Forwarders.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.Code).FirstOrDefault(),
                    smkimportersCode = _context.Forwarders.Where(y => y.ForwarderId == (_context.Companies.Where(z => z.CompanyId == x.ForwarderId).Select(z => z.CompanyId).FirstOrDefault())).Select(y => y.ForwarderId).FirstOrDefault(),
                    /*     isNorthen = _context.CustomOffices.Where(y => y.ForwarderId == x.ForwarderId).Select(y => y.IsNorthen).ToList(),*/
                    locked = x.Locked
                })
            .FirstOrDefaultAsync();

            if (elimsContext == null || userData == null)
            {
                return NotFound(); // or return a specific error response
            }

            // Assuming you want to return both data
            var result = new
            {
                Batch = elimsContext,
                User = userData
            };

            return Ok(result);
        }




        [HttpPost("{batchId}")]
        public async Task<IActionResult> uploadSuratIringan1([FromRoute] int batchId, IFormFile file)
        {
           var details = await _context.Batches.Where(x => x.BatchId == batchId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No batch");
           }
            else
            {
               if (file != null)
              {
                   var fileName = $"{batchId}_{details.SuratIringan}";
                   var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\suratIringan", fileName);
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


        [HttpPost("{batchId}")]
        public async Task<IActionResult> uploadSuratIringan([FromRoute] int batchId, [FromBody] byte[] pdfBlob)
        {
            // Ensure the batchId is valid
            var details = await _context.Batches.FindAsync(batchId);
            if (details == null)
            {
                return NotFound("Batch not found");
            }

            // Save the PDF file
            try
            {
                var fileName = $"{batchId}_{details.SuratIringan}.pdf";
                var filePath = Path.Combine(_environment.WebRootPath, "suratIringan", fileName);

                await System.IO.File.WriteAllBytesAsync(filePath, pdfBlob);

                return Ok("File uploaded successfully");
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error saving PDF file: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }



        [HttpGet("withSamplesStatusCode6")]
        public async Task<IActionResult> GetBatchesWithSamplesStatusCode6()
        {
            try
            {
                var batches = await _context.Batches
                    .Where(batch => _context.K1Details.Any(sample => sample.BatchId == batch.BatchId && sample.StatusCodeId == 6))
                    .Select(x => new
                    {
                        batchId = x.BatchId,
                        chequeNo = x.ChequeNo,
                        chequeAmount = x.ChequeAmount,
                        bankCode = x.BankCode,
                        sentOn = x.SentOn,
                        forwarderId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault(),
                        forwarderName = _context.Forwarders.Where(z => z.ForwarderId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ForwarderId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),
                        //unitName = _context.Staffs.Where(y => y.StaffId == x.BatchId).Select(y => y.UnitName).FirstOrDefault(),
                        importerName = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.ImporterName).FirstOrDefault(),
                        /*  companyId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault(),
                          companyName = _context.Companies.Where(z => z.CompanyId == (_context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.CompanyId).FirstOrDefault())).Select(y => y.Name).FirstOrDefault(),*/
                        statusCode = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).ToList(),
                        statusCodeId = _context.K1Details.Where(y => y.BatchId == x.BatchId).Select(y => y.StatusCodeId).ToList(),
                        dateSampleDelivered = x.DateSampleDelivered,
                        delivery = x.Delivery,
                        courierServices = x.CourierServices,
                        trackingNo = x.TrackingNo,
                        suratIringan = x.SuratIringan,
                        testMethodId = x.TestMethodId,
                        testMethod = _context.RefTestMethods.Where(y => y.Id == x.TestMethodId).Select(y => y.TestMethod).FirstOrDefault(),
                        isfastTrack = x.IsFastTrack,
                    })
                    .ToListAsync();

                return Ok(batches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPut("{batchid}")]
        public async Task<IActionResult> PutBatchPrinted([FromRoute]int batchid)
        {
            var existingBatch = await _context.Batches.Where(x => x.BatchId == batchid).FirstOrDefaultAsync();
            if (existingBatch == null) { return BadRequest(); }
            existingBatch.BatchPrinted = true;
            await _context.SaveChangesAsync();

            return NoContent();

        }


    }
}
