using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DataKastam.DataKastam2023;

public partial class DataKastam2023Context : DbContext
{
    public DataKastam2023Context()
    {
    }

    public DataKastam2023Context(DbContextOptions<DataKastam2023Context> options)
        : base(options)
    {
    }

    public virtual DbSet<CountryCode> CountryCodes { get; set; }

    public virtual DbSet<Hscode2022> Hscode2022s { get; set; }

    public virtual DbSet<K1Detail> K1Details { get; set; }

    public virtual DbSet<K1Duplicate> K1Duplicates { get; set; }

    public virtual DbSet<K1Header> K1Headers { get; set; }

    public virtual DbSet<K2Detail> K2Details { get; set; }

    public virtual DbSet<K2Duplicate> K2Duplicates { get; set; }

    public virtual DbSet<K2Header> K2Headers { get; set; }

    public virtual DbSet<K3Detail> K3Details { get; set; }

    public virtual DbSet<K3Header> K3Headers { get; set; }

    public virtual DbSet<K3HeaderDuplicate> K3HeaderDuplicates { get; set; }

    public virtual DbSet<RefCargoType> RefCargoTypes { get; set; }

    public virtual DbSet<RefModeOfTransport> RefModeOfTransports { get; set; }

    public virtual DbSet<RefMoveFrom> RefMoveFroms { get; set; }

    public virtual DbSet<RefMoveTo> RefMoveToes { get; set; }

    public virtual DbSet<RefMovementType> RefMovementTypes { get; set; }

    public virtual DbSet<RefPlaceOfLoading> RefPlaceOfLoadings { get; set; }

    public virtual DbSet<RefPortOfDischarge> RefPortOfDischarges { get; set; }

    public virtual DbSet<RefPortOfFinalDestination> RefPortOfFinalDestinations { get; set; }

    public virtual DbSet<TmpFilename> TmpFilenames { get; set; }

    public virtual DbSet<Uvw2023KastamK1ImportQ1> Uvw2023KastamK1ImportQ1s { get; set; }

    public virtual DbSet<Uvw2023KastamK1ImportQ2> Uvw2023KastamK1ImportQ2s { get; set; }

    public virtual DbSet<Uvw2023KastamK1ImportQ3> Uvw2023KastamK1ImportQ3s { get; set; }

    public virtual DbSet<Uvw2023KastamK1ImportQ4> Uvw2023KastamK1ImportQ4s { get; set; }

    public virtual DbSet<Uvw2023KastamK1UipJanJun> Uvw2023KastamK1UipJanJuns { get; set; }

    public virtual DbSet<Uvw2023KastamK1UipJulDi> Uvw2023KastamK1UipJulDis { get; set; }

    public virtual DbSet<Uvw2023KastamK2ExportQ1> Uvw2023KastamK2ExportQ1s { get; set; }

    public virtual DbSet<Uvw2023KastamK2ExportQ2> Uvw2023KastamK2ExportQ2s { get; set; }

    public virtual DbSet<Uvw2023KastamK2ExportQ3> Uvw2023KastamK2ExportQ3s { get; set; }

    public virtual DbSet<Uvw2023KastamK2ExportQ4> Uvw2023KastamK2ExportQ4s { get; set; }

    public virtual DbSet<Uvw2023KastamK2Uip> Uvw2023KastamK2Uips { get; set; }

    public virtual DbSet<Uvw2024KastamK1ImportQ1> Uvw2024KastamK1ImportQ1s { get; set; }

    public virtual DbSet<Uvw2024KastamK1ImportQ2> Uvw2024KastamK1ImportQ2s { get; set; }

    public virtual DbSet<Uvw2024KastamK1ImportQ3> Uvw2024KastamK1ImportQ3s { get; set; }

    public virtual DbSet<Uvw2024KastamK1ImportQ4> Uvw2024KastamK1ImportQ4s { get; set; }

    public virtual DbSet<Uvw2024KastamK1UipJanJun> Uvw2024KastamK1UipJanJuns { get; set; }

    public virtual DbSet<Uvw2024KastamK1UipJulDi> Uvw2024KastamK1UipJulDis { get; set; }

    public virtual DbSet<Uvw2024KastamK2ExportQ1> Uvw2024KastamK2ExportQ1s { get; set; }

