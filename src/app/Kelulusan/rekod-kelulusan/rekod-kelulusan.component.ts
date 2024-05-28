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
import { RubberType } from '../../models/rubberType';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Result } from '../../models/result';
import { CetakWorksheetService } from '../../CetakWorksheet/cetak-worksheet.service';
import { CetakKeputusanService } from '../../CetakKeputusan/cetak-keputusan.service';
import { RekodKelulusanService } from '../rekod-kelulusan.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rekod-kelulusan',
  templateUrl: './rekod-kelulusan.component.html',
  styleUrls: ['./rekod-kelulusan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RekodKelulusanComponent {
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
  ];

  expandedElement: Sample | null;

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  samples: Sample = {} as Sample;
  batches: any;
  batchId: number;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean = false;
  staff: Staff = {} as Staff;
  statusCodeId: number = 0;
  customNo: string;
  sample: Sample = {} as Sample;
  result: Result = {} as Result;
  typeCodes: any;
  rubberTypes: RubberType[];
  showForm: boolean = false;
  inputDisable: boolean = false;
  inputKelulusan: boolean = true;
  emailRecipient: any[] = [];
  k1DetailId: number; // Changed to a single number

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheetService: CetakWorksheetService,
    private cetakKeputusanService: CetakKeputusanService,
    private rekodKelulusanService: RekodKelulusanService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername();
      this.userRoleId = this.authService.getSessionRole();
    } else {
      this.loginAs = '';
    }

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res);
        this.authService.changeUser(res);
        this.emailRecipient.push(res.emailLgm);
        this.staff = res;
        this.roleGtacr = true;

        // Get email staff
        // this.rekodKelulusanService.GetEmailResultLetter(this.staff.staffId).subscribe(emelRes => {
        //   if (Array.isArray(emelRes) && emelRes.length > 0) {
        //     emelRes.forEach(item => {
        //       if (item.emailLgm) {
        //         this.emailRecipient.push(item.emailLgm);
        //         console.log(this.emailRecipient);
        //       }
        //     });
        //   }
        // });



      });
    }

    this.statusCodeId = 10;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(this.batches[0].samples);

      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data;
    });
  }

  sampleList(k1DetailId: number) {
    this.cetakWorksheetService.GetElimsSample(k1DetailId).subscribe(data => {
      this.samples = data;
      console.log(data);
      this.showForm = true;
      this.k1Detail.labRefNo = this.samples.labRefNo;
      this.k1Detail.testMethod = this.samples.testMethod;
      this.k1Detail.inLabOn = this.samples.inLabOn;
      this.k1Detail.inLabBy = this.samples.inLabBy;
      this.k1Detail.verifiedOn = this.samples.verifiedOn;
      this.k1Detail.verifiedBy = this.samples.verifiedBy;

        // this.rekodKelulusanService.GetEmailForwarder(this.samples.forwarderId).subscribe(emelRes => {
        //   console.log(emelRes)
        //     this.emailRecipient.push(emelRes.email);
        //     console.log(this.emailRecipient);
        // });


    });

    this.rekodKelulusanService.GetResultbySampleId(k1DetailId).subscribe(dataResult => {
      this.result = dataResult;
      console.log(dataResult);
    });
  }

  viewMemo(batchId: number): void {
    console.log(this.batchId);
    window.open("memo/" + batchId);
  }

  putApproved() {

    this.k1Detail.approvedBy = this.staff.username;
    this.batchId= this.samples.batchId;
    this.k1Detail.creatorRoleId= this.samples.creatorRoleId;

    const id = this.samples.k1DetailId;
    // this.cetakKeputusanService.PutApproved(id, this.k1Detail).subscribe(
    //   res => {
    //     this.toastr.success('Berjaya merekod keputusan', 'Berjaya');
    //   },
    //   error => {
    //     console.error('Failed to record decision', error);
    //   }
    // );


    //this.emailRecipient = ["nurizzatul@lgm.gov.my"];


    if (this.k1Detail.creatorRoleId == 1) {
    this.rekodKelulusanService.notificationResultLetter(this.staff.staffId, id, this.emailRecipient).subscribe(
      () => {
        console.log("Email for request status 009 has been sent to the recipients");

      },
      error => {
        console.log("Email for request status 009 failed to send to the recipients", error);
      }
    );
    }


    if (this.k1Detail.creatorRoleId == 2) {
    this.rekodKelulusanService.uipNotificationResultLetter(this.staff.staffId, this.batchId, this.emailRecipient).subscribe(
      () => {
        console.log("Email for request status 009 has been sent to the recipients");

      },
      error => {
        console.log("Email for request status 009 failed to send to the recipients", error);
      }
    );
    }


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
}
