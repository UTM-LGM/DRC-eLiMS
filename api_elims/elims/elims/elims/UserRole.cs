using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class UserRole
{
    public int RoleId { get; set; }

    public string? Role { get; set; }

    public bool? IsLogin { get; set; }
}
