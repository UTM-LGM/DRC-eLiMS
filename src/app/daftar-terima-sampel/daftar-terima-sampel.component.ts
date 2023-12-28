import { Component } from '@angular/core';
import { Batch } from '../models/batch';
import { ElimsService } from '../services/elims.service';
import { Sample } from '../models/sample';
import { K1Detail } from '../models/k1Detail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daftar-terima-sampel',
  templateUrl: './daftar-terima-sampel.component.html',
  styleUrls: ['./daftar-terima-sampel.component.css']
})
export class DaftarTerimaSampelComponent {

  batch: Batch = {} as Batch;
  samples: Sample[] = [];
  batches: Batch[] = [];
  k1Details: K1Detail[] = [];
  batchId : number;
  selectedBatchId: number;
  unregisteredSampleCount: number = 0;

  constructor(
    private elimsService: ElimsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.elimsService.GetElimsAllBatch().subscribe(data => {
      this.batches = data
    });

  }


  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res)
      this.samples = res;
      this.calculateUnregisteredSampleCount();
      
    }); 
  }


  calculateUnregisteredSampleCount() {

    this.unregisteredSampleCount = this.samples.filter(sample => !sample.isRegistered).length;
  }

}
