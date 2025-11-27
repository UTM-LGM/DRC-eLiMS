import { Component, ViewChild } from '@angular/core';
import { K1Detail } from '../models/k1Detail';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DaftarSampelService } from '../Daftar-Sampel/daftar-sampel.service';
import * as XLSX from 'xlsx';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-late-sample',
  templateUrl: './late-sample.component.html',
  styleUrls: ['./late-sample.component.css']
})
export class LateSampleComponent {


  startDate!: string;
  endDate!: string;

  constructor(
    private daftarSampelService: DaftarSampelService,

  ) { }

  displayedColumns: string[] = [
    'id',
    'customNo',
    'importedDate',
    'createdOn',
    'sentOn',
    'dateReceivedInLab',
    'forwarderName',
    'remarks',
    'evidence',
    'count',
    'status',

  ];

  dataSource!: MatTableDataSource<K1Detail[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

  }


  search(startDate: string, endDate: string): void {
    this.daftarSampelService.getLateSamples(startDate, endDate).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching data', err);
      }
    });
  }


  viewFile(path: string, k1DetailId: number): void {
    const fileUrl = environment.baseApiUrlElimsEvidence + k1DetailId + "_" + path;
    console.log('Opening file at URL:', fileUrl);
    window.open(fileUrl, "_blank");
  }


  exportToExcel(): void {
    // Define custom column names
    const columnMappings = {
      'customNo': 'No Borang Kastam',
      'importedDate': 'Tarikh Import',
      'sentOn': 'Tarikh Hantar',
      'dateReceivedInLab': 'dateReceivedInLab',
      'agentName': 'Syarikat Penghantar',
      'remarks': 'Catatan',
      'evidence': 'Evidence',
      'status': 'Status'
    };

    // Define which columns to export
    const columnsToExport = Object.keys(columnMappings);

    // Get all data from the data source
    const allData = this.dataSource.data;

    // Filter data to keep only the desired columns and apply custom column names
    const filteredData = allData.map((row, index) => {
      const filteredRow = {};

      // Add incremental 'Bil' (index + 1) as the first column
      filteredRow['Bil'] = index + 1; // Start counting from 1

      // Map other columns
      columnsToExport.forEach(column => {
        const customColumnName = columnMappings[column];

        // Check if the column is a date and format it
        if (column === 'importedDate' || column === 'sentOn' || column === 'dateReceivedInLab') {
          // Format the date to a string (e.g., 'YYYY-MM-DD' or any preferred format)
          const dateValue = row[column];
          filteredRow[customColumnName] = dateValue ? new Date(dateValue).toLocaleDateString('en-GB') : ''; // Use 'en-GB' for DD/MM/YYYY
        } else {
          filteredRow[customColumnName] = row[column];
        }
      });

      return filteredRow;
    });

    // Create a worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Add worksheet to workbook

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'late_sample.xlsx');
  }

}
