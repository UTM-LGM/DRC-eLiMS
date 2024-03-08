import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataKastamService } from '../../services/data-kastam.service';
import { K1Detail } from '../../models/k1Detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sample } from '../../models/sample';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { ElimsService } from '../../services/elims.service';
import { ToastrService } from 'ngx-toastr';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDaftarSampelComponent } from '../../dialogbox/dialog-daftar-sampel/dialog-daftar-sampel.component';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { RubberType } from 'src/app/models/rubberType';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import { SpinnerComponent } from 'src/app/dialogbox/spinner/spinner.component';
import { StationCode } from 'src/app/models/stationCode';
import { MatSort } from '@angular/material/sort';
import { loginImporter } from 'src/app/models/loginImporters';
import { Forwarder } from 'src/app/models/forwarder';
import { TypeCode } from 'src/app/models/typeCode';

@Component({
  selector: 'app-daftar-sampel-smk',
  templateUrl: './daftar-sampel-smk.component.html',
  styleUrls: ['./daftar-sampel-smk.component.css']
})
export class DaftarSampelSMKComponent implements OnInit {
  resDetail: any
  user: userDTO = {} as userDTO;
  k1Detail: K1Detail = {} as K1Detail;
  importerCompanies: any;
  forwarders: any;
  sample: Sample = {} as Sample;
  rubberTypes: RubberType[];
  samplePropose: any = ['Pengecualian Ses (CE)', 'Lain-lain'];
  showSampleTypes: boolean = false;
  showTypeCodes: boolean = false;
  customNo: string;
  itemDescriptionData: any;
  k1Header: any;
  latexTypes: any;
  blockRubberTypes: any;
  sampleForm: FormGroup;
  sampleForm1: FormGroup;
  formattedQuantity: any;
  formattedDRC: any;
  // companies: any
  companies: any = {};
  countries: any;
  latexCountries: any;
  blockRubberCountries: any;
  loginAs: any;
  agentCode: any;
  importerCode: any;
  smkImportersCode: any;

