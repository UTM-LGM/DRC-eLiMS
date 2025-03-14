using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam;

public partial class K1Header
{
    public string CustomRegistrationNo { get; set; } = null!;

    public string? FileFormat { get; set; }

    public string? Rfu { get; set; }

    public string? VersionNo { get; set; }

    public decimal? TotalNoOfItem { get; set; }

    public string? CommodityStatus { get; set; }

    public string? TransactionType { get; set; }

    public string? ExporterName { get; set; }

    public string? ExporterAddress { get; set; }

    public string? ImporterCode { get; set; }

    public string? ImporterName { get; set; }

    public string? ImporterAddress { get; set; }

    public string? AgentCode { get; set; }

    public string? AgentName { get; set; }

    public string? ModeOfTransport { get; set; }

    public DateTime? DateOfImport { get; set; }

    public string? VesselRegistration { get; set; }

    public string? VoyageNo { get; set; }

    public string? VesselName { get; set; }

    public string? FlightNo { get; set; }

    public DateTime? FlightDate { get; set; }

    public string? VehicleLorryNo { get; set; }

    public string? TrailerNo { get; set; }

    public string? PlaceOfImport { get; set; }

    public string? PlaceOfLoading { get; set; }

    public string? PortOfTranshipment { get; set; }

    public string? ExemptionType { get; set; }

    public string? CustomsPermitStn { get; set; }

    public string? CustomsPermitNo { get; set; }

    public DateTime? ImportPermitExpiryDate { get; set; }

    public string? Ogatype { get; set; }

    public string? Ogano { get; set; }

    public string? OgaofficerId { get; set; }

    public string? Ogapermit1Ogacode { get; set; }

    public string? Ogapermit1OgabranchCode { get; set; }

    public decimal? Ogapermit1PermitYear { get; set; }

    public string? Ogapermit1PermitNo { get; set; }

    public string? Ogapermit2Ogacode { get; set; }

    public string? Ogapermit2OgabranchCode { get; set; }

    public decimal? Ogapermit2PermitYear { get; set; }

    public string? Ogapermit2PermitNo { get; set; }

    public string? SptflagAc { get; set; }

    public string? Aseanpref { get; set; }

    public decimal? AgentUplift { get; set; }

    public string? UpliftType { get; set; }

    public string? DocketNo { get; set; }

    public string? PayTo { get; set; }

    public decimal? Insurance { get; set; }

    public decimal? OtherCharges { get; set; }

    public decimal? Cif { get; set; }

    public decimal? Fob { get; set; }

    public decimal? Freight { get; set; }

    public decimal? GrossWeight { get; set; }

    public decimal? Measurement { get; set; }

    public decimal? ExchangeRate { get; set; }

    public string? CurrencyCode { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string? RegistrationTime { get; set; }

    public DateTime? ApprovalDate { get; set; }

    public string? ApprovalTime { get; set; }

    public DateTime? ReceiptDate { get; set; }

    public string? ReceiptTime { get; set; }

    public DateTime? ReleaseDate { get; set; }

    public string? ReleaseTime { get; set; }

    public decimal? TotalDutyAmount { get; set; }

    public decimal? TotalExemptedAmount { get; set; }

    public string? DeclarantIcno { get; set; }

    public string? DeclarantName { get; set; }

    public string? DeclarantStatus { get; set; }

    public string? Remark { get; set; }

    public string? GeneralDescription { get; set; }

    public string? FileName { get; set; }

    public DateTime? DateUpload { get; set; }

    public virtual ICollection<K1Detail> K1Details { get; set; } = new List<K1Detail>();
}
