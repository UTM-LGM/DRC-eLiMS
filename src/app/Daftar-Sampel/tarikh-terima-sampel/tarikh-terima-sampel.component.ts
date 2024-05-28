import { Component, ViewChild } from '@angular/core';
import { ElimsService } from '../../services/elims.service';
import { ToastrService } from 'ngx-toastr';
import { Sample } from '../../models/sample';
import { K1Detail } from '../../models/k1Detail';
import { DaftarSampelService } from '../daftar-sampel.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Batch } from 'src/app/models/batch';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/app/environments/environment';
import { Staff } from 'src/app/models/staff';
import { RubberType } from 'src/app/models/rubberType';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HantarSampelService } from 'src/app/Hantar-Sampel/hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tarikh-terima-sampel',
  templateUrl: './tarikh-terima-sampel.component.html',
  styleUrls: ['./tarikh-terima-sampel.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TarikhTerimaSampelComponent {


  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'bankCode',
    'receipt',
    // 'chequeNo',
    'chequeAmount',
    'sentOn',
    'sampleCount',
    'testMethod'
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  baseApiUrl = environment.baseApiUrl;

  k1Detail: K1Detail = {} as K1Detail;
  staff: Staff = {} as Staff
  filteredBatches: Batch[] = [];
  samples: Sample[] = [];
  rubberTypes: RubberType[];
  batches: any;
  batchId: number;
  selectedBatchId: number;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  statusCodeId: number = 0;
  customNo: string;
  rubberTypeId: any;
  selectedFastTrackValue: string = ""; // Initialize with an empty string
  searchBy: string[] = []
  showRubberType: boolean = false
  showFastTrack: boolean = false
  showBatchId: boolean = false
  customFields: { value: string }[] = [];

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private daftarSampelService: DaftarSampelService,
    private toastr: ToastrService,
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
      })
      this.loadBatches();
      this.searchFastTrack()
    }

    this.statusCodeId = 5;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(this.batches)

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    this.searchBy = ['Batch Id', 'Jenis Getah', 'Laluan Pantas'];
  }


  registerReceived() {
    console.log(this.k1Detail);
    let successCount = 0;
    const totalCount = this.samples.length;
  
    this.samples.forEach(sample => {
      this.daftarSampelService.PutDateReceivedInLab(sample.k1DetailId, this.k1Detail).subscribe(
        res => {
          console.log(`Updated k1detailid: ${sample.k1DetailId} for batchid: ${this.batchId}`, res);
          successCount++;
  
          // Check if all samples have been successfully processed
          if (successCount === totalCount) {
            this.toastr.success('Sampel berjaya diterima!', 'Berjaya ');
          }
        },
        error => {
          // Handle error if needed
        }
      );
    });
  }




  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res)
      this.samples = res;
    });
  }


  searchSampleByBatch(batchId: number) {
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res);

      this.samples = res.filter(sample => sample.statusCodeId === 5);
    });
  }


  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
  }


  viewMemo(batchId: number): void {
    console.log(this.batchId)
    window.open("memo/" + batchId);
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


  loadBatches() {
    this.dataSource = new MatTableDataSource<Batch>(this.batches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // Method to trigger the fast track filtering process
  searchFastTrack() {
    // Get the selected value from the dropdown
    const selectedValue = this.selectedFastTrackValue;

    // Check if the filter value is set
    if (selectedValue !== "") {
      const filterValue = selectedValue === "true";
      this.filteredBatches = this.batches.filter(batch => batch.isFastTrack === filterValue);
    } else {
      // If no filter value is set, show all batches
      this.filteredBatches = this.batches;
    }

    // Update the data source with the filtered batches
    this.dataSource = new MatTableDataSource<Batch>(this.filteredBatches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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


  changeSearchBy(e: any) {
    e.target.value == "Jenis Getah" ? this.showRubberType = true : this.showRubberType = false;
    e.target.value == "Laluan Pantas" ? this.showFastTrack = true : this.showFastTrack = false;
    e.target.value == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
  }


  addField() {
    this.customFields.push({ value: '' });
  }


  searchByCustomNos() {
    // Concatenate the current customNo with customFields values
    const customNos = [this.customNo, ...this.customFields.map(field => field.value)];
    // Remove duplicates by converting to Set and then back to array
    const uniqueCustomNos = [...new Set(customNos)];

    // Clear previous results
    this.samples = [];

    // Perform search for each unique custom number
    uniqueCustomNos.forEach(customNo => {
      this.elimsService.GetElimsSamplesByCustomNo(customNo).subscribe(res => {
        console.log(res);
        this.samples.push(...res.filter(sample => sample.statusCodeId === 5));
      });
    });
  }


  // Inside DaftarTerimaSampelComponent class
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

}
