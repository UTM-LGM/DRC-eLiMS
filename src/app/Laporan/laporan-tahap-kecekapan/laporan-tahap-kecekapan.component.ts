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
  sampleCountsLtx: any;
  sampleCountsBlockRubber: any;
  fromDate: Date | undefined = new Date();
  toDate: Date | undefined = new Date();
  isSearched: boolean = false;
  selectedCategory: string = '';
  categoriesLtx: any;
  categoriesBlockRubber: any;
  selectedType: string = '';
  
  constructor(
    private laporanService: LaporanService,
    private elimsService: ElimsService,
  ) { }

  ngOnInit() { }

  searchSample(): void {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    startDate = this.fromDate;
    endDate = this.toDate;

    this.laporanService.CountLevelEfficiencyLatex(startDate, endDate).subscribe(
      (data) => {
        this.sampleCountsLtx = data;
        console.log(this.sampleCountsLtx);
        this.isSearched = true;
        this.categoriesLtx = [
          { name: 'Count5WorkingDays', description: '5 hari bekerja', count: this.sampleCountsLtx.sampleCounts.Count5WorkingDays },
          { name: 'Count6To10WorkingDays', description: '> 6 hari - <= 10 hari', count: this.sampleCountsLtx.sampleCounts.Count6To10WorkingDays },
          { name: 'Count11To14WorkingDays', description: '> 11 hari - <= 14 hari', count: this.sampleCountsLtx.sampleCounts.Count11To14WorkingDays },
          { name: 'CountMoreThan15WorkingDays', description: '> 15 hari', count: this.sampleCountsLtx.sampleCounts.CountMoreThan15WorkingDays }
        ];
      },
      (error) => {
        console.error('Error fetching latex sample counts:', error);
      }
    );

    this.laporanService.CountLevelEfficiencyBlockRubber(startDate, endDate).subscribe(
      (data) => {
        this.sampleCountsBlockRubber = data;
        console.log(this.sampleCountsBlockRubber);
        this.isSearched = true;
        this.categoriesBlockRubber = [
          { name: 'Count5WorkingDays', description: '5 hari bekerja', count: this.sampleCountsBlockRubber.sampleCounts.Count5WorkingDays },
          { name: 'Count6To10WorkingDays', description: '> 6 hari - <= 10 hari', count: this.sampleCountsBlockRubber.sampleCounts.Count6To10WorkingDays },
          { name: 'Count11To14WorkingDays', description: '> 11 hari - <= 14 hari', count: this.sampleCountsBlockRubber.sampleCounts.Count11To14WorkingDays },
          { name: 'CountMoreThan15WorkingDays', description: '> 15 hari', count: this.sampleCountsBlockRubber.sampleCounts.CountMoreThan15WorkingDays }
        ];
      },
      (error) => {
        console.error('Error fetching block rubber sample counts:', error);
      }
    );
  }

  getRowClass(index: number): string {
    const classes = ['green-row', 'yellow-row', 'orange-row', 'red-row'];
    return classes[index % classes.length];
  }

  selectCategory(categoryName: string, type: string): void {
    this.selectedCategory = categoryName;
    this.selectedType = type;
  }

  getSelectedSamples(): any[] {
    if (this.selectedType === 'latex') {
      return this.sampleCountsLtx?.workingDayCounts?.[this.selectedCategory] || [];
    } else if (this.selectedType === 'blockRubber') {
      return this.sampleCountsBlockRubber?.workingDayCounts?.[this.selectedCategory] || [];
    }
    return [];
  }
}
