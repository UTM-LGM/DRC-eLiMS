using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Result
{
    public int Id { get; set; }

    public int? K1DetailId { get; set; }

    public int? TestMethod { get; set; }

    public double? Wet1 { get; set; }

    public double? Wet2 { get; set; }

    public double? Dry1 { get; set; }

    public double? Dry2 { get; set; }

    public double? Result1 { get; set; }

    public string? Catatan { get; set; }

    public DateTime? VerifiedOn { get; set; }

    public string? VerifiedBy { get; set; }

    public bool? Repeat { get; set; }

    public DateTime? DecisionOn { get; set; }

    public string? DecisionBy { get; set; }

    public int? Decision { get; set; }

    public string? Prove { get; set; }
}
