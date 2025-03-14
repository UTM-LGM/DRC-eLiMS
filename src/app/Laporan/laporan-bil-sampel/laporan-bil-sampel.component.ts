import { Component, OnInit } from '@angular/core';
import { LaporanService } from '../laporan.service';
import { RubberType } from 'src/app/models/rubberType';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-laporan-bil-sampel',
  templateUrl: './laporan-bil-sampel.component.html',
  styleUrls: ['./laporan-bil-sampel.component.css']
})

export class LaporanBilSampelComponent implements OnInit {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  rubberTypeId: number | undefined;
  typeCodeId: number | undefined;
  rubberTypes: RubberType[] = [];
  typeCodes: any[] = [];
  searchByOptions: string[] = ['Tempoh Masa', 'Jenis Getah'];
  showDateFilter: boolean = false;
  showRubberTypeFilter: boolean = false;
  sampleCounts: any;
  isSearched: boolean = false;
  sampleCount4: number;
  sampleCount5And6: number;
  searchBy: string[] = []

  constructor(
    private laporanService: LaporanService,
    private elimsService: ElimsService,
  ) { }

  ngOnInit() {

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    this.searchBy = ['Tempoh Masa', 'Jenis Getah'];
    this.laporanService.GetSampleCountByStatusCode()
      .subscribe(
        (data) => {
          console.log(data)
          this.sampleCount4 = data.statusCode4;
          this.sampleCount5And6 = data.statusCode5And6;
          console.log(this.sampleCount4);
        },
        (error) => {
          // Handle error here if needed
        }
      );
  }

  changeSearchBy(event: any) {
    const selectedSearchBy = event.target.value;
    this.resetFilters();

    this.showDateFilter = selectedSearchBy === 'Tempoh Masa';
    this.showRubberTypeFilter = selectedSearchBy === 'Jenis Getah';
  }


  changeJenisGetah(event: any) {
    const selectedRubberTypeId = event.target.value;

    if (selectedRubberTypeId) {
      this.elimsService.GetRefSampleTypeByRubberType(selectedRubberTypeId).subscribe(data => {
        this.typeCodes = data;
        // Reset typeCodeId when rubberType is changed
        this.typeCodeId = undefined;
      });
    } else {
      // If no rubberType is selected, clear the typeCodes and typeCodeId
      this.typeCodes = [];
      this.typeCodeId = undefined;
    }
  }


  searchSample(): void {
    if (!this.fromDate || !this.toDate) {
      console.log("Please select a valid date range.");
      return;
    }

    const startDate = this.fromDate;
    const endDate = this.toDate;

    this.laporanService.GetSampleCount(startDate, endDate, this.rubberTypeId, this.typeCodeId)
      .subscribe(
        (data) => {
          this.sampleCounts = data;
          console.log(data)
          this.isSearched = true;
        },
        (error) => {
          console.error('Error searching samples:', error);
          this.isSearched = false;
        }
      );
  }

  resetFilters(): void {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.rubberTypeId = undefined;
    this.typeCodeId = undefined;
    this.isSearched = false;
    this.sampleCounts = null;
  }
}
