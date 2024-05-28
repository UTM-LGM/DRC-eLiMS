import { Component, Input, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { ToastrService } from 'ngx-toastr';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { forkJoin } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sample } from 'src/app/models/sample';
import { AuthService } from 'src/app/services/auth/auth.service';
import { userDTO } from 'src/app/models/userDTO';
import { Staff } from 'src/app/models/staff';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { loginImporter } from 'src/app/models/loginImporters';
import { K1Detail } from 'src/app/models/k1Detail';

import * as QRCode from 'qrcode-generator';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tarikh-sampel-dihantar',
  templateUrl: './tarikh-sampel-dihantar.component.html',
  styleUrls: ['./tarikh-sampel-dihantar.component.css']
})
export class TarikhSampelDihantarComponent {

  delivery: any = ['Fizikal', 'Perkhidmatan Kurier']
  batch: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  user: userDTO = {} as userDTO
  batches: Batch[] = [];
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean

  staff: Staff = {} as Staff
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  importer: loginImporter = {} as loginImporter

  // sample: Sample = {} as Sample;
  samples: Sample[] = [];
  lepassubmit: boolean = false
  mesYaTidak: any
  k1Detail: K1Detail = {} as K1Detail;
  receivedDataFromChild: any;
  selectedBatches: any[] = [];

  constructor(


    private toastr: ToastrService,
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private authservice: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,

  ) { }

  displayedColumns: string[] = [
    'batchId',
    'tarikhSampelDihantar',
    'penghantaran',
    'action',
    'uipRegNo'
  ];

