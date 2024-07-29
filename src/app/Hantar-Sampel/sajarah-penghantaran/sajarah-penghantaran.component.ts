import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sample } from 'src/app/models/sample';
import { Batch } from 'src/app/models/batch';
import { userDTO } from 'src/app/models/userDTO';
import { loginImporter } from 'src/app/models/loginImporters';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { Staff } from 'src/app/models/staff';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';


@Component({
  selector: 'app-sajarah-penghantaran',
  templateUrl: './sajarah-penghantaran.component.html',
  styleUrls: ['./sajarah-penghantaran.component.css'],
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
export class SajarahPenghantaranComponent {

  @Output() selectedSampleToSend = new EventEmitter<any>();
  @Input() batch: any;

  expandedElement: Sample | null = null;
  displayedColumns: string[] = []

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // batch: Batch = {} as Batch;
  user: userDTO = {} as userDTO
  batches: any;
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean

  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  batchId: number
  username: string

  samples: Sample[] = [];

  checkAll: boolean = false
  lepassubmit: boolean = false
  selectedBatchId: number;
  selectedBatches: any[] = [];

  constructor
    (
      private authservice: AuthService,
      private hantarSampelService: HantarSampelService,
      private userService: UserService,
    ) { }

  ngOnInit() {
    this.expandedElement = null;
    console.log(this.batch)

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
        console.log(this.user)
        this.username = this.user.username

        this.hantarSampelService.GetElimsBatchBySendByNull1(this.username).subscribe((res => {
          console.log(res)
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

        this.hantarSampelService.GetElimsBatchBySendByNull1(this.username).subscribe((res => {
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

        this.hantarSampelService.GetElimsBatchBySendByNull1(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;

          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }))

      })
    }

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  sendSample(){
    this.lepassubmit = true;
    console.log(this.selectedBatches)
    // const dataToSend = { message: this.selectedBatches };
    // console.log(dataToSend);
    this.selectedSampleToSend.emit(this.selectedBatches);
  }


  checkSingleChanged() {
    // this.selectedBatches: any[] = [];
    this.selectedBatches = [];
    for (const batch of this.batches as any[]) {
      if (batch.checked) {
        this.selectedBatches.push(batch);
        this.selectedSampleToSend.emit(this.selectedBatches);
      }
    }
    console.log(this.selectedBatches);
  }


}
