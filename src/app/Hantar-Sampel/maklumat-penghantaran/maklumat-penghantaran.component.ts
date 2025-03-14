import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from '../../User/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Sample } from '../../models/sample';
import { userDTO } from '../../models/userDTO';
import { UipRefRunNo } from '../../models/uipRefRunNo';
import { UipbkhRefRunNo } from '../../models/uipbkhRefRunNo';
import { Staff } from '../../models/staff';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { loginImporter } from '../../models/loginImporters';

@Component({
  selector: 'app-maklumat-penghantaran',
  templateUrl: './maklumat-penghantaran.component.html',
  styleUrls: ['./maklumat-penghantaran.component.css'],
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
export class MaklumatPenghantaranComponent {

  @Output() selectedSampleToSend = new EventEmitter<any>();
  @Input() batch: any;

  expandedElement: Sample | null;
  displayedColumns: string[] = []

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  user: userDTO = {} as userDTO
  batches: any;
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  selectedBatches: any[] = [];
  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  batchId: number
  username: string
  samples: Sample[] = [];
  checkAll: boolean = false
  lepassubmit: boolean = false
  mesYaTidak: any

  constructor
    (
      private authservice: AuthService,
      private hantarSampelService: HantarSampelService,
      private userService: UserService,
    ) { }

  ngOnInit() {

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {

      this.displayedColumns = [
        'qrbatchId',
        'batchId',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];

      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        this.username = this.user.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          this.batches = res;
          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }))
      })
    }

    else if (this.userRoleId == 2) {

      this.displayedColumns = [

        'qrbatchId',
        'batchId',
        'uipRegNo',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];

      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
        console.log(this.staff)
        this.username = this.staff.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;
          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }))
      })
    }

    else if (this.userRoleId == 3) {
      this.displayedColumns = [

        'qrbatchId',
        'batchId',
        // 'uipRegNo',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        console.log(this.importer)
        this.username = this.importer.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;
          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }))
      })
    }
  }


  checkSingleChanged() {
    this.selectedBatches = [];
    for (const batch of this.batches as any[]) {
      if (batch.checked) {
        this.selectedBatches.push(batch);
        this.selectedSampleToSend.emit(this.selectedBatches);
      }
    }
    console.log(this.selectedBatches);
  }


  isAtLeastOneCheckboxChecked(): boolean {
    return this.batches.some((batch: { checked: any; }) => batch.checked);
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }

}
