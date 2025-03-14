using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class UvwK2MalaysiaExport
{
    public string? Month { get; set; }

    public string? TariffCode { get; set; }

    public string? TariffCodeNew { get; set; }

    public string? HsCode { get; set; }

    public string? Country { get; set; }

    public string? Descuq { get; set; }

    public string? Description { get; set; }

    public string? Category { get; set; }

    public string? Sectors { get; set; }

    public string? Products { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? TotalValue { get; set; }

    public string? CustomRegNo { get; set; }

    public string? ExporterName { get; set; }

    public string? ExporterAddress { get; set; }

    public string? ImporterName { get; set; }

    public string? ImporterAddress { get; set; }

    public string? PlaceOfExport { get; set; }

    public string? PlaceOfDischarge { get; set; }

    public string? PortOfTranshipment { get; set; }

    public string? GeneralDesc { get; set; }

    public string? FileName { get; set; }

    public string? Cess1DutyType { get; set; }

    public decimal? Cess1Specific { get; set; }

    public string? SpecificUnitCess1 { get; set; }

    public decimal? Cess1Amount { get; set; }

    public decimal? RevClassCess1 { get; set; }

    public string? Cess2DutyType { get; set; }

    public decimal? Cess2Specific { get; set; }

    public string? SpecificUnitCess2 { get; set; }

    public decimal? Cess2Amount { get; set; }

    public decimal? RevClassCess2 { get; set; }

    public string? Cess3DutyType { get; set; }

    public decimal? Cess3Specific { get; set; }

    public string? SpecificUnitCess3 { get; set; }

    public decimal? Cess3Amount { get; set; }

    public decimal? RevClassCess3 { get; set; }

    public string? Cess1ExemptionType { get; set; }

    public decimal? SpecificCess1Exemption { get; set; }

    public string? UnitCess1Exemption { get; set; }

    public decimal? Cess1ExemptionAmount { get; set; }

    public string? Cess2ExemptionType { get; set; }

    public decimal? SpecificCess2Exemption { get; set; }

    public string? UnitCess2Exemption { get; set; }

    public decimal? Cess2ExemptionAmount { get; set; }

    public string? Cess3ExemptionType { get; set; }

    public decimal? SpecificCess3Exemption { get; set; }

    public string? UnitCess3Exemption { get; set; }

    public decimal? Cess3ExemptionAmount { get; set; }

    public decimal? TotalDutyAmount { get; set; }

    public DateTime? ReleaseDate { get; set; }
}
