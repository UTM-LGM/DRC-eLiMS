import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { K1Detail } from '../../models/k1Detail';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Staff } from '../../models/staff';
import { Forwarder } from '../../models/forwarder';
import { KeputusanUjianService } from './keputusan-ujian.service';
import { UserService } from '../../User/user.service';
import { loginImporter } from '../../models/loginImporters';
import * as XLSX from 'xlsx';
import { DaftarSampelService } from 'src/app/Daftar-Sampel/daftar-sampel.service';

@Component({
  selector: 'app-keputusan-ujian',
  templateUrl: './keputusan-ujian.component.html',
  styleUrls: ['./keputusan-ujian.component.css']
})
export class KeputusanUjianComponent implements OnInit {

  statusCodes: any = [
    'Telah didaftar',
    'Label Telah Dicetak',
    'Hantar ke LGM',
    'Hantar ke GTACR'
  ]
  
  importer: loginImporter = {} as loginImporter
  user: userDTO = {} as userDTO
  sample: Sample = {} as Sample
  forwarders: Forwarder[] = []
  searchBy: string[]
  loginAs: any;
  statusCodeId: any
  errorMes: boolean
  errorNotFound: boolean
  searchedby: any
  k1HeaderId: number;
  rubberTypeId: any;
  customNo: string;
  samplePropose: string;
  labRefNo: string;
  samples: any;
  batchId: number;
  companies: any
  k1Details: any
  driverName: string;
  icDriver: string;
  hsCode: string;
  statusCode: any;
  drc: any;
  quantity: any;
  bankCode: string;
  bankCodes: any
  companyId: any;
  forwarderId: any;
  sampleTypes: any
  rubberTypes: any
  typeCodeId : any
  fromDate: Date | undefined;
  toDate: Date | undefined;
  
  showCustomNo: boolean = false
  showLabRegNo: boolean = false
  showSampleId: boolean = false
  showBatchId: boolean = false
  showDriverName: boolean = false
  showSamplePropose: boolean = false
  showIdentificationDriver: boolean = false
  showHsCode: boolean = false
  showStatus: boolean = false
  showSampleType: boolean = false
  showDRC: boolean = false
  showQuantity: boolean = false
  showNamaBank: boolean = false
  showImportedDate: boolean = false
  showCompanyName: boolean = false
  showForwarderName: boolean = false
  
  userRoleId: any;
  
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  roleGtacr: boolean
  staff: Staff
  searchParams: any
  queryParams: any
  typeCodes: any
  selectedK1DetailId: number;

  // importedDates: Date[] = []; 
  // uniqueMonths: number[] = [];
  // displayedData: any[] = [];
  // rubberType: any;
  // importedDate: string;

  constructor(
    private elimsService: ElimsService,
    private authService: AuthService,
    private router: Router,
    private keputusanUjianService: KeputusanUjianService,
    private userService: UserService,
    private daftarSampelService: DaftarSampelService,

  ) { }

  displayedColumns: string[] = [
    'k1DetailId',
    'labRefNo',
    'customNo',
    'importedDate',
    'quantity',
    'importerName',
    'samplePropose',
    'status',
    'result',
    'action',
  ];

