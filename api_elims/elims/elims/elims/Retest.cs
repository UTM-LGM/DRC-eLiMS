using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Retest
{
    public int Id { get; set; }

    public int? K1DetailId { get; set; }

    public int? BatchId { get; set; }

    public DateTime? TestedOn { get; set; }

    public string? TestedBy { get; set; }

    public DateTime? RejectedOn { get; set; }

    public string? RejectedBy { get; set; }

    public int? NoOfRetest { get; set; }

    public int? TestMethod { get; set; }

    public double? Wet1 { get; set; }

    public double? Wet2 { get; set; }

    public double? Dry1 { get; set; }

    public double? Dry2 { get; set; }

    public double? Result { get; set; }
}
