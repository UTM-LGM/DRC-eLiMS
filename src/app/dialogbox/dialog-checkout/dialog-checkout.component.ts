import { Component } from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-checkout',
  templateUrl: './dialog-checkout.component.html',
  styleUrls: ['./dialog-checkout.component.css']
})
export class DialogCheckoutComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCheckoutComponent>
  ) { }


  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

}
