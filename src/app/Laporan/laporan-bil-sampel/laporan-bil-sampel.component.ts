import { Component } from '@angular/core';
import { LaporanService } from '../laporan.service';
import { RubberType } from 'src/app/models/rubberType';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-laporan-bil-sampel',
  templateUrl: './laporan-bil-sampel.component.html',
  styleUrls: ['./laporan-bil-sampel.component.css']
})
export class LaporanBilSampelComponent {

  selectedDate: string;
  sampleCounts: any;
  fromDate: Date | undefined = new Date(); // Initialize with current date
  toDate: Date | undefined = new Date(); // Initialize with current date
  
  rubberTypes: RubberType[];
  rubberTypeId: any;
  typeCodes: any
  typeCodeId : any

  searchBy: string[] = []
  showRubberType: boolean = false
  showDate: boolean = false
  showSampleType: boolean = false
  isSearched: boolean = false;

  sampleCount6: number;
  sampleCount7And8: number;

  constructor(
    private laporanService: LaporanService,
    private elimsService: ElimsService,
  ) { }

  ngOnInit() {


    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    this.searchBy = ['Tempoh Masa','Jenis Getah'];



    this.laporanService.GetSampleCountByStatusCode()
    .subscribe(
      (data) => {
        this.sampleCount6 = data.statusCode6;
        this.sampleCount7And8 = data.statusCode7And8;
        console.log(this.sampleCount6);
      },
      (error) => {
        // Handle error here if needed
      }
    );

  }
  


  changeSearchBy(e: any) {
    e.target.value == "Jenis Getah" ? this.showRubberType = true : this.showRubberType = false;
    e.target.value == "Tempoh Masa" ? this.showDate = true : this.showDate = false;
  }


  changeJenisGetah(e: any) {

    if (e.target.value == 1) {
      this.elimsService.GetRefSampleTypeByRubberType(1).subscribe(data => {
        this.typeCodes = data
      })
    }
    else if (e.target.value == 2) {
      this.elimsService.GetRefSampleTypeByRubberType(2).subscribe(data => {
        this.typeCodes = data
      })
    }
  }

  searchSample(): void {
    // Determine which parameters to include based on the selected criteria
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    let rubberTypeId: number | undefined;
    let typeCodeId: number | undefined;
  
    if (this.showDate) {
      startDate = this.fromDate;
      endDate = this.toDate;
    }
  
    if (this.showRubberType) {
      rubberTypeId = this.rubberTypeId;
      typeCodeId = this.typeCodeId;
    }
  
      // Call the API with the selected parameters
    this.laporanService.GetSampleCount(startDate, endDate, rubberTypeId, typeCodeId).subscribe(
      (data) => {
        this.sampleCounts = data;
        console.log(this.sampleCounts);
        this.isSearched = true; 
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );

  }
  

}
