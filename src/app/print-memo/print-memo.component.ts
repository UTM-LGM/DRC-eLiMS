import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RubberType } from '../models/rubberType';
import { SampleType } from '../models/sampleType';
import { UipRefRunNo } from '../models/uipRefRunNo';
import { Staff } from '../models/staff';
import { Batch } from '../models/batch';
import { UipMemoRunNo } from '../models/uipMemoRunNo';
import { UipSampleRunNo } from '../models/uipSampleRunNo';
import { K1Detail } from '../models/k1Detail';
import { Sample } from '../models/sample';
import { ElimsService } from '../services/elims.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../User/user.service';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-print-memo',
  templateUrl: './print-memo.component.html',
  styleUrls: ['./print-memo.component.css']
})
export class PrintMemoComponent {
  
  batchData: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  samples: any
  batches: Batch[] = [];
  batchId: number;
  staffId: number;
  unit: any;
  loginAs: any;
  role: any
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  staff: Staff = {} as Staff
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
  isPrintMemoRoute: boolean = false;
  
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild('pdfContent2') pdfContent2!: ElementRef;
  
  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private hantarSampelService: HantarSampelService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPrintMemoRoute = event.url.includes('print-memo');
      console.log(this.isPrintMemoRoute)
      var params = this.route.snapshot.params;
      console.log(params);
    });
  
    
    
    
      this.route.params.subscribe(param => {
        this.batchId = param['batchId'];
        this.staffId = param['staffId'];
        
        console.log(this.batchId);
        console.log(this.staffId);


        this.hantarSampelService.getElimsSampleByBatchId(this.batchId).subscribe(data => {
          this.samples = data;
          console.log(data)
          this.selectedCheckboxCount = this.samples.length; // update the samples array with the response data
          this.selectedRubberType = this.samples[0].rubberType
        });
      })
      this.hantarSampelService.GetBatchByBatchIdStaff(this.batchId, this.staffId).subscribe(data => {
        console.log(data);
        this.batch = data.batch; // Assuming batch is a property in your data object
        this.staff = data.staff; // Assuming staff is a property in your data object
    });
    
      // this.hantarSampelService.GetElimsBatchByStaffId(this.staffId).subscribe(data => {
      //   console.log(data)
      //   this.staff = data
      // })
   

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })
  }

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
