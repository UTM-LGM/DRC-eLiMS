import { Component, Input} from '@angular/core';
import * as QRCode from 'qrcode';
import { UserService } from 'src/app/User/user.service';
import { Batch } from 'src/app/models/batch';
import { Staff } from 'src/app/models/staff';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-pdf-worksheet-br',
  templateUrl: './pdf-worksheet-br.component.html',
  styleUrls: ['./pdf-worksheet-br.component.css']
})
export class PdfWorksheetBRComponent {

  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  rubberTypeId: any;
  qrCodeDataUrl: string = ''; // Store QR code data URL
  statusCodeId: number = 0;
  batches: Batch[] = [];
  
  @Input() k1Detail: any;


  constructor(
    private elimsService: ElimsService,
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


    console.log(this.k1Detail)
    this.generateQRCodeImage(this.k1Detail.customNo);
  }

  generateQRCodeImage(data: string): void {
    // Generate the QR code as a data URL
    QRCode.toDataURL(data).then((qrCodeDataUrl: string) => {
      this.qrCodeDataUrl = qrCodeDataUrl;
    }).catch((error: any) => {
      console.error('Error generating QR code:', error);
    });
  }

}

