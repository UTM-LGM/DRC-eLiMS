import { Component, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ElimsService } from '../../services/elims.service';
import { Sample } from '../../models/sample';
import { K1Detail } from '../../models/k1Detail';
import { UserService } from '../../User/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Staff } from '../../models/staff';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RubberType } from '../../models/rubberType';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Result } from '../../models/result';
import { CetakWorksheetService } from '../../CetakWorksheet/cetak-worksheet.service';
import { CetakKeputusanService } from '../../CetakKeputusan/cetak-keputusan.service';
import { RekodKelulusanService } from '../rekod-kelulusan.service';
import { ToastrService } from 'ngx-toastr';
import { RekodKeputusanService } from 'src/app/Rekod-Keputusan-Sampel/rekod-keputusan.service';
import { Retest } from 'src/app/models/retest';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-rekod-kelulusan',
  templateUrl: './rekod-kelulusan.component.html',
  styleUrls: ['./rekod-kelulusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RekodKelulusanComponent {
  columnsToDisplay = [
    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'bankCode',
    'receipt',
    'chequeAmount',
    'sentOn',
    'sampleCount',
  ];

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  samples: Sample = {} as Sample;
  batches: any;
  batchId: number;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean = false;
  roleApprove: boolean = false;
  staff: Staff = {} as Staff;
  statusCodeId: number = 0;
  customNo: string;
  sample: Sample = {} as Sample;
  result: Result = {} as Result;
  typeCodes: any;
  rubberTypes: RubberType[];
  showForm: boolean = false;
  inputDisable: boolean = false;
  inputKelulusan: boolean = true;
  emailRecipient: any[] = [];
  k1DetailId: number; // Changed to a single number
  roles: import("c:/Users/nurizzatul/Desktop/DRC-eLiMS/src/app/models/staffRole").staffRole[];
  staffRole: any;
  selectedSamples: Sample[] = [];
  estimate1: number
  estimate2: number
  inputEstimate1: any
  average: number = 0;
  limitValue: string = '';
  retest: Retest = {} as Retest;
  inputResult: Result = {} as Result;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheetService: CetakWorksheetService,
    private cetakKeputusanService: CetakKeputusanService,
    private rekodKelulusanService: RekodKelulusanService,
    private rekodKeputusanService: RekodKeputusanService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername();
      this.userRoleId = this.authService.getSessionRole();
    } else {
      this.loginAs = '';
    }

    // if (this.userRoleId == 4) {
    //   this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
    //     console.log(res);
    //     this.authService.changeUser(res);
    //     this.emailRecipient.push(res.emailLgm);
    //     this.staff = res;
    //     // this.roleGtacr = true;
    //     this.roleApprove = true;
    // })}
    // Get email staff
    // this.rekodKelulusanService.GetEmailResultLetter(this.staff.staffId).subscribe(emelRes => {
    //   if (Array.isArray(emelRes) && emelRes.length > 0) {
    //     emelRes.forEach(item => {
    //       if (item.emailLgm) {
    //         this.emailRecipient.push(item.emailLgm);
    //         console.log(this.emailRecipient);
    //       }
    //     });
    //   }
    // });



    // });
    // }

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res)
        this.authService.changeUser(res);
        // (email staff)
        // this.emailRecipient.push(res.emailLgm);
        this.staff = res;
        this.roleGtacr = true;
        this.staffRole = res.staffRole;
        // console.log(this.staffRole);

        this.rekodKeputusanService.GetStaffIdbyStaffRole(4).subscribe(data => {

          this.roles = data.filter(data => data.staffName != null);

          this.roles.sort((a: { staffName: any; }, b: { staffName: any; }) => {
            const roleA = a.staffName;
            const roleB = b.staffName;
            if (roleA < roleB) {
              return -1;
            } else if (roleA > roleB) {
              return 1;
            } else {
              return 0;
            }
          });

        })
      })
    }

    this.statusCodeId = 8;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      // console.log(this.batches[0].samples);

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    
    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data;
    });
  }

  sampleList(k1DetailId: number) {
    this.k1Detail.k1DetailId = k1DetailId; // Ensure this is set correctly
    this.cetakWorksheetService.GetElimsSample(k1DetailId).subscribe(data => {
      this.samples = data;
      console.log(data);
      this.showForm = true;
      this.k1Detail.labRefNo = this.samples.labRefNo;
      this.k1Detail.testMethod = this.samples.testMethod;
      this.k1Detail.inLabOn = this.samples.inLabOn;
      this.k1Detail.inLabBy = this.samples.inLabBy;
      this.k1Detail.verifiedOn = this.samples.verifiedOn;
      this.k1Detail.verifiedBy = this.samples.verifiedBy;
      this.k1Detail.result = this.result.result1;

      this.rekodKelulusanService.GetEmailForwarder(this.samples.forwarderId).subscribe(emelRes => {
        console.log(emelRes)
          this.emailRecipient.push(emelRes.email);
          console.log(this.emailRecipient);
      });

    });

    this.rekodKelulusanService.GetResultbySampleId(k1DetailId).subscribe(dataResult => {
      this.result = dataResult;
      console.log(dataResult);
      this.calculateAverage()
    });
  }


  viewMemo(batchId: number): void {
    console.log(this.batchId);
    window.open("memo/" + batchId);
  }


  calculateAverage() {

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
      console.log(this.result);
    }
    this.getLimitValue();
  }


  getLimitValue() {
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
    else if (this.result.testMethod == 5 && toleranceNum > 0.1) {
      this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
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



  reject() {
    this.inputResult.repeat = true;

    this.inputResult.result1 = this.average;
    this.retest.result = this.inputResult.result1;

    this.inputResult.k1DetailId = this.k1Detail.k1DetailId;
    this.retest.k1DetailId = this.result.k1DetailId;

    this.k1Detail.batchId = this.samples.batchId;
    this.retest.batchId = this.k1Detail.batchId;

    this.k1Detail.testedOn = this.samples.testedOn;
    this.retest.testedOn = this.k1Detail.testedOn;

    this.retest.testMethod = this.k1Detail.testMethodId || this.samples.testMethodId; // Use the correct source for testMethod

    this.inputResult.k1DetailId = this.k1Detail.k1DetailId;
    this.retest.k1DetailId = this.result.k1DetailId;

    this.inputResult.wet1 = this.result.wet1;
    this.retest.wet1 = this.inputResult.wet1;

    this.inputResult.wet2 = this.result.wet2;
    this.retest.wet2 = this.inputResult.wet2;

    this.inputResult.dry1 = this.result.dry1;
    this.retest.dry1 = this.inputResult.dry1;

    this.inputResult.dry2 = this.result.dry2;
    this.retest.dry2 = this.inputResult.dry2;

    this.retest.rejectedBy = this.staff.username;
    this.retest.testedBy = this.staff.username;

    console.log(this.k1Detail)
    console.log(this.retest)

    this.rekodKeputusanService.PostRetest(this.retest).subscribe(res1 => {
      console.log(res1)
      this.toastr.success('Sampel untuk retest telah berjaya didaftarkan. Maklumat berjaya disimpan', 'Success');
      this.rekodKeputusanService.PutRetest(this.k1Detail.k1DetailId, this.k1Detail).subscribe(
        res2 => { 
          console.log(res2) 
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      );
    })


    this.rekodKeputusanService.ResetResult(this.inputResult).subscribe(res1 => {
      console.log(res1)
    })
  }


  putApproved() {

    this.k1Detail.approvedBy = this.staff.username;
    this.batchId = this.samples.batchId;
    this.k1Detail.creatorRoleId = this.samples.creatorRoleId;

    const id = this.samples.k1DetailId;
    this.cetakKeputusanService.PutApproved(id, this.k1Detail).subscribe(
      res => {
        this.toastr.success('Berjaya merekod keputusan', 'Berjaya');
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Delay in milliseconds (2000ms = 2s)
      },
      error => {
        console.error('Failed to record decision', error);
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Delay in milliseconds (2000ms = 2s)
      }
    );

    //this.emailRecipient = ["nurizzatul@lgm.gov.my"];

    if (this.k1Detail.creatorRoleId == 1) {
      this.rekodKelulusanService.notificationResultLetter(this.staff.staffId, id, this.emailRecipient).subscribe(
        () => {
          console.log("Email for request status 009 has been sent to the recipients");

        },
        error => {
          console.log("Email for request status 009 failed to send to the recipients", error);
        }
      );
    }


    if (this.k1Detail.creatorRoleId == 2) {
      this.rekodKelulusanService.uipNotificationResultLetter(this.staff.staffId, id, this.emailRecipient).subscribe(
        () => {
          console.log("Email for request status 009 has been sent to the recipients");

        },
        error => {
          console.log("Email for request status 009 failed to send to the recipients", error);
        }
      );
    }

  }


  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    const columnMappings = {
      batchId: 'Batch Id',
      rubberType: 'Jenis Getah',
      isFastTrack: 'Laluan Pantas',
      forwarderName: 'Syarikat Penghantar',
      bankCode: 'Bank',
      receipt: 'No. Cek/Resit/Memo', // Consolidated column name
      chequeAmount: 'Amaun',
      sentOn: 'Tarikh Hantar',
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
        } else if (column === 'sentOn') {
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
    XLSX.utils.book_append_sheet(wb, ws, 'Rekod Kelulusan');
  
    XLSX.writeFile(wb, 'senarai_sampel.xlsx');
  }


}
