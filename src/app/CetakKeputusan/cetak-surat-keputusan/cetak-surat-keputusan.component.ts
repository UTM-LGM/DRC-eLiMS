import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { HantarSampelService } from 'src/app/Hantar-Sampel/hantar-sampel.service';
import { CetakKeputusanService } from '../cetak-keputusan.service';
import { RekodKeputusanService } from 'src/app/Rekod-Keputusan-Sampel/rekod-keputusan.service';


@Component({
  selector: 'app-cetak-surat-keputusan',
  templateUrl: './cetak-surat-keputusan.component.html',
  styleUrls: ['./cetak-surat-keputusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class CetakSuratKeputusanComponent {

  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'bankCode',
    'receipt',
    'chequeNo',
    'chequeAmount',
    'sentOn',
    'sampleCount',
  ]

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  batch: Batch = {} as Batch;
  samples: Sample[] = [];
  samples1: Sample[] = [];
  batches: any;
  k1Details: K1Detail[] = [];
  batchId: number;
  selectedBatchId: number;
  unregisteredSampleCount: number = 0;
  myForm: FormGroup;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  customNosForm: FormGroup;
  statusCodeId: number = 0;
  additionalCustomNosData: string[] = [];
  username: string;

  baseApiUrl = environment.baseApiUrl;
  customNo: string;
  sample: Sample = {} as Sample;
  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow');
  monthyear: string
  typeCodes: any;
  rubberTypes: RubberType[];
  rubberTypeId: any;
  isFastTrack: boolean
  roles: any;
  mesYaTidak: any
  selectedSamples: Sample[] = [];
  isPrint: boolean = false
  lepassubmit: boolean = false
  listk1DetailId: any[] = []
  staffRole: number[];


  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private cetakKeputusanService: CetakKeputusanService,
    private rekodKeputusanService: RekodKeputusanService



  ) {
    this.customNosForm = this.fb.group({
      customNos: this.fb.array([1]),
    });
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
            console.log(data)
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

    this.statusCodeId = 12;
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


  pilih() {

    this.lepassubmit = true;

    // Filter batches to include only those with selected samples
    // this.batches = this.batches.filter(batch => batch.samples.some(sample => sample.checked));
    // Filter samples to include only the selected ones
    for (const batch of this.batches) {
      // for (const sample of batch.samples) {
      //   if (sample.checked) {
      //     const id = sample.k1DetailId;
      //     this.cetakWorksheet.PutWorksheetTestOn(id, this.k1Detail).subscribe(
      //       res => { }
      //     );

      //     this.k1Detail.worksheetTestOn
      //     console.log(this.k1Detail)

      //   }
      // }
      batch.samples = batch.samples.filter(sample => sample.checked);
    }

  }


  generatePDF(k1DetailId: number) {

    for (const batch of this.batches) {
      for (const sample of batch.samples) {
        if (sample.checked) {
          const id = sample.k1DetailId;
          this.cetakKeputusanService.PutWorksheetTestOn(id, this.k1Detail).subscribe(
            res => {
              this.isPrint = true;
              this.selectedSamples.forEach(sample => {
                this.listk1DetailId.push(sample.k1DetailId)
                console.log(this.listk1DetailId)
              })
            }
          );
        }
      }
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
    } console.log(this.selectedSamples)
  }

  onYesClick() {
    // this.k1Detail.labelTestedOn = new Date();
    // this.k1Detail.labelTestedBy = this.loginAs;

    // for (const batch of this.batches) {
    //   for (const sample of batch.samples) {
    //     if (sample.checked) {
    //       const id = sample.k1DetailId;
    //       this.cetakWorksheet.PutCetakLembaranKerja(id, this.k1Detail).subscribe(
    //         res => { this.mesYaTidak = "yes" }
    //       );
    //     }
    //   }
    // }
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }


}


