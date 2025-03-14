using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class K1Detail
{
    public int K1DetailId { get; set; }

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

    public decimal? TotalValueDecl { get; set; }

    public string? ImportDutyType { get; set; }

    public decimal? AdValoremImportDuty { get; set; }

    public decimal? SpecificImportDuty { get; set; }

    public string? SpecificUnitImportDuty { get; set; }

    public decimal? ImportDutyAmount { get; set; }

    public string? RevClassImportDuty { get; set; }

    public string? SalesTaxType { get; set; }

    public decimal? AdValoremSalesTax { get; set; }

    public decimal? SpecificSalesTax { get; set; }

    public string? SpecificUnitSalesTax { get; set; }

    public decimal? SalesTaxAmount { get; set; }

    public string? RevClassSalesTax { get; set; }

    public string? ImportDutyExemptionType { get; set; }

    public decimal? AdValoremImportDutyExemption { get; set; }

    public decimal? SpecificImportDutyExemption { get; set; }

    public string? UnitImportDutyExemption { get; set; }

    public decimal? DutyExemptionAmount { get; set; }

    public string? SalesTaxExemptionType { get; set; }

    public decimal? AdValoremExemptedSalesTax { get; set; }

    public decimal? SpecificSalexTaxExemption { get; set; }

    public string? UnitSalesTaxExemption { get; set; }

    public decimal? SalesTaxExemptionAmount { get; set; }

    public decimal? TotalDutyAmount { get; set; }

    public decimal? TotalImportDutyExemption { get; set; }

    public decimal? Fob { get; set; }

    public string? CurrencyCodeFob { get; set; }

    public decimal? Insurance { get; set; }

    public string? CurrencyCodeInsurance { get; set; }

    public decimal? Freight { get; set; }

    public string? CurrencyCodeFreight { get; set; }

    public decimal? Cif { get; set; }

    public string? CurrencyCodeCif { get; set; }

    public decimal? OtherCharges { get; set; }

    public string? TariffCodeNew { get; set; }

    public DateTime? DateUpload { get; set; }

    public virtual K1Header? CustomRegistrationNoNavigation { get; set; }
}
