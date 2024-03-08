import { Component } from '@angular/core';
import { K1Detail } from '../models/k1Detail';
import { ElimsService } from '../services/elims.service';
import { Router } from '@angular/router';
import { Batch } from '../models/batch';
import { Sample } from '../models/sample';

@Component({
  selector: 'app-sampel-belum-terima',
  templateUrl: './sampel-belum-terima.component.html',
  styleUrls: ['./sampel-belum-terima.component.css']
})
export class SampelBelumTerimaComponent {

  k1Details: K1Detail[] = [];
  samples: Sample[] = [];
  batchId : number;
  batches: Batch[] = [];
  selectedBatchId: number;

  constructor(
    private elimsService: ElimsService,
    private router: Router
  ) { }
  
  ngOnInit() {
    // Call the GetElimsAllBatch function
    // this.elimsService.GetElimsAllBatch().subscribe(data => {
    //   this.batches = data;
  
    //   // Check if there are batches available
    //   if (this.samples && this.samples.length > 0) {
    //     // Call sampleList with the first batchId as an example
    //     this.sampleList(this.batches[0].batchId);
    //   }
    // });
  }
  
  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
  
    // Call the GetElimsSamplesByBatchId function
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res);
      this.samples = res;
    });
  }
  

}
