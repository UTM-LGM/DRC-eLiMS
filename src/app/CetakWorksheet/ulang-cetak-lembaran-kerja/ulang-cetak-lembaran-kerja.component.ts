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

    'select',
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

  batches: Batch[] = [];
  samples: Sample[] = [];
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  k1Detail: K1Detail = {} as K1Detail;
  sample: Sample = {} as Sample;
  lepassubmit: boolean = false
  isPrint: boolean = false
  // statusCodeId: number = 0;
  statusCodeId: number[] = []; 
  selectedSamples: Sample[] = [];
  mesYaTidak: any
  batch: any;
  listk1DetailId: any[] = []
  customNo: string = '';
  customFields: { value: string }[] = [];

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheet: CetakWorksheetService,

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
      this.loadBatches();
    }

    // Handle multiple status codes
    this.statusCodeId = [4,5,6,7];
    this.elimsService.GetElimsAllBatch2(this.statusCodeId).subscribe(data => {
      console.log('Received batches:', data); // Debug log
      this.batches = data;
      this.dataSource = new MatTableDataSource<Batch>(this.batches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


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


  toggleBatchSelection(batch: Batch, isSelected: boolean) {
    for (const sample of batch.samples) {
      sample.checked = isSelected;
    }
    this.updateSelectedSamples();
  }

  updateSelectedSamples() {
    this.selectedSamples = [];
    for (const batch of this.batches) {
      for (const sample of batch.samples) {
        if (sample.checked) {
          this.selectedSamples.push(sample);
        }
      }
    }
    // console.log(this.selectedSamples);
  }


  displaySelected() {
    this.lepassubmit = true;
    for (const batch of this.batches) {
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }


  generatePDF() {

    for (const sample of this.selectedSamples) {
      this.cetakWorksheet.PutWorksheetTestOn(sample.k1DetailId, this.k1Detail).subscribe(
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


  searchByCustomNos() {
    // Concatenate the current customNo with customFields values
    const customNos = [this.customNo, ...this.customFields.map(field => field.value)];
    // Remove duplicates by converting to Set and then back to array
    const uniqueCustomNos = [...new Set(customNos)];

    // Clear previous results
    this.selectedSamples = [];

    // Perform search for each unique custom number
    uniqueCustomNos.forEach(customNo => {
      this.elimsService.GetElimsSamplesByCustomNo(customNo).subscribe(res => {
        console.log(res);
        this.selectedSamples.push(...res.filter(sample => sample.statusCodeId === 4));
      });
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  filterByCustomNo(event: any) {
    const customNo = event.target.value;
    if (customNo) {
      const filteredBatches = this.batches.filter(batch => batch.samples.customNo.toString() == (customNo));
      this.dataSource = new MatTableDataSource<Batch>(filteredBatches);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadBatches();
    }

    
  }

  addField() {
    this.customFields.push({ value: '' });
  }

  loadBatches() {
    this.dataSource = new MatTableDataSource<Batch>(this.batches);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  onYesClick() {
    for (const sample of this.selectedSamples) {
      const id = sample.k1DetailId;
      this.cetakWorksheet.PutCetakLembaranKerja(id, this.k1Detail).subscribe(
        res => { this.mesYaTidak = "yes" }
      );
    }
    setTimeout(() => {
      window.location.reload();
    },1000); // Delay in milliseconds (2000ms = 2s)
  }

  onNoClick() {
    this.mesYaTidak = "tidak"
  }


  isAnyCheckboxSelected(): boolean {
    return this.selectedSamples.some(sample => sample.checked);

  }

  // Add a method to check if the button should be enabled
  isButtonEnabled(): boolean {
    // Enable if at least one checkbox is selected or No. Borang Kastam field is filled
    return this.isAnyCheckboxSelected() || this.customNo.trim() !== '';
  }



  addFieldIfEmpty(index: number = -1) {
    if (index === -1) {
      // Check if the first field is empty
      if (this.customNo.trim() !== '' && this.customFields.length === 0) {
        // Add a new field
        this.customFields.push({ value: '' });
      }
    } else {
      // Check if the current field is not the last field and is not empty
      if (index === this.customFields.length - 1 && this.customFields[index].value.trim() !== '') {
        // Add a new field if the last field is not empty
        this.customFields.push({ value: '' });
      }
    }
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


}




