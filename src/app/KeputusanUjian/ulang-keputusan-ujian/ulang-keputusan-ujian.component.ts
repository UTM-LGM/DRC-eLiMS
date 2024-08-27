import { Component, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ElimsService } from '../../services/elims.service';
import { Sample } from '../../models/sample';
import { K1Detail } from '../../models/k1Detail';
import { UserService } from '../../User/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Staff } from '../../models/staff';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RubberType } from '../../models/rubberType';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { KeputusanUjianService } from '../keputusan-ujian.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-ulang-keputusan-ujian',
  templateUrl: './ulang-keputusan-ujian.component.html',
  styleUrls: ['./ulang-keputusan-ujian.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UlangKeputusanUjianComponent {

  columnsToDisplay = [

    'select',
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

  selectedSamples: Sample[] = [];
  lepassubmit: boolean = false
  batches: any;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCodeId: number = 0;
  rubberTypes: RubberType[];
  batchId: number;
  
  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private keputusanUjianService: KeputusanUjianService,
    private toastr: ToastrService
    
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
        this.loadBatches();
      })

    }
    this.statusCodeId = 10;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })
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


  isAnyCheckboxSelected(): boolean {
    return this.selectedSamples.some(sample => sample.checked);
  }


  ulangCetakKeputusan() {
    let processedCount = 0;
  
    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.keputusanUjianService.PutUlangCetakKeputusanUjian(id, this.k1Detail).subscribe(
        res => {
          // Increment the processed count
          processedCount++;
  
          // Check if all samples have been processed
          if (processedCount === this.selectedSamples.length) {
            // Display Toastr notification once when all requests are successful
            this.toastr.success('Keputusan ulang cetak berhasil!', 'Berjaya');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        },
        error => {
          // Increment the processed count even on error
          processedCount++;
  
          // Handle error if needed
          console.error('Error:', error);
  
          // Display Toastr and reload page when all requests are complete
          if (processedCount === this.selectedSamples.length) {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }
      );
    }
  }
  

  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
  }


  viewMemo(batchId: number): void {

    window.open("memo/" + batchId);
  }
  
}

