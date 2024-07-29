import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ElimsService } from '../../services/elims.service';
import { CetakWorksheetService } from '../../CetakWorksheet/cetak-worksheet.service';
import { K1Detail } from '../../models/k1Detail';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../User/user.service';
import { Staff } from '../../models/staff';
import { Sample } from '../../models/sample';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-pdf-cetak-keputusan-uip',
  templateUrl: './pdf-cetak-keputusan-uip.component.html',
  styleUrls: ['./pdf-cetak-keputusan-uip.component.css']
})
export class PdfCetakKeputusanUipComponent {
  @Input() k1DetailId: number[];
  k1Details: K1Detail[] = [];
  rubberTypes: any;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean;
  staff: Staff = {} as Staff;
  today = new Date();
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  groupedSamples: any[]; // Add this variable
  printing: boolean = false;
  creatorRoleId: any;
  k1Detail: K1Detail = {} as K1Detail;
  isFirstPage: boolean = true;

  constructor(
    private elimsService: ElimsService,
    private cetakWorksheetService: CetakWorksheetService,
    private authService: AuthService,
    private userService: UserService,
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
        this.authService.changeUser(res);
        this.staff = res;
        this.roleGtacr = true;
      });
    }
    // Fetch k1Details based on k1DetailId
    // const fetchDetails = this.k1DetailId.map(id =>
    //   this.cetakWorksheetService.GetElimsSample(id).toPromise()
    // );
    
    // Promise.all(fetchDetails).then(details => {
    //   this.k1Details = details.sort((a, b) => a.k1DetailId - b.k1DetailId);
    // });

    this.k1DetailId.forEach(element => {
      this.cetakWorksheetService.GetElimsSample(element).subscribe(data => {
        // Push the data to k1Details array
        this.k1Details.push(data);
        // Sort k1Details array based on k1DetailId
        this.k1Details.sort((a, b) => a.k1DetailId - b.k1DetailId);
        this.creatorRoleId = this.k1Detail.creatorRoleId;
        console.log(this.k1Details);
        // Group the samples after sorting
        this.groupSamplesByCompany();
      });
    });



    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data;
    });
  }

  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const printWindow = window.open();
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>DRC-eLiMS</title>
                <style>
                    body, p, th, td {
                        font-family: Arial, sans-serif;
                        font-size: 12pt;
                    }
                    td, th, p {
                        font-size: 14px !important;
                        white-space: normal;
                    }
                    .listTable td, .listTable th {
                        border: 1px solid black;
                        border-collapse: collapse;
                        padding: 7px;
                        text-align: center;
                    }
                    .space {
                        padding-bottom: 40px;
                    }
                    .small-column {
                        width: 40px; /* Adjust the width as needed */
                    }
                    .small-column1 {
                        width: 30px; /* Adjust the width as needed */
                    }
                    .small-getah {
                        width: 15px; /* Adjust the width as needed */
                    }
                    .small-no {
                        width: 10px; /* Adjust the width as needed */
                    }
                    .big-column {
                        width: 110px; /* Adjust the width as needed */
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    .company-group {
                        page-break-before: always;
                        margin-top: 0px; /* Adjust to create space at the top of each page */
                    }
                    .company-group.first-group {
                        page-break-before: auto;
                        margin-top: 0;
                    }
                    .sample {
                        page-break-inside: avoid;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.5;
                        padding-left: 20px;
                    }
                    .title-spacing {
                        margin-bottom: 90px;
                    }
                    .col1 {
                        width: 20%;
                    }
                    .col2 {
                        width: 20%;
                    }
                    .table-sm {
                        font-size: 10px; /* Adjust font size as needed */
                        padding: 20px; /* Adjust padding as needed */
                    }
                    .report-footer-cell {
                        padding-bottom: 40px; /* Adjust the value as needed */
                    }
                    // .footer-info {
                    //     margin-bottom: 30px; /* Adjust the value as needed */
                    // }
                    .report-header-cell {
                        padding-top: 105px; /* Adjust the value as needed */
                        text-align: left;
                        position: relative;
                        border-bottom: 2px solid black;
                    }
                    .header-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    .date-info {
                        margin-left: auto;
                    }
                    .center-text {
                        text-align: center;
                        font-weight: bold; /* Optional: Makes the text bold */
                        font-size: 18px; /* Optional: Adjust the font size as needed */
                    }
                    .title {
                        margin-top: 90px; 
                        text-align: center;
                    }
                    @page {
                        margin: 20mm;
                    }
                    
                    @page :left {
                        @bottom-left {
                            content: "Page " counter(page);
                        }
                    }
                    
                    @page :right {
                        @bottom-right {
                            content: "Page " counter(page);
                        }
                    }

                    @page {
                        @bottom-center {
                            content: "Page " counter(page) " of " counter(pages);
                        }
                    }
                    
                    .footer {
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        text-align: center;
                        font-size: 12pt;
                    }

                    @media print {
  .header-to-hide {
    display: none;
  }

  .report-header {
    display: table-header-group;
  }

  @page {
    size: A4;
    margin: 20mm;
  }

  @page :first {
    .header-to-hide {
      display: none;
    }
  }
}


                </style>
            </head>
            <body>
                ${printContents}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        alert('Unable to open print preview. Please check your browser settings or popup blockers.');
    }
}



  
  // groupSamplesByCompany() {
  //   const groupedCollection = this.k1Details.reduce((accumulator, currentValue) => {
  //     const key = currentValue.importerName;
  //     (accumulator[key] = accumulator[key] || []).push(currentValue);
  //     return accumulator;
  //   }, {});
  //   this.groupedSamples = Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key], count: groupedCollection[key].length }));
  //   // Calculate first and last testedOn dates for each batch
  //   this.groupedSamples.forEach(group => {
  //     const sortedByTestedOn = group.items.sort((a, b) => new Date(a.testedOn).getTime() - new Date(b.testedOn).getTime());
  //     group.firstTestedOnDate = sortedByTestedOn[0].testedOn;
  //     group.lastTestedOnDate = sortedByTestedOn[sortedByTestedOn.length - 1].testedOn;
  //   });
  // }
  

  groupSamplesByCompany() {
    // First, sort the k1Details array by k1DetailId
    this.k1Details.sort((a, b) => a.k1DetailId - b.k1DetailId);
  
    // Group by company name
    const groupedCollection = this.k1Details.reduce((accumulator, currentValue) => {
      const key = currentValue.importerName;
      (accumulator[key] = accumulator[key] || []).push(currentValue);
      return accumulator;
    }, {});
  
    // Prepare the grouped samples
    this.groupedSamples = Object.keys(groupedCollection).map(key => ({
      key,
      items: groupedCollection[key],
      count: groupedCollection[key].length
    }));
  
    // Ensure that each group is sorted by k1DetailId as well
    this.groupedSamples.forEach(group => {
      group.items.sort((a, b) => a.k1DetailId - b.k1DetailId);
    });
  
    // Log the groupedSamples for debugging
    console.log('Grouped Samples:', this.groupedSamples);
  }



  generatePdf(): void {
    const element = document.getElementById('pdfContent');
    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }
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
    element.innerHTML = styledContent;
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
      element.innerHTML = content;
    });
  }
  generateReportNo(k1Details: K1Detail[]): string {
    const labRefNumbers = k1Details.map(detail => {
      const lastPart = detail.labRefNo.substring(detail.labRefNo.lastIndexOf('/') + 1);
      return this.formatLabRefNo(lastPart);
    });
    if (labRefNumbers.length === 1) {
      return labRefNumbers[0];
    } else {
      const sortedLabRefNumbers = labRefNumbers.sort();
      const firstLabRef = sortedLabRefNumbers[0];
      const lastLabRef = sortedLabRefNumbers[sortedLabRefNumbers.length - 1];
      return `${firstLabRef}-${lastLabRef}`;
    }
  }
  formatLabRefNo(labRefNo: string): string {
    const paddedNumber = '0000' + labRefNo;
    return paddedNumber.slice(-Math.max(4, labRefNo.length));
  }
}