  dataSource!: MatTableDataSource<K1Detail[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {


    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (sessionStorage.getItem('searchParams') != null) {
      const sessionData = sessionStorage.getItem('searchParams');
      console.log(sessionData)
      if (sessionData) {

        this.searchParams = JSON.parse(sessionData);
        this.k1HeaderId = this.searchParams.k1HeaderId,
          this.labRefNo = this.searchParams.labRefNo,
          this.customNo = this.searchParams.customNo,
          this.samplePropose = this.searchParams.samplePropose,
          this.batchId = this.searchParams.batchId,
          this.rubberTypeId = this.searchParams.rubberTypeId,
          this.driverName = this.searchParams.driverName,
          this.icDriver = this.searchParams.icDriver,
          this.hsCode = this.searchParams.hsCode,
          this.statusCodeId = this.searchParams.statusCodeId,
          this.typeCodeId = this.searchParams.typeCodeId,
          this.quantity = this.searchParams.quantity,
          this.drc = this.searchParams.drc,
          this.bankCode = this.searchParams.bankCode,
          this.companyId = this.searchParams.companyId,
          this.forwarderId = this.searchParams.forwarderId,
          this.fromDate = this.searchParams.fromDate,
          this.toDate = this.searchParams.toDate,
          this.searchedby = this.searchParams.searchedby,
          this.changeSearchedBy(this.searchedby);
      }
    }

    this.elimsService.GetBankCodes().subscribe(data => {
      this.bankCodes = data
    });

    this.elimsService.GetForwarders().subscribe(data => {
      this.forwarders = data.filter(data => data.name != null);

    });

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res;
        this.roleForwarder = true;
        this.roleUip = false;
        this.elimsService.GetCompanies(this.user.forwarderId).subscribe(data => {
          this.companies = data.filter(data => data.importerName != null);
          console.log(this.companies)

          this.companies.sort((a: { importerName: any; }, b: { importerName: any; }) => {
            const companiesA = a.importerName;
            const companiesB = b.importerName;

            // Compare the kodStesen values
            if (companiesA < companiesB) {
              return -1;
            } else if (companiesA > companiesB) {
              return 1;
            } else {
              return 0; // Kodstesen values are equal
            }
          });
        })
      })


