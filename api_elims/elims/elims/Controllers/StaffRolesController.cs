using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using elims.elims;

namespace elims.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StaffRolesController : ControllerBase
    {
        private readonly ElimsContext _context;

        public StaffRolesController(ElimsContext context)
        {
            _context = context;
        }

        // GET: api/StaffRoles
        [HttpGet]
        public async Task<IActionResult> GetStaffRoles()
        {
          if (_context.StaffRoles == null)
          {
              return NotFound();
          }
            return Ok( await _context.StaffRoles.ToListAsync());
        }

        
        [HttpGet("{staffId}")]
        public async Task<IActionResult> GetStaffRolebyStaffId(int staffId)
        {
            var StaffRole = await _context.StaffRoles.Where(x => x.StaffId == staffId).Select(x => new
            {
                id = x.Id,
                staffId = x.StaffId,
                StaffRole = x.StaffRole1,
                role = _context.Roles.Where(y => y.RoleId == x.StaffRole1).Select(y => y.Role1).FirstOrDefault(),
            })
                .ToListAsync();

            if (StaffRole == null)
            {
                return NotFound();
            }

            return Ok(StaffRole);
        }


        [HttpGet("{staffRole}")]
        public async Task<IActionResult> GetStaffIdbyStaffRole(int staffRole)
        {
            var StaffRole = await _context.StaffRoles.Where(x => x.StaffRole1 == staffRole).Select(x => new
            {
                id = x.Id,
                staffId = x.StaffId,
                StaffRole = x.StaffRole1,
                role = _context.Roles.Where(y => y.RoleId == x.StaffRole1).Select(y => y.Role1).FirstOrDefault(),
                staffName = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.StaffName).FirstOrDefault(),
                username = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.Username).FirstOrDefault(),
                ikmno = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.Ikmno).FirstOrDefault(),
            })
                .ToListAsync();

            if (StaffRole == null)
            {
                return NotFound();
            }

            return Ok(StaffRole);
        }


        [HttpGet("{staffRole}")]
        public async Task<IActionResult> GetStaffIdbyStaffRoleIkmNo(int staffRole)
        {
            var StaffRole = await _context.StaffRoles
                .Where(x => x.StaffRole1 == staffRole)
                .Where(x => _context.Staffs.Any(y => y.StaffId == x.StaffId && y.Ikmno != null)) // Filter where ikmno is not null
                .Select(x => new
                {
                    id = x.Id,
                    staffId = x.StaffId,
                    StaffRole = x.StaffRole1,
                    role = _context.Roles.Where(y => y.RoleId == x.StaffRole1).Select(y => y.Role1).FirstOrDefault(),
                    staffName = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.StaffName).FirstOrDefault(),
                    username = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.Username).FirstOrDefault(),
                    ikmno = _context.Staffs.Where(y => y.StaffId == x.StaffId).Select(y => y.Ikmno).FirstOrDefault(),
                })
                .ToListAsync();

            if (StaffRole == null || !StaffRole.Any())
            {
                return NotFound();
            }

            return Ok(StaffRole);
        }


        // PUT: api/StaffRoles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaffRole(int id, StaffRole staffRole)
        {
            if (id != staffRole.Id)
            {
                return BadRequest();
            }

            _context.Entry(staffRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffRoleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/StaffRoles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StaffRole>> PostStaffRole(StaffRole staffRole)
        {
          if (_context.StaffRoles == null)
          {
              return Problem("Entity set 'ElimsContext.StaffRoles'  is null.");
          }
            _context.StaffRoles.Add(staffRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaffRole", new { id = staffRole.Id }, staffRole);
        }

        // DELETE: api/StaffRoles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffRole(int id)
        {
            if (_context.StaffRoles == null)
            {
                return NotFound();
            }
            var staffRole = await _context.StaffRoles.FindAsync(id);
            if (staffRole == null)
            {
                return NotFound();
            }

            _context.StaffRoles.Remove(staffRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StaffRoleExists(int id)
        {
            return (_context.StaffRoles?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
