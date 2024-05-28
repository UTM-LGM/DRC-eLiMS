import { Component, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sample } from 'src/app/models/sample';
import { AuthService } from 'src/app/services/auth/auth.service';
import { userDTO } from 'src/app/models/userDTO';
import { Staff } from 'src/app/models/staff';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { UserService } from 'src/app/User/user.service';
import { loginImporter } from 'src/app/models/loginImporters';
import { K1Detail } from 'src/app/models/k1Detail';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Batch } from '../../models/batch';
import { HantarSampelService } from '../../Hantar-Sampel/hantar-sampel.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-delivery-updated',
  templateUrl: './delivery-updated.component.html',
  styleUrls: ['./delivery-updated.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({
        height: '0px',
        visibility: 'hidden'
      })),
      state('expanded', style({
        'min-height': '48px',
        height: '*',
        visibility: 'visible'
      })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class DeliveryUpdatedComponent {


  columnsToDisplay = [

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




  expandedElement: Sample | null = null;


  delivery: any = ['Fizikal', 'Perkhidmatan Kurier']
  batch: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  user: userDTO = {} as userDTO
  batches: Batch[] = [];
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean

  staff: Staff = {} as Staff
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  importer: loginImporter = {} as loginImporter

  // sample: Sample = {} as Sample;
  samples: Sample[] = [];
  lepassubmit: boolean = false
  mesYaTidak: any
  k1Detail: K1Detail = {} as K1Detail;
  receivedDataFromChild: any;
  selectedBatches: any[] = [];
  selectedSamples: Sample[] = [];

  constructor(


    private toastr: ToastrService,
    private authservice: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,

  ) { }

  

  viewReceipt(path: string, batchId: number): void {
    window.open(environment.baseApiUrlElimsReceipt + batchId + "_" + path, "_blank");
  }


  dataSource!: MatTableDataSource<Batch[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {

    
    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
      })
    }

    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
      })
    }

    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true

      })
    }
  }

  //////////////////////BUTTON UPDATE///////////////////////////
  updateBatch() {


  }

  //////////////////////CHECKING REQUIRED SEBELUM UPDATE///////////////////////////
  checkRequired() {
    if (
      // (this.batch.uipRegNo == null || this.batch.uipRegNo == '') ||
      (this.batch.dateSampleDelivered == null || this.batch.dateSampleDelivered == '') ||
      (this.batch.delivery == null || this.batch.delivery == '')
      // (this.batch.courierServices == null || this.batch.courierServices == '') ||
      // (this.batch.trackingNo == null || this.batch.trackingNo == '')
    ) {
      this.toastr.warning("Sila isi semua maklumat")
      return false;
    }
    return true;
  }


  changeDelivery(e: any) {

    if (e.target.value == "Perkhidmatan Kurier") {
      this.showDelivery = true
    }
    else if (e.target.value == "Fizikal") {
      this.showDelivery = false
      this.batch.courierServices = ""
      this.batch.trackingNo = ""
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
    for (const batch of this.receivedDataFromChild) {
      // if (batch.checked) {
      const id = batch.batchId;

      this.hantarSampelService.PutBatchPrinted(id).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
      // }
    }
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }

  //////////////////////////////SELEPAS BUTTON PILIH////////////////////
  receiveData(data: any) {
    this.receivedDataFromChild = data;
  }

  sendSample(){
    console.log('Data received in parent:', this.receivedDataFromChild);
    if (this.receivedDataFromChild.length > 0) {
      this.lepassubmit = true;

    }
  }




  goBack() {
    window.location.reload(); 
    // window.history.back(); 
  }

}


 //////////////////////////////CODE SIMPAN////////////////////
// updateBatch() {
//   if (this.sampleForm.invalid) {
//     this.toastr.warning('Sila isi semua ruangan yang diperlukan');
//     return;
//   }


//   if (this.userRoleId == '1') {
//     const addTarikhSampelDihantar = this.hantarSampelService.PostTarikhSampelDihantar(this.batch);
//     const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
//     const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

//     forkJoin([
//       addTarikhSampelDihantar,
//       updateLtxTarikhSampelDihantar,
//       updateBRTarikhSampelDihantar
//     ]).subscribe(
//       {
//         next: ((res: any[]) => {
//           this.toastr.success('Maklumat telah dikemaskini!');
//         }),
//         error: (e) => {
//           this.toastr.error('Maklumat gagal dikemaskini');
//         }
//       }
//     );
//   }

//   else if (this.userRoleId == '2') {
//     this.hantarSampelService.PostUipTarikhSampelDihantar(this.batch).subscribe(
//       (res) => {
//         this.toastr.success('Maklumat telah dikemaskini!');
//       },
//       (error) => {
//         this.toastr.error('Maklumat gagal dikemaskini');
//       }
//     );

//   }
// }