    public virtual DbSet<Uvw2024KastamK2ExportQ2> Uvw2024KastamK2ExportQ2s { get; set; }

    public virtual DbSet<Uvw2024KastamK2ExportQ3> Uvw2024KastamK2ExportQ3s { get; set; }

    public virtual DbSet<Uvw2024KastamK2ExportQ4> Uvw2024KastamK2ExportQ4s { get; set; }

    public virtual DbSet<Uvw2024KastamK2Uip> Uvw2024KastamK2Uips { get; set; }

    public virtual DbSet<UvwK1MalaysiaImport> UvwK1MalaysiaImports { get; set; }

    public virtual DbSet<UvwK2MalaysiaExport> UvwK2MalaysiaExports { get; set; }

    public virtual DbSet<UvwKastamK3> UvwKastamK3s { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=ddbsql1601;Initial Catalog=DataKastam2023;User=sa; Password=s@2016; Trusted_Connection=False;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CountryCode>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("CountryCode");

            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.DecimalLatitude).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.DecimalLongtitude).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Latitude)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Longitude)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        modelBuilder.Entity<Hscode2022>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("HSCode_2022");

            entity.Property(e => e.BilHs).HasColumnName("BIL HS");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Hscode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HSCode");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Type1Sectors)
                .HasMaxLength(255)
                .HasColumnName("Type1_Sectors");
            entity.Property(e => e.TypeCategory)
                .HasMaxLength(255)
                .HasColumnName("Type_Category");
            entity.Property(e => e.Unit)
                .HasMaxLength(5)
                .IsUnicode(false);
        });

        modelBuilder.Entity<K1Detail>(entity =>
        {
            entity.ToTable("K1_Detail");

            entity.Property(e => e.K1DetailId)
                .ValueGeneratedNever()
                .HasColumnName("K1_Detail_ID");
            entity.Property(e => e.AdValoremExemptedSalesTax)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_ExemptedSalesTax");
            entity.Property(e => e.AdValoremImportDuty)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_ImportDuty");
            entity.Property(e => e.AdValoremImportDutyExemption)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_ImportDutyExemption");
            entity.Property(e => e.AdValoremSalesTax)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_SalesTax");
            entity.Property(e => e.Cif)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CIF");
            entity.Property(e => e.CountryOfOrigin)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CurrencyCodeCif)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("CurrencyCode_CIF");
            entity.Property(e => e.CurrencyCodeFob)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("CurrencyCode_FOB");
            entity.Property(e => e.CurrencyCodeFreight)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("CurrencyCode_Freight");
            entity.Property(e => e.CurrencyCodeInsurance)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("CurrencyCode_Insurance");
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateUpload)
                .HasPrecision(3)
                .HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DutyExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.Freight).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ImportDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ImportDutyExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.ImportDutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Insurance).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.OtherCharges).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.RegistrationSeqNo).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RevClassImportDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("RevClass_ImportDuty");
            entity.Property(e => e.RevClassSalesTax)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("RevClass_SalesTax");
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.SalesTaxAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.SalesTaxExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.SalesTaxExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.SalesTaxType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.SpecificImportDuty)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_ImportDuty");
            entity.Property(e => e.SpecificImportDutyExemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_ImportDutyExemption");
            entity.Property(e => e.SpecificSalesTax)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_SalesTax");
            entity.Property(e => e.SpecificSalexTaxExemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_SalexTaxExemption");
            entity.Property(e => e.SpecificUnitImportDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_ImportDuty");
            entity.Property(e => e.SpecificUnitSalesTax)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_SalesTax");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalImportDutyExemption).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Duty");
            entity.Property(e => e.UnitImportDutyExemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_ImportDutyExemption");
            entity.Property(e => e.UnitSalesTaxExemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_SalesTaxExemption");
            entity.Property(e => e.UnitStatistics)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Statistics");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);

            entity.HasOne(d => d.CustomRegistrationNoNavigation).WithMany(p => p.K1Details)
                .HasForeignKey(d => d.CustomRegistrationNo)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_K1_Detail_K1_Header");
        });

        modelBuilder.Entity<K1Duplicate>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("K1_Duplicate");

            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<K1Header>(entity =>
        {
            entity.HasKey(e => e.CustomRegistrationNo);

            entity.ToTable("K1_Header");

            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.AgentUplift).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ApprovalDate).HasPrecision(3);
            entity.Property(e => e.ApprovalTime)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Aseanpref)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("ASEANPref");
            entity.Property(e => e.Cif)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CIF");
            entity.Property(e => e.CommodityStatus)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitStn)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.DateOfImport).HasPrecision(3);
            entity.Property(e => e.DateUpload)
                .HasPrecision(3)
                .HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DeclarantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DeclarantICNo");
            entity.Property(e => e.DeclarantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.DeclarantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.DocketNo)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.ExchangeRate).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ExemptionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FlightDate).HasPrecision(3);
            entity.Property(e => e.FlightNo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.Freight).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImportPermitExpiryDate).HasPrecision(3);
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Insurance).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Measurement).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Ogano)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("OGANo");
            entity.Property(e => e.OgaofficerId)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("OGAOfficerID");
            entity.Property(e => e.Ogapermit1OgabranchCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAPermit1_OGABranchCode");
            entity.Property(e => e.Ogapermit1Ogacode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAPermit1_OGACode");
            entity.Property(e => e.Ogapermit1PermitNo)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("OGAPermit1_PermitNo");
            entity.Property(e => e.Ogapermit1PermitYear)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("OGAPermit1_PermitYear");
            entity.Property(e => e.Ogapermit2OgabranchCode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAPermit2_OGABranchCode");
            entity.Property(e => e.Ogapermit2Ogacode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAPermit2_OGACode");
            entity.Property(e => e.Ogapermit2PermitNo)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("OGAPermit2_PermitNo");
            entity.Property(e => e.Ogapermit2PermitYear)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("OGAPermit2_PermitYear");
            entity.Property(e => e.Ogatype)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAType");
            entity.Property(e => e.OtherCharges).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.PayTo)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReceiptDate).HasPrecision(3);
            entity.Property(e => e.ReceiptTime)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.RegistrationDate).HasPrecision(3);
            entity.Property(e => e.RegistrationTime)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.ReleaseTime)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Remark)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.SptflagAc)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("SPTFlag_AC");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalExemptedAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalNoOfItem).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TrailerNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.TransactionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.UpliftType)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.VesselName)
                .HasMaxLength(17)
                .IsUnicode(false);
            entity.Property(e => e.VesselRegistration)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.VoyageNo)
                .HasMaxLength(6)
                .IsUnicode(false);
        });

        modelBuilder.Entity<K2Detail>(entity =>
        {
            entity.ToTable("K2_Detail");

            entity.Property(e => e.K2DetailId)
                .ValueGeneratedNever()
                .HasColumnName("K2_Detail_ID");
            entity.Property(e => e.AdValoremExportDuty)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_ExportDuty");
            entity.Property(e => e.AdValoremExportDutyExemption)
                .HasColumnType("decimal(29, 3)")
                .HasColumnName("AdValorem_ExportDutyExemption");
            entity.Property(e => e.Cess1Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess1DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess1ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess1ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess2Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess2DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess2ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess2ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess3Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess3DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess3ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess3ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateUpload)
                .HasPrecision(3)
                .HasDefaultValueSql("(getdate())");
            entity.Property(e => e.ExportDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ExportDutyExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ExportDutyExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.ExportDutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.GazettedValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.RegistrationSeqNo).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RevClassCess1)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess1");
            entity.Property(e => e.RevClassCess2)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess2");
            entity.Property(e => e.RevClassCess3)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess3");
            entity.Property(e => e.RevClassExportDuty)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_ExportDuty");
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.SpecificCess1)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess1");
            entity.Property(e => e.SpecificCess1Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess1Exemption");
            entity.Property(e => e.SpecificCess2)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess2");
            entity.Property(e => e.SpecificCess2Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess2Exemption");
            entity.Property(e => e.SpecificCess3)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess3");
            entity.Property(e => e.SpecificCess3Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess3Exemption");
            entity.Property(e => e.SpecificExportDuty)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_ExportDuty");
            entity.Property(e => e.SpecificExportDutyExemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_ExportDutyExemption");
            entity.Property(e => e.SpecificUnitCess1)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess1");
            entity.Property(e => e.SpecificUnitCess2)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess2");
            entity.Property(e => e.SpecificUnitCess3)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess3");
            entity.Property(e => e.SpecificUnitImportDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_ImportDuty");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalExemptionImportDuty)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalExemption_ImportDuty");
            entity.Property(e => e.TotalValueCal)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Cal");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitCess1Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess1Exemption");
            entity.Property(e => e.UnitCess2Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess2Exemption");
            entity.Property(e => e.UnitCess3Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess3Exemption");
            entity.Property(e => e.UnitDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Duty");
            entity.Property(e => e.UnitExportDutyExemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_ExportDutyExemption");
            entity.Property(e => e.UnitStatistics)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Statistics");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);

            entity.HasOne(d => d.CustomRegistrationNoNavigation).WithMany(p => p.K2Details)
                .HasForeignKey(d => d.CustomRegistrationNo)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_K2_Detail_K2_Header");
        });

        modelBuilder.Entity<K2Duplicate>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("K2_Duplicate");

            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<K2Header>(entity =>
        {
            entity.HasKey(e => e.CustomRegistrationNo);

            entity.ToTable("K2_Header");

            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.AmountReceived).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ApprovalDate).HasPrecision(3);
            entity.Property(e => e.ApprovalTime)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.CommodityStatus)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.DateOfExport).HasPrecision(3);
            entity.Property(e => e.DateUpload)
                .HasPrecision(3)
                .HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DeclarantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DeclarantICNo");
            entity.Property(e => e.DeclarantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.DeclarantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Equivalent).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.ExportPermit)
                .HasMaxLength(13)
                .IsUnicode(false);
            entity.Property(e => e.ExportPermitExpiryDate).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false);
            entity.Property(e => e.FinalDestination)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.FlightDate).HasPrecision(3);
            entity.Property(e => e.FlightNo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.ForeignExchangeCode)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.ForeignExchangeRate).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.Freight).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Insurance).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Kpwxno)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("KPWXNo");
            entity.Property(e => e.Measurement).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.OgaapprovalNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("OGAApprovalNo");
            entity.Property(e => e.OgaofficerId)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("OGAOfficerID");
            entity.Property(e => e.Ogatype)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("OGAType");
            entity.Property(e => e.OtherCharges).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReceiptDate).HasPrecision(3);
            entity.Property(e => e.ReceiptTime)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.ReceivedFrom)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.RegistrationDate).HasPrecision(3);
            entity.Property(e => e.RegistrationTime)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.ReleaseTime)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.Remark)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.SptflagAc)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("SPTFlag_AC");
            entity.Property(e => e.Sptref)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("SPTRef");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalExemptedAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.TotalNoOfItem).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TrailerNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.TransactionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.VesselName)
                .HasMaxLength(17)
                .IsUnicode(false);
            entity.Property(e => e.VesselRegistration)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.VoyageNo)
                .HasMaxLength(6)
                .IsUnicode(false);
        });

        modelBuilder.Entity<K3Detail>(entity =>
        {
            entity.ToTable("K3_Detail");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.CargoType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateProcessed)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(14, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(14, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueCal)
                .HasColumnType("decimal(11, 2)")
                .HasColumnName("TotalValue_Cal");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(11, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Duty");
            entity.Property(e => e.UnitStatistics)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Statistics");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(14, 5)");
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);

            entity.HasOne(d => d.CustomRegistrationNoNavigation).WithMany(p => p.K3Details)
                .HasForeignKey(d => d.CustomRegistrationNo)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_K3_Detail_K3_Header");
        });

        modelBuilder.Entity<K3Header>(entity =>
        {
            entity.HasKey(e => e.CustomRegistrationNo);

            entity.ToTable("K3_Header");

            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.AcceptanceRec)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode1)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("ApplicantICNo");
            entity.Property(e => e.ApplicantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CargoType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitStn)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.DFilename)
                .HasMaxLength(20)
                .HasColumnName("D_Filename");
            entity.Property(e => e.DateOfDispatch).HasColumnType("date");
            entity.Property(e => e.DateProcessed)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.DeclarantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DeclarantICNo");
            entity.Property(e => e.DeclarantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.DeclarantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.FlightDate).HasColumnType("date");
            entity.Property(e => e.FlightNo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("decimal(28, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.Freight).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.GeneralDescription1)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription2)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(28, 4)");
            entity.Property(e => e.Insurance).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.Measurement).HasColumnType("decimal(28, 4)");
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.MoveFrom)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.MoveTo)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.MovementType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Ogaapproval)
                .HasMaxLength(23)
                .IsUnicode(false)
                .HasColumnName("OGAApproval");
            entity.Property(e => e.OgaofficerId)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("OGAOfficerID");
            entity.Property(e => e.OriginDestinationDate)
                .HasColumnType("date")
                .HasColumnName("Origin_DestinationDate");
            entity.Property(e => e.OriginDestinationOfficer)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationOfficer");
            entity.Property(e => e.OriginDestinationRegNo)
                .HasMaxLength(19)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationRegNo");
            entity.Property(e => e.OriginDestinationTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationTime");
            entity.Property(e => e.PaperlessSign)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PermitExpiryDate).HasColumnType("date");
            entity.Property(e => e.PhyExDate).HasColumnType("date");
            entity.Property(e => e.PhyExTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfFinalDestination)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReceivedAmount).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.RegistrationDate).HasColumnType("date");
            entity.Property(e => e.RegistrationTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReleaseDate).HasColumnType("date");
            entity.Property(e => e.ReleaseTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Remark1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark4)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.TrailerNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.TransactionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.VesselName)
                .HasMaxLength(17)
                .IsUnicode(false);
            entity.Property(e => e.VesselRegistration)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.VoyageNo)
                .HasMaxLength(6)
                .IsUnicode(false);

            entity.HasOne(d => d.CargoTypeNavigation).WithMany(p => p.K3Headers)
                .HasForeignKey(d => d.CargoType)
                .HasConstraintName("FK_K3_Header_ref_CargoType");

            entity.HasOne(d => d.ModeOfTransportNavigation).WithMany(p => p.K3Headers)
                .HasForeignKey(d => d.ModeOfTransport)
                .HasConstraintName("FK_K3_Header_ref_ModeOfTransport");

            entity.HasOne(d => d.MoveFromNavigation).WithMany(p => p.K3Headers)
                .HasForeignKey(d => d.MoveFrom)
                .HasConstraintName("FK_K3_Header_ref_MoveFrom");

            entity.HasOne(d => d.MoveToNavigation).WithMany(p => p.K3Headers)
                .HasForeignKey(d => d.MoveTo)
                .HasConstraintName("FK_K3_Header_ref_MoveTo");
        });

        modelBuilder.Entity<K3HeaderDuplicate>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("K3_Header_Duplicate");

            entity.Property(e => e.AcceptanceRec)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode1)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("ApplicantICNo");
            entity.Property(e => e.ApplicantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CargoType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitStn)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.DFilename)
                .HasMaxLength(20)
                .HasColumnName("D_Filename");
            entity.Property(e => e.DateOfDispatch).HasColumnType("date");
            entity.Property(e => e.DateProcessed).HasColumnType("datetime");
            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.DeclarantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DeclarantICNo");
            entity.Property(e => e.DeclarantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.DeclarantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FileFormat)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.FlightDate).HasColumnType("date");
            entity.Property(e => e.FlightNo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("numeric(28, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.Freight).HasColumnType("numeric(28, 2)");
            entity.Property(e => e.GeneralDescription1)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription2)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("numeric(28, 4)");
            entity.Property(e => e.Insurance).HasColumnType("numeric(28, 2)");
            entity.Property(e => e.Measurement).HasColumnType("numeric(28, 4)");
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.MoveFrom)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.MoveTo)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.MovementType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Ogaapproval)
                .HasMaxLength(23)
                .IsUnicode(false)
                .HasColumnName("OGAApproval");
            entity.Property(e => e.OgaofficerId)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("OGAOfficerID");
            entity.Property(e => e.OriginDestinationDate)
                .HasColumnType("date")
                .HasColumnName("Origin_DestinationDate");
            entity.Property(e => e.OriginDestinationOfficer)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationOfficer");
            entity.Property(e => e.OriginDestinationRegNo)
                .HasMaxLength(19)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationRegNo");
            entity.Property(e => e.OriginDestinationTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationTime");
            entity.Property(e => e.PaperlessSign)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PermitExpiryDate).HasColumnType("date");
            entity.Property(e => e.PhyExDate).HasColumnType("date");
            entity.Property(e => e.PhyExTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfFinalDestination)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReceivedAmount).HasColumnType("numeric(28, 2)");
            entity.Property(e => e.RegistrationDate).HasColumnType("date");
            entity.Property(e => e.RegistrationTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReleaseDate).HasColumnType("date");
            entity.Property(e => e.ReleaseTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Remark1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark4)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Rfu)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("RFU");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("numeric(28, 2)");
            entity.Property(e => e.TrailerNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.TransactionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.VersionNo)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.VesselName)
                .HasMaxLength(17)
                .IsUnicode(false);
            entity.Property(e => e.VesselRegistration)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.VoyageNo)
                .HasMaxLength(6)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefCargoType>(entity =>
        {
            entity.HasKey(e => e.Kod);

            entity.ToTable("ref_CargoType");

            entity.Property(e => e.Kod)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Deskripsi)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefModeOfTransport>(entity =>
        {
            entity.HasKey(e => e.Kod);

            entity.ToTable("ref_ModeOfTransport");

            entity.Property(e => e.Kod)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Deskripsi)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefMoveFrom>(entity =>
        {
            entity.HasKey(e => e.Kod);

            entity.ToTable("ref_MoveFrom");

            entity.Property(e => e.Kod)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Deskripsi)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefMoveTo>(entity =>
        {
            entity.HasKey(e => e.Kod);

            entity.ToTable("ref_MoveTo");

            entity.Property(e => e.Kod)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Deskripsi)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefMovementType>(entity =>
        {
            entity.HasKey(e => e.Kod);

            entity.ToTable("ref_MovementType");

            entity.Property(e => e.Kod)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Deskripsi)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RefPlaceOfLoading>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ref_PlaceOfLoading");

            entity.Property(e => e.Deskripsi)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Kod)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<RefPortOfDischarge>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ref_PortOfDischarge");

            entity.Property(e => e.Deskripsi).HasMaxLength(255);
            entity.Property(e => e.Kod).HasMaxLength(255);
        });

        modelBuilder.Entity<RefPortOfFinalDestination>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ref_PortOfFinalDestination");

            entity.Property(e => e.Deskripsi).HasMaxLength(255);
            entity.Property(e => e.Kod).HasMaxLength(255);
        });

        modelBuilder.Entity<TmpFilename>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tmpFilename");

            entity.Property(e => e.K3Filename)
                .HasMaxLength(50)
                .HasColumnName("K3_filename");
            entity.Property(e => e.ValueTest)
                .HasMaxLength(50)
                .HasColumnName("valueTest");
        });

        modelBuilder.Entity<Uvw2023KastamK1ImportQ1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_Import_Q1");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK1ImportQ2>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_Import_Q2");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK1ImportQ3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_Import_Q3");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK1ImportQ4>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_Import_Q4");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK1UipJanJun>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_UIP_(JAN-JUN)");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin).HasMaxLength(255);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfImport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<Uvw2023KastamK1UipJulDi>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K1_UIP_(JUL-DIS)");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin).HasMaxLength(255);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfImport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<Uvw2023KastamK2ExportQ1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K2_Export_Q1");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK2ExportQ2>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K2_Export_Q2");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK2ExportQ3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K2_Export_Q3");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK2ExportQ4>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K2_Export_Q4");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2023KastamK2Uip>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2023_Kastam_K2_UIP");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Cess1Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess2Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess3Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfExport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.FinalDestination).HasMaxLength(255);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.SpecificCess1)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess1");
            entity.Property(e => e.SpecificCess2)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess2");
            entity.Property(e => e.SpecificCess3)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess3");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<Uvw2024KastamK1ImportQ1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_Import_Q1");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK1ImportQ2>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_Import_Q2");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK1ImportQ3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_Import_Q3");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK1ImportQ4>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_Import_Q4");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK1UipJanJun>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_UIP_(JAN-JUN)");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin).HasMaxLength(255);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfImport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<Uvw2024KastamK1UipJulDi>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K1_UIP_(JUL-DIS)");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin).HasMaxLength(255);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfImport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(140)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<Uvw2024KastamK2ExportQ1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K2_Export_Q1");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK2ExportQ2>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K2_Export_Q2");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK2ExportQ3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K2_Export_Q3");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK2ExportQ4>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K2_Export_Q4");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<Uvw2024KastamK2Uip>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_2024_Kastam_K2_UIP");

            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Cess1Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess2Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess3Amount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.DateOfExport).HasPrecision(3);
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.FinalDestination).HasMaxLength(255);
            entity.Property(e => e.GeneralDescription)
                .HasMaxLength(240)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(29, 4)");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false);
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.ModeOfTransport)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.SpecificCess1)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess1");
            entity.Property(e => e.SpecificCess2)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess2");
            entity.Property(e => e.SpecificCess3)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess3");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(29, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Vehicle_LorryNo");
        });

        modelBuilder.Entity<UvwK1MalaysiaImport>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K1_MalaysiaImport");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(140)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfImport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF IMPORT");
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF LOADING");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
        });

        modelBuilder.Entity<UvwK2MalaysiaExport>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K2_MalaysiaExport");

            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("CATEGORY");
            entity.Property(e => e.Cess1Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS1 AMOUNT");
            entity.Property(e => e.Cess1DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess1ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess1ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess1Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS1 SPECIFIC");
            entity.Property(e => e.Cess2Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS2 AMOUNT");
            entity.Property(e => e.Cess2DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess2ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess2ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess2Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS2 SPECIFIC");
            entity.Property(e => e.Cess3Amount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("CESS3 AMOUNT");
            entity.Property(e => e.Cess3DutyType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess3ExemptionAmount).HasColumnType("decimal(29, 2)");
            entity.Property(e => e.Cess3ExemptionType)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Cess3Specific)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("CESS3 SPECIFIC");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("COUNTRY");
            entity.Property(e => e.CustomRegNo)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("CUSTOM REG NO");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Descuq)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("DESCUQ");
            entity.Property(e => e.ExporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("EXPORTER ADDRESS");
            entity.Property(e => e.ExporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("EXPORTER NAME");
            entity.Property(e => e.FileName)
                .HasMaxLength(14)
                .IsUnicode(false)
                .HasColumnName("FILE NAME");
            entity.Property(e => e.GeneralDesc)
                .HasMaxLength(240)
                .IsUnicode(false)
                .HasColumnName("GENERAL DESC");
            entity.Property(e => e.HsCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("HS CODE");
            entity.Property(e => e.ImporterAddress)
                .HasMaxLength(105)
                .IsUnicode(false)
                .HasColumnName("IMPORTER ADDRESS");
            entity.Property(e => e.ImporterName)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IMPORTER NAME");
            entity.Property(e => e.Month)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("MONTH");
            entity.Property(e => e.PlaceOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF DISCHARGE");
            entity.Property(e => e.PlaceOfExport)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PLACE OF EXPORT");
            entity.Property(e => e.PortOfTranshipment)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PORT OF TRANSHIPMENT");
            entity.Property(e => e.Products).HasMaxLength(255);
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("QUANTITY");
            entity.Property(e => e.ReleaseDate).HasPrecision(3);
            entity.Property(e => e.RevClassCess1)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess1");
            entity.Property(e => e.RevClassCess2)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess2");
            entity.Property(e => e.RevClassCess3)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("RevClass_Cess3");
            entity.Property(e => e.Sectors)
                .HasMaxLength(255)
                .HasColumnName("SECTORS");
            entity.Property(e => e.SpecificCess1Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess1Exemption");
            entity.Property(e => e.SpecificCess2Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess2Exemption");
            entity.Property(e => e.SpecificCess3Exemption)
                .HasColumnType("decimal(29, 7)")
                .HasColumnName("Specific_Cess3Exemption");
            entity.Property(e => e.SpecificUnitCess1)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess1");
            entity.Property(e => e.SpecificUnitCess2)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess2");
            entity.Property(e => e.SpecificUnitCess3)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("SpecificUnit_Cess3");
            entity.Property(e => e.TariffCode)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE");
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TARIFF CODE NEW");
            entity.Property(e => e.TotalDutyAmount)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL DUTY AMOUNT");
            entity.Property(e => e.TotalValue)
                .HasColumnType("decimal(29, 2)")
                .HasColumnName("TOTAL VALUE");
            entity.Property(e => e.UnitCess1Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess1Exemption");
            entity.Property(e => e.UnitCess2Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess2Exemption");
            entity.Property(e => e.UnitCess3Exemption)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Cess3Exemption");
        });

        modelBuilder.Entity<UvwKastamK3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_Kastam_K3");

            entity.Property(e => e.AcceptanceRec)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentCode1)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.AgentName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("ApplicantICNo");
            entity.Property(e => e.ApplicantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ApplicantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CargoType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Cargo Type");
            entity.Property(e => e.CargoType1)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("CargoType");
            entity.Property(e => e.ConsigneeAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsigneeName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorAddress3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ConsignorName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.CountryOfOrigin)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.CustomRegistrationNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CustomsPermitStn)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.DFilename)
                .HasMaxLength(20)
                .HasColumnName("D_Filename");
            entity.Property(e => e.DateOfDispatch).HasColumnType("date");
            entity.Property(e => e.DateProcessed).HasColumnType("datetime");
            entity.Property(e => e.DeclarantIcno)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("DeclarantICNo");
            entity.Property(e => e.DeclarantName)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.DeclarantStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FlightDate).HasColumnType("date");
            entity.Property(e => e.FlightNo)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Fob)
                .HasColumnType("decimal(28, 2)")
                .HasColumnName("FOB");
            entity.Property(e => e.Freight).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.GeneralDescription1)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GeneralDescription2)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.GrossWeight).HasColumnType("decimal(28, 4)");
            entity.Property(e => e.Insurance).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.ItemDescription)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.Measurement).HasColumnType("decimal(28, 4)");
            entity.Property(e => e.ModeTransport)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MoveFrom)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Move From");
            entity.Property(e => e.MoveTo)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Move To");
            entity.Property(e => e.MovementType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Ogaapproval)
                .HasMaxLength(23)
                .IsUnicode(false)
                .HasColumnName("OGAApproval");
            entity.Property(e => e.OgaofficerId)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("OGAOfficerID");
            entity.Property(e => e.OriginDestinationDate)
                .HasColumnType("date")
                .HasColumnName("Origin_DestinationDate");
            entity.Property(e => e.OriginDestinationOfficer)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationOfficer");
            entity.Property(e => e.OriginDestinationRegNo)
                .HasMaxLength(19)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationRegNo");
            entity.Property(e => e.OriginDestinationTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Origin_DestinationTime");
            entity.Property(e => e.PaperlessSign)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PermitExpiryDate).HasColumnType("date");
            entity.Property(e => e.PhyExDate).HasColumnType("date");
            entity.Property(e => e.PhyExTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlaceOfLoading)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfDischarge)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PortOfFinalDestination)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.QuantityDuty)
                .HasColumnType("decimal(14, 7)")
                .HasColumnName("Quantity_Duty");
            entity.Property(e => e.QuantityStatistics)
                .HasColumnType("decimal(14, 7)")
                .HasColumnName("Quantity_Statistics");
            entity.Property(e => e.ReceivedAmount).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.RegistrationDate).HasColumnType("date");
            entity.Property(e => e.RegistrationTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ReleaseDate).HasColumnType("date");
            entity.Property(e => e.ReleaseTime)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Remark1)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark2)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark3)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.Remark4)
                .HasMaxLength(35)
                .IsUnicode(false);
            entity.Property(e => e.TariffCodeNew)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TariffCode_New");
            entity.Property(e => e.TotalDutyAmount).HasColumnType("decimal(28, 2)");
            entity.Property(e => e.TotalValueCal)
                .HasColumnType("decimal(11, 2)")
                .HasColumnName("TotalValue_Cal");
            entity.Property(e => e.TotalValueDecl)
                .HasColumnType("decimal(11, 2)")
                .HasColumnName("TotalValue_Decl");
            entity.Property(e => e.TrailerNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.TransactionType)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.UnitDuty)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Duty");
            entity.Property(e => e.UnitStatistics)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("Unit_Statistics");
            entity.Property(e => e.UnitValue).HasColumnType("decimal(14, 5)");
            entity.Property(e => e.VehicleLorryNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.VesselName)
                .HasMaxLength(17)
                .IsUnicode(false);
            entity.Property(e => e.VesselRegistration)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.VoyageNo)
                .HasMaxLength(6)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
