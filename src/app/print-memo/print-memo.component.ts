import { Component, ElementRef, ViewChild } from '@angular/core';
import { RubberType } from '../models/rubberType';
import { Staff } from '../models/staff';
import { ElimsService } from '../services/elims.service';
import { ActivatedRoute } from '@angular/router';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';

@Component({
  selector: 'app-print-memo',
  templateUrl: './print-memo.component.html',
  styleUrls: ['./print-memo.component.css']
})
export class PrintMemoComponent {

  samples: any
  batchId: number;
  staff: Staff = {} as Staff
  rubberTypes: RubberType[]
  refLableSamples: any
  selectedCheckboxCount: number = 0;
  selectedRubberType: string = "";


  @ViewChild('pdfContent') pdfContent!: ElementRef;

  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private hantarSampelService: HantarSampelService,

  ) {
  }

  ngOnInit() {
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   this.isPrintMemoRoute = event.url.includes('print-memo');
    //   console.log(this.isPrintMemoRoute)
    //   var params = this.route.snapshot.params;
    //   console.log(params);
    // });

    this.route.params.subscribe(param => {
      this.batchId = param['batchId'];
      // this.staffId = param['staffId'];

      console.log(this.batchId);
      // console.log(this.staffId);


      this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
        this.samples = data;
        console.log(data)

        this.selectedCheckboxCount = this.samples.length; // update the samples array with the response data
        console.log(this.selectedCheckboxCount)
        this.selectedRubberType = this.samples[0].rubberType
        console.log(this.selectedRubberType)
      });
    })

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

  }

  print() {

    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  }

}
