import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sample } from 'src/app/models/sample';
import { Batch } from 'src/app/models/batch';
import { Staff } from 'src/app/models/staff';
import { K1Detail } from 'src/app/models/k1Detail';
import { ElimsService } from 'src/app/services/elims.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { CetakWorksheetService } from '../cetak-worksheet.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cetak-lembaran-kerja',
  templateUrl: './cetak-lembaran-kerja.component.html',
  styleUrls: ['./cetak-lembaran-kerja.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class CetakLembaranKerjaComponent {

  columnsToDisplay = [
    'select',
    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'sentOn',
    'sampleCount',
    'bilHari',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  batches: Batch[] = [];
  samples: Sample[] = [];
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  k1Detail: K1Detail = {} as K1Detail;
  sample: Sample = {} as Sample;
  lepassubmit: boolean = false
  isPrint: boolean = false
  statusCodeId: number = 0;
  selectedSamples: Sample[] = [];
  mesYaTidak: any
  listk1DetailId: any[] = []
  customNo: string = '';
  customFields: { value: string }[] = [];
  today = new Date();

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheet: CetakWorksheetService,

  ) { }

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    // role GTACR = 4
    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true

      })
      this.loadBatches();
    }
    this.statusCodeId = 4;

    // list holiday
    const holidays = [
      '2024-06-17',//raya haji
      '2024-06-18',//raya haji
      '2024-09-01',//raya haji
      '2024-09-16',//maulidur rasul
      '2024-10-31',//depavali
      '2025-01-27',//israk mikraj
      '2025-01-29',//raya cina 1
      '2025-01-30',//raya cina 2
      '2025-03-02',//awal ramadhan
      '2025-03-31',//hari raya aidilfitri 1
      '2025-03-01', //hari raya aidilfitri 2
      '2025-05-01', //hari pekerja
      '2025-05-12', //hari wesak
      '2025-06-02', //hari keputeraan dipertuan agung
      '2025-06-07', //hari raya qurban 1
      '2025-06-22', //hari keputeraan sultan kedah
      '2025-06-27', //awal muharram
      '2025-07-31', //hari hol almarhum sultan iskandar
      '2025-08-31', //hari kebangsaan
      '2025-09-16', //hari malaysia
      '2025-10-20', //hari deepavali
      '2025-12-25', //hari krismas
    ];


    function isHoliday(date, holidays) {
      const formattedDate = date.toISOString().split('T')[0];
      return holidays.includes(formattedDate);
    }


    function countWorkingDays(startDate, endDate, holidays) {
      let count = 0;
      let currentDate = new Date(startDate);

      // Include both start date and end date in the count
      while (currentDate <= endDate) {
        const day = currentDate.getDay();
        if (day !== 5 && day !== 6 && !isHoliday(currentDate, holidays)) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return count;
    }


    this.elimsService.GetElimsAllBatch1(this.statusCodeId).subscribe(data => {
      data.forEach(resData => {
        const receivedOn = new Date(resData.receivedOn);
        const approvedOn = new Date(resData.approvedOn);
        let daysSinceReceived;

        if (approvedOn.getTime() !== 0) {
          daysSinceReceived = countWorkingDays(receivedOn, approvedOn, holidays);
        } else {
          daysSinceReceived = countWorkingDays(receivedOn, this.today, holidays);
        }

        // console.log(resData);
        resData.daysSinceReceived = daysSinceReceived;
        this.batches.push(resData);
      });

      this.batches.sort((a, b) => a.batchId - b.batchId);

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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


  toggleBatchSelection(batch: Batch, isSelected: boolean) {
    for (const sample of batch.samples) {
      sample.checked = isSelected;
    }
    this.updateSelectedSamples();
  }


  updateSelectedSamples() {
    this.selectedSamples = [];
    for (const batch of this.batches) {
      for (const sample of batch.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    }
    // console.log(this.selectedSamples);
  }


  displaySelected() {
    this.lepassubmit = true;
    for (const batch of this.batches) {
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }


  generatePDF() {
    for (const sample of this.selectedSamples) {
      this.cetakWorksheet.PutWorksheetTestOn(sample.k1DetailId, this.k1Detail).subscribe(
        res => {

          this.isPrint = true;
          this.selectedSamples.forEach(sample => {
            this.listk1DetailId.push(sample.k1DetailId)
            console.log(this.listk1DetailId)
          })
        });
    }
  }


  searchByCustomNos() {
    // Concatenate the current customNo with customFields values
    const customNos = [this.customNo, ...this.customFields.map(field => field.value)];
    // Remove duplicates by converting to Set and then back to array
    const uniqueCustomNos = [...new Set(customNos)];

    // Clear previous results
    this.selectedSamples = [];

    // Perform search for each unique custom number
    uniqueCustomNos.forEach(customNo => {
      this.elimsService.GetElimsSamplesByCustomNo(customNo).subscribe(res => {
        console.log(res);
        this.selectedSamples.push(...res.filter(sample => sample.statusCodeId === 4));
      });
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  filterByCustomNo(event: any) {
    const customNo = event.target.value;
    if (customNo) {
      const filteredBatches = this.batches.filter(batch => batch.samples.customNo.toString() == (customNo));
      this.dataSource = new MatTableDataSource<Batch>(filteredBatches);
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


  onYesClick() {
    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.cetakWorksheet.PutCetakLembaranKerja(id, this.k1Detail).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000); 
  }

  onNoClick() {
    this.mesYaTidak = "tidak"
  }


  isAnyCheckboxSelected(): boolean {
    return this.selectedSamples.some(sample => sample.checked);
  }


  isButtonEnabled(): boolean {
    // Enable if at least one checkbox is selected or No. Borang Kastam field is filled
    return this.isAnyCheckboxSelected() || this.customNo.trim() !== '';
  }


  addFieldIfEmpty(index: number = -1) {
    if (index === -1) {
      // Check if the first field is empty
      if (this.customNo.trim() !== '' && this.customFields.length === 0) {
        // Add a new field
        this.customFields.push({ value: '' });
      }
    } else {
      // Check if the current field is not the last field and is not empty
      if (index === this.customFields.length - 1 && this.customFields[index].value.trim() !== '') {
        // Add a new field if the last field is not empty
        this.customFields.push({ value: '' });
      }
    }
  }


  exportToExcel(): void {
    const columnMappings = {
      batchId: 'Batch Id',
      rubberType: 'Jenis Getah',
      isFastTrack: 'Laluan Pantas',
      forwarderName: 'Syarikat Penghantar',
      sentOn: 'Tarikh Hantar',
      sampleCount: 'Bil. Sampel',
      daysSinceReceived: 'Tempoh Simpanan (Bil Hari)',
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
    XLSX.utils.book_append_sheet(wb, ws, 'Cetak Lembaran Kerja');
  
    XLSX.writeFile(wb, 'senarai_sampel.xlsx');
  }
  
}




