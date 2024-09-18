using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Batch
{
    public int BatchId { get; set; }

    public string? UpbrefNo { get; set; }

    public string? ChequeNo { get; set; }

    public decimal? ChequeAmount { get; set; }

    public DateTime? SentOn { get; set; }

    public string? SentBy { get; set; }

    public string? LetterPrinted { get; set; }

    public string? BankCode { get; set; }

    public DateTime? LetterPrintedOn { get; set; }

    public string? ResultLetterPrinted { get; set; }

    public string? LgmletterRef { get; set; }

    public string? CustomsLetterPrinted { get; set; }

    public DateTime? CustomsLetterPrintedDate { get; set; }

    public string? TransactionNo { get; set; }

    public DateTime? Date { get; set; }

    public string? Receipt { get; set; }

    public DateTime? DateSampleDelivered { get; set; }

    public string? CourierServices { get; set; }

    public string? TrackingNo { get; set; }

    public string? Delivery { get; set; }

    public string? UipRegNo { get; set; }

    public string? Memo { get; set; }

    public string? SuratIringan { get; set; }

    public int? TestMethodId { get; set; }

    public string? DefaultTestMethod { get; set; }

    public bool? IsFastTrack { get; set; }

    public bool? MemoPrinted { get; set; }

    public bool? BatchPrinted { get; set; }

    public DateTime? PostResultOn { get; set; }

    public string? PostResultDelivery { get; set; }

    public string? PostResultCourierServices { get; set; }

    public string? PostResultTrackingNo { get; set; }

    public virtual ICollection<K1Detail> K1Details { get; set; } = new List<K1Detail>();
}
