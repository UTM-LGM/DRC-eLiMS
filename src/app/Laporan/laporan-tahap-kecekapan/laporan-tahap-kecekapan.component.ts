import { Component } from '@angular/core';
import { LaporanService } from '../laporan.service';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-laporan-tahap-kecekapan',
  templateUrl: './laporan-tahap-kecekapan.component.html',
  styleUrls: ['./laporan-tahap-kecekapan.component.css']
})
export class LaporanTahapKecekapanComponent {

  sampleCounts: any;
  fromDate: Date | undefined = new Date(); // Initialize with current date
  toDate: Date | undefined = new Date(); // Initialize with current date
  isSearched: boolean = false;
// selectedCategory: string | null = null; // Variable to store the selected category
  selectedCategory: string = '';
categories:any; 

  constructor(
    private laporanService: LaporanService,
    private elimsService: ElimsService,
  ) { }


  ngOnInit() {

  }

  searchSample(): void {
    // Determine which parameters to include based on the selected criteria
    let startDate: Date | undefined;
    let endDate: Date | undefined;

      startDate = this.fromDate;
      endDate = this.toDate;



    this.laporanService.CountLevelEfficiency(startDate, endDate).subscribe(
      (data) => {
        this.sampleCounts = data;
        console.log(this.sampleCounts);
        this.isSearched = true;
        this.categories = [
            { name: 'Count5WorkingDays', description: '5 hari bekerja', count: this.sampleCounts.sampleCounts.Count5WorkingDays },
            { name: 'Count6To10WorkingDays', description: '> 6 hari - <= 10 hari', count: this.sampleCounts.sampleCounts.Count6To10WorkingDays },
            { name: 'Count11To14WorkingDays', description: '> 11 hari - <= 14 hari', count: this.sampleCounts.sampleCounts.Count11To14WorkingDays },
            { name: 'CountMoreThan15WorkingDays', description: '> 15 hari', count: this.sampleCounts.sampleCounts.CountMoreThan15WorkingDays }
        ]; 
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );


    
  }


  getRowClass(index: number): string {
    const classes = ['green-row', 'yellow-row', 'orange-row',  'red-row'];
    return classes[index % classes.length];
  }

  
  selectCategory(categoryName: string): void {
      this.selectedCategory = categoryName;
  }
  // Count5WorkingDays(): void {
  //   this.selectedCategory = 'Count5WorkingDays';
  // }


  // Count6To10WorkingDays(): void {
  //   this.selectedCategory = 'Count6To10WorkingDays';
  // }

  // Count11To15WorkingDays(): void {
  //   this.selectedCategory = 'Count11To15WorkingDays';
  // }

  // CountMoreThan16WorkingDays(): void {
  //   this.selectedCategory = 'CountMoreThan16WorkingDays';
  // }

}


