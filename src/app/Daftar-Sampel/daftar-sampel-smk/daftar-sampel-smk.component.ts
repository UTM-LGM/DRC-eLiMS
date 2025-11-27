import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataKastamService } from '../../services/data-kastam.service';
import { K1Detail } from '../../models/k1Detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { ToastrService } from 'ngx-toastr';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RubberType } from 'src/app/models/rubberType';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import { SpinnerComponent } from 'src/app/dialogbox/spinner/spinner.component';
import { MatSort } from '@angular/material/sort';
import { loginImporter } from 'src/app/models/loginImporters';
import { TypeCode } from 'src/app/models/typeCode';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-daftar-sampel-smk',
  templateUrl: './daftar-sampel-smk.component.html',
  styleUrls: ['./daftar-sampel-smk.component.css']
})
export class DaftarSampelSMKComponent implements OnInit {
  samplePropose: any = ['Pengecualian Ses (CE)', 'Lain-lain'];
  importer: loginImporter = {} as loginImporter;
  staff: Staff = {} as Staff;
  user: userDTO = {} as userDTO;
  k1Detail: K1Detail = {} as K1Detail;
  sample: Sample = {} as Sample;
  showTypeCodes: boolean = false;
  tiadaDetailKastam: boolean = false;
  showErrorMessage: boolean = false;
  daftarClicked = false;
  lateSample: boolean = false;
  rubberTypes: RubberType[];
  typeCodes: TypeCode[];
  resDetail: any
  importerCompanies: any;
  forwarders: any;
  customNo: string;
  itemDescriptionData: any;
  k1Header: any;
  sampleForm: FormGroup;
  formattedQuantity: any;
  formattedDRC: any;
  companies: any = {};
  loginAs: any;
  agentCode: any;
  importerCode: any;
  k1DetailKastam: any;
  k3DetailKastam: any;

