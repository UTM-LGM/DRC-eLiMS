using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class Uvw2023KastamK1UipJulDi
{
    public DateTime? ReleaseDate { get; set; }

    public string CustomRegistrationNo { get; set; } = null!;

    public string? ExporterName { get; set; }

    public string? ExporterAddress { get; set; }

    public string? ImporterName { get; set; }

    public string? ImporterAddress { get; set; }

    public string? AgentCode { get; set; }

    public string? AgentName { get; set; }

    public string? ModeOfTransport { get; set; }

    public DateTime? DateOfImport { get; set; }

    public string? VehicleLorryNo { get; set; }

    public string? PlaceOfImport { get; set; }

    public string? GeneralDescription { get; set; }

    public string? ItemDescription { get; set; }

    public string? CountryOfOrigin { get; set; }

    public decimal? QuantityDuty { get; set; }

    public decimal? QuantityStatistics { get; set; }

    public decimal? UnitValue { get; set; }

    public decimal? TotalValueDecl { get; set; }

    public string? TariffCodeNew { get; set; }

    public decimal? GrossWeight { get; set; }
}
