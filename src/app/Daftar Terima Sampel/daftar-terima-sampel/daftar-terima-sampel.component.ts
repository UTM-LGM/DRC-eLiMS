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
import { HantarSampelService } from '../../Hantar-Sampel/hantar-sampel.service';
import { RubberType } from '../../models/rubberType';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-daftar-terima-sampel',
  templateUrl: './daftar-terima-sampel.component.html',
  styleUrls: ['./daftar-terima-sampel.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class DaftarTerimaSampelComponent {

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
    'dateReceivedInLab',
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
  isSubmitting: boolean = false; 
  daftarClicked = false;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private hantarSampelService: HantarSampelService,
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

    this.statusCodeId = 3;
    this.elimsService.GetDateReceivedInLab(this.statusCodeId).subscribe(data => {
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


  async registerReceived() {

    this.daftarClicked = true;

    this.isSubmitting = true; // Disable the button after click
    const currentDate = new Date();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Zero-padding month
    const year = currentDate.getFullYear().toString().slice(-2); // Taking last two digits of year
    const monthyear = year + month; // Concatenating month and year

    // Sort samples by k1DetailId
    this.samples.sort((a, b) => a.k1DetailId - b.k1DetailId);

    // Helper function to process each sample
    const processSample = async (sample) => {
        return new Promise<void>((resolve, reject) => {
            const rubberTypeId = sample.rubberTypeId;
            if (sample.customNo) {
                this.k1Detail.receivedBy = this.staff.username;

                let labRefPrefix = rubberTypeId == 1 ? "CL-SP/" : "CR-MB/";

                this.hantarSampelService.PutLabRefNo(monthyear, sample)
                    .subscribe(
                        resLabRefNo => {
                            const labRefNo = labRefPrefix + resLabRefNo.monthyear + "/" + resLabRefNo.runningno;
                            this.k1Detail.labRefNo = labRefNo;
                            console.log(this.k1Detail);
                            this.elimsService.PutDaftarTerimaSampel(sample.customNo, this.k1Detail).subscribe(
                                res => {
                                    resolve(); // Resolve the promise
                                },
                                error => {
                                    reject(error); // Reject the promise
                                }
                            );
                        },
                        error => {
                            reject(error); // Reject the promise if PutLabRefNo fails
                        }
                    );
            } else {
                resolve(); // Resolve the promise if customNo is not available
            }
        });
    };

    // Process samples sequentially
    for (const sample of this.samples) {
        try {
            await processSample(sample);
        } catch (error) {
            console.error('An error occurred:', error);
            this.toastr.error('Some samples failed to register', 'Error');
            this.isSubmitting = false; // Re-enable the button after processing
            return; // Exit on the first error
        }
    }

    this.toastr.success('Sampel Berjaya Didaftar Terima', 'Berjaya');
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Delay in milliseconds (2000ms = 2s)
    this.isSubmitting = false; // Re-enable the button after processing
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

      this.samples = res.filter(sample => sample.statusCodeId === 3);
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
        this.samples.push(...res.filter(sample => sample.statusCodeId === 3));
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
