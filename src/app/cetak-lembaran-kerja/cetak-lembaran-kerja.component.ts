import { Component } from '@angular/core';
import { Batch } from '../models/batch';
import { Sample } from '../models/sample';
import { ElimsService } from '../services/elims.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cetak-lembaran-kerja',
  templateUrl: './cetak-lembaran-kerja.component.html',
  styleUrls: ['./cetak-lembaran-kerja.component.css']
})
export class CetakLembaranKerjaComponent {

  batches: Batch[] = [];
  samples: Sample[] = [];
  selectedBatchId: number;
  
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
    }); 
  }


}
