import { Component, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ElimsService } from '../../services/elims.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder} from '@angular/forms';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { forkJoin} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sample } from 'src/app/models/sample';
import { AuthService } from 'src/app/services/auth/auth.service';
import { userDTO } from 'src/app/models/userDTO';
import { Staff } from 'src/app/models/staff';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { loginImporter } from 'src/app/models/loginImporters';


@Component({
  selector: 'app-tarikh-sampel-dihantar',
  templateUrl: './tarikh-sampel-dihantar.component.html',
  styleUrls: ['./tarikh-sampel-dihantar.component.css']
})
export class TarikhSampelDihantarComponent {

  delivery: any = ['Fizikal', 'Perkhidmatan Kurier']
  batch: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  user: userDTO = {} as userDTO
  batches: Batch[] = [];
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean

  staff: Staff = {} as Staff
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  importer: loginImporter = {} as loginImporter

  // sample: Sample = {} as Sample;
  samples: Sample[] = [];

  constructor(

    private route: ActivatedRoute,
    private elimsService: ElimsService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private router: Router,
    private authservice: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,

  ) { }

  displayedColumns: string[] = [
    'batchId',
    'tarikhSampelDihantar',
    'penghantaran',
    'action',
    'uipRegNo'
  ];

  dataSource!: MatTableDataSource<Batch[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {


    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.roleId = this.authservice.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
      })
    }

    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
      })
    }

    else if (this.roleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
      })
    }
  }


  // updateBatch() {
  //   if (this.sampleForm.invalid) {
  //     this.toastr.warning('Sila isi semua ruangan yang diperlukan');
  //     return;
  //   }


  //   if (this.roleId == '1') {
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

  //   else if (this.roleId == '2') {
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


  updateBatch() {


    if (this.checkRequired()) {

      if (this.roleId == 1 || this.roleId == 3) {
        const addTarikhSampelDihantar = this.hantarSampelService.PostTarikhSampelDihantar(this.batch);
        const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
        const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

        forkJoin([
          addTarikhSampelDihantar,
          updateLtxTarikhSampelDihantar,
          updateBRTarikhSampelDihantar
        ]).subscribe(
          {
            next: ((res: any[]) => {
              this.toastr.success('Data berjaya disimpan', 'Berjaya', {
                timeOut: 7000,
              }),

                setTimeout(() => {
                  window.location.reload();
                });

            }),
            error: (e) => {
              this.toastr.error('Maklumat gagal dikemaskini');
            }
          }
        );
      }

      else if (this.roleId == 2) {

        const addTarikhSampelDihantar = this.hantarSampelService.PostUipTarikhSampelDihantar(this.batch);
        const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
        const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

        forkJoin([
          addTarikhSampelDihantar,
          updateLtxTarikhSampelDihantar,
          updateBRTarikhSampelDihantar
        ]).subscribe(
          {
            next: ((res: any[]) => {
              this.toastr.success('Data berjaya disimpan', 'Berjaya', {
                timeOut: 7000,
              }),
              
                setTimeout(() => {
                  window.location.reload();
                });

            }),

            error: (e) => {
              this.toastr.error('Maklumat gagal dikemaskini');
            }
          }
        );
      }
    }

  }


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

    viewSample(k1DetailId: number) {
      this.router.navigate(['sample/view-sample/' + k1DetailId])
    }
  }