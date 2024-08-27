import { Component, Input } from '@angular/core';
import * as QRCode from 'qrcode';
import { UserService } from 'src/app/User/user.service';
import { Batch } from 'src/app/models/batch';
import { Staff } from 'src/app/models/staff';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ElimsService } from 'src/app/services/elims.service';
import { CetakWorksheetService } from '../cetak-worksheet.service';
import { Penimbang } from 'src/app/models/penimbang';
import { Oven } from 'src/app/models/oven';

@Component({
  selector: 'app-pdf-worksheet-ltx',
  templateUrl: './pdf-worksheet-ltx.component.html',
  styleUrls: ['./pdf-worksheet-ltx.component.css']
})
export class PdfWorksheetLtxComponent {

  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean;
  staff: Staff = {} as Staff;
  rubberTypeId: any;
  qrCodeDataUrl: string = ''; // Store QR code data URL
  statusCodeId: number = 0;
  batches: Batch[] = [];
  selectedPenimbang: string = 'default';
  selectedOven: string = 'default';
  penimbangs: Penimbang[];
  ovens: any;

  refPenimbang: Penimbang = {} as Penimbang;
  refOven: Oven = {} as Oven;

  @Input() k1Detail: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheetService: CetakWorksheetService
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
        this.staff = res;
        this.roleGtacr = true;
      });
    }

    console.log(this.k1Detail);
    this.generateQRCodeImage(this.k1Detail.customNo);

    this.cetakWorksheetService.GetRefPenimbangs().subscribe((data) => {
      this.penimbangs = data;
      console.log(this.penimbangs);
    });

    this.cetakWorksheetService.GetRefOvens().subscribe((data) => {
      this.ovens = data;
      console.log(this.ovens);
    });

    // Initialize default values for select elements
    if (!this.k1Detail.penimbang) {
      this.k1Detail.penimbang = 'default';
    }
    if (!this.k1Detail.oven) {
      this.k1Detail.oven = 'default';
    }
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
