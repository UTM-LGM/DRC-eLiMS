import { Component, Input, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';


@Component({
  selector: 'app-view-maklumat-penghantaran',
  templateUrl: './view-maklumat-penghantaran.component.html',
  styleUrls: ['./view-maklumat-penghantaran.component.css'],

})
export class ViewMaklumatPenghantaranComponent {
  receivedDataFromChild: any;

  lepassubmit: boolean = false
  batches: Batch[] = [];

  
  ngOnInit() {}

  receiveData(data: any) {
    this.receivedDataFromChild = data;
    console.log('Data received in parent:', this.receivedDataFromChild);
  }

  
  displaySelected() {
    this.lepassubmit = true;

    // Filter batches to include only those with selected samples
    // this.batches = this.batches.filter(batch => batch.samples.some(sample => sample.checked));
    // Filter samples to include only the selected ones
    for (const batch of this.batches) {
      // for (const sample of batch.samples) {
      //   if (sample.checked) {
      //     const id = sample.k1DetailId;
      //     this.cetakWorksheet.PutWorksheetTestOn(id, this.k1Detail).subscribe(
      //       res => { }
      //     );

      //     this.k1Detail.worksheetTestOn
      //     console.log(this.k1Detail)

      //   }
      // }
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }


}
