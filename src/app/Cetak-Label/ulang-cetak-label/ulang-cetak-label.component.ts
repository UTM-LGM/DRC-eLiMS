import { Component, OnInit } from '@angular/core';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode-generator';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { Sample } from '../../models/sample';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { ElimsService } from '../../services/elims.service';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { K1Detail } from '../../models/k1Detail';
import { CetakLabelService } from '../cetak-label.service';
import { UserService } from 'src/app/User/user.service';

@Component({
  selector: 'app-ulang-cetak-label',
  templateUrl: './ulang-cetak-label.component.html',
  styleUrls: ['./ulang-cetak-label.component.css']
})
export class UlangCetakLabelComponent implements OnInit {

  user: userDTO = {} as userDTO
  k1Detail: K1Detail = {} as K1Detail;
  cetakSample: Sample = {} as Sample
  samples: Sample[] = [];
  checkAll: boolean = false
  lepassubmit: boolean = false
  pdfUrl: string | null = null;
  mesYaTidak: any
  loginAs: any;
  statusCodeId = 2;
  latexSample: any
  latex1: any
  page: number = 1;
  ip: number = 20;
  roleId: any;
  sampleTypeName: string


  constructor(
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private elimsService: ElimsService,
    private authService: AuthService,
    private cetakLabelService: CetakLabelService,
    private userService: UserService

  ) { }

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.getElimsSamplesByUsername2()
      })
    }
    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.user = res
        this.getElimsSamplesByUsername2()
      })
    }

  }

  getElimsSamplesByUsername2() {
    console.log(this.user.username)
    this.elimsService.GetElimsSamplesByUsername(this.user.username, 2).subscribe(data => {
      this.samples = data;
      console.log(this.samples)
    },
    )
  }

  checkAllChanged() {
    if (this.checkAll) {
      for (let sample of this.samples) {
        sample.checked = true;
      }
      console.log(this.samples);
    } else {
      for (let sample of this.samples) {
        sample.checked = false;
      }
      console.log("All unchecked.");
    }
  }

  checkSingleChanged() {
    const selectedSamples = [];
    for (const sample of this.samples) {
      if (sample.checked) {
        selectedSamples.push(sample);
      }
    }
    console.log(selectedSamples);
  }

  displaySelected() {
    this.lepassubmit = true
    this.samples = this.samples.filter(sample => sample.checked);
  }

  generatePDFWithQRCode() {
    const selectedSamples = this.samples.filter(sample => sample.checked);
    if (selectedSamples.length === 0) {
      alert('Please select at least one sample.');
      return;
    }
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const boxHeight = 35;
    const boxWidth = 68;
    const qrCodeSize = 20;
    const fontSize = 7;
    const boxSpacing = 0;
    let y = 12;
    let x = 3;

    // Set font to Courier Monospace
    doc.setFont('courier', 'normal');

    for (let i = 0; i < selectedSamples.length; i += 3) {
      const sample1 = selectedSamples[i];
      const sample2 = selectedSamples[i + 1];
      const sample3 = selectedSamples[i + 2];

      // Check if boxes fit in the current page
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
      if (sample3) {
        doc.rect(x + 2 * boxWidth, y, boxWidth, boxHeight, 'FD');
      }

      // Create QR codes
      const qrCode1 = QRCode(0, 'L');
      qrCode1.addData(sample1.customNo);
      qrCode1.make();
      const qrCodeImgData1 = qrCode1.createDataURL(qrCodeSize);

      let qrCodeImgData2;
      if (sample2) {
        const qrCode2 = QRCode(0, 'L');
        qrCode2.addData(sample2.customNo);
        qrCode2.make();
        qrCodeImgData2 = qrCode2.createDataURL(qrCodeSize);
      }

      let qrCodeImgData3;
      if (sample3) {
        const qrCode3 = QRCode(0, 'L');
        qrCode3.addData(sample3.customNo);
        qrCode3.make();
        qrCodeImgData3 = qrCode3.createDataURL(qrCodeSize);
      }

      // Add QR code images to PDF
      doc.addImage(qrCodeImgData1, 'PNG', x + 1, y + 5, qrCodeSize, qrCodeSize);
      if (qrCodeImgData2) {
        doc.addImage(qrCodeImgData2, 'PNG', x + boxWidth + 1, y + 5, qrCodeSize, qrCodeSize);
      }

      if (qrCodeImgData3) {
        doc.addImage(qrCodeImgData3, 'PNG', x + 2 * (boxWidth + boxSpacing) + 1, y + 5, qrCodeSize, qrCodeSize);
      }

      // Add text to PDF
      doc.setFontSize(fontSize);

      if (this.roleId == 1) {
        if (sample1.customNo) {
          doc.text(`${sample1.customNo}`, x + 21, y + 5);
        }
      } else if (this.roleId == 2) {
        if (sample1.customNo) {
          doc.text(`${sample1.customNo} - UIP`, x + 21, y + 5);
        }
      }
      if (sample1.samplePropose) {
        doc.text(`${sample1.samplePropose}`, x + 21, y + 10);
      }

      if (sample1.sampleType) {
        const lines = doc.splitTextToSize(sample1.sampleType, 50);
        doc.text(lines, x + 21, y + 15);
      }

      if (sample1.importedDate) {
        const importedDate1 = new Date(sample1.importedDate);
        const formattedDate1 = importedDate1.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        doc.text(`${formattedDate1}`, x + 21, y + 23);
      }
      if (sample1.companyName || sample1.importerName) {
        const lines = doc.splitTextToSize(sample1.companyName || sample1.importerName, 46);
        doc.text(lines, x + 21, y + 28);
      }


      if (sample2) {
        if (this.roleId == 1) {
          if (sample2.customNo) {
            doc.text(`${sample2.customNo}`, x + boxWidth + 21, y + 5);
          }
        } else if (this.roleId == 2) {
          if (sample2.customNo) {
            doc.text(`${sample2.customNo} - UIP`, x + boxWidth + 21, y + 5);
          }
        }

        if (sample2.samplePropose) {
          doc.text(`${sample2.samplePropose}`, x + boxWidth + 21, y + 10);
        }

        if (sample2.sampleType) {
          const lines2 = doc.splitTextToSize(sample2.sampleType, 50);
          doc.text(lines2, x + boxWidth + 21, y + 15);
        }

        if (sample2.importedDate) {
          const importedDate2 = new Date(sample2.importedDate);
          const formattedDate2 = importedDate2.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          doc.text(`${formattedDate2}`, x + boxWidth + 21, y + 23);
        }

        if (sample2.companyName || sample2.importerName) {
          const lines1 = doc.splitTextToSize(sample2.companyName || sample2.importerName, 46);
          doc.text(lines1, x + boxWidth + 21, y + 28);
        }

      }

      if (sample3) {

        if (this.roleId == 1) {
          if (sample3.customNo) {
            doc.text(`${sample3.customNo}`, x + 2 * boxWidth + 21, y + 5);
          }
        } else if (this.roleId == 2) {
          if (sample3.customNo) {
            doc.text(`${sample3.customNo} - UIP`, x + 2 * boxWidth + 21, y + 5);
          }
        }

        if (sample3.samplePropose) {
          doc.text(`${sample3.samplePropose}`, x + 2 * boxWidth + 21, y + 10);
        }

        if (sample3.sampleType) {
          const lines3 = doc.splitTextToSize(sample3.sampleType, 50);
          doc.text(lines3, x + 2 * boxWidth + 21, y + 15);
        }

        if (sample3.importedDate) {
          const importedDate3 = new Date(sample3.importedDate);
          const formattedDate3 = importedDate3.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          doc.text(`${formattedDate3}`, x + 2 * boxWidth + 21, y + 23);
        }

        if (sample3.companyName || sample3.importerName) {
          const lines3 = doc.splitTextToSize(sample3.companyName || sample3.importerName, 46);
          doc.text(lines3, x + 2 * boxWidth + 21, y + 28);
        }

      }

      y += boxHeight + 0; // Change the box spacing here
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }

  onYesClick() {
    this.k1Detail.labelPrintedOn = new Date();
    this.k1Detail.labelPrintedBy = this.user.username;
    this.k1Detail.labelPrinted = true;

    this.cetakSample.labelPrintedOn = new Date();
    this.cetakSample.labelPrintedBy = this.user.username;
    this.cetakSample.labelPrinted = true;

    for (const sample of this.samples) {
      let id = sample.k1HeaderId;
      if (this.checkAll || sample.checked) {

        this.cetakLabelService.Putk1DetailLabelTelahDicetak(id, this.k1Detail).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

        this.cetakLabelService.Putk1HeaderLabelTelahDicetak(id).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

        this.drclimstrainingService.PutLtxLabelTelahDicetak(id, this.cetakSample).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

        this.getahBongkahService.PutBRLabelTelahDicetak(id, this.cetakSample).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

      }
    }
  }

  onNoClick() {
    this.mesYaTidak = "tidak"
  }

}