  showRemarks: boolean;
  notes: string;
  selectedDateSum: Date;
  customOffice: any;
  file: any | null;
  click: any;
  userRoleId: any;
  roleForwarder: boolean;
  roleUip: boolean;
  roleImporter: boolean;
  dryWeight: number;
  stationCodes: any;
  private isK3Data: boolean = false;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dataKastamService: DataKastamService,
    private elimsService: ElimsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private dialog: MatDialog,
    private daftarSampelService: DaftarSampelService,
    private userService: UserService,
  ) { }
  ngOnInit() {
    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }
    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        console.log(res)
        this.agentCode = res.code
        console.log(this.agentCode)
        this.daftarSampelService.GetCompanyForwarderbyId(this.user.forwarderId).subscribe(
          resForwarder => {
            this.importerCompanies = resForwarder
            this.importerCompanies.sort((a: { name: any; }, b: { name: any; }) => {
              const companiesA = a.name;
              const companiesB = b.name;
              if (companiesA < companiesB) {
                return -1;
              } else if (companiesA > companiesB) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        );
        this.elimsService.GetCompaniesbySMKImportersCode(this.agentCode).subscribe(data => {
          this.companies = data.filter(data => data.importerName != null);
          this.companies.sort((a: { importerName: any; }, b: { importerName: any; }) => {
            const companiesA = a.importerName;
            const companiesB = b.importerName;
            if (companiesA < companiesB) {
              return -1;
            } else if (companiesA > companiesB) {
              return 1;
            } else {
              return 0;
            }
          });
        })
      })
    }
    if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        console.log(res)
        this.importerCode = res.smkimportersCode
        console.log(this.importerCode)
        this.daftarSampelService.GetForwarders().subscribe(data => {
          this.forwarders = data.filter(data => data.name != null);
          console.log(this.forwarders)
          this.forwarders.sort((a: { name: any; }, b: { name: any; }) => {
            const forwarderA = a.name;
            const forwarderB = b.name;
            if (forwarderA < forwarderB) {
              return -1;
            } else if (forwarderA > forwarderB) {
              return 1;
            } else {
              return 0;
            }
          });
        });
      })
    }
    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        console.log(res)
        this.roleForwarder = false
        this.roleUip = true
        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data
          console.log(this.companies)
          this.companies.sort((a: { name: any; }, b: { name: any; }) => {
            const companyNameA = a.name;
            const companyNameB = b.name;
            if (companyNameA < companyNameB) {
              return -1;
            } else
              if (companyNameA > companyNameB) {
                return 1;
              } else {
                return 0;
              }
          });
        })
      })
    }
    this.sampleForm = this.formBuilder.group({
      kodStesen: ['', Validators.required],
      tahun: ['', Validators.required],
      nomborKastam: ['', Validators.required]
    });
    // Get rubberTypes
    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })
    // Get stationcode
    this.daftarSampelService.GetStationCodes().subscribe(data => {
      this.stationCodes = data.filter(data => data.kodStesen != null);
      this.stationCodes.sort((a: { kodStesen: any; }, b: { kodStesen: any; }) => {
        const kodStesenA = a.kodStesen;
        const kodStesenB = b.kodStesen;
        if (kodStesenA < kodStesenB) {
          return -1;
        } else if (kodStesenA > kodStesenB) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  private removeCommas(value: string): number {
    const numericValue = +value.replace(/,/g, '');
    return isNaN(numericValue) ? 0 : numericValue;
  }

  changeJenisGetah(e: any) {
    if (e.target.value == 1) {
      this.elimsService.GetRefSampleTypeByRubberType(1).subscribe(data => {
        this.typeCodes = data
      })
    }
    else if (e.target.value == 2) {
      this.elimsService.GetRefSampleTypeByRubberType(2).subscribe(data => {
        this.typeCodes = data
      })
    }
    this.showTypeCodes = true
  }

  searchCustomRegistrationNo(): void {
    this.tiadaDetailKastam = false;
    this.click = 1;
    if (this.sampleForm.valid) {
      const waitDialog = this.dialog.open(SpinnerComponent, { disableClose: true, width: '400px' });
      const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
      const tahun = this.sampleForm.get('tahun')?.value ?? '';
      const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
      this.customNo = kodStesen + tahun + nomborKastam;
      if (!this.customNo) {
        this.toastr.error('Nombor Borang Kastam tidak dijumpai.', 'Error');
        return; 
      }


      if (this.userRoleId === "1") {
        this.daftarSampelService.GetK1DetailByCustomNo(this.customNo).subscribe(resDetail => {
          if (resDetail && resDetail.length > 0) {
            this.tiadaDetailKastam = true;
            this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
            waitDialog.close(); // Close spinner when data is received
            return;
          }

          // Fetch K1 Detail
          this.dataKastamService.getK1DetailAgentCode(this.customNo, this.agentCode).subscribe(k1Data => {
            waitDialog.close(); // Close spinner when data is received
            if (k1Data && k1Data.length > 0) {
              this.k1DetailKastam = k1Data;
              console.log("K1 Detail Fetched:", this.k1DetailKastam);
            } else {
              this.fetchK3Detail(); // If K1 not found, check K3
            }
          }, error => {
            waitDialog.close(); // Close spinner on error
            console.error('Error occurred while fetching K1 detail:', error);
            this.fetchK3Detail(); // Attempt to fetch K3 even if K1 fails
          });
        }, err => {
          waitDialog.close(); // Close spinner on error
          console.error('Error occurred while fetching resDetail:', err);
        });
      }

      else if (this.userRoleId === "2") {
        if (!this.customNo) {
          this.toastr.error('Nombor Borang Kastam tidak dijumpai.', 'Warning');
          return; // Exit if no custom number is provided
        }
        const customNoWithUip = this.customNo + 'uip'; // Append 'uip' to customNo
        // Initialize flags
        let k1Found = false;
        let k3Found = false;
        // Use forkJoin to handle both observables simultaneously
        forkJoin({
          k1: this.dataKastamService.getK1Detail(this.customNo),
          k3: this.dataKastamService.getK3DetailbyCustomNo(this.customNo)
        }).subscribe({
          next: (results) => {  // Change here: receive results as an object
            waitDialog.close();
            // Check K1 Data
            if (results.k1 && results.k1.length > 0) {
              k1Found = true; // K1 data found
              this.k1DetailKastam = results.k1;
              // Proceed with additional checks for K1
              this.daftarSampelService.GetK1DetailByCustomNo(customNoWithUip).subscribe(resDetail => {
                const filteredDescriptions = resDetail
                  .filter((detail: K1Detail) => detail.creatorRoleId === 2)
                  .map((detail: K1Detail) => detail.itemDescription);
                this.k1DetailKastam = this.k1DetailKastam.filter(detail => !filteredDescriptions.includes(detail.itemDescription));
                if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
                  this.tiadaDetailKastam = true;
                  this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
                }
              }, err => {
                console.error('Error occurred in GetK1DetailByCustomNo:', err);
              });
            }
            // Check K3 Data
            if (results.k3 && results.k3.length > 0) {
              k3Found = true; // K3 data found
              this.k3DetailKastam = results.k3; // Save K3 data to a separate variable
              this.isK3Data = true;
              console.log("K3 Detail Fetched:", this.k3DetailKastam);
            }
            // After both checks, determine if toastr should be displayed
            if (!k1Found && !k3Found) {
              this.toastr.error('Nombor Borang Kastam tidak wujud.', 'Error');
            }
          },
          error: (err) => {
            waitDialog.close();
            console.error('Error occurred in fetching K1 or K3 detail:', err);
          }
        });
      }
     
      else if (this.userRoleId === '3') {
        // Fetch K1 details by Custom Number
        this.daftarSampelService.GetK1DetailByCustomNo(this.customNo).subscribe(
          (resDetail) => {
            waitDialog.close();
            // Combine filtering logic for both roles
            const filteredDescriptions = resDetail
              .filter(
                (detail: K1Detail) =>
                  detail.creatorRoleId === 3 || detail.creatorRoleId === 1
              )
              .map((detail: K1Detail) => detail.itemDescription);
            // Fetch K1 details by Importer Code
            this.dataKastamService.getK1DetailByImporterCode(this.customNo, this.importerCode).subscribe(
              (k1Data) => {
                this.k1DetailKastam = k1Data;
                // Filter out descriptions already registered by either role
                this.k1DetailKastam = this.k1DetailKastam.filter(
                  (detail) => !filteredDescriptions.includes(detail.itemDescription)
                );
                // Handle case where no K1 details remain
                if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
                  this.k1DetailKastam = null;
                  this.tiadaDetailKastam = true;
                  this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
                }
              },
              (err) => {
                waitDialog.close();
                console.error('Error occurred:', err);
              }
            );
            // After K1 details are processed, fetch K3 details and check for CustomNo duplicates
            this.fetchK3DetailImporterCode(filteredDescriptions);
          },
          (err) => {
            waitDialog.close();
            this.toastr.warning('Anda tidak berdaftar dengan nombor kastam ini');
            console.error('Error occurred:', err);
          }
        );
      }
    }
  }

  private fetchK3Detail(): void {
    this.dataKastamService.getK3DetailAgentCode(this.customNo, this.agentCode).subscribe(k3Data => {
      if (k3Data && k3Data.length > 0) {
        this.k3DetailKastam = k3Data;
        this.isK3Data = true;
        console.log("K3 Detail Fetched from Agent Code:", this.k3DetailKastam);
      } else {
     
        this.toastr.error('Nombor kastam tidak wujud.', 'Error');
      }
    }, error => {
      console.error('Error occurred while fetching K3 detail:', error);
      this.toastr.error('Nombor kastam tidak wujud.', 'error');
    });
  }

  private fetchK3DetailImporterCode(filteredDescriptions: string[]): void {
    this.dataKastamService.getK3DetailImporterCode(this.customNo, this.importerCode).subscribe(
      (k3Data) => {
        if (k3Data && k3Data.length > 0) {
          // Filter out descriptions already registered by either role
          this.k3DetailKastam = k3Data.filter(
            (detail) => !filteredDescriptions.includes(detail.itemDescription)
          );
          // Handle case where no K3 details remain after filtering
          if (!this.k3DetailKastam || this.k3DetailKastam.length === 0) {
            this.k3DetailKastam = null;
            this.toastr.warning('Tiada data K3 yang belum didaftarkan.', 'Warning');
          } else {
            this.isK3Data = true;
            console.log('K3 Detail Fetched from Agent Code:', this.k3DetailKastam);
          }
        } else {
          // Show error only if K3 data is not found and K1 data was also not found
          if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
            // this.toastr.error('Nombor kastam tidak wujud.', 'Error');
          }
        }
      },
      (error) => {
        console.error('Error occurred while fetching K3 detail:', error);
        // Show error if there was an error in fetching K3 data and K1 data is also absent
        if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
          // this.toastr.error('Nombor kastam tidak wujud.', 'Error');
        }
      }
    );
  }


  showDetails(row: number, type: 'K1' | 'K3') {
    if (type === 'K1') {
      this.showDetailsK1(row);
    } else if (type === 'K3') {
      this.showDetailsK3(row);
    }
  }

  showDetailsK1(row: number) {
    this.dataKastamService.getK1Detail1(row).subscribe(k1Data => {
      console.log('K1 Data:', k1Data);
      this.k1Detail = k1Data;
      const customNoK1 = this.k1Detail?.customNo || '';
      if (customNoK1) {
        this.dataKastamService.getdataByCustomNo(customNoK1).subscribe(k1HeaderData => {
          console.log('K1 Header Data:', k1HeaderData);
          this.k1Header = k1HeaderData;
          this.onDateChange();
          this.filterImporterCompanies(k1HeaderData);
        });
      }
    });
  }

  showDetailsK3(row: number) {
    this.dataKastamService.getK3Detail1(row).subscribe(k3Data => {
      console.log('K3 Data:', k3Data);
      this.k1Detail = k3Data;
      const customNoK3 = this.k1Detail?.customNo || '';
      this.itemDescriptionData = this.k1Detail?.itemDescription || '';
      if (customNoK3) {
        this.dataKastamService.getK3HeaderByCustomNo(customNoK3).subscribe(k3HeaderData => {
          console.log('K3 Header Data:', k3HeaderData);
          this.k1Header = k3HeaderData;
          this.onDateChangeK3();
          this.filterImporterCompanies(k3HeaderData);
        });
      }
    });
  }

  // Helper function to filter importer companies based on user role
  filterImporterCompanies(headerData: any) {
    const trimmedImporterCode = headerData?.importerCode?.trim() || '';
    if (this.userRoleId === 1) {
      // Filter for role 1
      this.importerCompanies = this.importerCompanies.filter(importer => {
        // Directly check for equality without comma-based conditions
        return importer.smkimporterCode === trimmedImporterCode;
      });
    } else if (this.userRoleId === 2) {
      // Filter for role 2
      this.importerCompanies = this.importerCompanies.filter(importer => {
        return importer.smkimporterCode === trimmedImporterCode;
      });
    }
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.k1Detail.evidence = event.target.files[0].name;
    console.log(this.k1Detail.evidence);
  }

  addSample() {
    this.daftarClicked = true;
    // Check if the error message is displayed
    if (this.showErrorMessage) {
      console.log('Cannot add data. Dry weight exceeds limit.');
      return;
    }
    const statusCodeId = 1;
    const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
    const tahun = this.sampleForm.get('tahun')?.value ?? '';
    const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
    this.customNo = kodStesen + tahun + nomborKastam;
    this.k1Detail.createdBy = this.loginAs;
    this.k1Detail.creatorRoleId = this.userRoleId
    if (this.userRoleId == 1 || this.userRoleId == 3) {
      this.k1Detail.customNo = this.customNo
      this.k1Header.customNo = this.customNo;
    }
    else if (this.userRoleId == 2) {
      this.k1Detail.customNo = this.customNo + 'uip';
      this.k1Header.customNo = this.customNo
    }
    this.k1Detail.itemDescription = this.k1Detail.itemDescription;
    this.k1Detail.smkimportersCode = this.k1Header.importerCode;
    this.k1Detail.importerName = this.k1Header.importerName;
    this.k1Detail.agentName = this.k1Header.agentName;
    this.k1Detail.importerAddress = this.k1Header.importerAddress;
    this.k1Detail.quantity = this.removeCommas(this.formattedQuantity);
    this.k1Detail.drc = this.formattedDRC;
    this.k1Detail.companyId = this.sample.companyId;
    this.k1Detail.createdOn = new Date();
    this.k1Detail.isSMK = true;
    this.k1Header.isSMK = true;
    this.k1Header.companyId = this.sample.companyId;
    if (this.userRoleId == 1) {
      this.k1Detail.forwarderId = this.user.forwarderId;
    }
    else if (this.userRoleId == 2) {
      this.k1Detail.forwarderId = 22;
    }
    else if (this.userRoleId == 3) {
      this.k1Detail.companyId = this.importer.companyId;
      this.k1Detail.forwarderId = this.sample.forwarderId;
    }
    this.k1Detail.isK3 = this.isK3Data;
    console.log(this.k1Detail)
    console.log(this.k1Header)
    this.daftarSampelService.PostK1HeaderSample(this.k1Header, statusCodeId).subscribe(res => {
      this.k1Detail.k1HeaderId = res.k1HeaderId;
      this.daftarSampelService.PostK1DetailSample(this.k1Detail, statusCodeId).subscribe(resDetail => {
        this.daftarSampelService.PostFileK1Detail(resDetail.k1DetailId, this.file).subscribe(() => {
          console.log('File uploaded successfully');
        },
          error => {
            console.error('Error uploading file:', error);
          });
        this.router.navigate(['sample']);
      },
        err => {
          this.toastr.warning('Nombor Kastam telah wujud', "", { timeOut: 15000 });
        });
    });
  }

  checkRequired(): boolean | undefined {
    if (this.userRoleId == 1) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '') ||
        (this.lateSample && (this.k1Detail.remarks == null || this.k1Detail.remarks.trim() == ''))
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;
    } else if (this.userRoleId == 3) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Detail.dateSampleReceived == null) ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '') ||
        (this.sample.forwarderId == null) ||
        (this.lateSample && (this.k1Detail.remarks == null || this.k1Detail.remarks.trim() == ''))
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;
    }
    else if (this.userRoleId == 2) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '')
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;
    }
    return false;
  }

  enforceDRCLimit() {
    if (this.formattedDRC && this.formattedQuantity) {
      if (this.formattedDRC > 100) {
        this.formattedDRC = 0;
      }
      const formattedQuantity = this.removeCommas(this.formattedQuantity);
      this.dryWeight = (formattedQuantity * this.formattedDRC) / 100;
      // Check if the dry weight exceeds the database quantity
      this.showErrorMessage = this.dryWeight > this.k1Header.grossWeight;
    }
  }

  onDateChange() {
    const dateValue = new Date(this.k1Header.importedDate);
    // Subtract 1 day from the 12-day addition
    const sum = dateValue.getDate() + 12 - 1; // 12 days + subtract 1 day
    const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
    this.selectedDateSum = sumDate;
    const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
    const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const year = sumDate.getFullYear();
    this.notes = `${day}.${month}.${year}`;
    console.log(this.notes);
    const today = new Date();
    // Subtract 1 day from daysUntilDeadline as well
    const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); // Subtract 1 day
    const daysLate = Math.ceil((today.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24)) - 1; // Subtract 1 day
    // Check for lateness
    if (sumDate < today) {
      if (daysLate > 0) {
        this.lateSample = true;
        this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
      }
      this.showRemarks = true; // Display the remarks field
    } else if (daysUntilDeadline <= 3) {
      this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
      this.showRemarks = false; // Hide the remarks field
    } else {
      this.showRemarks = false; // Hide the remarks field
    }
    console.log(this.selectedDateSum.toDateString());
  }



  onDateChangeK3() {
    // Step 1: Calculate deadline date (21 days from the imported date)
    const dateValue = new Date(this.k1Header.importedDate);
    dateValue.setHours(0, 0, 0, 0); // Reset time
    const deadlineDate = new Date(dateValue);
    deadlineDate.setDate(deadlineDate.getDate() + 21 + 1); // Add 21 days (No 1 extra day as before)
    // Update the displayed `importedDate` in 'yyyy-MM-dd' format
    this.k1Header.importedDate = deadlineDate.toISOString().split('T')[0];
    // Initialize notesDate variable
    let notesDate = new Date(deadlineDate);
    // Logic for userRoleId == 1 or 2 (add 12 days)
    // if (this.userRoleId == 1 || this.userRoleId == 2) {
    // For both roles, add 12 days, not based on region or unit
    notesDate.setDate(notesDate.getDate() + 10);
    this.setNotesAndRemarks(notesDate);
    // }
  }
  // Helper method to set notes and display remarks
  setNotesAndRemarks(notesDate) {
    notesDate.setHours(0, 0, 0, 0); // Reset time
    const day = ('0' + notesDate.getDate()).slice(-2);
    const month = ('0' + (notesDate.getMonth() + 1)).slice(-2);
    const year = notesDate.getFullYear();
    this.notes = `${day}.${month}.${year}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time
    const daysUntilDeadline = Math.ceil((notesDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysLate = Math.ceil((today.getTime() - notesDate.getTime()) / (1000 * 60 * 60 * 24));
    if (notesDate < today) {
      this.lateSample = true;
      this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
      this.showRemarks = true; // Display the remarks field
    } else if (daysUntilDeadline <= 3) {
      this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
      this.showRemarks = false; // Hide the remarks field
    } else {
      this.lateSample = false;
      this.showRemarks = false; // Hide the remarks field
    }
  }
}