      this.searchSample();

    } else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res);
        this.authService.changeUser(res);
        this.staff = res;
        this.roleForwarder = false;
        this.roleUip = true;
        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data;

          this.companies.sort((a: { name: any; }, b: { name: any; }) => {
            const nameA = a.name;
            const nameB = b.name;

            // Compare the kodStesen values
            if (nameA < nameB) {
              return -1;
            } else if (nameA >nameB) {
              return 1;
            } else {
              return 0; // Kodstesen values are equal
            }
          });

        });
      })
      this.searchSample();
    }


    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        console.log(res);
        this.authService.changeUser(res);
        this.importer = res;
        this.roleForwarder = false;
        this.roleUip = false;
        this.roleImporter = true;
      })
      this.searchSample();
    }


    else if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res);
        this.authService.changeUser(res);
        this.staff = res;
        this.roleForwarder = false;
        // this.roleUip = true;
        this.roleGtacr = true;
        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data;

          this.companies.sort((a: { name: any; }, b: { name: any; }) => {
            const nameA = a.name;
            const nameB = b.name;

            // Compare the kodStesen values
            if (nameA < nameB) {
              return -1;
            } else if (nameA >nameB) {
              return 1;
            } else {
              return 0; // Kodstesen values are equal
            }
          });

        });
      })
      this.searchSample();
    }


    this.searchBy = [
      'Tarikh Import',
      'No Kastam',
      // 'No Ruj Makmal',
      'Sampel Id',
      'Batch Id',
      'Nama Pemandu',
      'Mykad/ Pasport Pemandu',
      'HS Code',
      'Status Sampel',
      'Kandungan Getah Kering (KGK)',
      'Kuantiti',
    ];

    if (this.userRoleId == 1) {
      this.searchBy.push('Syarikat Pengimport');
    }

   else if (this.userRoleId == 2 || 4) {
      this.searchBy.push('Syarikat Pengimport');
      this.searchBy.push('Syarikat Penghantar');
      this.searchBy.push('Jenis Sampel');
      this.searchBy.push('Tujuan Sampel Dihantar');
    }

    else if (this.userRoleId == 3) {
      this.searchBy.push('Syarikat Penghantar');
    }

  }

  searchSample() {
    sessionStorage.removeItem('searchParams')
    this.queryParams = {
      k1HeaderId: this.k1HeaderId,
      labRefNo: this.labRefNo,
      customNo: this.customNo,
      samplePropose: this.samplePropose,
      batchId: this.batchId,
      rubberTypeId: this.rubberTypeId,
      driverName: this.driverName,
      icDriver: this.icDriver,
      hsCode: this.hsCode,
      statusCodeId: this.statusCodeId,
      typeCodeId: this.typeCodeId,
      quantity: this.quantity,
      drc: this.drc,
      bankCode: this.bankCode,
      companyId: this.companyId,
      forwarderId: this.forwarderId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      searchedby: this.searchedby
    };

    console.log(this.queryParams)

    if (this.rubberTypeId == "1" || this.rubberTypeId == "2") {

      if (this.userRoleId == 1) {
        this.keputusanUjianService.GetElimsSearchSample(this.user.username, this.queryParams)
          .subscribe(
            {
              next: ((data: K1Detail[] | K1Detail) => {
                this.samples = Array.isArray(data) ? data : [data];
                this.errorNotFound = false;
                this.dataSource = new MatTableDataSource<K1Detail[]>(this.samples);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }),
              error: (error) => {
                console.error('Error occurred while fetching samples:', error);
                this.errorNotFound = true;
                this.samples = []; // Clear samples in case of an error
                // Clear the table data and paginator
                this.dataSource = new MatTableDataSource<K1Detail[]>([]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            }
          );
      }

      
      if (this.userRoleId == 3) {
        this.keputusanUjianService.GetElimsSearchSample(this.importer.username, this.queryParams)
          .subscribe(
            {
              next: ((data: K1Detail[] | K1Detail) => {
                this.samples = Array.isArray(data) ? data : [data];
                this.errorNotFound = false;
                this.dataSource = new MatTableDataSource<K1Detail[]>(this.samples);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }),
              error: (error) => {
                console.error('Error occurred while fetching samples:', error);
                this.errorNotFound = true;
                this.samples = []; // Clear samples in case of an error
                // Clear the table data and paginator
                this.dataSource = new MatTableDataSource<K1Detail[]>([]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            }
          );
      }

      else if (this.userRoleId == 2) {
        this.keputusanUjianService.GetElimsSearchSamples(this.queryParams)
          .subscribe(
            {
              next: ((data: K1Detail[] | K1Detail) => {
                this.samples = Array.isArray(data) ? data : [data];
                this.errorNotFound = false;
                this.dataSource = new MatTableDataSource<K1Detail[]>(this.samples);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

              }),
              error: (error) => {
                console.error('Error occurred while fetching samples:', error);
                this.errorNotFound = true;
                this.samples = []; // Clear samples in case of an error
                // Clear the table data and paginator
                this.dataSource = new MatTableDataSource<K1Detail[]>([]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            }
          );
      }

      else if (this.userRoleId == 4) {
        this.keputusanUjianService.GetElimsSearchSamples(this.queryParams)
          .subscribe(
            {
              next: ((data: K1Detail[] | K1Detail) => {
                this.samples = Array.isArray(data) ? data : [data];
                this.errorNotFound = false;
                this.dataSource = new MatTableDataSource<K1Detail[]>(this.samples);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

              }),
              error: (error) => {
                console.error('Error occurred while fetching samples:', error);
                this.errorNotFound = true;
                this.samples = []; // Clear samples in case of an error
                // Clear the table data and paginator
                this.dataSource = new MatTableDataSource<K1Detail[]>([]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            }
          );
      }


    } else {
      this.samples = []; // Clear samples if no rubber type is selected
    }
  }


  validForm() {
    return this.sample.rubberTypeId !== null && this.sample.rubberTypeId !== 0;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewSample(k1DetailId: number) {
    sessionStorage.setItem('searchParams', JSON.stringify(this.queryParams));
    // this.router.navigate(['/sample/view-keputusan-ujian/' + k1DetailId]);
    this.daftarSampelService.setSelectedK1DetailId(k1DetailId);
    this.router.navigate(['keputusan-ujian/view-keputusan-ujian']); 
  }

  changeSearchBy(e: any) {
    this.customNo = ""
    this.labRefNo = ""
    this.samples = ""
    this.driverName = ""
    this.icDriver = ""
    this.hsCode = ""
    this.bankCode = ""
    this.samplePropose = ""
    this.typeCodeId = ""
    this.companyId = ""
    this.forwarderId = ""
    this.statusCodeId = ""
    this.quantity = ""
    this.drc = ""
    this.fromDate = undefined
    this.toDate = undefined
  

 
    e.target.value == "No Kastam" ? this.showCustomNo = true : this.showCustomNo = false;
    e.target.value == "No Ruj Makmal" ? this.showLabRegNo = true : this.showLabRegNo = false;
    e.target.value == "Tarikh Import" ? this.showImportedDate = true : this.showImportedDate = false;
    e.target.value == "Sampel Id" ? this.showSampleId = true : this.showSampleId = false;
    e.target.value == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
    e.target.value == "Nama Pemandu" ? this.showDriverName = true : this.showDriverName = false;
    e.target.value == "Tujuan Sampel Dihantar" ? this.showSamplePropose = true : this.showSamplePropose = false;
    e.target.value == "Mykad/ Pasport Pemandu" ? this.showIdentificationDriver = true : this.showIdentificationDriver = false;
    e.target.value == "HS Code" ? this.showHsCode = true : this.showHsCode = false;
    e.target.value == "Status Sampel" ? this.showStatus = true : this.showStatus = false;
    e.target.value == "Jenis Sampel" ? this.showSampleType = true : this.showSampleType = false;
    e.target.value == "Kandungan Getah Kering (KGK)" ? this.showDRC = true : this.showDRC = false;
    e.target.value == "Kuantiti" ? this.showQuantity = true : this.showQuantity = false;
    e.target.value == "Nama Bank" ? this.showNamaBank = true : this.showNamaBank = false;
    e.target.value == "Syarikat Pengimport" ? this.showCompanyName = true : this.showCompanyName = false;
    e.target.value == "Syarikat Penghantar" ? this.showForwarderName = true : this.showForwarderName = false;
    // this.samples = [];
  }

  changeSearchedBy(e: any) {

    e == "No Kastam" ? this.showCustomNo = true : this.showCustomNo = false;
    e == "No Ruj Makmal" ? this.showLabRegNo = true : this.showLabRegNo = false;
    e == "Tarikh Import" ? this.showImportedDate = true : this.showImportedDate = false;
    e == "Sampel Id" ? this.showSampleId = true : this.showSampleId = false;
    e == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
    e == "Nama Pemandu" ? this.showDriverName = true : this.showDriverName = false;
    e == "Tujuan Sampel Dihantar" ? this.showSamplePropose = true : this.showSamplePropose = false;
    e == "Mykad/ Pasport Pemandu" ? this.showIdentificationDriver = true : this.showIdentificationDriver = false;
    e == "HS Code" ? this.showHsCode = true : this.showHsCode = false;
    e == "Status Sampel" ? this.showStatus = true : this.showStatus = false;
    e == "Jenis Sampel" ? this.showSampleType = true : this.showSampleType = false;
    e == "Kandungan Getah Kering (KGK)" ? this.showDRC = true : this.showDRC = false;
    e == "Kuantiti" ? this.showQuantity = true : this.showQuantity = false;
    e == "Nama Bank" ? this.showNamaBank = true : this.showNamaBank = false;
    e == "Syarikat Pengimport" ? this.showCompanyName = true : this.showCompanyName = false;
    e == "Syarikat Penghantar" ? this.showForwarderName = true : this.showForwarderName = false;

    this.samples = [];

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
    // this.showSampleType= true
  }




  @ViewChild('table') table: any; 

  exportToExcel(): void {
    // Define custom column names
    const columnMappings = {
        'customNo': 'No Borang Kastam',
        'importedDate': 'Tarikh Import',
        'samplePropose': 'Tujuan Sample Dihantar',
        'quantity': 'Kuantiti',
        'importerName': 'Syarikat Pengimport',
        'status': 'Status'
    };

    // Define which columns to export
    const columnsToExport = Object.keys(columnMappings);

    // Get all data from the data source
    const allData = this.dataSource.data;

    // Filter data to keep only the desired columns and apply custom column names
    const filteredData = allData.map(row => {
        const filteredRow = {};
        columnsToExport.forEach(column => {
            const customColumnName = columnMappings[column];
            filteredRow[customColumnName] = row[column];
        });
        return filteredRow;
    });

    // Create a worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Add worksheet to workbook

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'senarai_sampel.xlsx');
}


}


