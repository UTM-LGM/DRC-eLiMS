using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam;

public partial class K2Header
{
    public string CustomRegistrationNo { get; set; } = null!;

    public string? FileFormat { get; set; }

    public string? Rfu { get; set; }

    public string? VersionNo { get; set; }

    public decimal? TotalNoOfItem { get; set; }

    public string? CommodityStatus { get; set; }

    public string? TransactionType { get; set; }

    public string? ImporterName { get; set; }

    public string? ImporterAddress { get; set; }

    public string? ExporterCode { get; set; }

    public string? ExporterName { get; set; }

    public string? ExporterAddress { get; set; }

    public string? AgentCode { get; set; }

    public string? AgentName { get; set; }

    public string? ModeOfTransport { get; set; }

    public DateTime? DateOfExport { get; set; }

    public string? VesselRegistration { get; set; }

    public string? VoyageNo { get; set; }

    public string? VesselName { get; set; }

    public string? FlightNo { get; set; }

    public DateTime? FlightDate { get; set; }

    public string? VehicleLorryNo { get; set; }

    public string? TrailerNo { get; set; }

    public string? PlaceOfExport { get; set; }

    public string? PlaceOfDischarge { get; set; }

    public string? PortOfTranshipment { get; set; }

    public string? SptflagAc { get; set; }

    public string? Sptref { get; set; }

    public string? ExportPermit { get; set; }

    public DateTime? ExportPermitExpiryDate { get; set; }

    public string? Ogatype { get; set; }

    public string? OgaapprovalNo { get; set; }

    public string? OgaofficerId { get; set; }

    public string? Kpwxno { get; set; }

    public string? CountryOfOrigin { get; set; }

    public string? FinalDestination { get; set; }

    public string? ForeignExchangeCode { get; set; }

    public decimal? AmountReceived { get; set; }

    public decimal? ForeignExchangeRate { get; set; }

    public decimal? Equivalent { get; set; }

    public string? ReceivedFrom { get; set; }

    public decimal? Insurance { get; set; }

    public decimal? OtherCharges { get; set; }

    public decimal? Fob { get; set; }

    public decimal? Freight { get; set; }

    public decimal? GrossWeight { get; set; }

    public decimal? Measurement { get; set; }

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

    public virtual ICollection<K2Detail> K2Details { get; set; } = new List<K2Detail>();
}
