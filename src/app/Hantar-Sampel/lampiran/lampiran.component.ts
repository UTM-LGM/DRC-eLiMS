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
import { Staff } from 'src/app/models/staff';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-lampiran',
  templateUrl: './lampiran.component.html',
  styleUrls: ['./lampiran.component.css']
})
export class LampiranComponent {
  @Input() sendBatchId: number;
  batch: Batch = {} as Batch;
  loginAs: any;
  userRoleId: any;
  selectedCheckboxCount: number = 0;
  batchId: number;
  emailRecipient: any[] = [];
  rubberTypes: RubberType[];
  samples: any;
  users: any;
  groupedSamples: any[]; // Add this variable
  kodStesen:string
  user: userDTO = {} as userDTO;
  companies: any;
  stesen:any
  namaStesen:any
  roleForwarder: boolean = false
  roleUip: boolean = false
  roleImporter: boolean = false
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
      this.loginAs = this.authService.getSessionUsername();
      this.userRoleId = this.authService.getSessionRole()
    } else {
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

      this.route.params.subscribe(param => {
        if (param['batchId'] != null) { this.batchId = param['batchId']; }
        else { this.batchId = this.sendBatchId; }


        this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
          this.samples = data;
          console.log(this.samples);
          this.selectedCheckboxCount = this.samples.length;
          this.kodStesen = this.samples[0].customNo.slice(0,3)
          console.log(this.kodStesen)
          this.elimsService.GetKeteranganByKodStesen(this.kodStesen).subscribe( resKeterangan => {
           console.log(resKeterangan)
           this.stesen = resKeterangan
           this.namaStesen = this.stesen.keterangan
           console.log(this.namaStesen)
          })
          // Call the grouping function after samples are loaded
          this.groupSamplesByCompany();
        });
      });

      this.elimsService.GetRefRubberTypes().subscribe(data => {
        this.rubberTypes = data;
        console.log(this.rubberTypes);
      });
    // });

  }

  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;

  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  // generatePdf(): void {
  //   const element = document.getElementById('pdfContent2');
  //   console.log(element);

  //   // Introduce a slight delay (e.g., 500 milliseconds) to allow the content to render
  //   setTimeout(() => {
  //     const opt = {
  //       margin: [1, 0.5, 0.5, 0.5],
  //       filename: 'lampiran.pdf',
  //       image: { type: 'jpeg', quality: 1.0 },
  //       html2canvas: { scale: 2, scrollY: 0, scrollX: 0, windowWidth: document.body.scrollWidth, windowHeight: document.body.scrollHeight },
  //       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //     };

  //     html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
  //       const downloadLink = document.createElement('a');
  //       downloadLink.href = URL.createObjectURL(pdfBlob);
  //       downloadLink.download = 'lampiran.pdf';
  //       downloadLink.click();
  //     });
  //     html2pdf(element, opt);
  //   }, 500); // Adjust the delay as needed
  // }

  generatePdf(): void { 
    // this.isPreview = false;
    const element = document.getElementById('pdfContent2');
  
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
      filename: 'Lampiran.pdf',
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
    });html2pdf(element, opt);
  
   
  }



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
