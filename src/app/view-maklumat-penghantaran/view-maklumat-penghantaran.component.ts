import { Component } from '@angular/core';
import { Batch } from '../models/batch';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';
import { sample } from 'rxjs';
import { UserService } from '../User/user.service';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetahBongkahService } from '../services/getah-bongkah.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ElimsService } from '../services/elims.service';
import { DrclimstrainingService } from '../services/drclimstraining.service';
import { Sample } from '../models/sample';
import { userDTO } from '../models/userDTO';
import { UipRefRunNo } from '../models/uipRefRunNo';
import { UipbkhRefRunNo } from '../models/uipbkhRefRunNo';
import { Staff } from '../models/staff';

import jsPDF from 'jspdf';
import * as QRCode from 'qrcode-generator';

@Component({
  selector: 'app-view-maklumat-penghantaran',
  templateUrl: './view-maklumat-penghantaran.component.html',
  styleUrls: ['./view-maklumat-penghantaran.component.css']
})
export class ViewMaklumatPenghantaranComponent {


  batch: Batch = {} as Batch;
  user: userDTO = {} as userDTO
  batches: any;
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean

  staff: Staff = {} as Staff
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  batchId: number
  username: string

  samples: Sample[] = [];

  checkAll: boolean = false
  lepassubmit: boolean = false
  selectedBatchId: number;

  constructor
    (
      private route: ActivatedRoute,
      private authservice: AuthService,
      private hantarSampelService: HantarSampelService,
      private userService: UserService,
      private elimsService: ElimsService,
      ) { }

