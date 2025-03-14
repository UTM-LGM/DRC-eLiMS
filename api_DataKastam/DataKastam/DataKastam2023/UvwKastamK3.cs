using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam2023;

public partial class UvwKastamK3
{
    public string CustomRegistrationNo { get; set; } = null!;

    public int? TotalNoOfItem { get; set; }

    public string? TransactionType { get; set; }

    public string? ConsignorCode { get; set; }

    public string? ConsignorName { get; set; }

    public string? ConsignorAddress1 { get; set; }

    public string? ConsignorAddress2 { get; set; }

    public string? ConsignorAddress3 { get; set; }

    public string? ConsigneeCode { get; set; }

    public string? ConsigneeName { get; set; }

    public string? ConsigneeAddress1 { get; set; }

    public string? ConsigneeAddress2 { get; set; }

    public string? ConsigneeAddress3 { get; set; }

    public string? AgentCode { get; set; }

    public string? AgentName { get; set; }

    public string? ModeTransport { get; set; }

    public string? MovementType { get; set; }

    public DateTime? DateOfDispatch { get; set; }

    public string? VesselRegistration { get; set; }

    public string? VoyageNo { get; set; }

    public string? VesselName { get; set; }

    public string? FlightNo { get; set; }

    public DateTime? FlightDate { get; set; }

    public string? AcceptanceRec { get; set; }

    public string? VehicleLorryNo { get; set; }

    public string? TrailerNo { get; set; }

    public string? PlaceOfLoading { get; set; }

    public string? PortOfDischarge { get; set; }

    public string? CustomsPermitStn { get; set; }

    public string? CustomsPermitNo { get; set; }

    public DateTime? PermitExpiryDate { get; set; }

    public string? Ogaapproval { get; set; }

    public string? OgaofficerId { get; set; }

    public string? MoveFrom { get; set; }

    public string? MoveTo { get; set; }

    public string? PortOfFinalDestination { get; set; }

    public decimal? ReceivedAmount { get; set; }

    public decimal? Insurance { get; set; }

    public decimal? Freight { get; set; }

    public decimal? Fob { get; set; }

    public decimal? GrossWeight { get; set; }

    public decimal? Measurement { get; set; }

    public string? CargoType { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string? RegistrationTime { get; set; }

    public DateTime? PhyExDate { get; set; }

    public string? PhyExTime { get; set; }

    public DateTime? ReleaseDate { get; set; }

    public string? ReleaseTime { get; set; }

    public string? OriginDestinationRegNo { get; set; }

    public string? OriginDestinationOfficer { get; set; }

    public DateTime? OriginDestinationDate { get; set; }

    public string? OriginDestinationTime { get; set; }

    public decimal? TotalDutyAmount { get; set; }

    public string? DeclarantIcno { get; set; }

    public string? DeclarantName { get; set; }

    public string? DeclarantStatus { get; set; }

    public string? ApplicantIcno { get; set; }

    public string? ApplicantName { get; set; }

    public string? ApplicantStatus { get; set; }

    public string? Remark1 { get; set; }

    public string? Remark2 { get; set; }

    public string? Remark3 { get; set; }

    public string? Remark4 { get; set; }

    public string? AgentCode1 { get; set; }

    public string? GeneralDescription1 { get; set; }

    public string? GeneralDescription2 { get; set; }

    public string? PaperlessSign { get; set; }

    public string? DFilename { get; set; }

    public DateTime? DateProcessed { get; set; }

    public int? RegistrationSeqNo { get; set; }

    public string? ItemDescription { get; set; }

    public string? CountryOfOrigin { get; set; }

    public string? CargoType1 { get; set; }

    public decimal? QuantityStatistics { get; set; }

    public string? UnitStatistics { get; set; }

    public decimal? QuantityDuty { get; set; }

    public string? UnitDuty { get; set; }

    public decimal? UnitValue { get; set; }

    public decimal? TotalValueDecl { get; set; }

    public decimal? TotalValueCal { get; set; }

    public string? TariffCodeNew { get; set; }
}
