import { Component, ViewChild } from '@angular/core';
import { Batch } from '../models/batch';
import { ElimsService } from '../services/elims.service';
import { Sample } from '../models/sample';
import { K1Detail } from '../models/k1Detail';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../User/user.service';
import { AuthService } from '../services/auth/auth.service';
import { Staff } from '../models/staff';
import { environment } from '../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DaftarSampelService } from '../Daftar-Sampel/daftar-sampel.service';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';
import { RubberType } from '../models/rubberType';

@Component({
  selector: 'app-daftar-terima-sampel',
  templateUrl: './daftar-terima-sampel.component.html',
  styleUrls: ['./daftar-terima-sampel.component.css']
})
export class DaftarTerimaSampelComponent {


  displayedColumns: string[] = [
    'expandIcon',
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
  ];

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




  batch: Batch = {} as Batch;
  samples: Sample[] = [];
  batches: any;
  k1Details: K1Detail[] = [];
  batchId: number;
  selectedBatchId: number;
  unregisteredSampleCount: number = 0;
  myForm: FormGroup;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  roleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  customNosForm: FormGroup;
  statusCodeId : number = 0 ;
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

  constructor(
    private elimsService: ElimsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private hantarSampelService: HantarSampelService,
  ) {
    this.customNosForm = this.fb.group({
      customNos: this.fb.array([1]),
    });
  }

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true
        // this.getStaffElimsSamples(this.staff)
      })

    }
    this.statusCodeId = 5 ;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(data)
    

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });

    this.calculateUnregisteredSampleCount();

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })


  }


  // getStaffElimsSamples(staff: Staff) {
  //   console.log(staff.username)
  //   this.elimsService.GetElimsSamplesByUsername(staff.username, 5).subscribe(data => {
  //     this.samples = data;
  //     // this.latexSample = data
  //     console.log(this.samples)
  //   },
  //   )
  // }



  addSample1() {
    const currentDate = new Date();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Zero-padding month
    const year = currentDate.getFullYear().toString().slice(-2); // Taking last two digits of year
    const monthyear = year + month; // Concatenating month and year


    for (const sample of this.samples) {
      if (sample.customNo) {
        this.k1Detail.receivedBy = this.staff.username;
      
        this.hantarSampelService.PutLabRefNo(monthyear, sample)
        .subscribe(resLabRefNo => {
          const labRefNo = "CL-SP/" + resLabRefNo.monthyear + "/" + resLabRefNo.runningno;
          this.k1Detail.labRefNo = labRefNo;
          console.log(this.k1Detail);  
          this.elimsService.PutDaftarTerimaSampel(sample.customNo, this.k1Detail).subscribe(
          res => {
            // Handle response
          },
          error => {
            // Handle error
          }
        );
        });
      }


    }
  }




  // for (const sample of this.samples) {
  //   let id = sample.k1DetailId;
  //   const rubberTypeId = sample.rubberTypeId
  //   console.log("ini maklumat sample loop : ", sample)
  //   ////////////PutLabRefNo/////////////
  //   this.hantarSampelService.PutLabRefNo(this.thisyear).subscribe(resLabRefNo => {
  //     console.log(resLabRefNo)
  //     this.k1Detail.labRefNo = "CL-SP/" + resLabRefNo.runNo + "/" + resLabRefNo.year
  //     this.k1Detail.statusCodeId = 6

  //   })
  // }




  // addSample() {

  //   console.log(this.additionalCustomNosData)

  //   this.additionalCustomNosData.forEach(customNo => {
  //     const additionalSample = this.samples.find(sample => sample.customNo === customNo);
  //     if (additionalSample) {

  //       this.elimsService.PutDaftarTerimaSampel(additionalSample.k1DetailId, this.k1Detail)
  //         .subscribe(res => {
  //           console.log('Additional sample updated successfully.');
  //         });
  //     } else {
  //       console.error(`Additional custom no ${customNo} not found.`);
  //     }
  //   });
  // }




  // addSample() {
  //   for (let sample of this.samples) {
  //     this.elimsService.PutDaftarTerimaSampel(sample.customNo, 4).subscribe((response) => {
  //       console.log('Status code updated for customNo: ', sample.customNo);
  //     }, (error) => {
  //       console.error('Error updating status code: ', error);
  //     });
  //   }
  // }


  // get customNos(): any {
  //   return this.customNosForm.get('customNos') as any;
  // }

  // addCustomNoField() {
  //   const control = this.fb.control('', Validators.required);
  //   this.customNos.push(control);
  //   this.additionalCustomNosData.push('');
  // }



  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res)
      this.samples = res;
      this.calculateUnregisteredSampleCount();

    });
  }


  calculateUnregisteredSampleCount() {

    this.unregisteredSampleCount = this.samples.filter(sample => !sample.isRegistered).length;
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


  submitForm() {
    console.log('Submitting form with custom number:', this.customNo);
  }



  toggleRow(row: any) {
    row.isExpanded = !row.isExpanded;

    if (row.isExpanded) {
      // Load samples for expanded batch
      this.elimsService.GetElimsSamplesByBatchId(row.batchId).subscribe(samples => {
      });
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
    // this.showTypeCodes = true
  }


  searchRubberType() {
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data.filter(batch => batch.isFastTrack === true || batch.isFastTrack === false);
      console.log(this.batches);
    });
  }
  
  
  
  


}
