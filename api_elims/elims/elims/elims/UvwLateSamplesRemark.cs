using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class UvwLateSamplesRemark
{
    public int K1DetailId { get; set; }

    public int? BatchId { get; set; }

    public string? CustomNo { get; set; }

    public string? LabRefNo { get; set; }

    public int? RubberTypeId { get; set; }

    public string? RubberType { get; set; }

    public string? SampleType { get; set; }

    public int? Quantity { get; set; }

    public string? Pengimport { get; set; }

    public string? Agen { get; set; }

    public DateTime? ImportedDate { get; set; }

    public DateTime? SentOn { get; set; }

    public DateTime? DateReceivedInLab { get; set; }

    public DateTime? ReceivedOn { get; set; }

    public DateTime? TestedOn { get; set; }

    public string? Last { get; set; }

    public double? Result { get; set; }

    public DateTime? VerifiedOn { get; set; }

    public DateTime? ApprovedOn { get; set; }

    public DateTime? ResultSentOn { get; set; }

    public int Id { get; set; }

    public string? Address { get; set; }

    public string? Remarks { get; set; }

    public string? Evidence { get; set; }
}
