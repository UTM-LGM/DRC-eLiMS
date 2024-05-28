import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as QRCode from 'qrcode-generator';
import jsPDF from 'jspdf';
import { Sample } from 'src/app/models/sample';
import { Batch } from 'src/app/models/batch';
import { Staff } from 'src/app/models/staff';
import { K1Detail } from 'src/app/models/k1Detail';
import { ElimsService } from 'src/app/services/elims.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { CetakWorksheetService } from '../cetak-worksheet.service';

@Component({
  selector: 'app-ulang-cetak-lembaran-kerja',
  templateUrl: './ulang-cetak-lembaran-kerja.component.html',
  styleUrls: ['./ulang-cetak-lembaran-kerja.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UlangCetakLembaranKerjaComponent {


  columnsToDisplay = [

    'batchId',
    'rubberType',
    'isFastTrack',
    'forwarderName',
    'sentOn',
    'sampleCount',
  ]

  expandedElement: Sample | null;


  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  codeId: any[] = [];
  batches: Batch[] = [];
  samples: Sample[] = [];
  selectedBatchId: number;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCode: number
  k1Detail: K1Detail = {} as K1Detail;
  sample: Sample = {} as Sample;
  username: string
  checkAll: boolean = false
  lepassubmit: boolean = false
  isPrint: boolean = false
  statusCodeId: number = 0;
  selectedSamples: Sample[] = [];
  mesYaTidak: any
  batch: any;
  listk1DetailId: any[] = [];

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheet: CetakWorksheetService,

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

    this.codeId = [7, 8, 9];

      this.elimsService.GetBatchByStatusCodeId(this.codeId).subscribe(data => {
        data.forEach(resData => {
          this.batches.push(resData);

          // this.sample.rubberType = this.batch.rubberType

        });
      
        this.batches.sort((a, b) => a.batchId - b.batchId);
      
        this.dataSource = new MatTableDataSource<Batch>(this.batches);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      

    
    console.log(this.listk1DetailId)
  }

 // https://api02.lgm.gov.my/ApiElims/api/Batches/GetBatchByStatusCodeId?statusCodeId=7&statusCodeId=8&statusCodeId=9

  checkSingleChanged() {
    this.selectedSamples = [];
    for (const row of this.batches) {
      for (const sample of row.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    } console.log(this.selectedSamples)
  }


  displaySelected() {
    
    this.lepassubmit = true;

    // Filter batches to include only those with selected samples
    // this.batches = this.batches.filter(batch => batch.samples.some(sample => sample.checked));
    // Filter samples to include only the selected ones
    for (const batch of this.batches) {
      // for (const sample of batch.samples) {
      //   if (sample.checked) {
      //     const id = sample.k1DetailId;
      //     this.cetakWorksheet.PutWorksheetTestOn(id, this.k1Detail).subscribe(
      //       res => { }
      //     );

      //     this.k1Detail.worksheetTestOn
      //     console.log(this.k1Detail)

      //   }
      // }
      batch.samples = batch.samples.filter(sample => sample.checked);
      
    }
    
  }



  generatePDF(k1DetailId: number) {

    for (const batch of this.batches) {
      for (const sample of batch.samples) {
        if (sample.checked) {
          const id = sample.k1DetailId;
          this.cetakWorksheet.PutWorksheetTestOn(id, this.k1Detail).subscribe(
            res => { 
              this.isPrint = true;
                          
              this.selectedSamples.forEach(sample => {
                this.listk1DetailId.push(sample.k1DetailId)
                console.log(this.listk1DetailId)
              })
            }
          );
        }
      }
    }

  

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onYesClick() {
    this.k1Detail.labelTestedOn = new Date();
    this.k1Detail.labelTestedBy = this.loginAs;

    for (const batch of this.batches) {
      for (const sample of batch.samples) {
        if (sample.checked) {
          const id = sample.k1DetailId;
          this.cetakWorksheet.PutCetakLembaranKerja(id, this.k1Detail).subscribe(
            res => { this.mesYaTidak = "yes" }
          );
        }
      }
    }
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }



  generatePDF1() {
    const selectedSamples = this.samples.filter(sample => sample.checked);
    if (selectedSamples.length === 0) {
      alert('Please select at least one sample.');
      return;
    }
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const boxHeight = 37;
    const boxWidth = 78;
    const qrCodeSize = 20;
    const fontSize = 7.5;
    let y = 15;
    let x = 20;

    // Set font to Courier Monospace
    doc.setFont('courier', 'normal');

    for (let i = 0; i < selectedSamples.length; i += 2) {
      const sample1 = selectedSamples[i];
      const sample2 = selectedSamples[i + 1];

      // Check if boxes fit on the current page
      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      // Draw boxes
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, boxWidth, boxHeight, 'FD');
      if (sample2) {
        doc.rect(x + boxWidth, y, boxWidth, boxHeight, 'FD');
      }

      // Create QR codes
      const qrCode1 = QRCode(0, 'L');

      if (this.userRoleId == 1 || this.userRoleId == 3) {
        qrCode1.addData(sample1.customNo);
      }
      else if (this.userRoleId == 2) {
        qrCode1.addData(sample1.customNo);
      }

      qrCode1.make();
      const qrCodeImgData1 = qrCode1.createDataURL(qrCodeSize);

      let qrCodeImgData2;
      if (sample2) {
        const qrCode2 = QRCode(0, 'L');

        if (this.userRoleId == 1 || this.userRoleId == 3) {
          qrCode2.addData(sample2.customNo);
        } else if (this.userRoleId == '2') {
          qrCode2.addData(sample2.customNo);
        }

        qrCode2.make();
        qrCodeImgData2 = qrCode2.createDataURL(qrCodeSize);
      }

      // Add QR code images to PDF
      doc.addImage(qrCodeImgData1, 'PNG', x + 1, y + 7, qrCodeSize, qrCodeSize);
      if (qrCodeImgData2) {
        doc.addImage(qrCodeImgData2, 'PNG', x + boxWidth + 1, y + 7, qrCodeSize, qrCodeSize);
      }

      // Add text to PDF
      doc.setFontSize(fontSize);


      if (this.userRoleId == 1 || this.userRoleId == 3) {
        if (sample1.customNo) {
          doc.text("*" + `${sample1.customNo} ` + "*", x + 21, y + 5);
        }
      } else if (this.userRoleId == 2) {
        if (sample1.customNo) {
          doc.text(`${sample1.customNo} - UIP`, x + 21, y + 5);
        }
      }

      if (sample1.samplePropose) {
        doc.text(`${sample1.samplePropose}`, x + 21, y + 10);
      }

      if (sample1.typeCode) {
        doc.text(`${sample1.typeCode}`, x + 21, y + 14);
      }

      if (sample1.importedDate) {
        const importedDate1 = new Date(sample1.importedDate);
        const formattedDate1 = importedDate1.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        doc.text(`${formattedDate1}`, x + 21, y + 18);
      }


      if (sample1.importerName) {
        const lines = doc.splitTextToSize(sample1.importerName, 52);
        doc.text(lines, x + 21, y + 22);
      }


      if (this.userRoleId == 1 || this.userRoleId == 3) {
        if (sample1.forwarderName) {
          const lines = doc.splitTextToSize('FA : ' + sample1.forwarderName, 53);
          doc.text(lines, x + 21, y + 29);
        }
      } else if (this.userRoleId == 2) {
        const lines = doc.splitTextToSize(`Unit Inspektorat dan Penguatkuasaan`, 53);
        doc.text(lines, x + 21, y + 29);
      }

      if (sample2) {

        if (this.userRoleId == 1 || this.userRoleId == 3) {
          if (sample2.customNo) {
            doc.text("*" + `${sample2.customNo}` + "*", x + boxWidth + 21, y + 5);
          }
        } else if (this.userRoleId == 2) {
          if (sample2.customNo) {
            doc.text(`${sample2.customNo} - UIP`, x + boxWidth + 21, y + 5);
          }
        }
        if (sample2.samplePropose) {
          doc.text(`${sample2.samplePropose}`, x + boxWidth + 21, y + 10);
        }

        if (sample2.typeCode) {
          doc.text(`${sample2.typeCode}`, x + boxWidth + 21, y + 14);
        }

        if (sample2.importedDate) {
          const importedDate2 = new Date(sample2.importedDate);
          const formattedDate2 = importedDate2.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          doc.text(`${formattedDate2}`, x + boxWidth + 21, y + 18);
        }


        if (sample2.importerName) {
          const lines1 = doc.splitTextToSize(sample2.importerName, 52);
          doc.text(lines1, x + boxWidth + 21, y + 22);
        }


        if (this.userRoleId == 1 || this.userRoleId == 3) {
          if (sample2.forwarderName) {
            const lines1 = doc.splitTextToSize('FA : ' + sample2.forwarderName, 53);
            doc.text(lines1, x + boxWidth + 21, y + 29);
          }
        }
        if (this.userRoleId == 2) {
          const lines1 = doc.splitTextToSize(`Unit Inspektorat dan Penguatkuasaan`, 53);
          doc.text(lines1, x + boxWidth + 21, y + 29);
        }

        // if (sample2.forwarderAddress) {
        //   const lines1 = doc.splitTextToSize(sample2.forwarderAddress, 52);
        //   doc.text(lines1, x + boxWidth + 21, y + 33);
        // }     

      }
      y += boxHeight + 0; // Change the box spacing here
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  isAnyCheckboxSelected(): boolean {
    return this.selectedSamples.some(sample => sample.checked);
  }
  

}




