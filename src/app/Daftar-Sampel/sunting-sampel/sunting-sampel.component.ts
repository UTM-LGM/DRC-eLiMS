import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample } from '../../models/sample';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { ElimsService } from '../../services/elims.service';
import { K1Detail } from '../../models/k1Detail';
import { K1Header } from '../../models/k1Header';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Staff } from 'src/app/models/staff';
import { DaftarSampelService } from '../daftar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-sunting-sampel',
  templateUrl: './sunting-sampel.component.html',
  styleUrls: ['./sunting-sampel.component.css']
})
export class SuntingSampelComponent implements OnInit {

  samplePropose: any = ['Pengecualian Ses (CE)', 'Lain-lain']
  user: userDTO = {} as userDTO
  sample: Sample = {} as Sample;
  k1Detail: K1Detail = {} as K1Detail;
  k1Header: K1Header = {} as K1Header;
  staff: Staff = {} as Staff
  importer: loginImporter = {} as loginImporter

  showTypeCodes: boolean = false
  showDarat: boolean = false
  showPelabuhan: boolean = false
  showSmk: boolean = false
  showErrorMessage: boolean = false;

  companies: any
  countries: any
  sampleForm: FormGroup;
  itemDescriptionData: any; username: any
  showRemarks: boolean;
  notes: string;
  selectedDateSum: Date;
  customOffice: any;
  file: any | null
  typeCodes: any
  rubberTypes: any
  userRoleId: any
  loginAs: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  errorMes: boolean;
  dryWeight: number;
  formattedQuantity: string;
  formattedDRC: number;
  creatorRoleId: any;
  selectedK1DetailId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private elimsService: ElimsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private daftarSampelService: DaftarSampelService,
    private userService: UserService,
  ) { }

  ngOnInit() {


    this.selectedK1DetailId = this.daftarSampelService.getSelectedK1DetailId();
    console.log("select k1 detail id : ", this.selectedK1DetailId);

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }


    if (this.userRoleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.roleForwarder = true
        this.roleUip = false

        this.elimsService.GetCompanies(this.user.forwarderId).subscribe(data => {
          this.companies = data;
        })

      })
    }
    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        console.log(res)
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true

        this.elimsService.GetAllCompanies().subscribe(data => {
          this.companies = data;
        })
      })
    }


    else if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        console.log(res)
        this.importer = res
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
      })
    }

    this.sampleForm = this.formBuilder.group({
      kodStesenKastam: ['', Validators.required],
      tahun: ['', Validators.required],
      nomborKastam: ['', Validators.required],
    })

    this.k1Detail.country = this.sample.country
    this.sample.country = this.k1Detail.country

    this.authservice.currentUser
      // .pipe(
      // switchMap(user => {
      //   return this.route.paramMap;
      // })
      // )
      .subscribe(params => {
        // const k1DetailId = params.get('k1DetailId');


        if (this.selectedK1DetailId !== null) {
          if (this.elimsService) {
            this.elimsService.getElimsSample(this.selectedK1DetailId).subscribe(response => {
              this.sample = response;
              this.creatorRoleId = this.sample.creatorRoleId
              this.onDateChange(this.sample.importedDate)
              if (this.sample.isSMK) {
                this.showSmk = true
              } else {
                this.showSmk = false
              }

              if (this.sample.rubberTypeId == 1) {
                this.elimsService.GetRefSampleTypeByRubberType(1).subscribe(data => {
                  this.typeCodes = data
                })
              }

              else if (this.sample.rubberTypeId == 2) {
                this.elimsService.GetRefSampleTypeByRubberType(2).subscribe(data => {
                  this.typeCodes = data
                })
              }


              this.elimsService.GetRefRubberTypes().subscribe(data => {
                this.rubberTypes = data

              })

              this.elimsService.GetAllCountries().subscribe(data => {
                this.countries = data;
              })

            });
          }

        }

      });
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


  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.sample.evidence = event.target.files[0].name;
    // console.log(this.k1Detail.evidence);
  }


  updateSample() {
    if (!this.validForm()) {
      this.errorMes = true
    } else {
      this.errorMes = false

      this.itemDescriptionData = this.k1Detail.itemDescription
      this.k1Detail.itemDescription = this.sample.itemDescription
      this.k1Detail.hsCode = this.sample.hsCode
      this.k1Detail.rubberTypeId = this.sample.rubberTypeId
      this.k1Detail.sampleTypeId = this.sample.sampleTypeId
      this.k1Detail.typeCodeId = this.sample.typeCodeId
      this.k1Detail.samplePropose = this.sample.samplePropose
      this.k1Detail.quantity = this.sample.quantity
      this.k1Detail.drc = this.sample.drc
      this.k1Detail.dateSampleReceived = new Date(this.sample.dateSampleReceived);
      this.k1Detail.country = this.sample.country
      this.k1Detail.customNo = this.sample.customNo
      this.k1Detail.importerName = this.sample.importerName
      this.k1Detail.evidence = this.sample.evidence
      this.k1Detail.remarks = this.sample.remarks
      this.k1Detail.companyId = this.sample.companyId;

      this.k1Header.importedDate = this.sample.importedDate;
      this.k1Header.supplierName = this.sample.supplierName
      this.k1Header.importedDate = this.sample.importedDate
      this.k1Header.lorryNo = this.sample.lorryNo
      this.k1Header.trailerNo = this.sample.trailerNo
      this.k1Header.driverName = this.sample.driverName
      this.k1Header.icDriver = this.sample.icDriver
      this.k1Header.exporterAddress = this.sample.exporterAddress
      this.k1Header.k1HeaderId = this.sample.k1HeaderId
      this.k1Header.customNo = this.sample.customNo
      this.k1Header.isSMK = this.sample.isSMK;

      // console.log("senarai sample ", this.sample)
      // console.log("senarai k1header ", this.k1Header)
      // console.log("senarai k1detail ", this.k1Detail)

      this.daftarSampelService.PutK1HeaderSample(this.k1Header).subscribe(
        res => {
          console.log(res);
          this.k1Detail.k1HeaderId = res.k1HeaderId;
          this.daftarSampelService.PutK1DetailSample(this.sample.k1DetailId, this.k1Detail).subscribe(
            resupdateDetail => {
              this.sample.sampleIdNew = resupdateDetail.k1DetailId;
              if (this.file != null) {
                this.daftarSampelService.PostFileK1Detail(this.sample.k1DetailId, this.file).subscribe(
                  () => {
                    console.log('File uploaded successfully');
                  },
                  error => {
                    console.error('Error uploading file:', error);
                  }
                );
              }
              this.router.navigate(['sample']);
            },
            err => {
              this.toastr.warning('Kemaskini gagal', '', { timeOut: 15000 });
            }
          );
        },
        err => {
          this.toastr.warning('Kemaskini header gagal', '', { timeOut: 15000 });
        }
      );

    }
  }


  onDateChange(importedDate: Date) {

    const dateValue = new Date(importedDate);

    let sum;

    if (this.userRoleId == 1) {
      this.authservice.GetCustomOffice(this.user.customOfficeId).subscribe(x => {
        console.log(x);
        this.customOffice = x;
        if (this.customOffice.isNorthen) {
          sum = dateValue.getDate() + 7;
        } else {
          sum = dateValue.getDate() + 14;
        }

        this.calculateAndDisplayDateInfo(dateValue, sum);
      });

    } else if (this.userRoleId == 2) {
      if (this.staff.unit == 'UIP') {
        sum = dateValue.getDate() + 14;
      } else if (this.staff.unit == 'UIPBKH') {
        sum = dateValue.getDate() + 7;
      }

      this.calculateAndDisplayDateInfo(dateValue, sum);
    }
  }

  calculateAndDisplayDateInfo(dateValue: Date, sum: number | undefined) {
    const sumDate = new Date(dateValue.getFullYear(), dateValue.getMonth(), sum);
    this.selectedDateSum = sumDate;

    const day = ('0' + sumDate.getDate()).slice(-2); // Add leading zero if needed
    const month = ('0' + (sumDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const year = sumDate.getFullYear();

    this.notes = `${day}.${month}.${year}`;

    const today = new Date();
    const daysUntilDeadline = Math.ceil((sumDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (sumDate < today) {
      const daysLate = Math.ceil((today.getTime() - sumDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLate > 7) {
        this.notes += ` (Anda telah lewat ${daysLate} hari untuk sampel getah sampai ke makmal G-TACR Sg Petani)`;
      }
      this.showRemarks = true; // Display the remarks field
    } else if (daysUntilDeadline <= 3) {

      this.notes += ` (Perhatian: Anda mempunyai ${daysUntilDeadline} hari lagi untuk sampel getah sampai ke makmal G-TACR Sg. Petani.)`;


      this.showRemarks = false; // Hide the remarks field
    } else {
      this.showRemarks = false; // Hide the remarks field
    }

    console.log(this.selectedDateSum.toDateString());
  }


  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsEvidence + this.sample.k1DetailId + "_" + path, "_blank");
  }


  validForm() {
    if (
      // (this.sample.customNo == null || this.sample.customNo == "") ||
      // (this.sample.importedDate == null) ||
      // (this.sample.hsCode == null || this.sample.hsCode == "") ||
      // (this.sample.supplierName == null || this.sample.supplierName == "") ||
      // (this.sample.companyName == null || this.sample.companyName == "") ||
      // (this.sample.lorryNo == null || this.sample.lorryNo == "") ||
      // (this.sample.country == null || this.sample.country == "") ||
      // (this.sample.rubberTypeId == null || this.sample.rubberTypeId == 0) ||
      // (this.sample.sampleTypeId == null || this.sample.sampleTypeId == 0) ||
      (this.sample.quantity == null) ||
      (this.sample.drc == null) ||
      (this.sample.samplePropose == null || this.sample.samplePropose == "") ||
      (this.sample.driverName == null || this.sample.driverName == "") ||
      (this.sample.icDriver == null || this.sample.icDriver == "")

    ) {
      this.toastr.warning("Sila isi semua maklumat")
      return false;
    }
    return true;
  }


  enforceDRCLimit() {
    if (this.sample.drc > 100) {
      this.sample.drc = 0;
    }
  }

}
