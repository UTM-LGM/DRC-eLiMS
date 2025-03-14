using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class K2Detail
{
    public int K2DetailId { get; set; }

    public string? FileFormat { get; set; }

    public string? Rfu { get; set; }

    public string? VersionNo { get; set; }

    public string? CustomRegistrationNo { get; set; }

    public decimal? RegistrationSeqNo { get; set; }

    public string? ItemDescription { get; set; }

    public string? TariffCode { get; set; }

    public string? CountryOfOrigin { get; set; }

    public decimal? QuantityStatistics { get; set; }

    public string? UnitStatistics { get; set; }

    public decimal? QuantityDuty { get; set; }

    public string? UnitDuty { get; set; }

    public decimal? UnitValue { get; set; }

    public decimal? GazettedValue { get; set; }

    public decimal? TotalValueDecl { get; set; }

    public decimal? TotalValueCal { get; set; }

    public string? ExportDutyType { get; set; }

    public decimal? AdValoremExportDuty { get; set; }

    public decimal? SpecificExportDuty { get; set; }

    public string? SpecificUnitImportDuty { get; set; }

    public decimal? ExportDutyAmount { get; set; }

    public decimal? RevClassExportDuty { get; set; }

    public string? Cess1DutyType { get; set; }

    public decimal? SpecificCess1 { get; set; }

    public string? SpecificUnitCess1 { get; set; }

    public decimal? Cess1Amount { get; set; }

    public decimal? RevClassCess1 { get; set; }

    public string? Cess2DutyType { get; set; }

    public decimal? SpecificCess2 { get; set; }

    public string? SpecificUnitCess2 { get; set; }

    public decimal? Cess2Amount { get; set; }

    public decimal? RevClassCess2 { get; set; }

    public string? Cess3DutyType { get; set; }

    public decimal? SpecificCess3 { get; set; }

    public string? SpecificUnitCess3 { get; set; }

    public decimal? Cess3Amount { get; set; }

    public decimal? RevClassCess3 { get; set; }

    public string? ExportDutyExemptionType { get; set; }

    public decimal? AdValoremExportDutyExemption { get; set; }

    public decimal? SpecificExportDutyExemption { get; set; }

    public string? UnitExportDutyExemption { get; set; }

    public decimal? ExportDutyExemptionAmount { get; set; }

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

    public decimal? TotalExemptionImportDuty { get; set; }

    public string? TariffCodeNew { get; set; }

    public DateTime? DateUpload { get; set; }

    public virtual K2Header? CustomRegistrationNoNavigation { get; set; }
}
