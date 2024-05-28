import { Component, Input } from '@angular/core';
import { ElimsService } from '../services/elims.service';
import { CetakWorksheetService } from '../CetakWorksheet/cetak-worksheet.service';
import { K1Detail } from '../models/k1Detail';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../User/user.service';
import { Staff } from '../models/staff';

@Component({
  selector: 'app-pdf-cetak-surat-keputusan',
  templateUrl: './pdf-cetak-surat-keputusan.component.html',
  styleUrls: ['./pdf-cetak-surat-keputusan.component.css']
})
export class PdfCetakSuratKeputusanComponent {

  @Input() k1DetailId: number[];
  k1Details: K1Detail[] = [];
  rubberTypes: any
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  // @Input() k1Detail: any;
  
    constructor(
    private elimsService: ElimsService,
    private cetakWorksheetService: CetakWorksheetService,
    private authService: AuthService,
    private userService: UserService,
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
        this.staff = res
        this.roleGtacr = true

      })
    }


    // console.log(this.k1Detail)
    // this.generateQRCodeImage(this.k1Detail.customNo);


    this.k1DetailId.forEach(element => {
      this.cetakWorksheetService.GetElimsSample(element).subscribe(data => {
        this.k1Details.push(data);
        console.log(this.k1Details)
       
      });

    })


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })

  }
}

