import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from '../../services/auth/auth.service';
import { ElimsService } from '../../services/elims.service';
import { ActivatedRoute } from '@angular/router';
import { Batch } from '../../models/batch';
import { Sample } from '../../models/sample';
import { Staff } from '../../models/staff';
import { RubberType } from '../../models/rubberType';
import { SampleType } from '../../models/sampleType';
import { UipRefRunNo } from '../../models/uipRefRunNo';
import { UipSampleRunNo } from '../../models/uipSampleRunNo';
import { UipMemoRunNo } from '../../models/uipMemoRunNo';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { K1Detail } from 'src/app/models/k1Detail';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent {


  batchData: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  samples: any
  batches: Batch[] = [];

  batchId: number;
  unit: any;
  loginAs: any;
  role: any
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  staff: Staff = {} as Staff;

  rubberTypes: RubberType[]
  sampleType: SampleType = {} as SampleType
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  refLableSamples: any
  uipRefRunNoes: any
  uipbkhRefRunNoes: any
  sampleCategory: string
  

  selectedCheckboxCount: number = 0;
  selectedRubberType: string = "";
  batch: Batch = {} as Batch;
  rubberType: any

  uipMemoRunNo: UipMemoRunNo = {} as UipMemoRunNo
  uipSampleRunNo: UipSampleRunNo = {} as UipSampleRunNo
  uipMemoRunNoes: any
  uipSampleRunNoes: any
  emailRecipient: any[]=[];
  file: any | null
  k1Detail: K1Detail = {} as K1Detail
  emailRecord : any[] = []
  sampleCode:string

  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild('pdfContent2') pdfContent2!: ElementRef;

  // @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

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
      this.roleId = this.authService.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
      console.log(res)
      this.authService.changeUser(res);
      this.staff = res

      this.route.params.subscribe(param => {
        this.batchId = param['batchId'];

        console.log(this.batchId);


        this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
          this.samples = data;
          // this.sampleCode = data.rub.sampleCode
          // this.sampleCategory = data.rub.sampleCategory
          
          console.log(this.samples)
          this.selectedCheckboxCount = this.samples.length; // update the samples array with the response data
          //this.selectedRubberType = this.samples[0].rubberType
        });

      })


      this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
        this.batch = data
        // this.staff = resBatchStaff.staff
        console.log(this.batch)
      })

      this.hantarSampelService.getEmailStaff(this.staff.staffId).subscribe( emelRes => {
        if (Array.isArray(emelRes) && emelRes.length > 0) {
          emelRes.forEach(item => {
            if (item.emailLgm) {
              this.emailRecipient.push(item.emailLgm);
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

  generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
    let yOffset = 20; // Initial vertical offset
    let currentPage = 1;

    function addPage() {
      pdf.addPage();
      yOffset = 20;
      currentPage++;
    }

    function addImageSegmentToPage(imageData: string, startY: number, height: number) {
      pdf.addImage(imageData, 'PNG', 20, startY, pdfWidth, height, '', 'FAST');
      yOffset = startY + height;
    }

    // Capture the content of the first page
    html2canvas(this.pdfContent.nativeElement, { scale: 2 }).then((canvas1) => {
      const imgData1 = canvas1.toDataURL('image/png');

      // Calculate the height of the content
      const imgProps1 = pdf.getImageProperties(imgData1);
      const pdfHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;

      let startY = 10;

      const remainingHeight = pdf.internal.pageSize.getHeight() - startY;
      const segmentHeight = remainingHeight < pdfHeight1 ? remainingHeight : pdfHeight1;

      addImageSegmentToPage(imgData1, startY, segmentHeight);

      // Capture the content of the second page
      if (this.pdfContent2.nativeElement.innerHTML.trim()) {
        addPage(); // Add a new page for the second content
        startY = 20;

        html2canvas(this.pdfContent2.nativeElement, { scale: 2 }).then((canvas2) => {
          const imgData2 = canvas2.toDataURL('image/png');
          const imgProps2 = pdf.getImageProperties(imgData2);
          const pdfHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;

          addImageSegmentToPage(imgData2, startY, pdfHeight2);

          // Save or open the PDF as needed
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
        });
      } else {
        // Save or open the PDF as needed if there is no content on the second page
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      }
    });

    this.emailRecipient = ["nurizzatul@lgm.gov.my"]
  

    console.log(this.emailRecipient)
  
this.hantarSampelService.notificationMemo(this.staff.staffId, this.batchId, this.emailRecipient).subscribe(
  email => {
    console.log("Email for request status 009 has been sent to recipient");
  },
  emailErr => {
    console.log("Email for request status 009 failed to send to the recipient");
  }
);


  }



  calculateSelectedCheckboxCount() {
    // Assuming that your samples have a unique "Bil" value
    this.selectedCheckboxCount = this.samples.length;
  }



  // images
  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.batch.receipt = event.target.files[0].name;
    console.log(this.file);
  }

}
