import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode-generator';
import { Sample } from '../../models/sample';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { ElimsService } from '../../services/elims.service';
import { K1Detail } from '../../models/k1Detail';
import { K1Header } from '../../models/k1Header';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { CetakLabelService } from '../cetak-label.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-cetak-label',
  templateUrl: './cetak-label.component.html',
  styleUrls: ['./cetak-label.component.css']
})
export class CetakLabelComponent implements OnInit {

  samples: Sample[] = [];
  k1Details: K1Detail[] = [];
  selectedSamples: number[] = [];

  k1Detail: K1Detail = {} as K1Detail;
  k1Header: K1Header = {} as K1Header;
  cetakSample: Sample = {} as Sample
  sample: Sample = {} as Sample
  user: userDTO = {} as userDTO
  staff: Staff = {} as Staff

  checkAll: boolean = false
  lepassubmit: boolean = false

  mesYaTidak: any
  sampleCode2: any
  pdfUrl: string | null = null;
  statusCode: number;
  statusCode2: number;
  sample1: any
  loginAs: any;
  latexSample: any
  latex1: any
  page: number = 1;
  ip: number = 20;
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  username: string;

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
      // console.log(this.loginAs)
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        this.getUserElimsSamples(this.user)
      })
    }
    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
        this.getStaffElimsSamples(this.staff)
      })
    }

  }

  getUserElimsSamples(user: userDTO) {
    console.log(user.username)
    this.elimsService.GetElimsSamplesByUsername(user.username, 1).subscribe(data => {
      this.samples = data;
      this.latexSample = data
      console.log(this.samples)
    },
    )
  }
  getStaffElimsSamples(staff: Staff) {
    console.log(staff.username)
    this.elimsService.GetElimsSamplesByUsername(staff.username, 1).subscribe(data => {
      this.samples = data;
      this.latexSample = data
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
    const boxWidth = 78;
    const qrCodeSize = 20;
    const fontSize = 7;
    let y = 12;
    let x = 27;

    // Set font to Courier Monospace
    doc.setFont('courier', 'normal');

    for (let i = 0; i < selectedSamples.length; i += 2) {
      const sample1 = selectedSamples[i];
      const sample2 = selectedSamples[i + 1];

      // const latex1 = selectedLatex[i];
      // const latex2 = selectedLatex[i + 1];

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

      if (this.roleId == 1) {
        qrCode1.addData(sample1.customNo);
      }
      else if (this.roleId == 2) {
        qrCode1.addData(sample1.customNo + "- UIP");
      }

      qrCode1.make();
      const qrCodeImgData1 = qrCode1.createDataURL(qrCodeSize);

      let qrCodeImgData2;
      if (sample2) {
        const qrCode2 = QRCode(0, 'L');

        if (this.roleId == 1) {
          qrCode2.addData(sample2.customNo);
        } else if (this.roleId == '2') {
          qrCode2.addData(sample2.customNo + "- UIP");
        }

        qrCode2.make();
        qrCodeImgData2 = qrCode2.createDataURL(qrCodeSize);
      }

      // Add QR code images to PDF
      doc.addImage(qrCodeImgData1, 'PNG', x + 1, y + 5, qrCodeSize, qrCodeSize);
      if (qrCodeImgData2) {
        doc.addImage(qrCodeImgData2, 'PNG', x + boxWidth + 1, y + 5, qrCodeSize, qrCodeSize);
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
        doc.text(`${sample1.samplePropose}`, x + 21, y + 11);
      }
      if (sample1.sampleType) {
        doc.text(`${sample1.sampleType}`, x + 21, y + 17);
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
        const lines = doc.splitTextToSize(sample1.companyName || sample1.importerName, 52);
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
          doc.text(`${sample2.samplePropose}`, x + boxWidth + 21, y + 11);
        }

        if (sample2.sampleType) {
          doc.text(`${sample2.sampleType}`, x + boxWidth + 21, y + 17);
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
          const lines1 = doc.splitTextToSize(sample2.companyName || sample2.importerName, 52);
          doc.text(lines1, x + boxWidth + 21, y + 28);
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
    this.k1Detail.labelPrintedBy = this.loginAs;
    this.k1Detail.labelPrinted = true;

    this.cetakSample.labelPrintedOn = new Date();
    this.cetakSample.labelPrintedBy = this.loginAs;
    this.cetakSample.labelPrinted = true;

    for (const sample of this.samples) {
      let id = sample.k1DetailId;
      const rubberTypeId = sample.rubberTypeId
      if (this.checkAll || sample.checked) {

        this.cetakLabelService.Putk1DetailLabelTelahDicetak(id, this.k1Detail).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

        if (rubberTypeId == 2) {
          this.getahBongkahService.PutBRLabelTelahDicetak(id, this.cetakSample).subscribe(
            res => { this.mesYaTidak = "yes" }
          );

        } else if (rubberTypeId == 1) {
          this.drclimstrainingService.PutLtxLabelTelahDicetak(id, this.cetakSample).subscribe(
            res => { this.mesYaTidak = "yes" }
          );
        }
      }
    }
  }

  onNoClick() {
    this.mesYaTidak = "tidak"
  }

}
