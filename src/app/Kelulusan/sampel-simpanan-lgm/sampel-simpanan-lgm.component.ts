import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/User/user.service';
import { Batch } from 'src/app/models/batch';
import { Forwarder } from 'src/app/models/forwarder';
import { RubberType } from 'src/app/models/rubberType';
import { Staff } from 'src/app/models/staff';
import { StatusCode } from 'src/app/models/statusCode';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-sampel-simpanan-lgm',
  templateUrl: './sampel-simpanan-lgm.component.html',
  styleUrls: ['./sampel-simpanan-lgm.component.css']
})
export class SampelSimpananLgmComponent {

  columnsToDisplay = [
    'batchId',
    'rubberType',
    'forwarderName',
    'importedDate',
    'sentOn',
    'receivedOn',
    'storagePeriod',
    'sampleCount',
    'status',
  ]

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  codeId: any[] = [];
  batches: Batch[] = [];
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCodeId: number = 0;
  rubberTypes: RubberType[];
  rubberTypeId: any;
  searchBy: string[] = []
  showBatchId: boolean = false
  showRubberType: boolean = false
  showForwardingAgent: boolean = false
  showImportedDate: boolean = false
  showSentOn: boolean = false
  showReceivedOn: boolean = false
  showCountDays: boolean = false
  showStatus: boolean = false
  forwarders: Forwarder[] = []
  statusCodes: StatusCode[] = []
  today = new Date();


  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
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
      })
      this.loadBatches();
    }

    // this.codeId = [4, 5, 6, 7, 8, 9];
    // this.codeId.forEach(element => {

    //   this.elimsService.GetElimsAllBatch(element).subscribe(data => {
    //     data.forEach(resData => {
    //       const receivedOn = new Date(resData.receivedOn);
    //       const approvedOn = new Date(resData.approvedOn);
    //       let dayssincereceived = (approvedOn.getTime() !== 0) ?
    //         (approvedOn.getTime() - receivedOn.getTime()) / (1000 * 3600 * 24) :
    //         (this.today.getTime() - receivedOn.getTime()) / (1000 * 3600 * 24) + 1;
    //       dayssincereceived = Math.floor(dayssincereceived);
    //       console.log(resData);
    //       resData.daysSinceReceived = dayssincereceived;
    //       this.batches.push(resData);
    //     });

    //     this.batches.sort((a, b) => a.batchId - b.batchId);

    //     this.dataSource = new MatTableDataSource<Batch>(this.batches);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });

    // }

    
    this.codeId = [4, 5, 6, 7, 8, 9];
    // list date holidays
    const holidays = [
      '2024-06-17',//raya haji
      '2024-06-18',//raya haji
      '2024-09-01',//raya haji
      '2024-09-16',//maulidur rasul
    ];
    
    this.codeId.forEach(element => {
      this.elimsService.GetElimsAllBatch(element).subscribe(data => {
        data.forEach(resData => {
          const receivedOn = new Date(resData.receivedOn);
          const approvedOn = new Date(resData.approvedOn);
          let dayssincereceived;
    
          if (approvedOn.getTime() !== 0) {
            dayssincereceived = calculateBusinessDays(receivedOn, approvedOn);
          } else {
            dayssincereceived = calculateBusinessDays(receivedOn, this.today) + 1;
          }
    
          dayssincereceived = Math.floor(dayssincereceived);
          // console.log(resData);
          resData.daysSinceReceived = dayssincereceived;
          this.batches.push(resData);
        });
    
        this.batches.sort((a, b) => a.batchId - b.batchId);
    
        this.dataSource = new MatTableDataSource<Batch>(this.batches);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
    
    function isHoliday(date: Date): boolean {
      return holidays.includes(date.toISOString().split('T')[0]);
    }
    
    function calculateBusinessDays(startDate: Date, endDate: Date): number {
      let count = 0;
      let currentDate = new Date(startDate);
    
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 5 && dayOfWeek !== 6 && !isHoliday(currentDate)) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    
      return count;
    }
    

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })


    this.searchBy = ['Jenis Getah', 'Batch Id', 'Syarikat Penghantar', 'Status', 'Tarikh Import', 'Tarikh Hantar', 'Tarikh Terima'];


    this.elimsService.GetForwarders().subscribe(data => {
      this.forwarders = data.filter(data => data.name != null);
    });


    this.elimsService.GetStatusCodes().subscribe(data => {
      this.statusCodes = data;
    });

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  changeJenisGetah(event: any) {

    const rubberType = event.target.value;
    if (rubberType) {
      const filteredBatches = this.batches.filter(batch => batch.rubberTypeId.toString().includes(rubberType));
      this.dataSource = new MatTableDataSource<Batch>(filteredBatches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }

  }


  changeSearchBy(e: any) {
    e.target.value == "Jenis Getah" ? this.showRubberType = true : this.showRubberType = false;
    e.target.value == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
    e.target.value == "Syarikat Penghantar" ? this.showForwardingAgent = true : this.showForwardingAgent = false;
    e.target.value == "Tarikh Import" ? this.showImportedDate = true : this.showImportedDate = false;
    e.target.value == "Tarikh Hantar" ? this.showSentOn = true : this.showSentOn = false;
    e.target.value == "Tarikh Terima" ? this.showReceivedOn = true : this.showReceivedOn = false;
    //e.target.value == "Tempoh Simpanan" ? this.showCountDays = true : this.showCountDays = false;
    e.target.value == "Status" ? this.showStatus = true : this.showStatus = false;
  }


  filterByBatchId(event: any) {
    const batchId = event.target.value;
    if (batchId) {
      const filteredBatches = this.batches.filter(batch => batch.batchId.toString().includes(batchId));
      this.dataSource = new MatTableDataSource<Batch>(filteredBatches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }
  }

  filterByStatus(event: any) {
    const statusCodeId = event.target.value;
    console.log(statusCodeId)
    if (statusCodeId != 0) {
      const filteredStatus = this.batches.filter(batch => batch.statusCodeId == parseInt(statusCodeId));
      this.dataSource = new MatTableDataSource<Batch>(filteredStatus);
      console.log(filteredStatus)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }
  }


  filterByImporterdate(event: any) {
    const selectedDate = new Date(event.target.value);
    console.log(selectedDate);
    if (!isNaN(selectedDate.getTime())) { // Check if valid date
      const filteredImportedDate = this.batches.filter(batch => {
        const batchDate = new Date(batch.importedDate);
        return batchDate.toDateString() === selectedDate.toDateString();
      });
      this.dataSource = new MatTableDataSource<Batch>(filteredImportedDate);
      console.log(filteredImportedDate);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }
  }


  filterBySentOn(event: any) {
    const selectedDate = new Date(event.target.value);
    console.log(selectedDate);
    if (!isNaN(selectedDate.getTime())) { // Check if valid date
      const filteredSentOn = this.batches.filter(batch => {
        const batchDate = new Date(batch.sentOn);
        return batchDate.toDateString() === selectedDate.toDateString();
      });
      this.dataSource = new MatTableDataSource<Batch>(filteredSentOn);
      console.log(filteredSentOn);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }
  }


  filterByReceivedOn(event: any) {
    const selectedDate = new Date(event.target.value);
    console.log(selectedDate);
    if (!isNaN(selectedDate.getTime())) { // Check if valid date
      const filteredReceivedOn = this.batches.filter(batch => {
        const batchDate = new Date(batch.receivedOn);
        return batchDate.toDateString() === selectedDate.toDateString();
      });
      this.dataSource = new MatTableDataSource<Batch>(filteredReceivedOn);
      console.log(filteredReceivedOn);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }
  }


  loadBatches() {
    this.dataSource = new MatTableDataSource<Batch>(this.batches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

