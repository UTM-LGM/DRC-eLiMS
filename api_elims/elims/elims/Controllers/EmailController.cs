using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using elims;
using System.Net;
using NuGet.Protocol.Plugins;
using System.Collections;
using MimeKit;
using Org.BouncyCastle.Crypto.Macs;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly ElimsContext _context;

        public EmailController(ElimsContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> InformRejectedAccount([FromBody] String email)
        {
            /* Process to send email*/
            var subject = "Permohonan Pendaftaran Akaun MyLesen LGM";
            var recipient = email;
            var message = "Assalamualaikum/Salam Sejahtera" +
                            "<br><br>" +
                            "Tuan/Puan," +
                            "<br><br>" +
                            "Permohonan pendaftaran akaun tuan/puan telah ditolak." +
                            "<br>" +
                            "Sila hubungi pejabat LGM terdekat untuk maklumat lanjut." +
                            "<br><br><br>" +
                            "Admin," +
                            "<br>" +
                            "Sistem MyLesen LGM" +
                            "<br><br>" +
                            "<i>Perhatian,mesej ini dijana secara automatik oleh sistem. <i>";

            var result = await EmailServices.SendEmailAsync(recipient, subject, message);

            return NoContent();
        }



        [HttpPost("{staffId}/{batchId}")]
        public async Task<IActionResult> notificationMemo([FromRoute] int staffId, [FromRoute] int batchId, [FromBody] List<String> recipients)
        {
            var staffName = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.StaffName).FirstOrDefaultAsync();

            var hpNo = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.HpNo).FirstOrDefaultAsync();

            if (recipients == null || recipients.Count == 0)
            {
                return BadRequest("No recipients specified.");
            }

            /*var uipRegNos = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.UipRegNo).ToListAsync();
            var uipRegNosString = string.Join(", ", uipRegNos);*/

            var sampleRunNos = await _context.K1Details.Where(x => x.BatchId == batchId).Select(x => x.SampleRunNo).ToListAsync();
            var sampleRunNosString = string.Join(", ", sampleRunNos);

            //var rubberTypeId = await _context.RefRubberTypes.Where(y => y.Id == (_context.K1Details.Where(x => x.BatchId == batchId).Select(x => x.RubberTypeId).FirstOrDefaultAsync())).Select(y => y.RubberType).FirstOrDefaultAsync();
            var rubberTypeId = await _context.K1Details.Where(x => x.BatchId == batchId).Select(x => x.RubberTypeId).FirstOrDefaultAsync();

            var rubberType = await _context.RefRubberTypes.Where(y => y.Id == rubberTypeId).Select(y => y.RubberType).FirstOrDefaultAsync();

            var sampleType = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCode).FirstOrDefaultAsync();

            var sampleCategory = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCategory).FirstOrDefaultAsync();

            // var testMethod = await _context.Batches.Where(y => y.BatchId == batchId).Select(y => y.TestMethodId).FirstOrDefaultAsync();

            var testMethodName = await (from batch in _context.Batches
                                        join refTestMethod in _context.RefTestMethods
                                        on batch.TestMethodId equals refTestMethod.Id
                                        where batch.BatchId == batchId
                                        select refTestMethod.TestMethod).FirstOrDefaultAsync();

            // var testMethod = _context.Batches.Where(y => y.TestMethodId == (_context.RefTestMethods.Where(z => z.BatchId == z.BatchId).Select(z => z.TestMethodId).FirstOrDefault())).Select(y => y.TestMethod).FirstOrDefault();
            /* Process to send email*/
            var subject = "PERMOHONAN UNTUK MENJALANKAN UJIAN KANDUNGAN GETAH KERING KE ATAS SAMPEL " + rubberType.ToUpper();
            //var recipient = email;

            var message = "Assalamualaikum/Salam Sejahtera" +
                            "<br><br>" +
                            "Tuan/Puan," +
                            "<br><br>" +
                            "Adalah dengan hormatnya perkara di atas adalah dirujuk." +
                            "<br><br>" +
                             // "<a href='https://www5.lgm.gov.my/Elims/print-memo/" + batchId + "/" + staffId + "'>MEMO</a>" +
                             //"<a href='http://localhost:4200/print-memo/" + batchId + "/" + staffId + "'>MEMO</a>" +
                             //sampleRunNosString + 
                             // "<br><br>" +
                             "2. Pihak kami memohon kerjasama pihak tuan untuk menjalankan ujian kandungan Getah Kering ke atas sampel mengikut kaedah ujian " + testMethodName + " seperti berikut :-" +
                            "<br><br>" +
                           // < strong > UPB / " + sampleCategory + " / 001 </ strong >
                                         //sampleType + "/" + sampleRunNosString+
                                         "<ul>" +
                                             sampleRunNosString.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(runNo => $"<li>{sampleType + "/" + runNo.Trim()}</li>").Aggregate((current, next) => current + next) +
                                         "</ul>" +

                            "3. Bersama-sama ini dilampirkan pautan " + "<a href='https://www5.lgm.gov.my/Elims/print-memo/" + batchId +"'>MEMO</a>" + ". Sebarang pertanyaan lanjut boleh menghubungi saya di talian " + hpNo +

                             "<br><br>" +

                             "Sekian, terima kasih." +
                               "<br><br>" +

                            "<strong>“MALAYSIA MADANI”</strong>" +
                           "<br>" +
                            "<strong>“BERKHIDMAT UNTUK NEGARA”</strong>" +
                            "<br>" +
                            "<strong>“KREATIF, INOVATIF, PROGRESIF”</strong>"+
                             "<br><br>" +
                            "<i>Perhatian,mesej ini dijana secara automatik oleh sistem. <i>";

            // var result = await EmailServices.SendEmailAsync(recipient, subject, message);
            foreach (var recipient in recipients)
            {
                var result = await EmailServices.SendEmailAsync(recipient, subject, message);
            }
            return NoContent();
        }



        [HttpPost("{staffId}")]
        public async Task<IActionResult> notificationResultLetterMultiple([FromRoute] int staffId, [FromBody] List<string> recipients, [FromQuery] IEnumerable<int> k1DetailIds)
        {
            var staffName = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.StaffName).FirstOrDefaultAsync();
            var hpNo = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.HpNo).FirstOrDefaultAsync();

            if (recipients == null || recipients.Count == 0)
            {
                return BadRequest("No recipients specified.");
            }

            if (k1DetailIds == null || !k1DetailIds.Any())
            {
                return BadRequest("No k1DetailIds specified.");
            }

            var emailDetailsList = new List<string>();

            foreach (var k1DetailId in k1DetailIds)
            {
                var sampleRunNos = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.SampleRunNo).ToListAsync();
                var sampleRunNosString = string.Join(", ", sampleRunNos);

                var rubberTypeId = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.RubberTypeId).FirstOrDefaultAsync();
                var batchId = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.BatchId).FirstOrDefaultAsync();
                var chequeAmount = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeAmount).FirstOrDefaultAsync();
                var bankCode = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.BankCode).FirstOrDefaultAsync();
                var chequeNo = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeNo).FirstOrDefaultAsync();

                var receivedOn = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.ReceivedOn).FirstOrDefaultAsync();
                var testedOn = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.TestedOn).FirstOrDefaultAsync();
                var testMethod = await _context.RefTestMethods.Where(y => y.Id == rubberTypeId).Select(y => y.TestMethod).FirstOrDefaultAsync();
                var labRefNo = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.LabRefNo).FirstOrDefaultAsync();

                var importedDate = await _context.K1Headers.Where(x => x.K1HeaderId == k1DetailId).Select(x => x.ImportedDate).FirstOrDefaultAsync();

                var importerName = await _context.K1Details.Where(y => y.K1DetailId == k1DetailId).Select(y => y.ImporterName).FirstOrDefaultAsync();
                var importerAddress = await _context.K1Details.Where(y => y.K1DetailId == k1DetailId).Select(y => y.ImporterAddress).FirstOrDefaultAsync();
                var result = await _context.Results.Where(y => y.K1DetailId == k1DetailId).Select(y => y.Result1).FirstOrDefaultAsync();
                var rubberType = await _context.RefRubberTypes.Where(y => y.Id == rubberTypeId).Select(y => y.RubberType).FirstOrDefaultAsync();
                var sampleType = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCode).FirstOrDefaultAsync();
                var sampleCategory = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCategory).FirstOrDefaultAsync();

                var emailDetail = $@"
            <ul>
                <li>Tarikh Surat Tuan: {labRefNo}</li>
                <li>Tarikh Surat Tuan: {importedDate}</li>
                <li>Tarikh Surat Tuan: {result}</li>

                <li>Tarikh Sampel Diterima: {receivedOn}</li>
                <li>Tarikh Ujian Dilakukan: {testedOn}</li>
                <li>Kaedah Ujian: {testMethod}</li>
                <li>Lokasi Analisa Dijalankan: MAKMAL GTACR SUNGAI PETANI</li>
                Bayaran ujian sebanyak {chequeAmount} telah dibuat melalui cek {bankCode}-{chequeNo}.
                Keputusan ini hanya merujuk kepada sampel yang diterima dan diuji seperti di atas sahaja.
            </ul>";

                emailDetailsList.Add(emailDetail);
            }

            var emailDetails = string.Join("<br><br>", emailDetailsList);
            var subject = "Keputusan Ujian Kandungan Getah Kering (%KGK)";
            var message = $@"
     /*     {staffName}
            {hpNo}*/
            <br><br>
            Assalamualaikum/Salam Sejahtera
            <br><br>
            Tuan/Puan,
            <br><br>
            Berikut adalah keputusan ujian yang telah dijalankan ke atas sampel tuan:
            <br><br>
            {emailDetails}

            <br><br>
            Sekian, terima kasih.
            <br><br>
            <strong>“MALAYSIA MADANI”</strong>
            <br>
            <strong>“BERKHIDMAT UNTUK NEGARA”</strong>
            <br>
            <strong>“KREATIF, INOVATIF, PROGRESIF”</strong>
            <br><br>
            <i>Perhatian, mesej ini dijana secara automatik oleh sistem.</i>";

            foreach (var recipient in recipients)
            {
                await EmailServices.SendEmailAsync(recipient, subject, message);
            }

            return NoContent();
        }



        [HttpPost("{staffId}/{k1DetailId}")]
        public async Task<IActionResult> notificationResultLetter([FromRoute] int staffId, [FromBody] List<string> recipients, [FromRoute] int k1DetailId)
        {

            var staffName = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.StaffName).FirstOrDefaultAsync();
            var hpNo = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => x.HpNo).FirstOrDefaultAsync();

            if (recipients == null || recipients.Count == 0)
            {
                return BadRequest("No recipients specified.");
            }

            if (k1DetailId == null)
            {
                return BadRequest("No k1DetailIds specified.");
            }

            var emailDetailsList = new List<string>();

                var sampleRunNos = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.SampleRunNo).ToListAsync();
                var sampleRunNosString = string.Join(", ", sampleRunNos);

                var rubberTypeId = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.RubberTypeId).FirstOrDefaultAsync();
                var batchId = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.BatchId).FirstOrDefaultAsync();
                var chequeAmount = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeAmount).FirstOrDefaultAsync();
                var bankCode = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.BankCode).FirstOrDefaultAsync();
                var chequeNo = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeNo).FirstOrDefaultAsync();

                var receivedOn = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.ReceivedOn).FirstOrDefaultAsync();
                var testedOn = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.TestedOn).FirstOrDefaultAsync();
                var testMethod = await _context.RefTestMethods.Where(y => y.Id == rubberTypeId).Select(y => y.TestMethod).FirstOrDefaultAsync();
                var importerName = await _context.K1Details.Where(y => y.K1DetailId == k1DetailId).Select(y => y.ImporterName).FirstOrDefaultAsync();
                var importerAddress = await _context.K1Details.Where(y => y.K1DetailId == k1DetailId).Select(y => y.ImporterAddress).FirstOrDefaultAsync();
                var result = await _context.Results.Where(y => y.K1DetailId == k1DetailId).Select(y => y.Result1).FirstOrDefaultAsync();
                var rubberType = await _context.RefRubberTypes.Where(y => y.Id == rubberTypeId).Select(y => y.RubberType).FirstOrDefaultAsync();
                var sampleType = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCode).FirstOrDefaultAsync();
                var sampleCategory = await _context.RefSampleTypes.Where(y => y.RubberTypeId == rubberTypeId).Select(y => y.SampleCategory).FirstOrDefaultAsync();
                var labRefNo = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.LabRefNo).FirstOrDefaultAsync();

            // Assuming `k1DetailId` is the ID from the `K1Details` table
            var importedDate = await (from detail in _context.K1Details
                                      join header in _context.K1Headers
                                      on detail.K1HeaderId equals header.K1HeaderId
                                      where detail.K1DetailId == k1DetailId
                                      select header.ImportedDate).FirstOrDefaultAsync();

            var customNo = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.CustomNo).FirstOrDefaultAsync();
                // Formatting the dates
                string receivedOnFormatted = receivedOn?.ToString("dd/MM/yyyy") ?? "N/A";
                string testedOnFormatted = testedOn?.ToString("dd/MM/yyyy") ?? "N/A";
                string importedDateFormatted = importedDate?.ToString("dd/MM/yyyy") ?? "N/A";



            var emailDetail = $@"
                            <ul>
                            

                                <li>Batch ID: {batchId}</li>
                                <li>Tarikh Surat Tuan: {receivedOnFormatted}</li>
                                <li>Tarikh Sampel Diterima: {receivedOnFormatted}</li>
                                <li>Tarikh Ujian Dilakukan: {testedOnFormatted}</li>
                                <li>Kaedah Ujian: {testMethod}</li>
                                <li>Lokasi Analisa Dijalankan: MAKMAL GTACR SUNGAI PETANI</li>
                                <li>No. Daftar LGM: {labRefNo}</li>
                                <li>No. Kastam: {customNo}</li>
                                <li>Tarikh Import: {importedDateFormatted}</li>
                                <li>Keputusan Ujian KGK ( % Berat): {result}</li>   
                            </ul>";

            emailDetailsList.Add(emailDetail);

            var emailDetails = string.Join("<br><br>", emailDetailsList);
            var subject = "Keputusan Ujian Kandungan Getah Kering (%KGK) " + rubberType.ToUpper();
            var message = $@"
                         
                            Assalamualaikum/Salam Sejahtera
                            <br><br>
                            Tuan/Puan,
                            <br><br>
                            Berikut adalah keputusan ujian yang telah dijalankan ke atas sampel tuan:
                            <br><br>
                            {emailDetails}

                            Bayaran ujian sebanyak {chequeAmount} telah dibuat melalui cek {bankCode}-{chequeNo}.
                            Keputusan ini hanya merujuk kepada sampel yang diterima dan diuji seperti di atas sahaja.

                            <br><br>
                            Sekian, terima kasih.
                            <br><br>
                            <strong>“MALAYSIA MADANI”</strong>
                            <br>
                            <strong>“BERKHIDMAT UNTUK NEGARA”</strong>
                            <br>
                            <strong>“KREATIF, INOVATIF, PROGRESIF”</strong>
                            <br><br>
                            <i>Perhatian, mesej ini dijana secara automatik oleh sistem.</i>";

            foreach (var recipient in recipients)
            {
                await EmailServices.SendEmailAsync(recipient, subject, message);
            }

            return NoContent();
        }



                [HttpPost("{staffId}/{k1DetailId}")]
                    public async Task<IActionResult> uipNotificationResultLetter([FromRoute] int staffId, [FromBody] List<string> recipients, [FromRoute] int k1DetailId)
                    {
                        var staff = await _context.Staffs
                            .Where(x => x.StaffId == staffId)
                            .Select(x => new { x.StaffName, x.HpNo })
                            .FirstOrDefaultAsync();

                        if (staff == null)
                        {
                            return NotFound($"Staff with ID {staffId} not found.");
                        }

                        if (recipients == null || !recipients.Any())
                        {
                            return BadRequest("No recipients specified.");
                        }

                        var k1Detail = await _context.K1Details
                            .Where(x => x.K1DetailId == k1DetailId)
                            .Select(x => new
                            {
                                x.SampleRunNo,
                                x.RubberTypeId,
                                x.BatchId,
                                x.ReceivedOn,
                                x.TestedOn,
                                x.ImporterName,
                                x.ImporterAddress,
                                x.LabRefNo
                            })
                            .FirstOrDefaultAsync();

                        if (k1Detail == null)
                        {
                            return NotFound($"K1Detail with ID {k1DetailId} not found.");
                        }

                        var batch = await _context.Batches
                            .Where(x => x.BatchId == k1Detail.BatchId)
                            .Select(x => new { x.ChequeAmount, x.BankCode, x.ChequeNo })
                            .FirstOrDefaultAsync();

                        var testMethod = await _context.RefTestMethods
                            .Where(y => y.Id == k1Detail.RubberTypeId)
                            .Select(y => y.TestMethod)
                            .FirstOrDefaultAsync();

                        var result = await _context.Results
                            .Where(y => y.K1DetailId == k1DetailId)
                            .Select(y => y.Result1)
                            .FirstOrDefaultAsync();

                        var rubberType = await _context.RefRubberTypes
                            .Where(y => y.Id == k1Detail.RubberTypeId)
                            .Select(y => y.RubberType)
                            .FirstOrDefaultAsync();

                        var sampleType = await _context.RefSampleTypes
                            .Where(y => y.RubberTypeId == k1Detail.RubberTypeId)
                            .Select(y => new { y.SampleCode, y.SampleCategory })
                            .FirstOrDefaultAsync();

            var importedDate = await (from detail in _context.K1Details
                                      join header in _context.K1Headers
                                      on detail.K1HeaderId equals header.K1HeaderId
                                      where detail.K1DetailId == k1DetailId
                                      select header.ImportedDate).FirstOrDefaultAsync();

            var labRefNo = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.LabRefNo).FirstOrDefaultAsync();
                        var customNo = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.CustomNo).FirstOrDefaultAsync();

                        var batchId = await _context.K1Details.Where(x => x.K1DetailId == k1DetailId).Select(x => x.BatchId).FirstOrDefaultAsync();
                        var chequeAmount = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeAmount).FirstOrDefaultAsync();
                        var bankCode = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.BankCode).FirstOrDefaultAsync();
                        var chequeNo = await _context.Batches.Where(x => x.BatchId == batchId).Select(x => x.ChequeNo).FirstOrDefaultAsync();

                        string receivedOnFormatted = k1Detail.ReceivedOn?.ToString("dd/MM/yyyy") ?? "N/A";
                        string testedOnFormatted = k1Detail.TestedOn?.ToString("dd/MM/yyyy") ?? "N/A";
                        string importedDateFormatted = importedDate?.ToString("dd/MM/yyyy") ?? "N/A";

                        var sampleRunNosString = string.Join(", ", k1Detail.SampleRunNo);

                        var emailDetail = $@"
                        <ul>

                            <li>Batch ID: {batchId}</li>
                            <li>Tarikh Surat Tuan: {receivedOnFormatted}</li>
                            <li>Tarikh Sampel Diterima: {receivedOnFormatted}</li>
                            <li>Tarikh Ujian Dilakukan:{testedOnFormatted}</li>
                            <li>Kaedah Ujian: {testMethod}</li>
                            <li>Lokasi analisa dijalankan: MAKMAL BASAH GTACR KUALA LUMPUR</li>

                            <li>No. Daftar LGM: {labRefNo}</li>
                            <li>No. Kastam: {customNo}</li>
                            <li>Tarikh Import: {importedDateFormatted}</li>
                            <li>Jenis Getah: {rubberType}</li>
                            <li>Keputusan Ujian KGK ( % Berat): {result}</li>

                        </ul>";

                        var emailDetails = string.Join("<br><br>", new List<string> { emailDetail });
                        var subject = $"Keputusan Ujian Kandungan Getah Kering (%KGK) {rubberType.ToUpper()}";
                        var message = $@"
                            Assalamualaikum/Salam Sejahtera
                            <br><br>
                            Tuan/Puan,
                            <br><br>
                            Berikut  adalah keputusan ujian yang telah dijalankan ke atas sampel tuan
                            {emailDetails}

                            Bayaran ujian sebanyak {chequeAmount} telah dibuat melalui cek {bankCode}-{chequeNo}.
                            Keputusan ini hanya merujuk kepada sampel yang diterima dan diuji seperti di atas sahaja.
                            <br><br>
                            Sekian, terima kasih.
                            <br><br>
                            <strong>“MALAYSIA MADANI”</strong>
                            <br>
                            <strong>“BERKHIDMAT UNTUK NEGARA”</strong>
                            <br>
                            <strong>“KREATIF, INOVATIF, PROGRESIF”</strong>
                            <br><br>
                            <i>Perhatian, mesej ini dijana secara automatik oleh sistem.</i>";

                        foreach (var recipient in recipients)
                        {
                            await EmailServices.SendEmailAsync(recipient, subject, message);
                        }

                    return NoContent();
                }


        public class NotificationMemoRequest
        {
            public int BatchId { get; set; }
            public List<string> Recipients { get; set; }
        }


        // Method to resize a byte array to the specified size
        private static byte[] ResizeByteArray(byte[] array, int newSize)
        {
            Array.Resize(ref array, newSize);
            return array;
        }

    }
}
