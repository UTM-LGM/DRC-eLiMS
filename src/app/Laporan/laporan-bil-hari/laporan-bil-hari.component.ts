import { Component } from '@angular/core';
import { LaporanService } from '../laporan.service';

@Component({
  selector: 'app-laporan-bil-hari',
  templateUrl: './laporan-bil-hari.component.html',
  styleUrls: ['./laporan-bil-hari.component.css']
})
export class LaporanBilHariComponent {


  fromDate: Date | undefined;
  toDate: Date | undefined;
  reportKgk: any;
  isSearched: boolean = false;


  constructor(
    private laporanService: LaporanService,
  ) { }


  ngOnInit() { }


  searchSample(): void {

    let startDate: Date | undefined = this.fromDate;
    let endDate: Date | undefined = this.toDate;

    this.laporanService.CountReportKgkSamples(startDate, endDate).subscribe(
      (data) => {
        this.reportKgk = data;
        console.log(this.reportKgk);
        this.isSearched = true;
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );

  }


}
