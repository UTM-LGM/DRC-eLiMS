import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { UserService } from '../../User/user.service';
import { HantarSampelService } from '../hantar-sampel.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ElimsService } from '../../services/elims.service';
import { RubberType } from '../../models/rubberType';
import { userDTO } from '../../models/userDTO';

import * as html2pdf from 'html2pdf.js';
import { Staff } from '../../models/staff';
import { loginImporter } from '../../models/loginImporters';

@Component({
  selector: 'app-surat-iringan',
  templateUrl: './surat-iringan.component.html',
  styleUrls: ['./surat-iringan.component.css']
})
export class SuratIringanComponent {
  @Input() sendBatchId: number;
  batch: Batch = {} as Batch;
  loginAs: any;
  userRoleId: any;
  selectedCheckboxCount: number = 0;
  batchId: number;
  emailRecipient: any[] = [];
  rubberTypes: RubberType[]
  samples: any;
  user: userDTO = {} as userDTO
  file: any | null
  selectedOption: string;
  groupedSamples: { key: string; items: any[] }[];
  isPreview: boolean = true;
  isFastTrack: boolean;
  roleForwarder: boolean = false
  roleUip: boolean = false
  roleImporter: boolean = false
  roleGtacr: boolean = false

  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter


  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,
    private authservice: AuthService,

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
        this.authservice.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false
        console.log(this.roleForwarder)
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

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true
      })
    }

    this.route.params.subscribe(param => {
      if (param['batchId'] != null) { this.batchId = param['batchId']; }
      else { this.batchId = this.sendBatchId; }

      // console.log(this.sendBatchId)
      // console.log(this.batchId);

      this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
        this.samples = data;
        console.log(this.samples[0].isFastTrack)
        this.isFastTrack = this.samples[0].isFastTrack
        this.groupSamplesByCompany();
        this.selectedCheckboxCount = this.samples.length;
      });
    })


    this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
      this.batch = data
      console.log(this.batch)
    })

    console.log(document.getElementById('pdfContent'))

  }

  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;

  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


  generatePdf(): void {
    this.isPreview = false;
    const element = document.getElementById('pdfContent');

    // Check if the element is null before proceeding
    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }

    // Set font size inline in the HTML content
    const content = element.innerHTML;
    const styledContent = `<div style="font-size: 12px;">${content}</div>`;

    var opt = {
      margin: [1.5, 0.5, 0.5, 0.5],
      filename: 'suratIringan.pdf',
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait',
        font: 'times',
      },
    };

    // Replace the original content with the modified content
    element.innerHTML = styledContent;

    // Generate PDF
    html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
      // Restore the original content
      element.innerHTML = content;

      // Save the blob or trigger a download as needed
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'suratIringan.pdf';
      downloadLink.click();
    }); html2pdf(element, opt);

  }


  // groupSamplesByCompany() {
  //   const groupedCollection = this.samples.reduce((accumulator, currentValue) => {
  //     const key = currentValue.importerName || currentValue.companyName;
  //     (accumulator[key] = accumulator[key] || []).push(currentValue);
  //     return accumulator;
  //   }, {});

  //   this.groupedSamples = Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key] }));
  //   console.log(this.groupedSamples);
  // }

  groupSamplesByCompany() {
    const groupedCollection = this.samples.reduce((accumulator, currentValue) => {
      const address = currentValue.importerAddress || currentValue.companyAddress;
      (accumulator[address] = accumulator[address] || []).push(currentValue);
      return accumulator;
    }, {});

    this.groupedSamples = Object.keys(groupedCollection).map(key => ({ key, items: groupedCollection[key] }));
    console.log(this.groupedSamples);
  }
}

