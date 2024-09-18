using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class K1Header
{
    public int K1HeaderId { get; set; }

    public string? CustomNo { get; set; }

    public DateTime? ImportedDate { get; set; }

    public string? LorryNo { get; set; }

    public string? TrailerNo { get; set; }

    public string? SupplierName { get; set; }

    public string? ExporterAddress { get; set; }

    public string? DriverName { get; set; }

    public string? IcDriver { get; set; }

    public int? CompanyId { get; set; }

    public string? Transport { get; set; }

    public bool? IsSmk { get; set; }

    public virtual ICollection<K1Detail> K1Details { get; set; } = new List<K1Detail>();
}
