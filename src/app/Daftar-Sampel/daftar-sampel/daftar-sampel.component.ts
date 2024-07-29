import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { Sample } from '../../models/sample';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElimsService } from '../../services/elims.service';
import { K1Header } from '../../models/k1Header';
import { K1Detail } from '../../models/k1Detail';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Staff } from '../../models/staff';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { StationCode } from 'src/app/models/stationCode';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-daftar-sampel',
  templateUrl: './daftar-sampel.component.html',
  styleUrls: ['./daftar-sampel.component.css']
})
export class DaftarSampelComponent implements OnInit {

  user: userDTO = {} as userDTO
  sample: Sample = {} as Sample
  k1Detail: K1Detail = {} as K1Detail
  k1Header: K1Header = {} as K1Header
  staff: Staff = {} as Staff

  transportType: any = ['Pelabuhan', 'Darat']
  samplePropose: any = ['Pengecualian Ses (CE)', 'Lain-lain']

  showSampleTypes: boolean = false
  showTypeCodes: boolean = false
  showDarat: boolean = false
  showPelabuhan: boolean = false

  formattedQuantity: string;
  //formattedDRC: string;
  numericQuantity: number
  companies: any
  countries: any
  latexTypes: any
  blockRubberTypes: any
  typeCodes: any
  rubberTypes: any
  file: any | null
  sampleForm: FormGroup;
  notes: string;
  selectedDateSum: Date;
  customOffice: any
  showRemarks: boolean;
  loginAs: any;
  username: any
  dataShow: any
  role: any
  roleForwarder: boolean
  roleUip: boolean
  formattedDRC: number;
  stationCodes: any
  stationCode: StationCode = {} as StationCode

  baseApiUrl = environment.baseApiUrlElims;

