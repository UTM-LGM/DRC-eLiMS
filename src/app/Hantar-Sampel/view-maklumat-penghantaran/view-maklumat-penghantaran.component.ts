import { Component } from '@angular/core';
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
    for (const batch of this.batches) {
      batch.samples = batch.samples.filter(sample => sample.checked);
    }
  }

}
