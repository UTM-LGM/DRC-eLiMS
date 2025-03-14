using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class K3Detail
{
    public int Id { get; set; }

    public string? FileFormat { get; set; }

    public string? Rfu { get; set; }

    public string? VersionNo { get; set; }

    public string? CustomRegistrationNo { get; set; }

    public int? RegistrationSeqNo { get; set; }

    public string? TariffCode { get; set; }

    public string? ItemDescription { get; set; }

    public string? CountryOfOrigin { get; set; }

    public string? CargoType { get; set; }

    public decimal? QuantityStatistics { get; set; }

    public string? UnitStatistics { get; set; }

    public decimal? QuantityDuty { get; set; }

    public string? UnitDuty { get; set; }

    public decimal? UnitValue { get; set; }

    public decimal? TotalValueDecl { get; set; }

    public decimal? TotalValueCal { get; set; }

    public string? TariffCodeNew { get; set; }

    public DateTime? DateProcessed { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual K3Header? CustomRegistrationNoNavigation { get; set; }
}