  k1DetailKastam: any;
  showRemarks: boolean;
  selectedDate: string;
  notes: string;
  selectedDateSum: Date;
  customOffice: any;
  file: any | null;
  detailArray: any;
  selectedItemDescriptions: string[] = [];
  click: any;
  sampleTypes: any;
  typeCodes: TypeCode[];
  isDataLoading: boolean = false;
  isDataFound: boolean = false;
  unmatchedK1: any[] = [];
  roleId: any;
  roleForwarder: boolean;
  roleUip: boolean;
  roleImporter: boolean;
  staff: Staff = {} as Staff;
  importer: loginImporter = {} as loginImporter;
  tiadaDetailKastam: boolean = false;
  dryWeight: number;
  showErrorMessage: boolean = false;
  originalQuantity: number;
  stationCodes: any;
  stationCode: StationCode = {} as StationCode;
  daftarClicked = false;
  lateSample: boolean = false;
  creatorRoleId: any;
  typecodefiltered: any;

  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dataKastamService: DataKastamService,
    private getahBongkahService: GetahBongkahService,
    private drclimstrainingService: DrclimstrainingService,
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
      this.roleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
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
              // Compare the kodStesen values
              if (companiesA < companiesB) {
                return -1;
              } else if (companiesA > companiesB) {
                return 1;
              } else {
                return 0; // Kodstesen values are equal
              }
            });
          }
        );


        this.elimsService.GetCompaniesbySMKImportersCode(this.agentCode).subscribe(data => {
          // this.companies = data
          // console.log(this.companies)
          this.companies = data.filter(data => data.importerName != null);
          // console.log(this.companies)

          this.companies.sort((a: { importerName: any; }, b: { importerName: any; }) => {
            const companiesA = a.importerName;
            const companiesB = b.importerName;

            // Compare the kodStesen values
            if (companiesA < companiesB) {
              return -1;
            } else if (companiesA > companiesB) {
              return 1;
            } else {
              return 0; // Kodstesen values are equal
            }
          });

        })

      })
    }

    if (this.roleId == 3) {
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
          // Sort the stationCodes by kodstesen
          this.forwarders.sort((a: { name: any; }, b: { name: any; }) => {
            const forwarderA = a.name;
            const forwarderB = b.name;
            // Compare the kodStesen values
            if (forwarderA < forwarderB) {
              return -1;
            } else if (forwarderA > forwarderB) {
              return 1;
            } else {
              return 0;
            }
          });
        });


        // this.daftarSampelService.GetForwarderbyCompanyId(this.importer.companyId).subscribe(
        //   resImporter => {
        //     // Filter out null values for namaForwarder
        //     this.forwarders = resImporter.filter((item: { namaForwarder: any }) => item.namaForwarder !== null);
        //     console.log(this.forwarders);
        //     // Sort the filtered forwarders
        //     this.forwarders.sort((a: { namaForwarder: any; }, b: { namaForwarder: any; }) => {
        //       const forwarderA = a.namaForwarder;
        //       const forwarderB = b.namaForwarder;
        //       // Compare the name values
        //       if (forwarderA < forwarderB) {
        //         return -1;
        //       } else if (forwarderA > forwarderB) {
        //         return 1;
        //       } else {
        //         return 0; // Names are equal
        //       }
        //     });
        //   }
        // );
      })
    }


    else if (this.roleId == 2) {
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
            // Assuming companyName is a string property
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

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    this.daftarSampelService.GetStationCodes().subscribe(data => {
      this.stationCodes = data.filter(data => data.kodStesen != null);
      // Sort the stationCodes by kodstesen
      this.stationCodes.sort((a: { kodStesen: any; }, b: { kodStesen: any; }) => {
        const kodStesenA = a.kodStesen;
        const kodStesenB = b.kodStesen;
        // Compare the kodStesen values
        if (kodStesenA < kodStesenB) {
          return -1;
        } else if (kodStesenA > kodStesenB) {
          return 1;
        } else {
          return 0; // Kodstesen values are equal
        }
      });
    });
  }

  private removeCommas(value: string): number {
    const numericValue = +value.replace(/,/g, '');
    return isNaN(numericValue) ? 0 : numericValue;
  }

  // private removeCommas(value: string): number {
  //   return +value.replace(/,/g, ''); // Remove commas and convert to number
  // }
  // private formatNumberWithCommas(value: number): string {
  //   return value.toLocaleString(); // Format the number with commas
  // }

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


  //   searchCustomRegistrationNo(): void {
  //     this.tiadaDetailKastam = false
  //     this.click = 1;
  //     if (this.sampleForm.valid) {
  //       const waitDialog = this.dialog.open(SpinnerComponent, { disableClose: true, width: '400px' });
  //       const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
  //       const tahun = this.sampleForm.get('tahun')?.value ?? '';
  //       const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
  //       const customNo = kodStesen + tahun + nomborKastam;

  //       // Perform the search using customRegistrationNo
  //       this.dataKastamService.getK1DetailAgentCode(customNo, this.agentCode).subscribe(x => {
  //         // console.log(x);
  //         waitDialog.close()
  //         this.k1DetailKastam = x;
  //         this.daftarSampelService.GetK1DetailByCustomNo(customNo).subscribe(resDetail => {
  //           // console.log(resDetail);
  //           // Extract item descriptions from resDetail
  //           if (!x || x.length == 0) {
  //             this.k1DetailKastam = null
  //             if (this.roleId == 1) {
  //               // Show dialog message
  //               // const dialogRef = this.dialog.open(DialogDaftarSampelComponent, {
  //               //   width: '400px',
  //               //   data: {
  //               //     title: 'Invalid customNo',
  //               //     message: 'The customNo you entered is invalid.'
  //               //   }
  //               // });
  //               // // Handle button click event
  //               // dialogRef.afterClosed().subscribe((result: string) => {
  //               //   if (result == 'manualDaftar') {
  //               //     this.router.navigate(['/daftar-sampel']);
  //               //   }
  //               // });
  //               this.toastr.error('Nombor Kastam tidak Dijumpai', 'Error');
  //             }
  //             if (this.roleId == 2) {
  //               this.toastr.error('Nombor Kastam tidak Dijumpai', 'Error');
  //             }
  //           }
  //           else if (this.roleId == 1) {
  // // anda tidak berdaftar dengan nombor kastam ini kalau nombor kastam ada tapi dia masukkan nombor kastam org lain
  //             const selectedDescriptions = resDetail.map((detail: K1Detail) => detail.itemDescription);
  //             // console.log(selectedDescriptions);
  //             // Filter out selected item descriptions from k1DetailKastam
  //             this.k1DetailKastam = this.k1DetailKastam.filter((detail: K1Detail) =>
  //               !selectedDescriptions.includes(detail.itemDescription)
  //             );
  //             if (!this.k1DetailKastam || this.k1DetailKastam.length == 0) {
  //               this.tiadaDetailKastam = true
  //             }
  //           }
  //         },
  //           error => {
  //             // Handle error
  //             console.error('Error occurred:', error);
  //             // Display error dialog
  //             const dialogRef = this.dialog.open(DialogDaftarSampelComponent, {
  //               width: '400px',
  //               data: {
  //                 title: 'Error',
  //                 message: 'An error occurred while retrieving data.'
  //               }
  //             });
  //           });
  //       }
  //       );
  //     }
  //   }


  searchCustomRegistrationNo(): void {
    this.tiadaDetailKastam = false;

    this.click = 1;
    if (this.sampleForm.valid) {

      const waitDialog = this.dialog.open(SpinnerComponent, { disableClose: true, width: '400px' });

      const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
      const tahun = this.sampleForm.get('tahun')?.value ?? '';
      const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
      this.customNo = kodStesen + tahun + nomborKastam;



      if (this.roleId == "1") {
        this.dataKastamService.getK1DetailAgentCode(this.customNo, this.agentCode).subscribe(x => {
          this.k1DetailKastam = x;
          console.log(this.k1DetailKastam);

          this.daftarSampelService.GetK1DetailByCustomNo(this.customNo).subscribe(resDetail => {
            console.log(resDetail);
            this.resDetail = resDetail;
            waitDialog.close();


            const filteredDescriptions = resDetail
              .filter((detail: K1Detail) => detail.creatorRoleId === 1)
              .map((detail: K1Detail) => detail.itemDescription);

            console.log(filteredDescriptions);

            this.k1DetailKastam = this.k1DetailKastam.filter((detail: K1Detail) =>
              !filteredDescriptions.includes(detail.itemDescription)
            );
            if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
              this.k1DetailKastam = null;
              this.tiadaDetailKastam = true;
              this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
              return; // Exit earNombor Kastam tidak Dijumpaily if there are no k1DetailKastam items
            }

          }, err => {
            waitDialog.close();
            console.error('Error occurred:', err);
          });
        },
          err => {
            waitDialog.close()
            this.toastr.warning('Anda tidak berdaftar dengan nombor kastam ini')
            console.error('Error occurred:', err);
          });
      }


      else if (this.roleId == "2") {
        let customNoWithUip = this.customNo + 'uip'; // Append 'uip' to customNo
      
        this.dataKastamService.getK1Detail(this.customNo).subscribe(x => {
          console.log(x)
          this.k1DetailKastam = x;
          waitDialog.close();
          if (!this.k1DetailKastam || this.k1DetailKastam.length == 0) {
            this.k1DetailKastam = null;
            this.tiadaDetailKastam = true;
             this.toastr.error('Nombor Kastam tidak Dijumpai.', 'Warning');
             return;
          }
          this.daftarSampelService.GetK1DetailByCustomNo(customNoWithUip).subscribe(resDetail => {
            waitDialog.close();
      
            const filteredDescriptions = resDetail
              .filter((detail: K1Detail) => detail.creatorRoleId === 2)
              .map((detail: K1Detail) => detail.itemDescription);
      
            console.log(filteredDescriptions);
      
            this.k1DetailKastam = this.k1DetailKastam.filter((detail: K1Detail) =>
              !filteredDescriptions.includes(detail.itemDescription)
              
            );
      
            if (!this.k1DetailKastam || this.k1DetailKastam.length == 0) {
              this.k1DetailKastam = null;
              this.tiadaDetailKastam = true;
               this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
               return;
            }
            console.log(resDetail);
          },
          err => {
            waitDialog.close();
            console.error('Error occurred:', err);
          });
        });
      }
      


      else if (this.roleId == '3') {
        console.log(this.roleId)
        this.dataKastamService.getK1DetailByImporterCode(this.customNo, this.importerCode).subscribe(x => {
          this.k1DetailKastam = x;

          console.log(this.k1DetailKastam)

          // this.daftarSampelService.GetK1DetailByCustomNo(customNo).subscribe(resDetail => {
          //   waitDialog.close()
          //   if (!x || x.length == 0) {
          //     this.k1DetailKastam = null;
          //     this.toastr.error('Nombor Kastam tidak Dijumpai', 'Error');
          //   } else if (this.roleId == 3) {
          //     console.log(resDetail)
          //     const selectedDescriptions = resDetail.map((detail: K1Detail) => detail.itemDescription);
          //     this.k1DetailKastam = this.k1DetailKastam.filter((detail: K1Detail) =>
          //       !selectedDescriptions.includes(detail.itemDescription)
          //     );
          //     if (!this.k1DetailKastam || this.k1DetailKastam.length == 0) {
          //       this.tiadaDetailKastam = true;
          //     }
          //   }

          //   console.log(resDetail)
          // },

          this.daftarSampelService.GetK1DetailByCustomNo(this.customNo).subscribe(resDetail => {
            console.log(resDetail);
            this.resDetail = resDetail;
            waitDialog.close();


            const filteredDescriptions = resDetail
              .filter((detail: K1Detail) => detail.creatorRoleId === 1)
              .map((detail: K1Detail) => detail.itemDescription);

            console.log(filteredDescriptions);

            this.k1DetailKastam = this.k1DetailKastam.filter((detail: K1Detail) =>
              !filteredDescriptions.includes(detail.itemDescription)
            );
            if (!this.k1DetailKastam || this.k1DetailKastam.length === 0) {
              this.k1DetailKastam = null;
              this.tiadaDetailKastam = true;
              this.toastr.warning('Nombor Borang Kastam ini telah didaftarkan.', 'Warning');
              return; // Exit earNombor Kastam tidak Dijumpaily if there are no k1DetailKastam items
            }

          },

            err => {
              waitDialog.close()
              console.error('Error occurred:', err);
            });
        },
          err => {
            waitDialog.close()
            this.toastr.warning('Anda tidak berdaftar dengan nombor kastam ini')
            console.error('Error occurred:', err);
          });
      }


    }
  }


  showDetails(row: number) {
    // console.log(row);
    this.dataKastamService.getK1Detail1(row).subscribe(x => {
      console.log(x);
      this.k1Detail = x;
      this.customNo = this.k1Detail.customNo;
      this.itemDescriptionData = this.k1Detail.itemDescription;
      this.dataKastamService.getdataByCustomNo(this.customNo).subscribe(y => {
        console.log(y);
        this.k1Header = y;
        this.onDateChange();

        if (this.roleId == 1) {
          this.importerCompanies = this.importerCompanies.filter(importerCompaniesdata => {
            // console.log(this.importerCompanies);
            const trimmedImporterCode = y.importerCode.trim();
            // if (importerCompaniesdata.smkimporterCode.includes(',')) {
            //   // Split the smkimporterCode into an array of individual codes
            //   const smkImporterCodes = importerCompaniesdata.smkimporterCode.split(',').map(code => code.trim());
            //   // Check if trimmedImporterCode is included in the array of codes
            //   return smkImporterCodes.includes(trimmedImporterCode);
            // } else {
            // If smkimporterCode doesn't contain commas, directly check for equality
            return importerCompaniesdata.smkimporterCode;
            // return importerCompaniesdata.smkimporterCode === trimmedImporterCode;
            // }
          });

        }

        else if (this.roleId == 2) {
          this.importerCompanies = this.importerCompanies.filter(importerCompaniesdata => {
            console.log(this.importerCompanies)
            const trimmedImporterCode = y.importerCode.trim();
            return importerCompaniesdata.smkimporterCode == trimmedImporterCode;
          });
        }
      });
    });
  }


  changeImporterCompanies(e: any) {
    console.log(e.target.value)
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
      // Display a message or handle the error as needed
      console.log('Cannot add data. Dry weight exceeds limit.');
      return; // Exit the method without adding data
    }
    // const quantity = this.removeCommas(this.formattedQuantity);
    // const calculatedDryWeight = (quantity * this.formattedDRC) / 100;
    const statusCodeId = 1;
    const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
    const tahun = this.sampleForm.get('tahun')?.value ?? '';
    const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
    this.customNo = kodStesen + tahun + nomborKastam;
    this.k1Detail.createdBy = this.loginAs;
    this.k1Detail.creatorRoleId = this.roleId

    if(this.roleId ==1 || this.roleId == 3){
      this.k1Detail.customNo = this.customNo
      this.k1Header.customNo = this.customNo;
      this.sample.customNo = this.customNo;
    }
    else if(this.roleId== 2){
       this.k1Detail.customNo = this.customNo + 'uip';
       this.k1Header.customNo = this.customNo + 'uip';
       this.sample.customNo = this.customNo + 'uip';
    }

    this.k1Detail.itemDescription = this.k1Detail.itemDescription;
    this.k1Detail.smkimportersCode = this.k1Header.importerCode;
    this.k1Detail.importerName = this.k1Header.importerName;
    this.k1Detail.agentName = this.k1Header.agentName;
    this.k1Detail.importerAddress = this.k1Header.importerAddress;
    // this.k1Detail.forwarderId = this.user.forwarderId;
    this.k1Detail.quantity = this.removeCommas(this.formattedQuantity);
    //this.k1Detail.drc = this.removeCommas(this.formattedDRC);
    this.k1Detail.drc = this.formattedDRC;
    this.k1Detail.companyId = this.sample.companyId;
    this.k1Detail.createdOn = new Date();
    this.k1Detail.isSMK = true;
    // this.k1Header.customNo = customNo;
    this.k1Header.isSMK = true;
    this.k1Header.companyId = this.sample.companyId;

    if (this.roleId == 1) {
      this.sample.forwarderId = this.user.forwarderId;
      this.k1Detail.forwarderId = this.user.forwarderId;
    }

    else if (this.roleId == 2) {
      this.sample.forwarderId = 22;
      this.k1Detail.forwarderId = 22;
    }

    else if (this.roleId == 3) {
      // this.sample.forwarderId = this.k1Detail.forwarderId;
      this.k1Detail.companyId = this.importer.companyId;
      this.sample.companyId = this.importer.companyId;
      this.k1Detail.forwarderId = this.sample.forwarderId;
    }

    this.sample.createdBy = this.loginAs;
    // this.sample.customNo = customNo;
    this.sample.quantity = this.k1Detail.quantity;
    this.sample.country = this.k1Detail.country;
    this.sample.hsCode = this.k1Detail.hsCode;
    this.sample.lorryNo = this.k1Header.lorryNo;
    this.sample.trailerNo = this.k1Header.trailerNo;
    this.sample.supplierName = this.k1Header.supplierName;
    this.sample.importedDate = this.k1Header.importedDate;
    this.sample.smkimportersCode = this.k1Detail.smkimportersCode;
    this.sample.dateSampleReceived = this.k1Detail.dateSampleReceived;
    this.sample.rubberTypeId = this.k1Detail.rubberTypeId;
    this.sample.sampleTypeId = this.k1Detail.sampleTypeId;

    this.sample.samplePropose = this.k1Detail.samplePropose;
    this.sample.driverName = this.k1Header.driverName;
    this.sample.icDriver = this.k1Header.icDriver;
    // this.sample.drc = this.removeCommas(this.formattedDRC);
    this.sample.drc = this.formattedDRC;
    this.sample.isSMK = true;
    this.sample.remarks = this.k1Detail.remarks;
    this.sample.evidence = this.k1Detail.evidence;
    this.sample.createdOn = new Date();
    this.sample.creatorRoleId = this.k1Detail.creatorRoleId;

    this.sample.importerName = this.k1Detail.importerName;
    this.sample.agentName = this.k1Detail.agentName;
    this.sample.importerAddress = this.k1Detail.importerAddress;
    this.sample.itemDescription = this.k1Detail.itemDescription;



    this.typecodefilter().subscribe(oldSystemId => {
      this.sample.typeCodeId = oldSystemId;
      console.log(this.sample)
      console.log(this.k1Detail)
      console.log(this.k1Header)


      if (this.k1Detail.rubberTypeId == 1) {


        this.daftarSampelService.PostK1HeaderSample(this.k1Header, statusCodeId).subscribe(res => {
          this.k1Detail.k1HeaderId = res.k1HeaderId;
          this.daftarSampelService.PostK1DetailSample(this.k1Detail, statusCodeId).subscribe(resDetail => {
            this.sample.sampleIdNew = resDetail.k1DetailId;

            this.drclimstrainingService.PostLtxSamples(this.sample, statusCodeId).subscribe(() => { });
            this.daftarSampelService.PostFileK1Detail(resDetail.k1DetailId, this.file).subscribe(() => {
              console.log('File uploaded successfully');
            },
              error => {
                console.error('Error uploading file:', error);
              })
            this.router.navigate(['sample']);
          },
            err => {
              this.toastr.warning(' Nombor Kastam telah wujud', "", { timeOut: 15000 });
            });
        });

      } else if (this.k1Detail.rubberTypeId == 2) {

        this.daftarSampelService.PostK1HeaderSample(this.k1Header, statusCodeId).subscribe(res => {
          this.k1Detail.k1HeaderId = res.k1HeaderId;
          this.daftarSampelService.PostK1DetailSample(this.k1Detail, statusCodeId).subscribe(resDetail => {
            this.sample.sampleIdNew = resDetail.k1DetailId;
            this.getahBongkahService.PostBRSamples(this.sample, statusCodeId).subscribe(() => { });
            this.daftarSampelService.PostFileK1Detail(resDetail.k1DetailId, this.file).subscribe(() => {
              console.log('File uploaded successfully');
            },
              error => {
                console.error('Error uploading file:', error);
              })
            this.router.navigate(['sample']);
          },
            err => {
              this.toastr.warning(' Nombor Kastam telah wujud', "", { timeOut: 15000 });
            }
          );
        });
      }
    });

  }

  typecodefilter(): Observable<number> {
    return this.daftarSampelService.GetOldSystemIdbyId(this.k1Detail.typeCodeId).pipe(
      map(data => data.oldSystemId)
    );
  }


  // checkRequired() {
  //   if (
  //     (this.formattedDRC == null || this.formattedDRC == 0) ||
  //     (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
  //     (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
  //     (this.formattedQuantity == null || this.formattedQuantity == '') ||
  //     (this.k1Header.icDriver == null || this.k1Header.icDriver == '')||

  //     (this.lateSample && (this.k1Detail.remarks == null || this.k1Detail.remarks.trim() == '')) 
  //     // (this.lateSample && (this.k1Detail.evidence == null || this.k1Detail.evidence.trim() == ''))

  //   ) {
  //     this.toastr.warning("Sila isi semua maklumat")
  //     return false;
  //   }
  //   return true;
  // }

  checkRequired(): boolean | undefined {
    if (this.roleId == 1) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '') ||
        // (this.sample.companyId == null) ||

        (this.lateSample && (this.k1Detail.remarks == null || this.k1Detail.remarks.trim() == ''))
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;

    } else if (this.roleId == 3) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '') ||
        (this.sample.forwarderId == null) ||

        (this.lateSample && (this.k1Detail.remarks == null || this.k1Detail.remarks.trim() == ''))
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;

    }
    else if (this.roleId == 2) {
      if (
        (this.formattedDRC == null || this.formattedDRC == 0) ||
        (this.k1Detail.samplePropose == null || this.k1Detail.samplePropose == '') ||
        (this.k1Header.driverName == null || this.k1Header.driverName == '') ||
        (this.formattedQuantity == null || this.formattedQuantity == '') ||
        (this.k1Header.icDriver == null || this.k1Header.icDriver == '')
        // (this.sample.forwarderId == null) 
      ) {
        this.toastr.warning("Sila isi semua maklumat");
        return false;
      }
      return true;

    }

    // Add a default return statement
    return false;
  }





  onDateChange() {
    const dateValue = new Date(this.k1Header.importedDate);
    let sum;
    if (this.roleId == 1) {
      this.authservice.GetCustomOffice(this.user.customOfficeId).subscribe(x => {
        console.log(x);
        this.customOffice = x;
        if (this.customOffice.isNorthen) {
          sum = dateValue.getDate() + 7;
        } else {
          sum = dateValue.getDate() + 14;
        }
        // this.calculateAndDisplayDateInfo(dateValue, sum);
        const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
        this.selectedDateSum = sumDate;
        const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
        const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const year = sumDate.getFullYear();
        this.notes = `${day}.${month}.${year}`;
        console.log(this.notes)
        const today = new Date();
        const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysLate = Math.ceil((today.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24));
        if (sumDate < today) {
          if (this.customOffice.isNorthen) {
            if (daysLate > 0) {
              this.lateSample = true;
              this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
            }
          } else {
            if (daysLate > 7) {
              this.lateSample = true;
              this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
            }
          }
          this.showRemarks = true; // Display the remarks field
        } else if (daysUntilDeadline <= 3) {
          if (this.customOffice.isNorthen) {
            this.notes += ` (Perhatian: Anda mempunyai  ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
          } else {
            this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
          }
          this.showRemarks = false; // Hide the remarks field
        } else {
          this.showRemarks = false; // Hide the remarks field
        }
        console.log(this.selectedDateSum.toDateString());
      });
    }

    else if (this.roleId == 2) {
      if (this.staff.unit === 'UIP') {
        sum = dateValue.getDate() + 14;
      } else if (this.staff.unit === 'UIPBKH') {
        sum = dateValue.getDate() + 7;
      }
      // this.calculateAndDisplayDateInfo(dateValue, sum);
      const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
      this.selectedDateSum = sumDate;
      const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
      const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
      const year = sumDate.getFullYear();
      this.notes = `${day}.${month}.${year}`;
      const today = new Date();
      const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (sumDate < today) {
        const daysLate = Math.ceil((today.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLate > 7) {
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

    else if (this.roleId == 3) {
      const dateImported = new Date(this.k1Header.importedDate);
      const dateSampleReceived = new Date(this.k1Detail.dateSampleReceived);

      let sum;
      if (this.importer.isNorthen) {
        sum = dateImported.getDate() + 7;
      } else {
        sum = dateImported.getDate() + 14;
      }

      const sumDate = new Date(dateImported.getFullYear(), dateImported.getMonth(), sum);
      this.selectedDateSum = sumDate;

      const day = ('0' + sumDate.getDate()).slice(-2);
      const month = ('0' + (sumDate.getMonth() + 1)).slice(-2);
      const year = sumDate.getFullYear();

      this.notes = `${day}.${month}.${year}`;

      const daysUntilDeadline = Math.ceil((sumDate.getTime() - dateSampleReceived.getTime()) / (1000 * 60 * 60 * 24));

      if (sumDate < dateSampleReceived) {
        const daysLate = Math.ceil((dateSampleReceived.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24));
        if (this.importer.isNorthen || !this.importer.isNorthen) {
          this.lateSample = true;
          this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
        }
        this.showRemarks = true;
      } else if (daysUntilDeadline <= 3) {
        this.lateSample = false; // Reset lateSample when sample is not late
        this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
        this.showRemarks = false;
      } else {
        this.lateSample = false; // Reset lateSample when sample is not late
        this.showRemarks = false;
      }
    }
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

}
