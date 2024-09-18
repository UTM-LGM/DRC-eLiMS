using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Company
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public string? Name { get; set; }

    public string? Address { get; set; }

    public string? Postcode { get; set; }

    public string? Tel { get; set; }

    public string? Email { get; set; }

    public string? Fax { get; set; }

    public string? ContactPerson { get; set; }

    public string? Code { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? SmkimportersCode { get; set; }

    public bool? IsNorthen { get; set; }

    public string? LicenseNo { get; set; }
}
