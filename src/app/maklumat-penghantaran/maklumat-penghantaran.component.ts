import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Batch } from '../models/batch';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';
import { UserService } from '../User/user.service';
import { AuthService } from '../services/auth/auth.service';
import { Sample } from '../models/sample';
import { userDTO } from '../models/userDTO';
import { UipRefRunNo } from '../models/uipRefRunNo';
import { UipbkhRefRunNo } from '../models/uipbkhRefRunNo';
import { Staff } from '../models/staff';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import * as QRCode from 'qrcode-generator';
import jsPDF from 'jspdf';
import { loginImporter } from '../models/loginImporters';

@Component({
  selector: 'app-maklumat-penghantaran',
  templateUrl: './maklumat-penghantaran.component.html',
  styleUrls: ['./maklumat-penghantaran.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({
        height: '0px',
        visibility: 'hidden'
      })),
      state('expanded', style({
        'min-height': '48px',
        height: '*',
        visibility: 'visible'
      })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MaklumatPenghantaranComponent {

  @Output() selectedSampleToSend = new EventEmitter<any>();
  @Input() batch: any;

  expandedElement: Sample | null;
  displayedColumns: string[] = []

  dataSource!: MatTableDataSource<Batch>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // batch: Batch = {} as Batch;
  user: userDTO = {} as userDTO
  batches: any;
  showDelivery: boolean = false
  sampleForm: any;
  loginAs: any;
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  selectedBatches: any[] = [];
  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  batchId: number
  username: string

  samples: Sample[] = [];

  checkAll: boolean = false
  lepassubmit: boolean = false
  mesYaTidak: any

  constructor
    (
      private authservice: AuthService,
      private hantarSampelService: HantarSampelService,
      private userService: UserService,
    ) { }

  ngOnInit() {

    // console.log(this.batch)

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authservice.getSessionUsername()
      this.userRoleId = this.authservice.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {

      this.displayedColumns = [
        'qrbatchId',
        'batchId',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];

      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        // console.log(this.user)
        this.username = this.user.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          // console.log(res)
          this.batches = res;

          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }))

      })
    }
    else if (this.userRoleId == 2) {

      this.displayedColumns = [

        'qrbatchId',
        'batchId',
        'uipRegNo',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];

      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
        console.log(this.staff)
        this.username = this.staff.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;

          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;


        }))

      })
    }

    else if (this.userRoleId == 3) {
      this.displayedColumns = [

        'qrbatchId',
        'batchId',
        // 'uipRegNo',
        'date',
        'delivery',
        'courierServices',
        'trackingNo',

      ];
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authservice.changeUser(res);
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        console.log(this.importer)
        this.username = this.importer.username

        this.hantarSampelService.GetElimsBatchBySendByNotNull(this.username).subscribe((res => {
          console.log(res)
          this.batches = res;

          this.dataSource = new MatTableDataSource<Batch>(this.batches);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }))

      })
    }

  }

  sendSample() {
    this.lepassubmit = true;
    console.log(this.selectedBatches)
    // const dataToSend = { message: this.selectedBatches };
    // console.log(dataToSend);
    this.selectedSampleToSend.emit(this.selectedBatches);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /////////////////////////GENERATE QR CODE//////////////////////// TAK PAKAI
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


  ///////////////////////CHECK ALL///////////////////////// TAK PAKAI
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


  ///////////////////////CHECK SATU2///////////////////////// PAKAI
  checkSingleChanged() {
    // this.selectedBatches: any[] = [];
    this.selectedBatches = [];
    for (const batch of this.batches as any[]) {
      if (batch.checked) {
        this.selectedBatches.push(batch);
        this.selectedSampleToSend.emit(this.selectedBatches);
      }
    }
    console.log(this.selectedBatches);
  }





  isAtLeastOneCheckboxChecked(): boolean {
    return this.batches.some((batch: { checked: any; }) => batch.checked);
  }




  onNoClick() {
    this.mesYaTidak = "tidak"
  }

}
