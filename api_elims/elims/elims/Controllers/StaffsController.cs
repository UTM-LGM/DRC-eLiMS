using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using elims.elims;
using elims.DTOs;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StaffsController : Controller
    {
        private readonly ElimsContext _context;

        public StaffsController(ElimsContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllStaff()
        {
            var Staffs = await _context.Staffs.Select(x => new
            {
                staffId = x.StaffId,
                staffName = x.StaffName,
                username = x.Username,
                password = x.Password,
                position = x.Position,
                iKMno = x.Ikmno,
                office = x.Office,
                emailLgm = x.EmailLgm,
                icNumber = x.IcNumber,
                hpNo = x.HpNo,
                unit = x.Unit,
                unitName = x.UnitName,
                signature = x.Signature,
                staffRole = _context.StaffRoles.Where(y => y.StaffId == x.StaffId).Select(y => y.StaffRole1).ToList(),
            }).ToListAsync();

            return Ok(Staffs);
        }



        [HttpGet("{username}")]
        public async Task<IActionResult> GetStaffByUsername(string username)
        {
            var staff = await _context.Staffs.Where(x => x.Username == username).Select(x => new
            {
                staffId = x.StaffId,
                staffName = x.StaffName,
                username = x.Username,
                password = x.Password,
                position = x.Position,
                iKMno = x.Ikmno,
                office = x.Office,
                emailLgm = x.EmailLgm,
                hpNo = x.HpNo,
                unit = x.Unit,
                unitName = x.UnitName,
                signature = x.Signature,
                staffRole = _context.StaffRoles.Where(y => y.StaffId == x.StaffId).Select(y => y.StaffRole1).ToList(),
            })
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetStaffById(int staffId)
        {
            var staff = await _context.Staffs.Where(x => x.StaffId == staffId).Select(x => new
            {
                staffId = x.StaffId,
                staffName = x.StaffName,
                username = x.Username,
                password = x.Password,
                position = x.Position,
                iKMno = x.Ikmno,
                office = x.Office,
                emailLgm = x.EmailLgm,
                hpNo = x.HpNo,
                unit = x.Unit,
                unitName = x.UnitName,
                signature = x.Signature,
                staffRole = _context.StaffRoles.Where(y => y.StaffId == x.StaffId).Select(y => y.StaffRole1).ToList(),
            })
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Post([FromBody] LoginDTO staff)
        {
            var existingUser = await _context.Staffs.SingleOrDefaultAsync(u => u.Username == staff.Username && u.Password == staff.Password);

            if (existingUser == null)
            {
                return BadRequest("Invalid username or password");
            }

            // User is authenticated, you can generate a token or set a session/cookie here

            return Ok(existingUser);
        }

        [HttpPut("{staffId}")]

        public async Task<IActionResult> updateProfile([FromRoute] int staffId, [FromBody] Staff updateProfileRequest)
        {
            var staff = await _context.Staffs.Where(x => x.StaffId == staffId).FirstOrDefaultAsync();

            if (staff == null)
            {
                return NotFound();
            }

            staff.StaffName = updateProfileRequest.StaffName;
            staff.Username = updateProfileRequest.Username;
            staff.Position = updateProfileRequest.Position;
            staff.Office = updateProfileRequest.Office;
            staff.EmailLgm = updateProfileRequest.EmailLgm;
            staff.HpNo = updateProfileRequest.HpNo;
            staff.Unit = updateProfileRequest.Unit;
            staff.UnitName = updateProfileRequest.UnitName;
            staff.Signature = updateProfileRequest.Signature;
        /*    if (!string.IsNullOrEmpty(updateProfileRequest.NewPassword) && updateProfileRequest.NewPassword == updateProfileRequest.ConfirmPassword)
            {
                staff.Password = updateProfileRequest.NewPassword; // Ensure you hash the password before storing it
            }*/


            await _context.SaveChangesAsync();

            return Ok(staff);

        }


        [HttpGet("{batchId}")]
        public async Task<IActionResult> getElimsSampleByBatchId(int batchId)
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

                importedDate = _context.K1Headers.Where(y => y.K1HeaderId == x.K1HeaderId).Select(y => y.ImportedDate).ToList(),
                importerName = x.ImporterName,
                importerAddress = x.ImporterAddress,
                rubberTypeId = x.RubberTypeId,
                rubberType = _context.RefRubberTypes.Where(y => y.Id == x.RubberTypeId).Select(y => y.RubberType).FirstOrDefault(),
                sampleTypeId = x.SampleTypeId,
                sampleType = _context.RefSampleTypes.Where(y => y.RubberTypeId == x.SampleTypeId).Select(y => y.SampleType).FirstOrDefault(),


            }).ToListAsync();


            if (k1Details != null && k1Details.Count > 0)
            {
                return Ok(k1Details);
            }

            return NotFound("Batch not found");
        }


        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetEmailStaff(int staffId)

        {
            var Staffs = await _context.Staffs.Where(x => x.StaffId == staffId || x.EmailLgm == "azafi@lgm.gov.my" || x.EmailLgm == "mizi@lgm.gov.my" || x.EmailLgm == "izhar@lgm.gov.my" || x.EmailLgm == "nurizzatul@lgm.gov.my" || x.EmailLgm == "kartini@lgm.gov.my").Select(x => new
            {
                staffId = x.StaffId,
                emailLgm = x.EmailLgm,

            }).ToListAsync();

            return Ok(Staffs);

        }

        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetEmailResultLetter(int staffId)

        {
            var Staffs = await _context.Staffs.Where(x => x.StaffId == staffId || x.EmailLgm == "nurizzatul@lgm.gov.my").Select(x => new
            {
                staffId = x.StaffId,
                emailLgm = x.EmailLgm,

            }).ToListAsync();

            return Ok(Staffs);

        }



        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetEmailStaffTest(int staffId)

        {
            var Staffs = await _context.Staffs.Where(x => x.StaffId == staffId || x.EmailLgm == "izzatuliffah9@gmail.com").Select(x => new
            {
                staffId = x.StaffId,
                emailLgm = x.EmailLgm,

            }).ToListAsync();

            return Ok(Staffs);

        }



        [HttpPost("{staffId}")]
        public async Task<IActionResult> UploadSignature([FromRoute] int staffId, IFormFile file)
        {
            var details = await _context.Staffs.Where(x => x.StaffId == staffId).FirstOrDefaultAsync();
            if (details == null)
            {
                return BadRequest("No staff");
            }
            else
            {
                if (file != null)
                {
                    var fileName = $"{staffId}_{details.Signature}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\signature", fileName);
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


        /*  // GET: Staffs
          public async Task<IActionResult> Index()
          {
                return _context.Staffs != null ? 
                            View(await _context.Staffs.ToListAsync()) :
                            Problem("Entity set 'ElimsContext.Staffs'  is null.");
          }

          // GET: Staffs/Details/5
          public async Task<IActionResult> Details(int? id)
          {
              if (id == null || _context.Staffs == null)
              {
                  return NotFound();
              }

              var staff = await _context.Staffs
                  .FirstOrDefaultAsync(m => m.Id == id);
              if (staff == null)
              {
                  return NotFound();
              }

              return View(staff);
          }

          // GET: Staffs/Create
          public IActionResult Create()
          {
              return View();
          }

          // POST: Staffs/Create
          // To protect from overposting attacks, enable the specific properties you want to bind to.
          // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
          [HttpPost]
          [ValidateAntiForgeryToken]
          public async Task<IActionResult> Create([Bind("Id,StaffId,StaffName,Username,Password,Position,Ikmno,Pejabat")] Staff staff)
          {
              if (ModelState.IsValid)
              {
                  _context.Add(staff);
                  await _context.SaveChangesAsync();
                  return RedirectToAction(nameof(Index));
              }
              return View(staff);
          }

          // GET: Staffs/Edit/5
          public async Task<IActionResult> Edit(int? id)
          {
              if (id == null || _context.Staffs == null)
              {
                  return NotFound();
              }

              var staff = await _context.Staffs.FindAsync(id);
              if (staff == null)
              {
                  return NotFound();
              }
              return View(staff);
          }

          // POST: Staffs/Edit/5
          // To protect from overposting attacks, enable the specific properties you want to bind to.
          // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
          [HttpPost]
          [ValidateAntiForgeryToken]
          public async Task<IActionResult> Edit(int id, [Bind("Id,StaffId,StaffName,Username,Password,Position,Ikmno,Pejabat")] Staff staff)
          {
              if (id != staff.Id)
              {
                  return NotFound();
              }

              if (ModelState.IsValid)
              {
                  try
                  {
                      _context.Update(staff);
                      await _context.SaveChangesAsync();
                  }
                  catch (DbUpdateConcurrencyException)
                  {
                      if (!StaffExists(staff.Id))
                      {
                          return NotFound();
                      }
                      else
                      {
                          throw;
                      }
                  }
                  return RedirectToAction(nameof(Index));
              }
              return View(staff);
          }

          // GET: Staffs/Delete/5
          public async Task<IActionResult> Delete(int? id)
          {
              if (id == null || _context.Staffs == null)
              {
                  return NotFound();
              }

              var staff = await _context.Staffs
                  .FirstOrDefaultAsync(m => m.Id == id);
              if (staff == null)
              {
                  return NotFound();
              }

              return View(staff);
          }

          // POST: Staffs/Delete/5
          [HttpPost, ActionName("Delete")]
          [ValidateAntiForgeryToken]
          public async Task<IActionResult> DeleteConfirmed(int id)
          {
              if (_context.Staffs == null)
              {
                  return Problem("Entity set 'ElimsContext.Staffs'  is null.");
              }
              var staff = await _context.Staffs.FindAsync(id);
              if (staff != null)
              {
                  _context.Staffs.Remove(staff);
              }

              await _context.SaveChangesAsync();
              return RedirectToAction(nameof(Index));
          }

          private bool StaffExists(int id)
          {
            return (_context.Staffs?.Any(e => e.Id == id)).GetValueOrDefault();
          }*/
    }
}