  ngOnInit() {


    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.roleId = this.authservice.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        console.log(this.user)
        this.username = this.user.username

        this.hantarSampelService.GetElimsBatchBySendBy(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;
        }))

      })
    }
    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
        console.log(this.staff)
        this.username = this.staff.username

        this.hantarSampelService.GetElimsBatchBySendBy(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;
        }))
      })
    }


  }





  generateQRCode(batchId: string) {
    // Create a new QR Code instance
    const qr = QRCode(0, 'L');
    console.log(batchId);

    // Set the data to be encoded in the QR code (in this case, the batchId)
    const batchIdString = batchId.toString();
    qr.addData(batchIdString);
    qr.make();

    // Create a new PDF document
    const pdf = new jsPDF();

    // Convert the QR code data to a data URL
    const qrCodeDataUrl = qr.createDataURL(10, 10);

    // Add the QR code as an image to the PDF
    const imageWidth = 50; // Adjust the width as needed
    const imageHeight = 50; // Adjust the height as needed
    pdf.addImage(qrCodeDataUrl, 'PNG', 10, 10, imageWidth, imageHeight);

    // Add text under the QR code
    const textUnderQR = 'Batch Id : ' + batchId;
    pdf.text(textUnderQR, 10, 70); // Adjust the coordinates (x, y) as needed

    // Save the PDF as a Blob
    const pdfBlob = pdf.output('blob');

    // Create a Blob URL for the PDF Blob
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    // Create an anchor element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfBlobUrl;
    // downloadLink.download = 'yourFileName.pdf'; // Provide a desired filename

    // Trigger a click on the anchor element to start the download
    downloadLink.click();

    // Optionally, revoke the Blob URL to free up resources
    URL.revokeObjectURL(pdfBlobUrl);
  }



  checkAllChanged() {
    if (this.checkAll) {
      for (let batch of this.batches) {
        batch.checked = true;
      }
      console.log(this.batches);
    } else {
      for (let batch of this.batches) {
        batch.checked = false;
      }
      console.log("All unchecked.");
    }
  }



  checkSingleChanged() {
    const selectedBatches = [];
    for (const batch of this.batches) {
      if (batch.checked) {
        selectedBatches.push(batch);
      }
    }
    console.log(selectedBatches);
  }


  generatePDFWithQRCode() {

    const selectedBatches = this.batches.filter((batch: { checked: any; }) => batch.checked);
    if (selectedBatches.length === 0) {
      alert('Please select at least one sample.');
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const boxHeight = 35;
    const boxWidth = 60;
    const qrCodeSize = 25;
    const fontSize = 10;
    const boxSpacing = 0;
    let y = 13;
    let x = 15;

    // Set font to Courier Monospace
    doc.setFont('courier', 'normal');

    for (let i = 0; i < selectedBatches.length; i += 3) {
      const batch1 = selectedBatches[i];
      const batch2 = selectedBatches[i + 1];
      const batch3 = selectedBatches[i + 2];

      // Check if boxes fit on the current page
      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      // Draw boxes
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, boxWidth, boxHeight, 'FD');

      if (batch2) {
        doc.rect(x + boxWidth, y, boxWidth, boxHeight, 'FD');
      }

      if (batch3) {
        doc.rect(x + 2 * boxWidth, y, boxWidth, boxHeight, 'FD');
      }


      // Create QR codes 1
      const qrCode1 = QRCode(0, 'L');

      if (this.roleId == 1) {
        qrCode1.addData(batch1.batchId.toString());
      }

      else if (this.roleId == 2) {
        qrCode1.addData(batch1.batchId.toString() + "- UIP");
      }

      qrCode1.make();
      const qrCodeImgData1 = qrCode1.createDataURL(qrCodeSize);


      // Create QR codes 2
      let qrCodeImgData2;
      if (batch2) {
        const qrCode2 = QRCode(0, 'L');

        if (this.roleId == 1) {
          qrCode2.addData(batch2.batchId.toString());
        } else if (this.roleId == '2') {
          qrCode2.addData(batch2.batchId.toString() + "- UIP");
        }

        qrCode2.make();
        qrCodeImgData2 = qrCode2.createDataURL(qrCodeSize);
      }


      // Create QR codes 3

      let qrCodeImgData3;
      if (batch3) {
        const qrCode3 = QRCode(0, 'L');

        if (this.roleId == 1) {
          qrCode3.addData(batch3.batchId.toString());
        } else if (this.roleId == '2') {
          qrCode3.addData(batch3.batchId.toString() + "- UIP");
        }

        qrCode3.make();
        qrCodeImgData3 = qrCode3.createDataURL(qrCodeSize);
      }




      // Add QR code images to PDF
      doc.addImage(qrCodeImgData1, 'PNG', x + 17, y + 3, qrCodeSize, qrCodeSize);
      if (qrCodeImgData2) {
        doc.addImage(qrCodeImgData2, 'PNG', x + boxWidth + 17, y + 3, qrCodeSize, qrCodeSize);
      }
      if (qrCodeImgData3) {
        doc.addImage(qrCodeImgData3, 'PNG', x + 2 * (boxWidth + boxSpacing) + 17, y + 3, qrCodeSize, qrCodeSize);
      }

      // Add text to PDF
      doc.setFontSize(fontSize);


      if (this.roleId == 1) {
        if (batch1.batchId) {
          doc.text("Batch Id : " + `${batch1.batchId}`, x + 16, y + 30);
        }
      }

      else if (this.roleId == 2) {
        if (batch1.batchId) {
          doc.text("Batch Id : " + `${batch1.batchId} - UIP`, x + 16, y + 30);
        }
      }


      if (batch2) {

        if (this.roleId == 1) {
          if (batch2.batchId) {
            doc.text("Batch Id : " + `${batch2.batchId}`, x + boxWidth + 16, y + 30);
          }
        } else if (this.roleId == 2) {
          if (batch2.batchId) {
            doc.text("Batch Id : " + `${batch2.batchId} - UIP`, x + boxWidth + 16, y + 30);
          }
        }
      }


      if (batch3) {

        if (this.roleId == 1) {
          if (batch3.batchId) {
            doc.text("Batch Id : " + `${batch3.batchId}`, x + 2 * boxWidth + 16, y + 30);
          }
        }

        else if (this.roleId == 2) {
          if (batch3.batchId) {
            doc.text("Batch Id : " + `${batch3.batchId} - UIP`, x + 2 * boxWidth + 16, y + 30);
          }
        }
      }

      y += boxHeight + 0; // Change the box spacing here
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }



  isAtLeastOneCheckboxChecked(): boolean {
    return this.batches.some((batch: { checked: any; }) => batch.checked);
  }
  

  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res)
      this.samples = res;
      // this.calculateUnregisteredSampleCount();
      
    }); 
  }

}
