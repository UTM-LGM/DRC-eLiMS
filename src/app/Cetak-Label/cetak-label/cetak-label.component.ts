import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { K1Detail } from '../../models/k1Detail';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { CetakLabelService } from '../cetak-label.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import * as QRCode from 'qrcode-generator';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-cetak-label',
  templateUrl: './cetak-label.component.html',
  styleUrls: ['./cetak-label.component.css']
})
export class CetakLabelComponent implements OnInit {

  samples: Sample[] = [];
  k1Detail: K1Detail = {} as K1Detail;
  cetakSample: Sample = {} as Sample
  user: userDTO = {} as userDTO
  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter
  checkAll: boolean = false
  lepassubmit: boolean = false
  mesYaTidak: any
  loginAs: any;
  latexSample: any
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  page: number = 1;
  ip: number = 20;

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

    // userroleid = 1 :  forwarder
    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        this.getUserElimsSamples(this.user)
      })
    }

    // userroleid = 2 :  UIP
    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
        this.getStaffElimsSamples(this.staff)
      })
    }

    // userroleid = 3 :  Importer
    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        this.getImporterElimsSamples(this.importer)
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

  getImporterElimsSamples(importer: loginImporter) {
    console.log(importer.username)
    this.elimsService.GetElimsSamplesByUsername(importer.username, 1).subscribe(data => {
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
    const selectedSamples: Sample[] = [];
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


  generatePDFWithQRCode1() {
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

  generatePDFWithQRCode() {
    const selectedSamples = this.samples.filter(sample => sample.checked);
    if (selectedSamples.length === 0) {
      alert('Please select at least one sample.');
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // Adjusted box size for larger boxes
    const boxHeight = 37;  // Increased box height
    const boxWidth = 78;   // Increased box width
    const qrCodeSize = 20;
    const fontSize = 7.5;
    let y = 15;
    let x = 20;

    // Set font to Courier Monospace
    doc.setFont('courier', 'normal');

    // Watermark Image URL
    const watermarkUrl = "data:image/png;base64,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"; // Replace with your actual URL

    const image = new Image();
    image.src = watermarkUrl;
    image.crossOrigin = 'Anonymous';  // Ensure CORS is handled

    image.onload = () => {
      // Proceed with PDF generation after image has loaded
      for (let i = 0; i < selectedSamples.length; i += 2) {
        const sample1 = selectedSamples[i];
        const sample2 = selectedSamples[i + 1];

        // Check if boxes fit on the current page
        if (y + boxHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        // Watermark Image Scaling (make it smaller)
        const watermarkWidth = boxWidth * 0.4;  // Scale down to 40% of the box width
        const watermarkHeight = boxHeight * 0.7;  // Scale down to 40% of the box height

        // Center the image within the box
        const watermarkX1 = x + (boxWidth - watermarkWidth) / 2;  // Center horizontally for sample 1
        const watermarkY1 = y + (boxHeight - watermarkHeight) / 2;  // Center vertically for sample 1

        const watermarkX2 = x + boxWidth + (boxWidth - watermarkWidth) / 2;  // Center horizontally for sample 2
        const watermarkY2 = y + (boxHeight - watermarkHeight) / 2;  // Center vertically for sample 2

        // Apply transparency to create a faded effect
        const fadedAlpha = 0.9;  // Adjust this value for more or less fade (0.0 is fully transparent, 1.0 is fully opaque)

        // Add Watermark image behind the text for both samples with transparency effect
        doc.addImage(image, 'PNG', watermarkX1, watermarkY1, watermarkWidth, watermarkHeight, undefined, 'NONE', fadedAlpha);
        if (sample2) {
          doc.addImage(image, 'PNG', watermarkX2, watermarkY2, watermarkWidth, watermarkHeight, undefined, 'NONE', fadedAlpha);
        }

        // Draw boxes for the sample details (this is outside the watermark area)
        doc.setDrawColor(0, 0, 0);  // Set the box color to black (or any color you prefer)
        doc.setLineWidth(0.5);  // Set line thickness
        doc.rect(x, y, boxWidth, boxHeight);  // Box around sample1 details

        if (sample2) {
          doc.rect(x + boxWidth, y, boxWidth, boxHeight); // Box around sample2 details
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

        // Add QR code images on top of the watermark
        doc.addImage(qrCodeImgData1, 'PNG', x + 1, y + 7, qrCodeSize, qrCodeSize);
        if (qrCodeImgData2) {
          doc.addImage(qrCodeImgData2, 'PNG', x + boxWidth + 1, y + 7, qrCodeSize, qrCodeSize);
        }

        // Add text to PDF for sample1
        doc.setFontSize(fontSize);
        if (sample1.customNo) {
          doc.text("*" + `${sample1.customNo} ` + "*", x + 21, y + 5);
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

        // Add text to PDF for sample2
        if (sample2) {
          if (sample2.customNo) {
            doc.text("*" + `${sample2.customNo}` + "*", x + boxWidth + 21, y + 5);
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

        y += boxHeight + 0; // Adjust the box spacing
      }

      // Trigger the PDF download
      doc.save('Cetak_Label.pdf');
    };

    image.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  }




  downloadBlob(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'test.pdf';
    anchor.click();
    window.URL.revokeObjectURL(url); // Clean up
  }

  // after remove
  onYesClick() {
    this.k1Detail.labelPrintedOn = new Date();
    this.k1Detail.labelPrintedBy = this.loginAs;
    this.k1Detail.labelPrinted = true;

    this.cetakSample.labelPrintedOn = new Date();
    this.cetakSample.labelPrintedBy = this.loginAs;

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
