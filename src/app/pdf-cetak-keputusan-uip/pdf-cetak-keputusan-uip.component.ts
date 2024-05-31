import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ElimsService } from '../services/elims.service';
import { CetakWorksheetService } from '../CetakWorksheet/cetak-worksheet.service';
import { K1Detail } from '../models/k1Detail';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../User/user.service';
import { Staff } from '../models/staff';
import { Sample } from '../models/sample';
import * as html2pdf from 'html2pdf.js';

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


  // print() {
  //   const printContents = this.pdfContent?.nativeElement.innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  // }
  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      // Write the contents to the new tab
      printWindow.document.open();
      printWindow.document.write(`
            <html>
            <head>
                <title>DRC-eLiMS</title>
                <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 12pt;               
              }

              td,
              th, p {
   
                font-size: 14px !important;
                white-space: normal;
                // word-wrap: break-word;
                // max-width: 300px;
              }
              .listTable td, .listTable th {
                border: 1px solid black;
                border-collapse: collapse; 
                padding: 7px;
                /* Add padding here */
              }
              table {
                border-collapse: collapse;
              }
                </style>
            </head>
            <body>
                ${printContents}
            </body>
            </html>
        `);
      printWindow.document.close();

      // Print the contents of the new tab
      printWindow.print();
    } else {
      alert('Unable to open print preview. Please check your browser settings or popup blockers.');
    }
  }



  generatePdf(): void {
    const element = document.getElementById('pdfContent');

    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }

    // Set font size inline in the HTML content
    const content = element.innerHTML;
    const styledContent = `<div style="font-size: 12px;">${content}</div>`;

    var opt = {
      margin: [1.5, 0.5, 0.5, 0.5],
      filename: 'cetakKeputusan.pdf',
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait',
        font: 'times',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      enableLinks: true
    };

    // Replace the original content with the modified content
    element.innerHTML = styledContent;

    // Generate PDF with page numbers
    html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 0.5, {
          align: 'center'
        });
      }
    }).save().then(() => {
      // Restore the original content
      element.innerHTML = content;
    });
  }




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

