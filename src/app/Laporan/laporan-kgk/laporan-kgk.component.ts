import { Component } from '@angular/core';
import { LaporanService } from '../laporan.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-laporan-kgk',
  templateUrl: './laporan-kgk.component.html',
  styleUrls: ['./laporan-kgk.component.css']
})
export class LaporanKgkComponent {

  fromDate: Date | undefined;
  toDate: Date | undefined;
  reportKgk: any;
  isSearched: boolean = false;

  constructor(
    private laporanService: LaporanService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() { }

  searchSample(): void {

    let startDate: Date | undefined = this.fromDate;
    let endDate: Date | undefined = this.toDate;

    this.laporanService.CountReportKgkSamples(startDate, endDate).subscribe(
      (data) => {
        this.reportKgk = data;
        this.isSearched = true;
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );
  }


  calculateFormattedDifference(result: number, drc: number): string {
    const difference = result - drc; // Calculate the difference without taking the absolute value
    const formattedDifference = this.decimalPipe.transform(Math.abs(difference), '1.2-2') || ''; // Format to two decimal places

 
    if (drc > result) {
      return '-' + formattedDifference;
    } else {
      return formattedDifference;
    }
  }


}




