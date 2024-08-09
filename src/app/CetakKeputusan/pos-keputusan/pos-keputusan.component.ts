import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Batch } from 'src/app/models/batch';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sample } from 'src/app/models/sample';
import { K1Detail } from 'src/app/models/k1Detail';
import { Staff } from 'src/app/models/staff';
import { environment } from 'src/app/environments/environment';
import { ElimsService } from 'src/app/services/elims.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { RubberType } from 'src/app/models/rubberType';
import { CetakWorksheetService } from 'src/app/CetakWorksheet/cetak-worksheet.service';
import { ToastrService } from 'ngx-toastr';
import { CetakKeputusanService } from '../cetak-keputusan.service';

@Component({
  selector: 'app-pos-keputusan',
  templateUrl: './pos-keputusan.component.html',
  styleUrls: ['./pos-keputusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class PosKeputusanComponent {

  columnsToDisplay = [
    'select',
    'batchId',
    'postResultOn',
    'postResultDelivery',
    'postResultCourierServices',
    'postResultTrackingNo',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'bankCode',
    // 'receipt',
    'chequeNo',
    'chequeAmount',
    'sentOn',
    'sampleCount',
  ]





  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  batches: any;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCodeId: number = 0;
  typeCodes: any;
  rubberTypes: RubberType[];
  lepassubmit: boolean = false
  selectedSamples: Sample[] = [];
  mesYaTidak: any

  showDelivery: boolean = false
  batch: Batch = {} as Batch;
  delivery: any = ['Fizikal', 'Perkhidmatan Kurier']
  batchId: number;
  
  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheet: CetakWorksheetService,
    private toastr: ToastrService,
    private cetakKeputusan: CetakKeputusanService,
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
    }

    this.statusCodeId = 10;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      // console.log(this.batches[0].samples)

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    
    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })
  }


  GetElimsAllBatch() {

    this.statusCodeId = 13;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(this.batches[0].samples)

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });

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
    console.log(this.selectedSamples);
  }


  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
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
  }


  searchRubberType() {
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data.filter(batch => batch.isFastTrack === true || batch.isFastTrack === false);
      console.log(this.batches);
    });
  }


  filterByBatchId(event: any) {
    const batchId = event.target.value;
    if (batchId) {
      const filteredBatches = this.batches.filter(batch => batch.batchId.toString() == (batchId));
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
    this.k1Detail.resultSentBy = this.staff.username;
    //this.k1Detail.resultSentOn = this.loginAs;

    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.cetakWorksheet.PutPrintResult(id, this.k1Detail).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
    }

    setTimeout(() => {
      window.location.reload();
    },1000); // Delay in milliseconds (2000ms = 2s)
    
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
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


  displaySelected() {
    this.lepassubmit = true;
    for (const batch of this.batches) {
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }

  changeDelivery(e: any) {

    if (e.target.value == "Perkhidmatan Kurier") {
      this.showDelivery = true
    }
    else if (e.target.value == "Fizikal") {
      this.showDelivery = false
      this.batch.postResultCourierServices= ""
      this.batch.postResultTrackingNo = ""
    }
  }


  updateBatch() {
    // if (this.checkRequired()) {
      this.cetakKeputusan.PutResultDate(this.batch).subscribe({
        next: () => {
          this.toastr.success('Data berjaya disimpan', 'Berjaya', { timeOut: 7000 });
          setTimeout(() => window.location.reload());
        },
        error: () => {
          this.toastr.error('Maklumat gagal dikemaskini');
        }
      });
    // }
  }
  
  

  checkRequired() {
    if (
      // (this.batch.uipRegNo == null || this.batch.uipRegNo == '') ||
     // (this.batch.postResultOn == null || this.batch.postResultOn == '') ||
      (this.batch.postResultDelivery == null || this.batch.postResultDelivery == '')
      // (this.batch.courierServices == null || this.batch.courierServices == '') ||
      // (this.batch.trackingNo == null || this.batch.trackingNo == '')
    ) {
      this.toastr.warning("Sila isi semua maklumat")
      return false;
    }
    return true;
  }


  
  viewMemo(batchId: number): void {
    console.log(this.batchId)
    window.open("memo/" + batchId);
  }

}
