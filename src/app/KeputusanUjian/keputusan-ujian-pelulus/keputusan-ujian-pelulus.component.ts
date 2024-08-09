import { Component, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ElimsService } from '../../services/elims.service';
import { Sample } from '../../models/sample';
import { UserService } from '../../User/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Staff } from '../../models/staff';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RubberType } from '../../models/rubberType';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-keputusan-ujian-pelulus',
  templateUrl: './keputusan-ujian-pelulus.component.html',
  styleUrls: ['./keputusan-ujian-pelulus.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class KeputusanUjianPelulusComponent {

  columnsToDisplay = [
    'batchId',
    'rubberType',
    'forwarderName',
    // 'importerName',
    'chequeNo',
    'chequeAmount',
    'importedDate',
    'sentOn',
    'receivedOn',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showYear: boolean = false
  showMonth: boolean = false
  selectedMonth: number ; 
  yearRange: number[] = [];
  selectedYear: number; 
  months: any[] = [];
  batches: any;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCodeId: number = 0;
  rubberTypes: RubberType[];
  samples: Sample[] = [];
  batchId: number;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
  ) {

    const currentYear = new Date().getFullYear();
    const startYear = 1900; // Change this to your desired start year
    for (let year = currentYear; year >= startYear; year--) {
      this.yearRange.push(year);
    }

    for (let month = 0; month < 12; month++) {
      const monthName = new Date(2000, month).toLocaleString('ms', { month: 'long' });
      this.months.push({ name: monthName, value: month+1 });
    }
    
  }


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
      })
    }
    this.statusCodeId = 11;
    this.elimsService.GetKeputusanUjian(this.statusCodeId).subscribe(data => {
      this.batches = data;
console.log(data)
      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })
  }

  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
  }
  
  changeSearchBy(e: any) {
    e.target.value == "Jenis Getah" ? this.showYear = true : this.showYear = false;
    e.target.value == "Batch Id" ? this.showMonth = true : this.showMonth = false;
  }


  search() {
    // Convert selectedYear and selectedMonth to numbers
    const year = +this.selectedYear;
    const month = +this.selectedMonth;
    
    // Check if both year and month are selected
    if (year && month) {
      console.log("test")
      // Filter batches based on the selected year and month
      const filteredBatches = this.batches.filter(batch => {
        // Extract year and month from the sentOn date of each batch
        const batchSentOn = new Date(batch.sentOn);
        const batchYear = batchSentOn.getFullYear();
        const batchMonth = batchSentOn.getMonth() + 1; // Month is zero-indexed
        
        // Check if the batch's year and month match the selected year and month
        return batchYear === year && batchMonth === month;
      });
  
      // Update dataSource with filtered batches
      this.dataSource = new MatTableDataSource<Batch>(filteredBatches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      // If either year or month is not selected, reset dataSource to show all batches
      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  

  viewMemo(batchId: number): void {
    console.log(this.batchId)
    window.open("memo/" + batchId);
  }


}
