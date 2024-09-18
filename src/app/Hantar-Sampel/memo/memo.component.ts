import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ElimsService } from '../../services/elims.service';
import { ActivatedRoute } from '@angular/router';
import { Batch } from '../../models/batch';
import { Staff } from '../../models/staff';
import { RubberType } from '../../models/rubberType';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent {


  staff: Staff = {} as Staff;
  batches: Batch[] = [];
  rubberTypes: RubberType[]
  emailRecipient: any[] = [];
  samples: any
  batchId: number;
  loginAs: any;
  userRoleId: any;
  refLableSamples: any
  selectedCheckboxCount: number = 0;
  batch: Batch = {} as Batch;
  file: any | null
  isPreview: boolean = true;
  memoPrinted: number; 
  isPrintButtonClicked = false; 

  // batchData: Batch = {} as Batch;
  // sample: Sample = {} as Sample;
  // unit: any;
  // role: any
  // roleForwarder: boolean
  // roleUip: boolean
  // sampleType: SampleType = {} as SampleType
  // uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  // uipRefRunNoes: any
  // uipbkhRefRunNoes: any
  // sampleCategory: string
  // selectedRubberType: string = "";
  // rubberType: any
  // uipMemoRunNo: UipMemoRunNo = {} as UipMemoRunNo
  // uipSampleRunNo: UipSampleRunNo = {} as UipSampleRunNo
  // uipMemoRunNoes: any
  // uipSampleRunNoes: any
  // k1Detail: K1Detail = {} as K1Detail
  // emailRecord: any[] = []
  // sampleCode: string
  // signatureImageBase64: SafeResourceUrl;
  // signaturePath: string;

  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild('pdfContent2') pdfContent2!: ElementRef;

  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,
  ) {

  }

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
      console.log(res)
      this.authService.changeUser(res);
      this.staff = res

      // this.signaturePath = res.signature
      // this.signaturePath = "https://api02.lgm.gov.my/ApiElims/wwwroot/signature/sign_ezmy.jpg"

      this.route.params.subscribe(param => {
        this.batchId = param['batchId'];

        console.log(this.batchId);

        this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
          this.batches = data
          // this.staff = resBatchStaff.staff
          console.log(this.batches)
        })


        this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
          this.samples = data;
          
          // Sort the samples array based on k1_detail_id
          this.samples.sort((a, b) => a.k1DetailId - b.k1DetailId);
          console.log(this.samples);
        
          this.selectedCheckboxCount = this.samples.length;
        });
        

      })

      ///////////////CODE FOR GET EMAIL STAFF////////////////
        this.hantarSampelService.getEmailStaff(this.staff.staffId).subscribe(emelRes => {
          if (Array.isArray(emelRes) && emelRes.length > 0) {
            emelRes.forEach(item => {
              if (item.emailLgm) {
                this.emailRecipient.push(item.emailLgm);
                console.log(this.emailRecipient)
              }
            });
          }
        })

    });


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })
  }


  // generatePDF() {
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
  //   let yOffset = 20; // Initial vertical offset
  //   let currentPage = 1;

  //   function addPage() {
  //     pdf.addPage();
  //     yOffset = 20;
  //     currentPage++;
  //   }

  //   function addImageSegmentToPage(imageData: string, startY: number, height: number) {
  //     pdf.addImage(imageData, 'PNG', 20, startY, pdfWidth, height, '', 'FAST');
  //     yOffset = startY + height;
  //   }

  //   // Capture the content of the first page
  //   html2canvas(this.pdfContent.nativeElement, { scale: 2 }).then((canvas1) => {
  //     const imgData1 = canvas1.toDataURL('image/png');

  //     // Calculate the height of the content
  //     const imgProps1 = pdf.getImageProperties(imgData1);
  //     const pdfHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;

  //     let startY = 10;

  //     // // Check if content exceeds the first page
  //     // if (pdfHeight1 > pdf.internal.pageSize.getHeight() - startY) {
  //     //   addPage();
  //     //   startY = 20;
  //     // }

  //     const remainingHeight = pdf.internal.pageSize.getHeight() - startY;
  //     const segmentHeight = remainingHeight < pdfHeight1 ? remainingHeight : pdfHeight1;

  //     addImageSegmentToPage(imgData1, startY, segmentHeight);

  //     // Capture the content of the second page
  //     if (this.pdfContent2.nativeElement.innerHTML.trim()) {
  //       addPage(); // Add a new page for the second content
  //       startY = 20;

  //       html2canvas(this.pdfContent2.nativeElement, { scale: 2 }).then((canvas2) => {
  //         const imgData2 = canvas2.toDataURL('image/png');
  //         const imgProps2 = pdf.getImageProperties(imgData2);
  //         const pdfHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;

  //         addImageSegmentToPage(imgData2, startY, pdfHeight2);

  //         // Save or open the PDF as needed
  //         const pdfBlob = pdf.output('blob');
  //         const pdfUrl = URL.createObjectURL(pdfBlob);
  //         window.open(pdfUrl, '_blank');
  //       });
  //     } else {
  //       // Save or open the PDF as needed if there is no content on the second page
  //       const pdfBlob = pdf.output('blob');
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl, '_blank');
  //     }


  //   });

  //   this.hantarSampelService.PostFileK1Detail(this.batchId, this.file).subscribe(() => {
  //     console.log('File save successfully');
  //   },
  //     error => {
  //       console.error('Error save file:', error);
  //     })

  //   this.emailRecipient =  ["izzatuliffah9@gmail.com"]
  //   //console.log(this.emailRecipient)
  //   this.hantarSampelService.InformRequest009(this.staff.staffId, this.emailRecipient).subscribe(
  //     email => {
  //       console.log("Email for request status 009 has been sent to recipient")
  //     },
  //     emailErr => {
  //       console.log("Email for request status 009 failed to send to the recipient")
  //     }
  //             );

  // }

  // generatePDF() {

  //   this.hantarSampelService.PutMemoPrinted(this.batchId).subscribe(() => { })


  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
  //   let yOffset = 20; // Initial vertical offset
  //   let currentPage = 1;

  //   function addPage() {
  //     pdf.addPage();
  //     yOffset = 20;
  //     currentPage++;
  //   }

  //   function addImageSegmentToPage(imageData: string, startY: number, height: number) {
  //     pdf.addImage(imageData, 'PNG', 20, startY, pdfWidth, height, '', 'FAST');
  //     yOffset = startY + height;
  //   }

  //   // Capture the content of the first page
  //   html2canvas(this.pdfContent.nativeElement, { scale: 2 }).then((canvas1) => {
  //     const imgData1 = canvas1.toDataURL('image/png');

  //     // Calculate the height of the content
  //     const imgProps1 = pdf.getImageProperties(imgData1);
  //     const pdfHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;

  //     let startY = 10;

  //     const remainingHeight = pdf.internal.pageSize.getHeight() - startY;
  //     const segmentHeight = remainingHeight < pdfHeight1 ? remainingHeight : pdfHeight1;

  //     addImageSegmentToPage(imgData1, startY, segmentHeight);

  //     // Capture the content of the second page
  //     if (this.pdfContent2.nativeElement.innerHTML.trim()) {
  //       addPage(); // Add a new page for the second content
  //       startY = 20;

  //       html2canvas(this.pdfContent2.nativeElement, { scale: 2 }).then((canvas2) => {
  //         const imgData2 = canvas2.toDataURL('image/png');
  //         const imgProps2 = pdf.getImageProperties(imgData2);
  //         const pdfHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;

  //         addImageSegmentToPage(imgData2, startY, pdfHeight2);

  //         // Save or open the PDF as needed
  //         const pdfBlob = pdf.output('blob');
  //         const pdfUrl = URL.createObjectURL(pdfBlob);
  //         window.open(pdfUrl, '_blank');
  //       });
  //     } else {
  //       // Save or open the PDF as needed if there is no content on the second page
  //       const pdfBlob = pdf.output('blob');
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl, '_blank');
  //     }
  //   });

  //   // this.emailRecipient = ["nurizzatul@lgm.gov.my"]


  //   console.log(this.batches[0].memoPrinted)

  //   if (this.batches[0].memoPrinted != true) {
  //     this.hantarSampelService.notificationMemo(this.staff.staffId, this.batchId, this.emailRecipient).subscribe(
  //       email => {
  //         console.log("Email for request status 009 has been sent to recipient");
  //         // this.ngOnInit();
  //       },
  //       emailErr => {
  //         console.log("Email for request status 009 failed to send to the recipient");
  //       }
  //     );

  //   }else {
  //     console.log("memo printed is true");
  //   }

  //   console.log(this.emailRecipient);
  // }

  print() {

    // this.emailRecipient = ["nurizzatul@lgm.gov.my"];

    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;


    setTimeout(() => {


      console.log(this.batches[0].memoPrinted)

      if (this.batches[0].memoPrinted != true) {
        this.hantarSampelService.notificationMemo(this.staff.staffId, this.batchId, this.emailRecipient).subscribe(
          email => {
            console.log("Email for request status 009 has been sent to recipient");
            this.hantarSampelService.PutMemoPrinted(this.batchId).subscribe(() => { window.location.reload(); })

            // this.ngOnInit();
          },
          emailErr => {
            console.log("Email for request status 009 failed to send to the recipient");
          }
        );

      } else {
        console.log("memo printed is true");
      }

    }, 1000);
    console.log(this.emailRecipient)
    // }
  }



  generatePdfMemo(): void {
    this.isPreview = false;
    const element = document.getElementById('pdfContent');

    // Check if the element is null before proceeding
    if (!element) {
      console.error("Element with ID 'pdfContent' not found.");
      return;
    }

    // Set font size inline in the HTML content
    const content = element.innerHTML;
    const styledContent = `<div style="font-size:2px;">${content}</div>`;

    var opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'memo.pdf',
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
      downloadLink.download = 'memo.pdf';
      downloadLink.click();
    }); html2pdf(element, opt);


  }

  calculateSelectedCheckboxCount() {
    this.selectedCheckboxCount = this.samples.length;
  }


  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.batch.receipt = event.target.files[0].name;
    console.log(this.file);
  }

}


