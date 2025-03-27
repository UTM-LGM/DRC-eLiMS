using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace elims.elims;

public partial class ElimsContext : DbContext
{
    public ElimsContext()
    {
    }

    public ElimsContext(DbContextOptions<ElimsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BankCode> BankCodes { get; set; }

    public virtual DbSet<Batch> Batches { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanyForwarder> CompanyForwarders { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<CustomOffice> CustomOffices { get; set; }

    public virtual DbSet<Forwarder> Forwarders { get; set; }

    public virtual DbSet<Holiday> Holidays { get; set; }

    public virtual DbSet<K1Detail> K1Details { get; set; }

    public virtual DbSet<K1Header> K1Headers { get; set; }

    public virtual DbSet<LabRefNoRunningNo> LabRefNoRunningNos { get; set; }

    public virtual DbSet<LoginForwarder> LoginForwarders { get; set; }

    public virtual DbSet<LoginImporter> LoginImporters { get; set; }

    public virtual DbSet<Notice> Notices { get; set; }

    public virtual DbSet<RefCreatorRole> RefCreatorRoles { get; set; }

    public virtual DbSet<RefOven> RefOvens { get; set; }

    public virtual DbSet<RefPenimbang> RefPenimbangs { get; set; }

    public virtual DbSet<RefRubberType> RefRubberTypes { get; set; }

    public virtual DbSet<RefSampleType> RefSampleTypes { get; set; }

    public virtual DbSet<RefTestMethod> RefTestMethods { get; set; }

    public virtual DbSet<Result> Results { get; set; }

    public virtual DbSet<Retest> Retests { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sheet1> Sheet1s { get; set; }

    public virtual DbSet<Staff> Staffs { get; set; }

    public virtual DbSet<StaffRole> StaffRoles { get; set; }

    public virtual DbSet<StationCode> StationCodes { get; set; }

    public virtual DbSet<StatusCode> StatusCodes { get; set; }

    public virtual DbSet<TblImpotersCode> TblImpotersCodes { get; set; }

    public virtual DbSet<TypeCode> TypeCodes { get; set; }

    public virtual DbSet<UipMemoRunNo> UipMemoRunNos { get; set; }

    public virtual DbSet<UipSampleRunNo> UipSampleRunNos { get; set; }

    public virtual DbSet<UipbkhMemoRunNo> UipbkhMemoRunNos { get; set; }

    public virtual DbSet<UipbkhSampleRunNo> UipbkhSampleRunNos { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<UvwForwarder> UvwForwarders { get; set; }

    public virtual DbSet<UvwForwarder1> UvwForwarders1 { get; set; }

    public virtual DbSet<UvwImporter> UvwImporters { get; set; }

    public virtual DbSet<UvwK1Detail> UvwK1Details { get; set; }

    public virtual DbSet<UvwK1ErubberSample> UvwK1ErubberSamples { get; set; }

    public virtual DbSet<UvwK1LimsBatchesBr> UvwK1LimsBatchesBrs { get; set; }

    public virtual DbSet<UvwK1LimsBatchesLatex> UvwK1LimsBatchesLatexes { get; set; }

    public virtual DbSet<UvwK1LimsSample> UvwK1LimsSamples { get; set; }

    public virtual DbSet<UvwLateSamplesRemark> UvwLateSamplesRemarks { get; set; }

    public virtual DbSet<UvwTester> UvwTesters { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=pdbsql1601;Initial Catalog=elims;User=sa; Password=s@2016; Trusted_Connection=False;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BankCode>(entity =>
        {
            entity.HasKey(e => e.BankCode1).HasName("PK__BankCode__93AE04F6CBCBFB35");

            entity.ToTable("BankCode");

            entity.Property(e => e.BankCode1)
                .HasMaxLength(8)
                .HasColumnName("BankCode");
            entity.Property(e => e.BankName).HasMaxLength(50);
        });

        modelBuilder.Entity<Batch>(entity =>
        {
            entity.HasKey(e => e.BatchId).HasName("PK__Batches__5D55CE581B790993");

            entity.Property(e => e.BankCode).HasMaxLength(8);
            entity.Property(e => e.ChequeAmount).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.ChequeNo).HasMaxLength(50);
            entity.Property(e => e.CourierServices).HasMaxLength(50);
            entity.Property(e => e.CustomsLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.CustomsLetterPrintedDate).HasColumnType("datetime");
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.DateSampleDelivered).HasColumnType("date");
            entity.Property(e => e.DefaultTestMethod).HasMaxLength(50);
            entity.Property(e => e.Delivery).HasMaxLength(50);
            entity.Property(e => e.IsFastTrack).HasColumnName("isFastTrack");
            entity.Property(e => e.LetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.LetterPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.LgmletterRef)
                .HasMaxLength(50)
                .HasColumnName("LGMLetterRef");
            entity.Property(e => e.PostResultCourierServices).HasMaxLength(50);
            entity.Property(e => e.PostResultDelivery).HasMaxLength(50);
            entity.Property(e => e.PostResultOn).HasColumnType("date");
            entity.Property(e => e.PostResultTrackingNo).HasMaxLength(50);
            entity.Property(e => e.ResultLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.TrackingNo).HasMaxLength(50);
            entity.Property(e => e.TransactionNo).HasMaxLength(50);
            entity.Property(e => e.UipRegNo).HasMaxLength(50);
            entity.Property(e => e.UpbrefNo)
                .HasMaxLength(50)
                .HasColumnName("UPBRefNo");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Fax).HasMaxLength(50);
            entity.Property(e => e.IsNorthen).HasColumnName("isNorthen");
            entity.Property(e => e.LicenseNo).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Postcode).HasMaxLength(10);
            entity.Property(e => e.SmkimportersCode)
                .HasMaxLength(50)
                .HasColumnName("SMKImportersCode");
            entity.Property(e => e.Tel).HasMaxLength(50);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<CompanyForwarder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_CompanyForwarder_1");

            entity.ToTable("CompanyForwarder");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Country__3213E83FF36AF3DA");

            entity.ToTable("Country");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Country1)
                .HasMaxLength(50)
                .HasColumnName("Country");
        });

        modelBuilder.Entity<CustomOffice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_CustomOffices_1");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.CodeStation).HasMaxLength(50);
            entity.Property(e => e.ContactPerson)
                .HasMaxLength(50)
                .HasColumnName("contact_person");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.Fax)
                .HasMaxLength(50)
                .HasColumnName("fax");
            entity.Property(e => e.IsNorthen).HasColumnName("isNorthen");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Postcode)
                .HasMaxLength(50)
                .HasColumnName("postcode");
            entity.Property(e => e.Refno)
                .HasMaxLength(50)
                .HasColumnName("refno");
            entity.Property(e => e.Tel)
                .HasMaxLength(50)
                .HasColumnName("tel");
        });

        modelBuilder.Entity<Forwarder>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Fax).HasMaxLength(50);
            entity.Property(e => e.LicenseNo).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Postcode).HasMaxLength(50);
            entity.Property(e => e.RefNo).HasMaxLength(50);
            entity.Property(e => e.Tel).HasMaxLength(50);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Holiday>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("holiday");

            entity.Property(e => e.HolidayDate)
                .HasColumnType("datetime")
                .HasColumnName("holiday_date");
            entity.Property(e => e.HolidayId).HasColumnName("HolidayID");
            entity.Property(e => e.HolidayPeriod).HasColumnName("holiday_period");
            entity.Property(e => e.HolidayType)
                .HasMaxLength(255)
                .HasColumnName("holiday_type");
        });

        modelBuilder.Entity<K1Detail>(entity =>
        {
            entity.HasKey(e => e.K1DetailId).HasName("PK__K1_Detai__4400866B0B3EA036");

            entity.ToTable("K1_Detail");

            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.AgentName).HasMaxLength(255);
            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedOn).HasColumnType("datetime");
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.DateReceivedInLab).HasColumnType("date");
            entity.Property(e => e.DateSampleReceived).HasColumnType("datetime");
            entity.Property(e => e.Drc).HasColumnName("DRC");
            entity.Property(e => e.DryWeight).HasComputedColumnSql("(([Quantity]*[DRC])/(100))", false);
            entity.Property(e => e.HsCode).HasMaxLength(10);
            entity.Property(e => e.InLabBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.InLabOn).HasColumnType("datetime");
            entity.Property(e => e.IsSmk)
                .HasDefaultValueSql("((0))")
                .HasColumnName("isSMK");
            entity.Property(e => e.K1HeaderId).HasColumnName("K1_Header_ID");
            entity.Property(e => e.LabRefNo).HasMaxLength(50);
            entity.Property(e => e.LabelPrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.LabelPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.NoLaporanTuan).HasMaxLength(50);
            entity.Property(e => e.PrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.PrintedOn).HasColumnType("datetime");
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ReceivedOn).HasColumnType("datetime");
            entity.Property(e => e.RegistrationSeqNo).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Repeat).HasDefaultValueSql("((0))");
            entity.Property(e => e.RepeatPrintKeputusan).HasDefaultValueSql("((0))");
            entity.Property(e => e.ResultLetterApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ResultSentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ResultSentOn).HasColumnType("datetime");
            entity.Property(e => e.SamplePropose).HasMaxLength(50);
            entity.Property(e => e.SampleRunNo).HasMaxLength(50);
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.SmkimportersCode)
                .HasMaxLength(50)
                .HasColumnName("SMKImportersCode");
            entity.Property(e => e.TestedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
            entity.Property(e => e.WorksheetTestOn)
                .HasColumnType("date")
                .HasColumnName("worksheetTestOn");

            entity.HasOne(d => d.Batch).WithMany(p => p.K1Details)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_K1_Detail_Batches");

            entity.HasOne(d => d.K1Header).WithMany(p => p.K1Details)
                .HasForeignKey(d => d.K1HeaderId)
                .HasConstraintName("FK_K1_Detail_K1_Header");

            entity.HasOne(d => d.StatusCode).WithMany(p => p.K1Details)
                .HasForeignKey(d => d.StatusCodeId)
                .HasConstraintName("FK_K1_Detail_StatusCode");
        });

        modelBuilder.Entity<K1Header>(entity =>
        {
            entity.HasKey(e => e.K1HeaderId).HasName("PK__K1_Heade__964D7C9307ECEEAB");

            entity.ToTable("K1_Header");

            entity.Property(e => e.K1HeaderId).HasColumnName("K1_Header_ID");
            entity.Property(e => e.CompanyId).HasColumnName("companyId");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.ImportedDate).HasColumnType("date");
            entity.Property(e => e.IsSmk)
                .HasDefaultValueSql("((0))")
                .HasColumnName("isSMK");
            entity.Property(e => e.LorryNo).HasMaxLength(50);
            entity.Property(e => e.SupplierName).HasMaxLength(255);
            entity.Property(e => e.TrailerNo).HasMaxLength(50);
            entity.Property(e => e.Transport)
                .HasMaxLength(50)
                .HasColumnName("transport");
        });

        modelBuilder.Entity<LabRefNoRunningNo>(entity =>
        {
            entity.ToTable("LabRefNoRunningNo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Monthyear)
                .HasMaxLength(50)
                .HasColumnName("monthyear");
            entity.Property(e => e.Runningno).HasColumnName("runningno");
        });

        modelBuilder.Entity<LoginForwarder>(entity =>
        {
            entity.ToTable("LoginForwarder");

            entity.Property(e => e.ForwarderId).HasColumnName("forwarderId");
            entity.Property(e => e.Locked).HasColumnName("locked");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<LoginImporter>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompanyId).HasColumnName("companyId");
            entity.Property(e => e.Locked).HasColumnName("locked");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Notice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Notification");

            entity.ToTable("Notice");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Announcement).HasColumnName("announcement");
            entity.Property(e => e.IsShow).HasColumnName("isShow");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Title).HasColumnName("title");
        });

        modelBuilder.Entity<RefCreatorRole>(entity =>
        {
            entity.ToTable("RefCreatorRole");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatorRoleName)
                .HasMaxLength(50)
                .HasColumnName("creatorRoleName");
        });

        modelBuilder.Entity<RefOven>(entity =>
        {
            entity.ToTable("RefOven");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ID1)
                .HasMaxLength(50)
                .HasColumnName("I/D");
            entity.Property(e => e.Oven).HasMaxLength(50);
        });

        modelBuilder.Entity<RefPenimbang>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_RefPenimbang_1");

            entity.ToTable("RefPenimbang");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Balance).HasMaxLength(50);
            entity.Property(e => e.ID1)
                .HasMaxLength(50)
                .HasColumnName("I/D");
        });

        modelBuilder.Entity<RefRubberType>(entity =>
        {
            entity.ToTable("RefRubberType");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RubberType)
                .HasMaxLength(50)
                .HasColumnName("rubberType");
        });

        modelBuilder.Entity<RefSampleType>(entity =>
        {
            entity.ToTable("RefSampleType");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RubberTypeId).HasColumnName("rubberTypeId");
            entity.Property(e => e.SampleCategory)
                .HasMaxLength(5)
                .HasColumnName("sampleCategory");
            entity.Property(e => e.SampleCode)
                .HasMaxLength(5)
                .HasColumnName("sampleCode");
            entity.Property(e => e.SampleType)
                .HasMaxLength(50)
                .HasColumnName("sampleType");
        });

        modelBuilder.Entity<RefTestMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_TestMethod");

            entity.ToTable("RefTestMethod");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RubberTypeId).HasColumnName("rubberTypeId");
            entity.Property(e => e.TestMethod)
                .HasMaxLength(25)
                .HasColumnName("testMethod");
        });

        modelBuilder.Entity<Result>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Catatan)
                .HasMaxLength(100)
                .IsFixedLength();
            entity.Property(e => e.DecisionBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.DecisionOn).HasColumnType("datetime");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.Result1).HasColumnName("Result");
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<Retest>(entity =>
        {
            entity.ToTable("Retest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.RejectedBy).HasMaxLength(50);
            entity.Property(e => e.RejectedOn).HasColumnType("datetime");
            entity.Property(e => e.TestedBy).HasMaxLength(50);
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.Property(e => e.IsLogin).HasColumnName("isLogin");
            entity.Property(e => e.Role1)
                .HasMaxLength(50)
                .HasColumnName("Role");
        });

        modelBuilder.Entity<Sheet1>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Sheet1$");

            entity.Property(e => e.F10).HasMaxLength(255);
            entity.Property(e => e.F11).HasMaxLength(255);
            entity.Property(e => e.F5).HasMaxLength(255);
            entity.Property(e => e.F6).HasMaxLength(255);
            entity.Property(e => e.F7).HasMaxLength(255);
            entity.Property(e => e.F8).HasMaxLength(255);
            entity.Property(e => e.F9).HasMaxLength(255);
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImporterCode).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Staffs2");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EmailLgm).HasMaxLength(50);
            entity.Property(e => e.HpNo).HasMaxLength(50);
            entity.Property(e => e.IcNumber).HasMaxLength(50);
            entity.Property(e => e.Ikmno)
                .HasMaxLength(50)
                .HasColumnName("IKMno");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Position)
                .HasMaxLength(50)
                .HasColumnName("position");
            entity.Property(e => e.StaffName).HasMaxLength(255);
            entity.Property(e => e.Unit).HasMaxLength(50);
            entity.Property(e => e.UnitName).HasMaxLength(125);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<StaffRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_StaffRoles2");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StaffRole1).HasColumnName("StaffRole");
        });

        modelBuilder.Entity<StationCode>(entity =>
        {
            entity.ToTable("StationCode");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Keterangan).HasMaxLength(50);
            entity.Property(e => e.KodStesen).HasMaxLength(50);
        });

        modelBuilder.Entity<StatusCode>(entity =>
        {
            entity.HasKey(e => e.StatusCodeId).HasName("PK__StatusCo__589371942EB97E47");

            entity.ToTable("StatusCode");

            entity.Property(e => e.StatusCodeId).ValueGeneratedNever();
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<TblImpotersCode>(entity =>
        {
            entity.ToTable("tblImpotersCode");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Companyid).HasColumnName("companyid");
            entity.Property(e => e.SmkimportersCode)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("SMKImportersCode");
        });

        modelBuilder.Entity<TypeCode>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OldSystemId).HasColumnName("oldSystemId");
            entity.Property(e => e.RubberTypeId).HasColumnName("rubberTypeId");
            entity.Property(e => e.SampleCategory)
                .HasMaxLength(5)
                .HasColumnName("sampleCategory");
            entity.Property(e => e.SampleCode)
                .HasMaxLength(5)
                .HasColumnName("sampleCode");
            entity.Property(e => e.SampleType)
                .HasMaxLength(50)
                .HasColumnName("sampleType");
        });

        modelBuilder.Entity<UipMemoRunNo>(entity =>
        {
            entity.ToTable("UipMemoRunNo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RunNo).HasColumnName("runNo");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .HasColumnName("year");
        });

        modelBuilder.Entity<UipSampleRunNo>(entity =>
        {
            entity.ToTable("UipSampleRunNo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RunNo).HasColumnName("runNo");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .HasColumnName("year");
        });

        modelBuilder.Entity<UipbkhMemoRunNo>(entity =>
        {
            entity.ToTable("UipbkhMemoRunNo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RunNo).HasColumnName("runNo");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .HasColumnName("year");
        });

        modelBuilder.Entity<UipbkhSampleRunNo>(entity =>
        {
            entity.ToTable("UipbkhSampleRunNo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RunNo).HasColumnName("runNo");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .HasColumnName("year");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId);

            entity.Property(e => e.IsLogin).HasColumnName("isLogin");
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<UvwForwarder>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_Forwarder");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UvwForwarder1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_forwarders");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UvwImporter>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_Importers");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UvwK1Detail>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_k1Details");

            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.Agen).HasMaxLength(255);
            entity.Property(e => e.ApprovedOn).HasColumnType("datetime");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.DateReceivedInLab).HasColumnType("date");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImportedDate).HasColumnType("date");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.LabRefNo).HasMaxLength(50);
            entity.Property(e => e.Last)
                .HasMaxLength(1)
                .HasColumnName("LAST");
            entity.Property(e => e.Pengimport).HasMaxLength(255);
            entity.Property(e => e.ReceivedOn).HasColumnType("datetime");
            entity.Property(e => e.ResultSentOn).HasColumnType("datetime");
            entity.Property(e => e.RubberType)
                .HasMaxLength(50)
                .HasColumnName("rubberType");
            entity.Property(e => e.RubberTypeId).HasColumnName("rubberTypeId");
            entity.Property(e => e.SampleType)
                .HasMaxLength(50)
                .HasColumnName("sampleType");
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<UvwK1ErubberSample>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K1_erubber_samples");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedOn).HasColumnType("datetime");
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.Drc).HasColumnName("DRC");
            entity.Property(e => e.DriverName).HasMaxLength(50);
            entity.Property(e => e.HsCode).HasMaxLength(10);
            entity.Property(e => e.IcDriver).HasMaxLength(50);
            entity.Property(e => e.ImportedDate).HasColumnType("date");
            entity.Property(e => e.InLabBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.InLabOn).HasColumnType("datetime");
            entity.Property(e => e.IsSmk).HasColumnName("isSMK");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.LabRefNo).HasMaxLength(50);
            entity.Property(e => e.LabelPrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.LabelPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.LorryNo).HasMaxLength(50);
            entity.Property(e => e.PrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.PrintedOn).HasColumnType("datetime");
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ReceivedOn).HasColumnType("datetime");
            entity.Property(e => e.ResultLetterApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ResultSentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ResultSentOn).HasColumnType("datetime");
            entity.Property(e => e.SamplePropose).HasMaxLength(50);
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.SupplierName).HasMaxLength(50);
            entity.Property(e => e.TestedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
            entity.Property(e => e.TrailerNo).HasMaxLength(50);
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<UvwK1LimsBatchesBr>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K1_Lims_Batches_BR");

            entity.Property(e => e.BankCode).HasMaxLength(8);
            entity.Property(e => e.ChequeAmount).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.ChequeNo).HasMaxLength(50);
            entity.Property(e => e.CourierServices).HasMaxLength(50);
            entity.Property(e => e.CustomsLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.CustomsLetterPrintedDate).HasColumnType("datetime");
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.DateSampleDelivered).HasColumnType("date");
            entity.Property(e => e.Delivery).HasMaxLength(50);
            entity.Property(e => e.LetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.LetterPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.LgmletterRef)
                .HasMaxLength(50)
                .HasColumnName("LGMLetterRef");
            entity.Property(e => e.ResultLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.TrackingNo).HasMaxLength(50);
            entity.Property(e => e.TransactionNo).HasMaxLength(50);
            entity.Property(e => e.UipRegNo).HasMaxLength(50);
            entity.Property(e => e.UpbrefNo)
                .HasMaxLength(50)
                .HasColumnName("UPBRefNo");
        });

        modelBuilder.Entity<UvwK1LimsBatchesLatex>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K1_lims_batches_Latex");

            entity.Property(e => e.BankCode).HasMaxLength(8);
            entity.Property(e => e.ChequeAmount).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.ChequeNo).HasMaxLength(50);
            entity.Property(e => e.CourierServices).HasMaxLength(50);
            entity.Property(e => e.CustomsLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.CustomsLetterPrintedDate).HasColumnType("datetime");
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.DateSampleDelivered).HasColumnType("date");
            entity.Property(e => e.Delivery).HasMaxLength(50);
            entity.Property(e => e.LetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.LetterPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.LgmletterRef)
                .HasMaxLength(50)
                .HasColumnName("LGMLetterRef");
            entity.Property(e => e.ResultLetterPrinted)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.TrackingNo).HasMaxLength(50);
            entity.Property(e => e.TransactionNo).HasMaxLength(50);
            entity.Property(e => e.UipRegNo).HasMaxLength(50);
            entity.Property(e => e.UpbrefNo)
                .HasMaxLength(50)
                .HasColumnName("UPBRefNo");
        });

        modelBuilder.Entity<UvwK1LimsSample>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_K1_lims_samples");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedOn).HasColumnType("datetime");
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.CreatedOn).HasColumnType("datetime");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.Drc).HasColumnName("DRC");
            entity.Property(e => e.DriverName).HasMaxLength(50);
            entity.Property(e => e.HsCode).HasMaxLength(10);
            entity.Property(e => e.IcDriver).HasMaxLength(50);
            entity.Property(e => e.ImportedDate).HasColumnType("date");
            entity.Property(e => e.InLabBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.InLabOn).HasColumnType("datetime");
            entity.Property(e => e.IsSmk).HasColumnName("isSMK");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.LabRefNo).HasMaxLength(50);
            entity.Property(e => e.LabelPrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.LabelPrintedOn).HasColumnType("datetime");
            entity.Property(e => e.LorryNo).HasMaxLength(50);
            entity.Property(e => e.PrintedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.PrintedOn).HasColumnType("datetime");
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ReceivedOn).HasColumnType("datetime");
            entity.Property(e => e.ResultLetterApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ResultSentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ResultSentOn).HasColumnType("datetime");
            entity.Property(e => e.SamplePropose).HasMaxLength(50);
            entity.Property(e => e.SentBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.SupplierName).HasMaxLength(50);
            entity.Property(e => e.TestedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
            entity.Property(e => e.TrailerNo).HasMaxLength(50);
            entity.Property(e => e.VerifiedBy)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<UvwLateSamplesRemark>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_Late_Samples_Remarks");

            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.Agen).HasMaxLength(255);
            entity.Property(e => e.ApprovedOn).HasColumnType("datetime");
            entity.Property(e => e.CustomNo).HasMaxLength(50);
            entity.Property(e => e.DateReceivedInLab).HasColumnType("date");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImportedDate).HasColumnType("date");
            entity.Property(e => e.K1DetailId).HasColumnName("K1_Detail_ID");
            entity.Property(e => e.LabRefNo).HasMaxLength(50);
            entity.Property(e => e.Last)
                .HasMaxLength(1)
                .HasColumnName("LAST");
            entity.Property(e => e.Pengimport).HasMaxLength(255);
            entity.Property(e => e.ReceivedOn).HasColumnType("datetime");
            entity.Property(e => e.ResultSentOn).HasColumnType("datetime");
            entity.Property(e => e.RubberType)
                .HasMaxLength(50)
                .HasColumnName("rubberType");
            entity.Property(e => e.RubberTypeId).HasColumnName("rubberTypeId");
            entity.Property(e => e.SampleType)
                .HasMaxLength(50)
                .HasColumnName("sampleType");
            entity.Property(e => e.SentOn).HasColumnType("datetime");
            entity.Property(e => e.TestedOn).HasColumnType("datetime");
            entity.Property(e => e.VerifiedOn).HasColumnType("datetime");
        });

        modelBuilder.Entity<UvwTester>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("uvw_Tester");

            entity.Property(e => e.StaffName).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
