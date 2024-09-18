import { Component, Input, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../User/user.service';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { RekodKeputusanService } from '../rekod-keputusan.service';
import { Result } from 'src/app/models/result';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Retest } from 'src/app/models/retest';
import { ToastrService } from 'ngx-toastr';
import { CetakWorksheetService } from 'src/app/CetakWorksheet/cetak-worksheet.service';
import { RekodKelulusanService } from 'src/app/Kelulusan/rekod-kelulusan.service';
import { environment } from 'src/app/environments/environment';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sah-keputusan',
  templateUrl: './sah-keputusan.component.html',
  styleUrls: ['./sah-keputusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SahKeputusanComponent {

  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'receivedOn',
    'sampleCount',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  batches: Batch[] = [];
  samples: Sample = {} as Sample;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  k1Detail: K1Detail = {} as K1Detail;
  result: Result = {} as Result;
  inputResult: Result = {} as Result;
  retest: Retest = {} as Retest;
  statusCodeId: number = 0;
  roles: any;
  staffRole: number[];
  customNo: string;
  selectedSamples: Sample[] = [];
  estimate1: number = 0;
  estimate2: number = 0;
  result1: number = 0;
  inputEstimate1: number = 0;
  inputEstimate2: number = 0;
  average: number = 0;
  inputAverage: number = 0;
  showForm: boolean = false;
  inputDisable: boolean = true;
  file: any | null;
  limitValue: string = '';
  formattedDate: string;
  formattedVerifiedDate: string;
  buttonClicked: boolean = false;


  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
    private toastr: ToastrService,
    private rekodKelulusanService: RekodKelulusanService,
    private cetakWorksheetService: CetakWorksheetService,
  ) { }


  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true
        this.staffRole = res.staffRole

        this.staffRole.forEach(element => {

          this.rekodKeputusanService.GetStaffIdbyStaffRole(element).subscribe(data => {
            this.roles = data.filter(data => data.staffName != null);
            // Sort the stationCodes by kodstesen
            this.roles.sort((a: { staffName: any; }, b: { staffName: any; }) => {
              const roleA = a.staffName;
              const roleB = b.staffName;
              // Compare the kodStesen values
              if (roleA < roleB) {
                return -1;
              } else if (roleA > roleB) {
                return 1;
              } else {
                return 0;
              }
            });
          });

        })
      })
    }

    this.statusCodeId = 7;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      // this.batches = data.filter((batch) => batch.inLabBy.trim() !== this.staff.username);
      this.batches = data
      // console.log(this.batches)
      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });

    this.formatDate();
  }


  checkSingleChanged() {
    this.selectedSamples = [];
    for (const row of this.batches) {
      for (const sample of row.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    } console.log(this.selectedSamples)
  }


  searchCustomNo(customNo: string) {

    this.statusCodeId = 7;
    this.rekodKeputusanService.GetResultsByCustomNo(customNo, this.statusCodeId).subscribe(res => {


      if (res.length > 0) {

        this.k1Detail.labRefNo = res[0].labRefNo;
        this.k1Detail.inLabBy = res[0].inLabBy;
        this.k1Detail.inLabOn = res[0].inLabOn;
        this.k1Detail.batchId = res[0].batchId;
        this.k1Detail.testedOn = res[0].testedOn;
        this.k1Detail.k1DetailId = res[0].k1DetailId;
        this.k1Detail.testMethod = res[0].testMethod;
        this.k1Detail.testMethodId = this.inputResult.testMethod = res[0].testMethodId;
        this.result.wet1 = res[0].wet1;
        this.result.wet2 = res[0].wet2;
        this.result.dry1 = res[0].dry1;
        this.result.dry2 = res[0].dry2;
        this.result.result1 = res[0].result1;
        this.result.catatan = res[0].catatan;

        this.k1Detail.catatan = res[0].catatan;
        this.k1Detail.prove = res[0].prove;

        this.inputResult.wet1 = res[0].wet1;
        this.inputResult.wet2 = res[0].wet2;
        this.inputResult.dry1 = res[0].dry1;
        this.inputResult.dry2 = res[0].dry2;
        this.inputResult.result1 = res[0].result1;
        this.inputResult.catatan = res[0].catatan;
        this.inputResult.prove = res[0].prove;
        this.calculateAveragebyCustomno()
        this.showForm = true;
        console.log(res)

      } else {
        console.log("No results found for custom number:", customNo);
        this.k1Detail.labRefNo = "";
        this.k1Detail.inLabBy = "";
        this.k1Detail.inLabOn = "";
        this.result.wet1 = 0;
        this.showForm = false;
      }
    });
  }


  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsProve + this.result.k1DetailId + "_" + path, "_blank");
  }


  calculateAverageFirst() {
    const dry1 = this.inputResult.dry1;
    const wet1 = this.inputResult.wet1;
    const dry2 = this.inputResult.dry2;
    const wet2 = this.inputResult.wet2;
    console.log(this.inputResult)


    if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
      this.inputEstimate1 = (dry1 / wet1) * 100;
      this.inputEstimate1 = parseFloat(this.inputEstimate1.toFixed(2)); // Round to two decimal places
      console.log(this.inputEstimate1)
    } else {
      this.inputEstimate1 = 0;
      console.log(this.inputEstimate1)
    }

    if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
      this.inputEstimate2 = (dry2 / wet2) * 100;
      this.inputEstimate2 = parseFloat(this.inputEstimate2.toFixed(2)); // Round to two decimal places
    } else {
      this.inputEstimate2 = 0;
    }

    this.inputAverage = (this.inputEstimate1 + this.inputEstimate2) / 2;
    this.inputAverage = parseFloat(this.inputAverage.toFixed(2));

    this.rekodKelulusanService.GetResultbySampleId(this.k1Detail.k1DetailId).subscribe(dataResult => {
      this.result = dataResult;
      console.log(dataResult)

      this.getLimitValue();

    });

  }


  calculateAveragebyCustomno() {
    this.calculateAverage()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  updateRekodKeputusan() {
    this.buttonClicked = true;

    if (!this.limitValue.includes('Nilai purata melebihi > 0.2')) {

      this.statusCodeId = 10;
      this.k1Detail.verifiedBy = this.staff.username;
      this.inputResult.verifiedBy = this.staff.username;
      this.inputResult.catatan = this.result.catatan;
      this.inputResult.result1 = this.inputAverage;
      this.inputResult.k1DetailId = this.k1Detail.k1DetailId;

      console.log(this.k1Detail)
      console.log(this.result)
      console.log(this.inputResult)


      this.rekodKeputusanService.PutResultbyK1DetailId(this.inputResult).subscribe(res1 => {
        console.log(res1)
        this.toastr.success('Rekod Keputusan berjaya disimpan', 'Berjaya');
        this.rekodKeputusanService.PutVerifiedResult(this.k1Detail.k1DetailId, this.k1Detail).subscribe(
          res2 => { console.log(res2) }
        );

        this.rekodKeputusanService.PostProve(this.result.k1DetailId, this.file).subscribe(() => {
          console.log('File uploaded successfully');
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Delay in milliseconds (2000ms = 2s)
        },
          error => {
            console.error('Error uploading file:', error);
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Delay in milliseconds (2000ms = 2s)
          })

      })

    } else {
      this.toastr.error('Cannot save, limit value exceeded.');
    }
  }


  reject() {

    this.inputResult.repeat = true;
    // Set values for inputResult and retest
    this.inputResult.result1 = this.average;
    this.inputResult.k1DetailId = this.k1Detail.k1DetailId;

    this.retest.result = this.inputResult.result1;
    this.retest.wet1 = this.inputResult.wet1;
    this.retest.wet2 = this.inputResult.wet2;
    this.retest.dry1 = this.inputResult.dry1;
    this.retest.dry2 = this.inputResult.dry2;
    this.retest.rejectedBy = this.staff.username;
    this.retest.testedBy = this.staff.username;
    this.retest.k1DetailId = this.k1Detail.k1DetailId;
    this.retest.testMethod = this.inputResult.testMethod;

    // Determine batchId based on whether samples were selected or custom number was searched
    if (this.samples && this.samples.batchId) {
      // If a sample is selected
      this.retest.batchId = this.samples.batchId;
    } else if (this.k1Detail.batchId) {
      // If a custom number was searched
      this.retest.batchId = this.k1Detail.batchId;
    }

    // Ensure k1Detail.batchId matches retest.batchId
    this.k1Detail.batchId = this.retest.batchId;



    if (this.samples && this.samples.testedOn) {
      // If a sample is selected
      this.retest.testedOn = this.samples.testedOn;
    } else if (this.k1Detail.testedOn) {
      // If a custom number was searched
      this.retest.testedOn = this.k1Detail.testedOn;
    }

    // Ensure k1Detail.batchId matches retest.batchId
    this.k1Detail.testedOn = this.retest.testedOn;

    console.log(this.k1Detail);
    console.log(this.retest);

    // Post retest and handle responses
    this.rekodKeputusanService.PostRetest(this.retest).subscribe(res1 => {
      console.log(res1);
      this.toastr.success('Sampel untuk retest telah berjaya didaftarkan. Maklumat berjaya disimpan', 'Success');


      // Update k1Detail if needed
      this.rekodKeputusanService.PutRetest(this.k1Detail.k1DetailId, this.k1Detail).subscribe(res2 => {
        console.log(res2);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    });

    //reset result in table result
    this.rekodKeputusanService.ResetResult(this.inputResult).subscribe(res1 => {
      console.log(res1)

    })

  }


  sampleList(k1DetailId: number) {

    this.k1Detail.k1DetailId = k1DetailId;

    this.cetakWorksheetService.GetElimsSample(k1DetailId).subscribe(data => {
      this.samples = data;
      console.log(data)
      this.showForm = true;

      this.k1Detail.labRefNo = this.samples.labRefNo;
      this.k1Detail.inLabBy = this.samples.inLabBy;
      this.k1Detail.inLabOn = this.samples.inLabOn;
      this.k1Detail.k1DetailId = this.samples.k1DetailId;
      this.k1Detail.testMethod = this.samples.testMethod;
      this.k1Detail.catatan = this.samples.catatan;
      this.k1Detail.prove = this.samples.prove;

    });

    this.rekodKelulusanService.GetResultbySampleId(k1DetailId).subscribe(dataResult => {
      this.result = dataResult;
      this.inputResult.wet1 = this.result.wet1;
      this.inputResult.wet2 = this.result.wet2;
      this.inputResult.dry1 = this.result.dry1;
      this.inputResult.dry2 = this.result.dry2;
      this.inputResult.testMethod = this.result.testMethod;
      //this.inputResult.result1 = this.result.result1;
      this.inputResult.catatan = this.result.catatan;
      this.calculateAverage()
      console.log(dataResult);
    });

  }


  calculateAverage() {

    this.buttonClicked = false;

    this.result.testMethod = this.k1Detail.testMethodId;

    const dry1 = this.result.dry1;
    const wet1 = this.result.wet1;
    const dry2 = this.result.dry2;
    const wet2 = this.result.wet2;

    // RS-1/1
    if (this.result.testMethod == 8) {
      this.average = parseFloat(((wet1 + wet2) / 2).toFixed(2)); // Convert string to number

    } else {
      if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
        this.estimate1 = (dry1 / wet1) * 100;
        this.estimate1 = parseFloat(this.estimate1.toFixed(2)); // Round to two decimal places
      } else {
        this.estimate1 = 0;
      }

      if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
        this.estimate2 = (dry2 / wet2) * 100;
        this.estimate2 = parseFloat(this.estimate2.toFixed(2)); // Round to two decimal places
      } else {
        this.estimate2 = 0;
      }

      this.average = parseFloat(((this.estimate1 + this.estimate2) / 2).toFixed(2)); // Round to two decimal places

      this.result.result1 = this.average;

    }
    this.getLimitValue();
  }


  enableHantarButton() {
    this.buttonClicked = true;
  }

  // getLimitValue() {

  //   // Calculate tolerance value
  //   const tolerance = Math.abs(this.inputEstimate1 - this.inputEstimate2);
  //   const tolerance1 = Math.abs(((this.inputEstimate1 - this.inputEstimate2) / this.inputResult.result1) * 100);
  //   // UPB/L/001
  //   if (this.result.testMethod == 1) {

  //     if (tolerance > 0.2) {
  //       this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
  //       return; // Abort saving if tolerance > 0.25
  //     }
  //   }

  //   // MS 281*
  //   else if (this.result.testMethod == 2) {
  //     if (tolerance > 0.1) {
  //       this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // ISO 126*
  //   else if (this.result.testMethod == 3) {
  //     if (tolerance1 > 0.1) {
  //       this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // MS 466*
  //   else if (this.result.testMethod == 4) {
  //     if (tolerance > 0.2) {
  //       this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // UPB/R/007
  //   else if (this.result.testMethod == 5) {
  //     if (tolerance > 0.1) {
  //       this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // MS 2531**
  //   else if (this.result.testMethod == 6) {
  //     if (tolerance1 < 0.001) {
  //       this.limitValue = `Nilai purata melebihi < 0.001 (${tolerance1}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // LGM/GTACR/R/01
  //   else if (this.result.testMethod == 7) {

  //     if (tolerance > 0.1) {
  //       this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }
  //   // RS 1-1**
  //   else if (this.result.testMethod == 8) {
  //     if (tolerance1 > 0.1) {
  //       this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
  //       return;
  //     }
  //   }

  // }
  getLimitValue1() {
    // Calculate tolerance value
    const tolerance = Math.abs(this.estimate1 - this.estimate2).toFixed(2);
    const tolerance1 = Math.abs(((this.estimate1 - this.estimate2) / this.average) * 100).toFixed(2);

    // Convert tolerance values to numbers for comparison purposes
    const toleranceNum = parseFloat(tolerance);
    const tolerance1Num = parseFloat(tolerance1);

    // Reset the limit value
    this.limitValue = '';

    // Set the limit value only if tolerance exceeds the limit
    // UPB/L/001
    if (this.result.testMethod == 1 && toleranceNum > 0.2) {
      this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
    }
    // MS 281*
    else if (this.result.testMethod == 2 && toleranceNum > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
    }
    // ISO 126*
    else if (this.result.testMethod == 3 && tolerance1Num > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
    }
    // MS 466*
    else if (this.result.testMethod == 4 && toleranceNum > 0.2) {
      this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
    }
    // UPB/R/007
    else if (this.result.testMethod == 5 && toleranceNum > 0.08) {
      this.limitValue = `Nilai purata melebihi > 0.08 (${tolerance}), sampel perlu diuji semula.`;
    }
    // MS 2531**
    else if (this.result.testMethod == 6 && tolerance1Num < 0.001) {
      this.limitValue = `Nilai purata melebihi < 0.001 (${tolerance1}), sampel perlu diuji semula.`;
    }
    // LGM/GTACR/R/01
    else if (this.result.testMethod == 7 && toleranceNum > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
    }
    // RS 1-1**//+2/2
    else if (this.result.testMethod == 8 && tolerance1Num > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
    }
  }

  getLimitValue() {
    // Calculate tolerance value
    const tolerance = Math.abs(this.inputEstimate1 - this.inputEstimate2).toFixed(2);
    const tolerance1 = Math.abs(((this.inputEstimate1 - this.inputEstimate2) / this.inputResult.result1) * 100).toFixed(2);

    // Convert tolerance values to numbers for comparison purposes
    const toleranceNum = parseFloat(tolerance);
    const tolerance1Num = parseFloat(tolerance1);

    // Reset the limit value
    this.limitValue = '';

    // Set the limit value only if tolerance exceeds the limit
    // UPB/L/001
    if (this.result.testMethod == 1 && toleranceNum > 0.2) {
      this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
    }
    // MS 281*
    else if (this.result.testMethod == 2 && toleranceNum > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
    }
    // ISO 126*
    else if (this.result.testMethod == 3 && tolerance1Num > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
    }
    // MS 466*
    else if (this.result.testMethod == 4 && toleranceNum > 0.2) {
      this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
    }
    // UPB/R/007
    else if (this.result.testMethod == 5 && toleranceNum > 0.08) {
      this.limitValue = `Nilai purata melebihi > 0.08 (${tolerance}), sampel perlu diuji semula.`;
    }
    // MS 2531**
    else if (this.result.testMethod == 6 && tolerance1Num < 0.001) {
      this.limitValue = `Nilai purata melebihi < 0.001 (${tolerance1}), sampel perlu diuji semula.`;
    }
    // LGM/GTACR/R/01
    else if (this.result.testMethod == 7 && toleranceNum > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
    }
    // RS 1-1**
    else if (this.result.testMethod == 8 && tolerance1Num > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
    }
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.result.prove = event.target.files[0].name;
    console.log(this.result.prove);
  }


  formatDecimal(field: string, event: any, finalize: boolean = false) {
    const inputElement: HTMLInputElement = event.target;
    let inputValue: string = inputElement.value;
    const originalCaretPosition = inputElement.selectionStart;

    // Remove any non-numeric characters except the decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Split input into integer and decimal parts
    let [integerPart, decimalPart] = inputValue.split('.');

    // Ensure integer part is not empty
    // integerPart = integerPart || '0';

    // If no decimal part exists, initialize it
    decimalPart = decimalPart || '';

    // Ensure no more than four decimal places
    decimalPart = decimalPart.substring(0, 4);

    // Combine integer and decimal parts, always showing the decimal point
    inputValue = integerPart + '.' + decimalPart.padEnd(4, '0');

    if (finalize) {
      // If finalizing (on blur), ensure the number has exactly four decimal places
      inputValue = parseFloat(inputValue).toFixed(4);
    }

    // Update the input value
    inputElement.value = inputValue;

    // Update the ngModel with the formatted value
    this.result[field] = parseFloat(inputValue);

    // Restore the caret position
    if (!finalize && originalCaretPosition !== null) {
      const newPosition = originalCaretPosition <= inputElement.value.length ? originalCaretPosition : inputElement.value.length;
      inputElement.setSelectionRange(newPosition, newPosition);
    }
  }



  formatDate() {

    if (this.k1Detail.verifiedOn) {
      const verifiedDateObj = new Date(this.k1Detail.verifiedOn);
      const verifiedDay = verifiedDateObj.getDate().toString().padStart(2, '0');
      const verifiedMonth = (verifiedDateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const verifiedYear = verifiedDateObj.getFullYear();
      this.formattedVerifiedDate = `${verifiedDay}-${verifiedMonth}-${verifiedYear}`;
    } else {
      this.formattedVerifiedDate = ''; // Handle empty date case
    }
  }


  
  exportToExcel(): void {
    const columnMappings = {
      batchId: 'Batch Id',
      rubberType: 'Jenis Getah',
      isFastTrack: 'Laluan Pantas',
      forwarderName: 'Syarikat Penghantar',
      receivedOn: 'Tarikh Terima',
      sampleCount: 'Bil. Sampel',
    };
  
    const columnsToExport = Object.keys(columnMappings);
    const allData = this.dataSource.data;
  
    const filteredData = allData.map(row => {
      const filteredRow = {};
      columnsToExport.forEach(column => {
        let value;
  
        if (column === 'receipt') {
          value = row.creatorRoleId === 2 ? 'memo' : row.receipt || row.chequeNo;
        } else if (column === 'isFastTrack') {
          value = row.isFastTrack ? 'YA' : 'TIDAK';
        } else if (column === 'receivedOn') {
          // Format date values
          value = formatDate(row[column], 'dd/MM/yyyy', 'en-US'); // Customize the date format here
        } else {
          value = row[column];
        }
  
        if (value !== undefined) {
          const customColumnName = columnMappings[column];
          filteredRow[customColumnName] = value;
        }
      });
      return filteredRow;
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sah Keputusan');
  
    XLSX.writeFile(wb, 'senarai_sampel.xlsx');
  }


}
