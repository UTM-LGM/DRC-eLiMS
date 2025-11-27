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
  creatorRoleId: any;
  sample: Sample = {} as Sample;
  k1Detail: K1Detail = {} as K1Detail;
  groupedSamples: any[];
  samples: any;
  printing: boolean = false;

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


    this.k1DetailId.forEach(element => {
      this.cetakWorksheetService.GetElimsSample(element).subscribe(data => {
       
        this.k1Details.push(data);  
        this.k1Details.sort((a, b) => a.k1DetailId - b.k1DetailId);
        this.creatorRoleId = this.k1Detail.creatorRoleId;
        console.log(this.k1Details);
        this.groupSamplesByCompany();
      });
    });


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })

  }


  groupSamplesByCompany() {
    // First, sort the k1Details array by k1DetailId
    this.k1Details.sort((a, b) => a.k1DetailId - b.k1DetailId);

    // Group by company name
    const groupedCollection = this.k1Details.reduce((accumulator, currentValue) => {
      const key = currentValue.importerAddress;
      (accumulator[key] = accumulator[key] || []).push(currentValue);
      return accumulator;
    }, {});

    // Prepare the grouped samples
    this.groupedSamples = Object.keys(groupedCollection).map(key => ({
      key,
      items: groupedCollection[key],
      count: groupedCollection[key].length
    }));

 
    console.log('Grouped Samples:', this.groupedSamples);

    this.groupedSamples.forEach(group => {
      group.items.sort((a, b) => a.k1DetailId - b.k1DetailId);
    });

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


  // print() {
  //   const printContents = this.pdfContent?.nativeElement.innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   this.printing = false; // Enable the button after printing is done
  // }


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


          .center-text {
                        text-align: center;
                        font-weight: bold; /* Optional: Makes the text bold */
                        font-size: 18px; /* Optional: Adjust the font size as needed */
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
              padding-left: 20d;
            }
            .title-spacing {
              margin-bottom: 90px;
            }

@media all
  {
  #page-one, .footer, .page-break { display:none; }
  }
@media print
  {
   .page-number {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 12px;
  }
   .header { 
    display: none; /* Hide the header */
  }
   @page :first {
    .header { 
      display: block; /* This will not work in all browsers, see notes below */
    }
      
  #page-one, .footer, .page-break   
    { 
    display: block;
    color:red; 
    font-family:Arial; 
    font-size: 16px; 
    text-transform: uppercase; 
    }
  .page-break
    {
    page-break-before:always;
    } 
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
    padding-bottom: 50px; /* Adjust the value as needed */
  }
  // .footer-info {
  //   margin-bottom: 40px; /* Adjust the value as needed */
  // }
  .report-header-cell {
    padding-top:150px; /* Adjust the value as needed */
    text-align: left;
    position: relative;
    border-bottom: 2px solid black;
    
  }
  .header-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    //  margin-top: 75px; /* Adjust the value as needed */
  }

  .date-info {
    margin-left: auto;
  }
 .title {
     margin-top: 90px; 
    text-align: center;
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
      printWindow.onload = () => {
        const totalPages = printWindow.document.body.getElementsByTagName('div').length;
        const pageNumberDivs = printWindow.document.getElementsByClassName('page-number');

        for (let i = 0; i < pageNumberDivs.length; i++) {
          const pageNumberDiv = pageNumberDivs[i] as HTMLElement;
          pageNumberDiv.innerText = `Page ${i + 1} of ${totalPages}`;
        }
        printWindow.print();
      };
    } else {
      alert('Unable to open print preview. Please check your browser settings or popup blockers.');
    }
  }

}


