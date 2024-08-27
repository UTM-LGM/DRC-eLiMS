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

  ngOnInit() {}

  searchSample(): void {
    // Determine which parameters to include based on the selected criteria
    let startDate: Date | undefined = this.fromDate;
    let endDate: Date | undefined = this.toDate;
    // Call the API with the selected parameters
    this.laporanService.CountReportKgkSamples(startDate, endDate).subscribe(
      (data) => {
        this.reportKgk = data;
        // console.log(this.reportKgk);
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

  // Check if drc is greater than result, then prepend a negative sign
  if (drc > result) {
    return '-' + formattedDifference;
  } else {
    return formattedDifference;
  }
}


}




