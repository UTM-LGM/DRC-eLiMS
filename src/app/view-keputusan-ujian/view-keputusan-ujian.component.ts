import { Component, OnInit } from '@angular/core';
import { Sample } from '../models/sample';
import { K1Detail } from '../models/k1Detail';
import { K1Header } from '../models/k1Header';
import { userDTO } from '../models/userDTO';
import { Staff } from '../models/staff';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../User/user.service';
import { DaftarSampelService } from '../Daftar-Sampel/daftar-sampel.service';
import { Batch } from '../models/batch';
import { loginImporter } from '../models/loginImporters';

@Component({
  selector: 'app-view-keputusan-ujian',
  templateUrl: './view-keputusan-ujian.component.html',
  styleUrls: ['./view-keputusan-ujian.component.css']
})
export class ViewKeputusanUjianComponent implements OnInit {
  searchParams: any;
  constructor
    (
      private route: ActivatedRoute,
      private authservice: AuthService,
      private daftarSampelService: DaftarSampelService,
      private userService: UserService,

    ) { }

  sample: Sample = {} as Sample;
  k1Detail: K1Detail = {} as K1Detail;
  k1Header: K1Header = {} as K1Header;
  user: userDTO = {} as userDTO
  importer: loginImporter = {} as loginImporter
  batch: Batch = {} as Batch;
  batchData: Batch = {} as Batch;

  samplePropose: any = ['Pengecualian Ses (CE)', 'Lain-lain']
  transportType: any = ['Pelabuhan', 'Darat']

  companies: any
  latexTypes: any
  blockRubberTypes: any
  showLatexTypes: boolean = false
  showBlockRubberTypes: boolean = false
  showSmk: boolean = false
  showRemarks: boolean;

  quantity: number;
  formattedQuantity: string;
  formattedDRC: string;
  numericQuantity: number
  loginAs: any;
  username: any
  selectedDate: string;
  notes: string;
  selectedDateSum: Date;
  customOffice: any
  userRoleId: any;
  creatorRoleId: any;
  roleForwarder: boolean = false
  roleImporter: boolean = false
  roleUip: boolean = false
  roleGtacr: boolean = false
  staff: Staff = {} as Staff
  batchId2: number

  baseApiUrl = environment.baseApiUrl;
  baseApiUrlElimsEvidence = environment.baseApiUrlElimsEvidence;

  changeWebsite(e: any) {
    if (e.target.value == "Lateks") { this.showLatexTypes = true } else { this.showLatexTypes = false }
    if (e.target.value == "Getah Bongkah") { this.showBlockRubberTypes = true } else { this.showBlockRubberTypes = false }
  }

  ngOnInit() {

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()
      console.log(this.loginAs)
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
        console.log(this.roleForwarder)
      })
    }
    else if (this.userRoleId == 2 ) {
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
        this.roleImporter = false
      })
    }

    else if (this.userRoleId == 4 ) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleGtacr = true
        
      })
    }



    this.route.paramMap.subscribe({
      next: (params) => {
        const k1DetailId = params.get('k1DetailId');

        if (k1DetailId) {
          this.daftarSampelService.GetElimsSample(parseInt(k1DetailId))
            .subscribe(response => {
              this.sample = response;
              console.log(response);
              this.creatorRoleId = this.sample.creatorRoleId
              if (this.sample.isSMK) {
                this.showSmk = true
              } else {
                this.showSmk = false
              }
            });
        }
      }
    })

  }

  isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date.toString() !== 'Invalid Date';
  }

  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsEvidence + this.sample.k1DetailId + "_" + path, "_blank");
  }

  viewReceipt(path: string): void {
    window.open(environment.baseApiUrlElimsReceipt + this.sample.batchId + "_" + path, "_blank");
  }

  viewMemo(): void {
    window.open("memo/" + this.sample.batchId);
  }

  viewSuratIringan(): void {
    window.open("surat-iringan/" + this.sample.batchId);
  }


  // viewSuratIringan(): void {
  //   window.open("surat-iringan/" + this.sample.batchId );
  // }

  viewLampiran(): void {
    window.open("lampiran/" + this.sample.batchId);
  }

  goBack() {
    window.history.back();
  }

}
