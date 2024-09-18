import { Component, OnInit } from '@angular/core';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { K1Detail } from '../../models/k1Detail';
import { CetakLabelService } from '../cetak-label.service';
import { UserService } from 'src/app/User/user.service';
import * as QRCode from 'qrcode-generator';

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
  mesYaTidak: any
  loginAs: any;
  latexSample: any
  page: number = 1;
  ip: number = 20;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean


  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private cetakLabelService: CetakLabelService,
    private userService: UserService

  ) { }

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.getElimsSamplesByUsername2()
      })
    }
    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.user = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        this.getElimsSamplesByUsername2()
      })
    }

    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.user = res
        this.roleUip = true
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
    const selectedSamples: Sample[] = [];
    for (const sample of this.samples) {
      if ((sample as Sample).checked) {
        selectedSamples.push(sample as Sample);
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
      }
      y += boxHeight + 0; // Change the box spacing here
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }


  // After remove

  onYesClick() {
    this.k1Detail.labelPrintedOn = new Date();
    this.k1Detail.labelPrintedBy = this.loginAs;
    this.k1Detail.labelPrinted = true;

    this.cetakSample.labelPrintedOn = new Date();
    this.cetakSample.labelPrintedBy = this.loginAs;
    this.cetakSample.labelPrinted = true;
  
    for (const sample of this.samples) {
      let id = sample.k1DetailId;
      if (this.checkAll || sample.checked) {
  
        this.cetakLabelService.Putk1DetailLabelTelahDicetak(id, this.k1Detail).subscribe(
          res => { this.mesYaTidak = "yes" }
        );
      }
    }
  }

  onNoClick() {
    this.mesYaTidak = "tidak"
  }

}


