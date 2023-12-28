import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-daftar-sampel',
  templateUrl: './dialog-daftar-sampel.component.html',
  styleUrls: ['./dialog-daftar-sampel.component.css']
})
export class DialogDaftarSampelComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }


}
