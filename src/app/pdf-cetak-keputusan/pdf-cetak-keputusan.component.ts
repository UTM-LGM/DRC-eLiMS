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
  selector: 'app-pdf-cetak-keputusan',
  templateUrl: './pdf-cetak-keputusan.component.html',
  styleUrls: ['./pdf-cetak-keputusan.component.css']
})
export class PdfCetakKeputusanComponent {

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

  groupedSamples: any[]; // Add this variable
  samples: any;
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
        this.k1Details.push(data);
        this.creatorRoleId = this.k1Detail.creatorRoleId
        console.log(this.k1Details)
       
        this.groupSamplesByCompany();
      });

    })


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })


  }

  groupSamplesByCompany() {
    const groupedCollection = this.k1Details.reduce((accumulator, currentValue) => {
      const key = currentValue.importerName;
      (accumulator[key] = accumulator[key] || []).push(currentValue);
      return accumulator;
    }, {});

    this.groupedSamples = Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key], count: groupedCollection[key].length }));
    console.log(this.groupedSamples);
  }


  generatePdf(): void { 
    // this.isPreview = false;
    const element = document.getElementById('pdfContent2');
  
    // Check if the element is null before proceeding
    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }
  
    // Set font size inline in the HTML content
    const content = element.innerHTML;
    const styledContent = `<div style="font-size: 12px;">${content}</div>`;
  
    var opt = {
      margin: [1.5, 0.5, 0.5, 0.5],
      filename: 'Lampiran.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { 
        unit: 'in', 
        format: 'A4', 
        orientation: 'portrait', 
        font: 'times', 
      },
    };
  
    // Replace the original content with the modified content
    element.innerHTML = styledContent;
  
    // Generate PDF
    html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
      // Restore the original content
      element.innerHTML = content;
  
      // Save the blob or trigger a download as needed
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'suratIringan.pdf';
      downloadLink.click();
    });html2pdf(element, opt);
  }
  
  
  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


//   print() {
//     const printContents = this.pdfContent?.nativeElement.innerHTML;
//     const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//     popupWin?.document.open();
//     popupWin?.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//         </head>
//         <body>${printContents}</body>
//       </html>
//     `);
//     popupWin?.document.close();
//     popupWin?.focus();
//     popupWin?.print();
//     popupWin?.close();
// }




}
