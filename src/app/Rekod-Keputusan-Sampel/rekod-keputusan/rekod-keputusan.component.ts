import { Component, ViewChild } from '@angular/core';
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
import { RekodKelulusanService } from 'src/app/Kelulusan/rekod-kelulusan.service';
import { CetakWorksheetService } from 'src/app/CetakWorksheet/cetak-worksheet.service';

@Component({
  selector: 'app-rekod-keputusan',
  templateUrl: './rekod-keputusan.component.html',
  styleUrls: ['./rekod-keputusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RekodKeputusanComponent {

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
  statusCodeId: number = 0;
  roles: any;
  staffRole: number[];
  customNo: string;
  selectedSamples: Sample[] = [];
  estimate1: number = 0;
  estimate2: number = 0;
  average: number = 0;
  showForm: boolean = false;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
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
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true
        this.staffRole = res.staffRole
        // this.getStaffElimsSamples(this.staff)
        this.staffRole.forEach(element => {
          console.log(element)
          this.rekodKeputusanService.GetStaffIdbyStaffRole(element).subscribe(data => {
            this.roles = data.filter(data => data.staffName != null);
            // console.log(data)
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

    this.statusCodeId = 8;
    this.elimsService.GetBatchByInLabBy(this.statusCodeId, this.loginAs).subscribe(data => {
      this.batches = data;
      console.log(data)

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  searchCustomNo(customNo: string) {
    this.statusCodeId = 8;
    this.rekodKeputusanService.GetResultsByCustomNo(customNo, this.statusCodeId).subscribe(res => {
      console.log(res)
      if (res.length > 0) {
        this.k1Detail.labRefNo = res[0].labRefNo;     
        this.k1Detail.testMethod = res[0].testMethod;
        this.k1Detail.testMethodId = this.result.testMethod = res[0].testMethodId; 
        this.k1Detail.inLabBy = res[0].inLabBy;
        this.k1Detail.inLabOn = res[0].inLabOn;
        this.k1Detail.verifiedBy = res[0].verifiedBy;
        this.k1Detail.verifiedOn = res[0].verifiedOn;
        this.k1Detail.k1DetailId = res[0].k1DetailId;
        this.showForm = true;
      } else {
        console.log("No results found for custom number:", customNo);
        this.k1Detail.labRefNo = "";
        this.k1Detail.inLabBy = "";
        this.k1Detail.inLabOn = "";
        this.showForm = false;
      }
    });
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


  sampleList(k1DetailId: number) {
    this.cetakWorksheetService.GetElimsSample(k1DetailId).subscribe(data => {
      this.samples = data;
      console.log(data)
      this.showForm = true;
      this.k1Detail= data

    });
    this.rekodKelulusanService.GetResultbySampleId(k1DetailId).subscribe(dataResult => {
      this.result = dataResult;
      console.log(dataResult)
    });
  }


  // addRekodKeputusan() {
  //   this.result.result1 = this.average;

  //   this.k1Detail.testedBy = this.staff.username;
  //   this.result.k1DetailId = this.k1Detail.k1DetailId;
  //   console.log(this.k1Detail)
  //   console.log(this.result)

  //   this.rekodKeputusanService.PostResult(this.result).subscribe(res1 => {
  //     this.toastr.success('Rekod Keputusan added successfully', 'Success');
  //     console.log(res1)
  //     this.rekodKeputusanService.PutResult(this.k1Detail.k1DetailId, this.k1Detail).subscribe(
  //       res2 => { console.log(res2) }
  //     );
  //   })
  // }


  // calculateAverage() {

  //   const dry1 = this.result.dry1;
  //   const wet1 = this.result.wet1;
  //   const dry2 = this.result.dry2;
  //   const wet2 = this.result.wet2;


  //   if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
  //     this.estimate1 = (dry1 / wet1) * 100;
  //     this.estimate1 = parseFloat(this.estimate1.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.estimate1 = 0;
  //   }

  //   if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
  //     this.estimate2 = (dry2 / wet2) * 100;
  //     this.estimate2 = parseFloat(this.estimate2.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.estimate2 = 0;
  //   }

  //   this.average = (this.estimate1 + this.estimate2) / 2;
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  formatInput(event: any) {
    // Get the input value
    let value = event.target.value;

    // Remove non-numeric characters except for dot '.'
    value = value.replace(/[^0-9.]/g, '');

    // Check if the decimal point is clicked
    if (event.data === '.') {
      // Move cursor to the end of the value
      event.target.selectionStart = event.target.selectionEnd = value.length;
    }

    // Remove any existing decimal point
    value = value.replace('.', '');

    // If value is not empty and has more than two characters, insert decimal point
    if (value.length > 2) {
      value = value.slice(0, -2) + '.' + value.slice(-2);
    }

    // Update the input value
    event.target.value = value;

    // Update the ngModel binding
    this.result.wet1 = value;
    console.log(value)

  }


  formatInputWet2(event: any) {

    // Get the input value
    let value = event.target.value;

    // Remove non-numeric characters except for dot '.'
    value = value.replace(/[^0-9.]/g, '');

    // Check if the decimal point is clicked
    if (event.data === '.') {
      // Move cursor to the end of the value
      event.target.selectionStart = event.target.selectionEnd = value.length;
    }

    // Remove any existing decimal point
    value = value.replace('.', '');

    // If value is not empty and has more than two characters, insert decimal point
    if (value.length > 2) {
      value = value.slice(0, -2) + '.' + value.slice(-2);
    }

    // Update the input value
    event.target.value = value;

    // Update the ngModel binding
    this.result.wet2 = value;
    console.log(value)

  }

}
