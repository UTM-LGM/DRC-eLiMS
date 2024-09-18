using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class StationCode
{
    public int Id { get; set; }

    public int? Status { get; set; }

    public string? KodStesen { get; set; }

    public string? Keterangan { get; set; }
}
