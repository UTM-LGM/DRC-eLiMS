import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Batch } from 'src/app/models/batch';
import { Sample } from 'src/app/models/sample';
import { K1Detail } from 'src/app/models/k1Detail';
import { Staff } from 'src/app/models/staff';
import { environment } from 'src/app/environments/environment';
import { RubberType } from 'src/app/models/rubberType';
import { ElimsService } from 'src/app/services/elims.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { CetakKeputusanService } from '../cetak-keputusan.service';
import { RekodKeputusanService } from 'src/app/Rekod-Keputusan-Sampel/rekod-keputusan.service';

@Component({
  selector: 'app-cetak-keputusan',
  templateUrl: './cetak-keputusan.component.html',
  styleUrls: ['./cetak-keputusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CetakKeputusanComponent {

  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'bankCode',
    // 'receipt',
    'chequeNo',
    'chequeAmount',
    'receivedOn',
    'sampleCount',
    'sampleApproved',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() k1DetailId: number[];
  batches: any;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCodeId: number = 0;
  customNo: string;
  sample: Sample = {} as Sample;
  typeCodes: any;
  rubberTypes: RubberType[];
  roles: any;
  mesYaTidak: any
  staffRole: number[];
  selectedSamples: Sample[] = [];
  isPrint: boolean = false
  lepassubmit: boolean = false
  listk1DetailId: any[] = []
  creatorRoleId: any;
  customFields: { value: string }[] = [];
  checkboxClicked: boolean = false;

  batchId : number

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakKeputusanService: CetakKeputusanService,
    private rekodKeputusanService: RekodKeputusanService,

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
        this.staff = res;
        this.roleGtacr = true;
        this.staffRole = res.staffRole;
        console.log(this.staffRole);

        this.rekodKeputusanService.GetStaffIdbyStaffRoleIkmNo(3).subscribe(data => {

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


    this.statusCodeId = 11;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(this.batches[0].samples)
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  pilih() {
    this.lepassubmit = true;
    for (const batch of this.batches) {
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }


  generatePDF(k1DetailId: number) {

    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.creatorRoleId = this.sample.creatorRoleId
      console.log(sample)
      this.cetakKeputusanService.PutResultLetterApprovedBy(id, this.k1Detail).subscribe(
        res => {
          this.isPrint = true;
          this.selectedSamples.forEach(sample => {
            this.listk1DetailId.push(sample.k1DetailId)
          })

        }
      );
    }
  }


  onYesClick() {

    this.k1Detail.printedBy = this.staff.username;

    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.cetakKeputusanService.PutCetakKeputusan(id, this.k1Detail).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
    }
  }


  checkSingleChanged() {
    this.selectedSamples = [];
    for (const row of this.batches) {
      for (const sample of row.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    } this.updateCheckoutButtonVisibility();

     console.log(this.selectedSamples)

  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }


  addField() {
    this.customFields.push({ value: '' });
  }


  updateCheckoutButtonVisibility() {
    if (this.checkboxClicked || this.selectedSamples.length > 0) {
      return true; // Display the Checkout button
    } else {
      return false; // Hide the Checkout button
    }
  }


  viewMemo(batchId: number): void {
    console.log(this.batchId)
    window.open("memo/" + batchId);
  }


  searchByCustomNos() {

    this.updateCheckoutButtonVisibility();

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
        this.selectedSamples.push(...res.filter(sample => sample.statusCodeId === 11));
      });
    });
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

  
}



