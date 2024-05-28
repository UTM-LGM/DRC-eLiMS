import { Component, OnInit } from '@angular/core';
import { Sample } from '../../models/sample';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ElimsService } from '../../services/elims.service';
import { K1Detail } from '../../models/k1Detail';
import { environment } from '../../environments/environment';
import { K1Header } from '../../models/k1Header';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { userDTO } from '../../models/userDTO';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-view-sample',
  templateUrl: './view-sample.component.html',
  styleUrls: ['./view-sample.component.css']
})
export class ViewSampleComponent implements OnInit {


  sample: Sample = {} as Sample;
  k1Detail: K1Detail = {} as K1Detail;
  k1Header: K1Header = {} as K1Header;
  user: userDTO = {} as userDTO

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
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter
  batchId2: number
  creatorRoleId: any;

  baseApiUrl = environment.baseApiUrl;
  baseApiUrlElimsEvidence = environment.baseApiUrlElimsEvidence;

  changeWebsite(e: any) {

    if (e.target.value == "Lateks") {
      this.showLatexTypes = true
    }
    else {
      this.showLatexTypes = false
    }


    if (e.target.value == "Getah Bongkah") {
      this.showBlockRubberTypes = true
    }
    else {
      this.showBlockRubberTypes = false
    }
  }

  constructor
    (private route: ActivatedRoute,
      private elimsService: ElimsService,
      private location: Location,
      private authservice: AuthService,
      private httpclient: HttpClient,
      private daftarSampelService: DaftarSampelService,
      private authService: AuthService,
      private userService: UserService,

    ) { }


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
        console.log(res)
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
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
              this.onDate(this.sample.importedDate)
              if (this.sample.isSMK) {
                this.showSmk = true
              } else {
                this.showSmk = false
              }

              if (response == null) {
                // Handle null response if needed
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

  goBack() {
    this.location.back();
  }

  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsEvidence + this.sample.k1DetailId + "_" + path, "_blank");
  }

  viewReceipt(path: string): void {
    window.open(environment.baseApiUrlElimsReceipt + this.sample.batchId + "_" + path, "_blank");
  }

  onDate(importedDate: Date) {
    const dateValue = new Date(importedDate);
    let sum;

    this.authservice.GetCustomOffice(this.user.customOfficeId).subscribe(x => {
      console.log(x);
      this.customOffice = x;

      if (this.customOffice.isNorthen) {
        sum = dateValue.getDate() + 7;
      } else {
        sum = dateValue.getDate() + 14;
      }

      const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
      this.selectedDateSum = sumDate;

      const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
      const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
      const year = sumDate.getFullYear();

      this.notes = `${day}.${month}.${year}`;

      const today = new Date();
      const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (sumDate < today) {
        if (this.customOffice.isNorthen) {
          this.notes += " (Anda telah lewat 7 hari)";
        } else {
          this.notes += " (Anda telah lewat 14 hari)";
        }
        this.showRemarks = true; // Display the remarks field
      } else if (daysUntilDeadline <= 3) {
        if (this.customOffice.isNorthen) {
          // this.notes += ` (Warning: Only ${daysUntilDeadline} days left before the deadline)`;
          this.notes += ` (Perhatian: Anda mempunyai  ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
        } else {
          this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
        }
        this.showRemarks = false; // Hide the remarks field
      } else {
        this.showRemarks = false; // Hide the remarks field
      }

      console.log(this.selectedDateSum.toDateString());
    });
  }

}
