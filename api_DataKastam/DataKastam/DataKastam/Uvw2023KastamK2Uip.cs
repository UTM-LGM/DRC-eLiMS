using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam;

public partial class Uvw2023KastamK2Uip
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

    public DateTime? DateOfExport { get; set; }

    public string? FinalDestination { get; set; }

    public string? PlaceOfExport { get; set; }

    public string? PlaceOfDischarge { get; set; }

    public string? PortOfTranshipment { get; set; }

    public string? VehicleLorryNo { get; set; }

    public string? GeneralDescription { get; set; }

    public string? ItemDescription { get; set; }

    public decimal? QuantityDuty { get; set; }

    public decimal? UnitValue { get; set; }

    public decimal? TotalValueDecl { get; set; }

    public string? TariffCodeNew { get; set; }

    public decimal? GrossWeight { get; set; }

    public decimal? SpecificCess1 { get; set; }

    public decimal? Cess1Amount { get; set; }

    public decimal? SpecificCess2 { get; set; }

    public decimal? Cess2Amount { get; set; }

    public decimal? SpecificCess3 { get; set; }

    public decimal? Cess3Amount { get; set; }
}
