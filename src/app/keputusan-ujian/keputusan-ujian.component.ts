import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample } from '../models/sample';
import { ElimsService } from '../services/elims.service';
import { K1Detail } from '../models/k1Detail';
import { userDTO } from '../models/userDTO';
import { AuthService } from '../services/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Staff } from '../models/staff';
import { Forwarder } from '../models/forwarder';
import { KeputusanUjianService } from './keputusan-ujian.service';
import { UserService } from '../User/user.service';

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

  user: userDTO = {} as userDTO
  sample: Sample = {} as Sample
  loginAs: any;
  statusCodeId: number
  errorMes: boolean
  errorNotFound: boolean
  searchBy: string[]
  searchedby: any
  k1HeaderId: number;
  rubberTypeId: any;
  rubberType: any;
  customNo: string;
  labRefNo: string;
  samples: any;
  batchId: number;
  forwarders: Forwarder[] = []
  companies: any
  k1Details: any
  driverName: string;
  icDriver: string;
  hsCode: string;
  statusCode: number;
  drc: number;
  quantity: number;
  bankCode: string;
  bankCodes: any
  companyId: number;
  forwarderId: number;
  sampleTypes: any
  rubberTypes: any

  // Date filter properties
  fromDate: Date;
  toDate: Date;
  showCustomNo: boolean = false
  showLabRegNo: boolean = false
  showSampleId: boolean = false
  showBatchId: boolean = false
  showDriverName: boolean = false
  showIdentificationDriver: boolean = false
  showHsCode: boolean = false
  showStatus: boolean = false
  showDRC: boolean = false
  showQuantity: boolean = false
  showNamaBank: boolean = false
  showImportedDate: boolean = false
  showCompanyName: boolean = false
  showForwarderName: boolean = false

  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  staff: Staff
  searchParams: any
  queryParams: any

  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private keputusanUjianService: KeputusanUjianService,
    private userService: UserService,

  ) { }

  displayedColumns: string[] = [
    'k1DetailId',
    'customNo',
    'importedDate',
    'quantity',
    'importerName',
    'status',
    'action'
  ];

  dataSource!: MatTableDataSource<K1Detail[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
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
          this.batchId = this.searchParams.batchId,
          this.rubberTypeId = this.searchParams.rubberTypeId,
          this.driverName = this.searchParams.driverName,
          this.icDriver = this.searchParams.icDriver,
          this.hsCode = this.searchParams.hsCode,
          this.statusCodeId = this.searchParams.statusCodeId,
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


    this.elimsService.GetElimsBankCodes().subscribe(data => {
      this.bankCodes = data
    });

    this.elimsService.GetForwarders().subscribe(data => {
      this.forwarders = data.filter(data => data.name != null);
    });

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res;
        this.roleForwarder = true;
        this.roleUip = false;
        this.elimsService.GetCompanies(this.user.forwarderId).subscribe(data => {
          this.companies = data;
        });
      })
      this.searchSample();

    } else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res);
        this.authService.changeUser(res);
        this.staff = res;
        this.roleForwarder = false;
        this.roleUip = true;
        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data;
          // console.log(this.companies);
        });
      })
      this.searchSample();
    }

    this.searchBy = [
      'Tarikh Import',
      'No Kastam',
      //'No Ruj Makmal',
      'Sampel Id',
      'Batch Id',
      'Nama Pemandu',
      'Mykad/ Pasport Pemandu',
      'HS Code',
      'Status Sampel',
      'Kandungan Getah Kering (KGK)',
      'Kuantiti',
      //'Nama Bank',
      'Syarikat Pengimport',
    ];

    if (this.roleId == 2) {
      this.searchBy.push('Syarikat Penghantar');
    }
  }

  searchSample() {
    sessionStorage.removeItem('searchParams')
    this.queryParams = {
      k1HeaderId: this.k1HeaderId,
      labRefNo: this.labRefNo,
      customNo: this.customNo,
      batchId: this.batchId,
      rubberTypeId: this.rubberTypeId,
      driverName: this.driverName,
      icDriver: this.icDriver,
      hsCode: this.hsCode,
      statusCodeId: this.statusCodeId,
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

      if (this.roleId == 1) {
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

      else if (this.roleId == 2) {
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


  // validForm() {
  //   if (this.sample.rubberTypeId == null || this.sample.rubberTypeId == 0) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

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
    this.router.navigate(['/sample/view-keputusan-ujian/' + k1DetailId]);
  }

  changeSearchBy(e: any) {
    this.customNo = ""
    this.labRefNo = ""
    this.samples = ""
    this.driverName = ""
    this.icDriver = ""
    this.hsCode = ""
    this.bankCode = ""
    // this.statusCode=0
    // this.drc=0
    // this.quantity=0

    e.target.value == "No Kastam" ? this.showCustomNo = true : this.showCustomNo = false;
    e.target.value == "No Ruj Makmal" ? this.showLabRegNo = true : this.showLabRegNo = false;
    e.target.value == "Tarikh Import" ? this.showImportedDate = true : this.showImportedDate = false;
    e.target.value == "Sampel Id" ? this.showSampleId = true : this.showSampleId = false;
    e.target.value == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
    e.target.value == "Nama Pemandu" ? this.showDriverName = true : this.showDriverName = false;
    e.target.value == "Mykad/ Pasport Pemandu" ? this.showIdentificationDriver = true : this.showIdentificationDriver = false;
    e.target.value == "HS Code" ? this.showHsCode = true : this.showHsCode = false;
    e.target.value == "Status Sampel" ? this.showStatus = true : this.showStatus = false;
    e.target.value == "Kandungan Getah Kering (KGK)" ? this.showDRC = true : this.showDRC = false;
    e.target.value == "Kuantiti" ? this.showQuantity = true : this.showQuantity = false;
    e.target.value == "Nama Bank" ? this.showNamaBank = true : this.showNamaBank = false;
    e.target.value == "Syarikat Pengimport" ? this.showCompanyName = true : this.showCompanyName = false;
    e.target.value == "Syarikat Penghantar" ? this.showForwarderName = true : this.showForwarderName = false;
  }

  changeSearchedBy(e: any) {

    e == "No Kastam" ? this.showCustomNo = true : this.showCustomNo = false;
    e == "No Ruj Makmal" ? this.showLabRegNo = true : this.showLabRegNo = false;
    e == "Tarikh Import" ? this.showImportedDate = true : this.showImportedDate = false;
    e == "Sampel Id" ? this.showSampleId = true : this.showSampleId = false;
    e == "Batch Id" ? this.showBatchId = true : this.showBatchId = false;
    e == "Nama Pemandu" ? this.showDriverName = true : this.showDriverName = false;
    e == "Mykad/ Pasport Pemandu" ? this.showIdentificationDriver = true : this.showIdentificationDriver = false;
    e == "HS Code" ? this.showHsCode = true : this.showHsCode = false;
    e == "Status Sampel" ? this.showStatus = true : this.showStatus = false;
    e == "Kandungan Getah Kering (KGK)" ? this.showDRC = true : this.showDRC = false;
    e == "Kuantiti" ? this.showQuantity = true : this.showQuantity = false;
    e == "Nama Bank" ? this.showNamaBank = true : this.showNamaBank = false;
    e == "Syarikat Pengimport" ? this.showCompanyName = true : this.showCompanyName = false;
    e == "Syarikat Penghantar" ? this.showForwarderName = true : this.showForwarderName = false;
  }

}