  constructor(
    private router: Router,
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private elimsService: ElimsService,
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private daftarSampelService: DaftarSampelService,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.sampleForm = this.formBuilder.group({
      kodStesen: ['', Validators.required],
      tahun: ['', Validators.required],
      nomborKastam: ['', Validators.required],
      importedDate: ['', Validators.required],
      remarks: [''],
      evidence: [''],
      quantity: ['', Validators.required],
      hsCode: ['', Validators.required],
      rubberType: ['', Validators.required],
      // sampleType: ['', Validators.required],
      typeCode: ['', Validators.required],
      //companyId: ['', Validators.required],
      samplePropose: ['', Validators.required],
      transport: ['', Validators.required],
      lorryNo: ['', Validators.required],
      trailerNo: [''],
      formattedDRC: ['', Validators.required],
      supplierName: ['', Validators.required],
      country: ['', Validators.required],
      driverName: ['', Validators.required],
      icDriver: ['', Validators.required],
    });

    if (this.authservice.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.role = this.authService.getSessionRole()
      console.log(this.loginAs)
    }
    else {
      this.loginAs = '';
    }

    this.elimsService.GetAllCountries().subscribe(data => {
      this.countries = data
    })

    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
    })

    if (this.role == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(x => {
        this.authService.changeUser(x);
        this.user = x;
        console.log(this.user);
        this.roleForwarder = true
        this.roleUip = false

        this.elimsService.GetCompanies(this.user.forwarderId).subscribe(data => {
          // this.companies = data
          console.log(this.companies)
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

    } else if (this.role == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(x => {
        this.authService.changeUser(x);
        this.staff = x;
        console.log(this.staff);
        this.roleForwarder = false
        this.roleUip = true

        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data
          console.log(this.companies)
        })
      })
    }



    this.daftarSampelService.GetStationCodes().subscribe(data => {

      this.stationCodes = data.filter(data => data.kodStesen != null);
      // Sort the stationCodes by kodstesen
      this.stationCodes.sort((a: { kodStesen: any; }, b: { kodStesen: any; }) => {
        const kodStesenA = a.kodStesen;
        const kodStesenB = b.kodStesen;

        // Compare the kodStesen values
        if (kodStesenA < kodStesenB) {
          return -1;
        } else if (kodStesenA > kodStesenB) {
          return 1;
        } else {
          return 0; // Kodstesen values are equal
        }
      });
    });


    
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.k1Detail.evidence = event.target.files[0].name;
    console.log(this.k1Detail.evidence);
  }

  addSample() {
    console.log(this.k1Detail)
    console.log(this.k1Header)
    console.log(this.sample)

    if (this.sampleForm.invalid) {
      this.toastr.warning('Sila isi semua ruangan yang diperlukan');
      return;
      
    }

    const formData = new FormData();
    formData.append('customNo', this.sample.customNo);
    const statusCodeId = 1;

    const kodStesen = this.sampleForm.get('kodStesen')?.value ?? '';
    const tahun = this.sampleForm.get('tahun')?.value ?? '';
    const nomborKastam = this.sampleForm.get('nomborKastam')?.value ?? '';
    const customNo = kodStesen + tahun + nomborKastam;

    this.k1Detail.createdBy = this.loginAs;

    this.k1Detail.creatorRoleId = this.role
    this.k1Detail.customNo = customNo;
    this.k1Detail.drc = this.sample.drc;
    this.k1Detail.quantity = this.removeCommas(this.formattedQuantity);
    this.k1Detail.drc = this.removeCommas(this.formattedDRC.toString());
    this.k1Detail.companyId = this.sample.companyId;
    this.k1Detail.forwarderId = this.user.forwarderId;
    this.k1Detail.importerAddress = this.companies.address;
    this.k1Detail.createdOn = new Date();

    this.sample.forwarderId = this.user.forwarderId;
    this.sample.createdOn = new Date();
    this.sample.customNo = customNo;
    this.sample.importedDate = this.k1Header.importedDate;
    this.sample.quantity = this.removeCommas(this.formattedQuantity);
    this.sample.createdBy = this.loginAs;
    this.sample.samplePropose = this.k1Detail.samplePropose;
    this.sample.lorryNo = this.k1Header.lorryNo;
    this.sample.trailerNo = this.k1Header.trailerNo;
    this.sample.drc = this.removeCommas(this.formattedDRC.toString());
    this.sample.drc = this.k1Detail.drc;
    this.sample.supplierName = this.k1Header.supplierName;
    this.k1Header.customNo = customNo;
    this.sample.country = this.k1Detail.country;
    this.sample.remarks = this.k1Detail.remarks;
    this.sample.evidence = this.k1Detail.evidence;
    this.sample.hsCode = this.k1Detail.hsCode;
    this.sample.driverName = this.k1Header.driverName;
    this.sample.icDriver = this.k1Header.icDriver;
    this.sample.rubberTypeId = this.k1Detail.rubberTypeId;
    this.sample.typeCodeId = this.k1Detail.typeCodeId;
    this.sample.creatorRoleId = this.k1Detail.creatorRoleId;
    this.k1Header.companyId = this.sample.companyId;


    console.log(this.sample);

    // if (this.k1Detail.rubberTypeId == 1) {
    //   this.daftarSampelService.PostK1HeaderSample(this.k1Header, statusCodeId).subscribe(res => {
    //     this.k1Detail.k1HeaderId = res.k1HeaderId;
    //     this.daftarSampelService.PostK1DetailSample(this.k1Detail, statusCodeId).subscribe(resDetail => {
    //       this.sample.sampleIdNew = resDetail.k1DetailId;
    
    //       // Combining multiple observables to wait for all of them to complete
    //       forkJoin([
    //         this.drclimstrainingService.PostLtxSamples(this.sample, statusCodeId),
    //         this.daftarSampelService.PostFileK1Detail(resDetail.k1DetailId, this.file)
    //       ]).subscribe(() => {
    //         console.log('All requests completed successfully');
    //         this.router.navigate(['sample']);
    //       }, error => {
    //         console.error('Error:', error);
    //         // Handle error
    //       });
    //     }, err => {
    //       this.toastr.warning(' Nombor Kastam telah wujud', "", { timeOut: 15000 });
    //     });
    //   });
    // } else if (this.k1Detail.rubberTypeId == 2) {
    //   this.daftarSampelService.PostK1HeaderSample(this.k1Header, statusCodeId).subscribe(res => {
    //     this.k1Detail.k1HeaderId = res.k1HeaderId;
    //     this.daftarSampelService.PostK1DetailSample(this.k1Detail, statusCodeId).subscribe(resDetail => {
    //       this.sample.sampleIdNew = resDetail.k1DetailId;
    
    //       // Combining multiple observables to wait for all of them to complete
    //       forkJoin([
    //         this.getahBongkahService.PostBRSamples(this.sample, statusCodeId),
    //         this.daftarSampelService.PostFileK1Detail(resDetail.k1DetailId, this.file)
    //       ]).subscribe(() => {
    //         console.log('All requests completed successfully');
    //         this.router.navigate(['sample']);
    //       }, error => {
    //         console.error('Error:', error);
    //         // Handle error
    //       });
    //     }, err => {
    //       this.toastr.warning(' Nombor Kastam telah wujud', "", { timeOut: 15000 });
    //     });
    //   });
    // }


  }


  private removeCommas(value: string): number {
    return +value.replace(/,/g, ''); // Remove commas and convert to number
  }

  // private formatNumberWithCommas(value: number): string {
  //   return value.toLocaleString(); // Format the number with commas
  // }

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
    this.showTypeCodes = true

  }

  changeTransport(e: any) {

    if (e.target.value == "Pelabuhan") {
      this.showPelabuhan = true
    }
    else {
      this.showPelabuhan = false
    }

    if (e.target.value == "Darat") {
      this.showDarat = true
    }
    else {
      this.showDarat = false
    }
  }


  enforceDRCLimit() {
    if (this.formattedDRC > 100) {
      this.formattedDRC = 0;
    }
}



  onDateChange() {
    const dateValue = new Date(this.k1Header.importedDate);
    console.log(this.k1Header.importedDate)
    let sum;

    this.authservice.GetCustomOffice(this.user.customOfficeId).subscribe(x => {
      console.log(x);
      this.customOffice = x;

      if (this.customOffice.isNorthen) {
        sum = dateValue.getDate() + 7;
      } else {
        sum = dateValue.getDate() + 14;
      }

      const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
      this.selectedDateSum = sumDate;

      const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
      const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
      const year = sumDate.getFullYear();

      this.notes = `${day}.${month}.${year}`;
      console.log(this.notes)

      const today = new Date();
      const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysLate = Math.ceil((today.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24));

      if (sumDate < today) {
        if (this.customOffice.isNorthen) {
          if (daysLate > 0) {
            this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
          }
        } else {
          if (daysLate > 7) {
            this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
          }
        }
        this.showRemarks = true;

      } else if (daysUntilDeadline <= 3) {
        if (this.customOffice.isNorthen) {

          this.notes += ` (Perhatian: Anda mempunyai  ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
        } else {
          this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
        }
        this.showRemarks = false; // Hide the remarks field
      } else {
        this.showRemarks = false; // Hide the remarks field
      }

      console.log(this.selectedDateSum.toDateString());
    });
  }


  // onDateChange() {
  //   const dateValue = new Date(this.k1Header.importedDate);
  //   console.log(this.k1Header.importedDate)
  //   let sum;

  //   this.authservice.GetCustomOffice(this.user.customOfficeId).subscribe(x => {
  //     console.log(x);
  //     this.customOffice = x;

  //     if (this.customOffice.isNorthen) {
  //       sum = dateValue.getDate() + 7;
  //     } else {
  //       sum = dateValue.getDate() + 14;
  //     }

  //     const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
  //     this.selectedDateSum = sumDate;

  //     const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
  //     const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
  //     const year = sumDate.getFullYear();

  //     this.notes = `${day}.${month}.${year}`;
  //     console.log(this.notes)

  //     const today = new Date();
  //     const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  //     if (sumDate < today) {
  //       if (this.customOffice.isNorthen) {
  //         this.notes += " (Anda telah lewat, melebihi 7 hari)";
  //       } else {
  //         this.notes += " (Anda telah lewat, melebihi 14 hari)";
  //       }
  //       this.showRemarks = true; // Display the remarks field
  //     } else if (daysUntilDeadline <= 3) {
  //       if (this.customOffice.isNorthen) {

  //         this.notes += ` (Perhatian: Anda mempunyai  ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
  //       } else {
  //         this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;
  //       }
  //       this.showRemarks = false; // Hide the remarks field
  //     } else {
  //       this.showRemarks = false; // Hide the remarks field
  //     }

  //     console.log(this.selectedDateSum.toDateString());
  //   });
  // }


}