  dataSource!: MatTableDataSource<Batch[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
      })
    }

    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
      })
    }

    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
      })
    }
  }

  //////////////////////BUTTON UPDATE///////////////////////////
  updateBatch() {
    if (this.checkRequired()) {

      if (this.userRoleId == 1 || this.userRoleId == 3) {
        const addTarikhSampelDihantar = this.hantarSampelService.PostTarikhSampelDihantar(this.batch);
        const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
        const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

        forkJoin([
          addTarikhSampelDihantar,
          updateLtxTarikhSampelDihantar,
          updateBRTarikhSampelDihantar
        ]).subscribe(
          {
            next: ((res: any[]) => {
              this.toastr.success('Data berjaya disimpan', 'Berjaya', {
                timeOut: 7000,
              }),

                setTimeout(() => {
                  window.location.reload();
                });

            }),
            error: (e) => {
              this.toastr.error('Maklumat gagal dikemaskini');
            }
          }
        );
      }

      else if (this.userRoleId == 2) {

        const addTarikhSampelDihantar = this.hantarSampelService.PostUipTarikhSampelDihantar(this.batch);
        const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
        const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

        forkJoin([
          addTarikhSampelDihantar,
          updateLtxTarikhSampelDihantar,
          updateBRTarikhSampelDihantar
        ]).subscribe(
          {
            next: ((res: any[]) => {
              this.toastr.success('Data berjaya disimpan', 'Berjaya', {
                timeOut: 7000,
              }),

                setTimeout(() => {
                  window.location.reload();
                });

            }),

            error: (e) => {
              this.toastr.error('Maklumat gagal dikemaskini');
            }
          }
        );
      }
    }

  }

  //////////////////////CHECKING REQUIRED SEBELUM UPDATE///////////////////////////
  checkRequired() {
    if (
      // (this.batch.uipRegNo == null || this.batch.uipRegNo == '') ||
      (this.batch.dateSampleDelivered == null || this.batch.dateSampleDelivered == '') ||
      (this.batch.delivery == null || this.batch.delivery == '')
      // (this.batch.courierServices == null || this.batch.courierServices == '') ||
      // (this.batch.trackingNo == null || this.batch.trackingNo == '')
    ) {
      this.toastr.warning("Sila isi semua maklumat")
      return false;
    }
    return true;
  }


  changeDelivery(e: any) {

    if (e.target.value == "Perkhidmatan Kurier") {
      this.showDelivery = true
    }
    else if (e.target.value == "Fizikal") {
      this.showDelivery = false
      this.batch.courierServices = ""
      this.batch.trackingNo = ""
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
    for (const batch of this.receivedDataFromChild) {
      // if (batch.checked) {
      const id = batch.batchId;

      this.hantarSampelService.PutBatchPrinted(id).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
      // }
    }
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }

  //////////////////////////////SELEPAS BUTTON PILIH////////////////////
  receiveData(data: any) {
    this.receivedDataFromChild = data;
  }

  sendSample(){
    console.log('Data received in parent:', this.receivedDataFromChild);
    if (this.receivedDataFromChild.length > 0) {
      this.lepassubmit = true;

    }
  }


 //////////////////////////////GENERATE PDF WITH QR CODE////////////////////
  generatePDFWithQRCode() {

    // const selectedBatches = this.batches.filter((batch: { checked: any; }) => batch.checked);
    const selectedBatches = this.receivedDataFromChild;
    if (selectedBatches.length === 0) {
      alert('Please select at least one batch.');
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

      if (this.userRoleId == 1 || this.userRoleId == 3) {
        qrCode1.addData(batch1.batchId.toString());
      }

      else if (this.userRoleId == 2) {
        qrCode1.addData(batch1.batchId.toString() + "- UIP");
      }

      qrCode1.make();
      const qrCodeImgData1 = qrCode1.createDataURL(qrCodeSize);


      // Create QR codes 2
      let qrCodeImgData2;
      if (batch2) {
        const qrCode2 = QRCode(0, 'L');

        if (this.userRoleId == 1 || this.userRoleId == 3) {
          qrCode2.addData(batch2.batchId.toString());
        } else if (this.userRoleId == '2') {
          qrCode2.addData(batch2.batchId.toString() + "- UIP");
        }

        qrCode2.make();
        qrCodeImgData2 = qrCode2.createDataURL(qrCodeSize);
      }


      // Create QR codes 3

      let qrCodeImgData3;
      if (batch3) {
        const qrCode3 = QRCode(0, 'L');

        if (this.userRoleId == 1) {
          qrCode3.addData(batch3.batchId.toString());
        } else if (this.userRoleId == '2') {
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


      if (this.userRoleId == 1 || this.userRoleId == 3) {
        if (batch1.batchId) {
          doc.text("Batch Id : " + `${batch1.batchId}`, x + 16, y + 30);
        }
      }

      else if (this.userRoleId == 2) {
        if (batch1.batchId) {
          doc.text("Batch Id : " + `${batch1.batchId} - UIP`, x + 16, y + 30);
        }
      }


      if (batch2) {

        if (this.userRoleId == 1 || this.userRoleId == 3) {
          if (batch2.batchId) {
            doc.text("Batch Id : " + `${batch2.batchId}`, x + boxWidth + 16, y + 30);
          }
        } else if (this.userRoleId == 2) {
          if (batch2.batchId) {
            doc.text("Batch Id : " + `${batch2.batchId} - UIP`, x + boxWidth + 16, y + 30);
          }
        }
      }


      if (batch3) {

        if (this.userRoleId == 1 || this.userRoleId == 3) {
          if (batch3.batchId) {
            doc.text("Batch Id : " + `${batch3.batchId}`, x + 2 * boxWidth + 16, y + 30);
          }
        }

        else if (this.userRoleId == 2) {
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


  goBack() {
    window.location.reload(); 
    // window.history.back(); 
  }

}


 //////////////////////////////CODE SIMPAN////////////////////
// updateBatch() {
//   if (this.sampleForm.invalid) {
//     this.toastr.warning('Sila isi semua ruangan yang diperlukan');
//     return;
//   }


//   if (this.userRoleId == '1') {
//     const addTarikhSampelDihantar = this.hantarSampelService.PostTarikhSampelDihantar(this.batch);
//     const updateLtxTarikhSampelDihantar = this.drclimstrainingService.PutLtxTarikhSampelDihantar(this.batch);
//     const updateBRTarikhSampelDihantar = this.getahBongkahService.PutBRTarikhSampelDihantar(this.batch);

//     forkJoin([
//       addTarikhSampelDihantar,
//       updateLtxTarikhSampelDihantar,
//       updateBRTarikhSampelDihantar
//     ]).subscribe(
//       {
//         next: ((res: any[]) => {
//           this.toastr.success('Maklumat telah dikemaskini!');
//         }),
//         error: (e) => {
//           this.toastr.error('Maklumat gagal dikemaskini');
//         }
//       }
//     );
//   }

//   else if (this.userRoleId == '2') {
//     this.hantarSampelService.PostUipTarikhSampelDihantar(this.batch).subscribe(
//       (res) => {
//         this.toastr.success('Maklumat telah dikemaskini!');
//       },
//       (error) => {
//         this.toastr.error('Maklumat gagal dikemaskini');
//       }
//     );

//   }
// }

