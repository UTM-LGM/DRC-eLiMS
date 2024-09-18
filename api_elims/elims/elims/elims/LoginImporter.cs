using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class LoginImporter
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public int? CompanyId { get; set; }

    public bool? Locked { get; set; }
}
