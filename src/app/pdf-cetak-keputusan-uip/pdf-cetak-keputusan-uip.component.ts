import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ElimsService } from '../services/elims.service';
import { CetakWorksheetService } from '../CetakWorksheet/cetak-worksheet.service';
import { K1Detail } from '../models/k1Detail';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../User/user.service';
import { Staff } from '../models/staff';
import { Sample } from '../models/sample';

@Component({
  selector: 'app-pdf-cetak-keputusan-uip',
  templateUrl: './pdf-cetak-keputusan-uip.component.html',
  styleUrls: ['./pdf-cetak-keputusan-uip.component.css']
})
export class PdfCetakKeputusanUipComponent {

  @Input() k1DetailId: number[];
  k1Details: K1Detail[] = [];
  rubberTypes: any
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  today = new Date();
  // @Input() k1Detail: any;
  creatorRoleId: any;
  sample: Sample = {} as Sample;
  k1Detail: K1Detail = {} as K1Detail;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  
  
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
        console.log(data)
        this.k1Details.push(data);
        console.log(this.k1Details);
       
      });

    })


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })

  }


  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


  // generateReportNo(labRefNo: string): string {
  //   const lastFourDigits = this.formatLabRefNo(labRefNo) .slice(-4);
  //  console.log(lastFourDigits)
  //   return `${lastFourDigits}`;
  // }

  generateReportNo(k1Details: K1Detail[]): string {
    const labRefNumbers = k1Details.map(detail => {
        const lastPart = detail.labRefNo.substring(detail.labRefNo.lastIndexOf('/') + 1);
        return this.formatLabRefNo(lastPart);
    });

    if (labRefNumbers.length === 1) {
        return labRefNumbers[0]; // Only one lab reference number
    } else {
        const sortedLabRefNumbers = labRefNumbers.sort();
        const firstLabRef = sortedLabRefNumbers[0];
        const lastLabRef = sortedLabRefNumbers[sortedLabRefNumbers.length - 1];
        return `${firstLabRef}-${lastLabRef}`;
    }
}



formatLabRefNo(labRefNo: string): string {
    const paddedNumber = '0000' + labRefNo; // Pad with leading zeros
    return paddedNumber.slice(-Math.max(4, labRefNo.length)); // Take the last digits, keeping at least four
}


// generateReportNo(labRefNo: string): string {
//   const lastFourDigits = this.formatLabRefNo(labRefNo) .slice(-4);
//  console.log(lastFourDigits)
//   return `${lastFourDigits}`;
// }

// formatLabRefNo(labRefNo: string): string {
//   const parts = labRefNo.split('/');
//   if (parts.length >= 3) {
//     const lastPart = parts[parts.length - 1];
//     const paddedNumber = '0000' + lastPart;
//     return parts.slice(0, -1).join('/') + '/' + paddedNumber.slice(-4);
//   }
//   return labRefNo;
// }


}

