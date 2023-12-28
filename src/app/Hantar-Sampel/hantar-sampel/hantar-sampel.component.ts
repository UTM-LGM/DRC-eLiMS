import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { Sample } from '../../models/sample';
import { Batch } from '../../models/batch';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import 'jspdf-autotable';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { ElimsService } from '../../services/elims.service';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { SampleType } from 'src/app/models/sampleType';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { UipbkhMemoRunNo } from 'src/app/models/uipbkhMemoRunNo';
import { UipMemoRunNo } from 'src/app/models/uipMemoRunNo';
import { UipSampleRunNo } from 'src/app/models/uipSampleRunNo';
import { UipbkhSampleRunNo } from 'src/app/models/uipbkhSampleRunNo';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';

import jsPDF from 'jspdf';


@Component({
  selector: 'app-hantar-sampel',
  templateUrl: './hantar-sampel.component.html',
  styleUrls: ['./hantar-sampel.component.css']
})
export class HantarSampelComponent {

  addPenghantaranBatchRequest: Sample = {} as Sample
  batch: Batch = {} as Batch;
  batchData: Batch = {} as Batch;
  sample: Sample = {} as Sample;
  user: userDTO = {} as userDTO
  k1Detail: K1Detail = {} as K1Detail
  staff: Staff = {} as Staff
  uipRefRunNo: UipRefRunNo = {} as UipRefRunNo
  uipbkhRefRunNo: UipbkhRefRunNo = {} as UipbkhRefRunNo
  sampleType: SampleType = {} as SampleType

  uipRefRunNoes: any
  thisyear: string
  role: any

  batches: Batch[] = [];
  samples: Sample[] = [];
  runNo: number
  selectedSamples: any[] = [];

  checkAll: boolean = false
  hantarSampel: boolean = false
  bankCodes: any
  mesYaTidak: any
  batchId2: number
  selectedOption: string;
  file: any | null
  chequeAmount: number = 0;
  loginAs: any;
  statusCodeId = 2;
  latexSample: any
  batchForm: FormGroup;
  disableSimpanButton: boolean = true;
  disableNextBtn: boolean = true;

  selectedCheckboxCount: number = 0;
  rubberTypes: any
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  generatedUipRegNo: string;

  selectedRubberType: string = ""; // Initialize with a default value
  filteredSamples: Sample[] = []; // Create a new array to store filtered samples
  checkboxSelected: boolean = false;

  uipSampleRunNoes: any
  uipbkhMemoRunNo: UipbkhMemoRunNo = {} as UipbkhMemoRunNo
  uipMemoRunNo: UipMemoRunNo = {} as UipMemoRunNo
  uipSampleRunNo: UipSampleRunNo = {} as UipSampleRunNo
  uipbkhSampleRunNo: UipbkhSampleRunNo = {} as UipbkhSampleRunNo
  year: string
  username: string
  statusCode: number
  sahPenghantaranClicked = false;


  baseApiUrl: string = environment.baseApiUrlElims;

  constructor(
    private drclimstrainingService: DrclimstrainingService,
    private getahBongkahService: GetahBongkahService,
    private elimsService: ElimsService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,


  ) {
  }

  ngOnInit() {
    //byusername 
    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.userService.GetUserInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.user = res
        this.username = this.user.username
        this.getElimsSamplesByUsername2(this.username)
        this.roleForwarder = true
        this.roleUip = false
        this.statusCode = 3

      })
    }
    else if (this.roleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res
        this.username = this.staff.username
        console.log(this.username)
        this.getElimsSamplesByUsername2(this.username)
        this.roleForwarder = false
        this.roleUip = true
        this.statusCode = 5
      })
    }

    this.elimsService.GetElimsBankCodes().subscribe(data => {
      this.bankCodes = data
    });

  }

  getElimsSamplesByUsername2(username: string) {
    this.elimsService.GetElimsSamplesByUsername(username, 2).subscribe(data => {
      this.samples = data;
      console.log(this.samples)
    },
    )
  }

  selectedOptionChangedRubberType() {

    const isCheckboxSelected = this.samples.some(sample => sample.checked);
    const isPaymentOptionSelected = this.selectedOption === 'EFT' || this.selectedOption === 'CEK';

    this.disableSimpanButton = !isCheckboxSelected || !isPaymentOptionSelected;

  }

  selectedOptionChanged() {
    const isCheckboxSelected = this.samples.some(sample => sample.checked);
    const isPaymentOptionSelected = this.selectedOption === 'EFT' || this.selectedOption === 'CEK';

    this.disableSimpanButton = !isCheckboxSelected || !isPaymentOptionSelected;
    this.disableNextBtn = !isCheckboxSelected;

  }

  checkAllChanged() {
    if (this.checkAll) {
      for (let sample of this.samples) {
        sample.checked = true;
      }
      console.log(this.samples);
      this.calculateAmount();
    } else {
      for (let sample of this.samples) {
        sample.checked = false;
      }
      console.log("All unchecked.");
      this.chequeAmount = 0;
      this.selectedSamples = [];
    }

    this.selectedOptionChanged();
  }


  checkSingleChanged() {
    const selectedSamples = [];
    for (const sample of this.samples) {
      if (sample.checked) {
        selectedSamples.push(sample);
      }
    }
    console.log(selectedSamples);
    this.calculateAmount();

    this.selectedOptionChanged();
  }

  displaySelected() {
    if (this.selectedOption === 'CEK') {
      if ((this.batch.bankCode == null || this.batch.bankCode == '') ||
        (this.batch.chequeNo == null || this.batch.chequeNo == '')) {
        this.toastr.warning('Sila isikan maklumat Cek');
        return false;
      }
    } else if (this.selectedOption === 'EFT') {
      if ((this.batch.bankCode == null || this.batch.bankCode == '') ||
        (this.batch.transactionNo == null || this.batch.transactionNo == '') ||
        (this.batch.date == null) ||
        (this.file == null || this.file == '')) {
        this.toastr.warning('Sila isikan maklumat EFT');
        return false;
      }
    }

    this.hantarSampel = true;
    this.samples = this.samples.filter(sample => sample.checked);
    return true;
  }


  displaySelectedUIP() {
    this.hantarSampel = true;
    this.samples = this.samples.filter(sample => sample.checked);
    return true;
  }


  // images
  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.batch.receipt = event.target.files[0].name;
    console.log(this.file);
  }


  sahPenghantaran(batchData: Batch) {
    if (this.selectedOption == "CEK") {
      this.batch.transactionNo = ""
      const dateString = '0000-00-00';
      this.batch.date = new Date(dateString);
      this.file = null
    } else if (this.selectedOption == "EFT") {
      this.batch.chequeAmount = 0
      this.batch.chequeNo = ""
    }

    this.hantarSampelService.PostElimsBatches(this.batch, this.username)
      .subscribe(
        res => {

          this.batchData.batchId = res.batchId
          this.batchId2 = res.batchId

          //this.k1Detail.sentBy = this.sample.sentBy = this.user.username
          // this.sample.sentBy = this.user.username
          // var nextyear = new Date().getFullYear() + 1
          // this.thisyear = nextyear.toString()
          this.thisyear = new Date().getFullYear().toString()

          this.k1Detail.batchId = this.batchId2
          this.k1Detail.sentOn = new Date();
          this.k1Detail.sentBy = this.username
          this.sample.batchId = this.batchId2
          this.sample.sentOn = new Date();
          this.sample.sentBy = this.username


          this.k1Detail.statusCodeId = this.sample.statusCodeId = this.statusCode

          console.log("maklumat k1detail: ", this.k1Detail);

          for (const sample of this.samples) {
            let id = sample.k1DetailId;

            const rubberTypeId = sample.rubberTypeId
            console.log(sample.k1HeaderId)

            this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
              res => {
                this.mesYaTidak = "yes";
              }
            );

            if (rubberTypeId == 1) {

              this.drclimstrainingService.PostLtxBatches(this.batchId2, this.batch, this.username).subscribe(() => { console.log("postLatex") })
              console.log(this.sample)
              this.drclimstrainingService.PutLtxSampleBatchId(id, this.sample)
                .subscribe(() => { console.log("putLatex") }, (error) => { console.log("error " + error) })

            }

            else if (rubberTypeId == 2) {
              this.getahBongkahService.PostBRBatches(this.batchId2, this.batch, this.username).subscribe(() => { })
              this.getahBongkahService.PutBRSampleBatchId(id, this.sample).subscribe(() => { })
            }

            if (this.file != null) {
              this.hantarSampelService.UploadReceipt(this.batchData.batchId, this.file).subscribe(() => {
                console.log('File uploaded successfully');
              });
            }
          }

          if (this.file != null) {
            this.hantarSampelService.UploadReceipt(this.batchData.batchId, this.file).subscribe(() => {
              console.log('File uploaded successfully');
            });
          }

        }
      )

    this.sahPenghantaranClicked = true;
  }




  onNoClick() {
    this.mesYaTidak = "tidak"
  }

  back() {
    this.hantarSampel = false
    this.router.navigate(['hantar-sampel'])
  }


  suratIringan(batchData: Batch) {
    for (const sample of this.samples) {
      let id = sample.k1DetailId;

      this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
        res => {
          this.mesYaTidak = "yes";
        }
      );

      this.router.navigateByUrl("surat-iringan/" + batchData.batchId)

      // const suratIringanUrl = this.router.createUrlTree(["/Elims/surat-iringan/", batchData.batchId]).toString();
      // window.open(suratIringanUrl, '_blank'); // Open in a new tab

    }
  }


  


  
  lampiran(batchData: Batch) {
    for (const sample of this.samples) {
      let id = sample.k1DetailId;

      this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
        res => {
          this.mesYaTidak = "yes";
        }
      );

      // this.router.navigateByUrl("lampiran/" + batchData.batchId)

      const suratIringanUrl = this.router.createUrlTree(["/Elims/lampiran", batchData.batchId]).toString();
      window.open(suratIringanUrl, '_blank'); // Open in a new tab

    }
  }



  memo(batchData: Batch) {


    if (this.staff.unit == "UIP") {
      for (const sample of this.samples) {
        let id = sample.k1DetailId;
        const rubberTypeId = sample.rubberTypeId
        console.log("ini maklumat sample loop : ", sample)
        ////////////PutUipSampleRunNo/////////////
        this.hantarSampelService.PutUipSampleRunNo(this.thisyear).subscribe(resUipRunNo => {
          console.log(resUipRunNo)
          this.k1Detail.sampleRunNo = "UIP/" + resUipRunNo.runNo + "/" + resUipRunNo.year
          this.k1Detail.statusCodeId = 5

          this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
            resBatch => {
              console.log(this.k1Detail)
              this.mesYaTidak = "yes";
              console.log(resBatch)
              this.hantarSampelService.PutUipMemoRunNo(this.thisyear).subscribe(res => {
                this.batch.uipRegNo = "LGM/BEPP/UIP/500-5/" + res.year + "(" + res.runNo + ")";
                this.hantarSampelService.PutBatchUipRefRunNo(batchData.batchId, this.batch).subscribe(res => { });
                console.log(res);
                this.router.navigateByUrl("memo/" + batchData.batchId)
                  .then(() => {
                  });
              });
            });
        })
      }

    }


    else if (this.staff.unit == "UIPBKH") {
      for (const sample of this.samples) {
        let id = sample.k1DetailId;
        const rubberTypeId = sample.rubberTypeId
        console.log("ini maklumat sample loop : ", sample)
        this.hantarSampelService.PutUipbkhSampleRunNo(this.thisyear).subscribe(resUipbkhRunNo => {
          this.k1Detail.sampleRunNo = "UIPBKH/" + resUipbkhRunNo.runNo + "/" + resUipbkhRunNo.year
          this.k1Detail.statusCodeId = 5
          this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
            resBatch => {
              this.mesYaTidak = "yes";
            }
          );
        })
      }

      this.hantarSampelService.PutUipbkhMemoRunNo(this.thisyear).subscribe(res => {
        this.batch.uipRegNo = "LGM/BEPP/UIPBKH/500-5/" + res.year + "(" + res.runNo + ")";
        this.hantarSampelService.PutBatchUipRefRunNo(batchData.batchId, this.batch).subscribe(res => { });
        console.log(res);
        this.router.navigateByUrl("memo/" + batchData.batchId)
          .then(() => {
          });
      });

    }

  }


  // calculateAmount() {
  //   this.batch.chequeAmount = 0;
  //   this.selectedSamples = this.samples.filter((sample) => sample.checked);
  //   for (let sample of this.selectedSamples) {
  //     if (sample.rubberType === 'Lateks') {
  //       this.batch.chequeAmount += 23;
  //     } else if (sample.rubberType === 'Getah Bongkah') {
  //       this.batch.chequeAmount += 49;
  //     }
  //   }
  // }

  calculateAmount() {
    this.batch.chequeAmount = 0;
    this.selectedSamples = this.samples.filter((sample) => sample.checked);

    for (let sample of this.selectedSamples) {
      let baseAmount = 0;

      if (sample.rubberType === 'Lateks') {
        baseAmount = 23;
      } else if (sample.rubberType === 'Getah Bongkah') {
        baseAmount = 49;
      }

      // Apply 6% SST
      const sstRate = 0.06;
      const sstAmount = baseAmount * sstRate;

      // Add the base amount and SST amount to the total cheque amount
      this.batch.chequeAmount += baseAmount + sstAmount;
    }
  }


  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsReceipt + this.batchId2 + "_" + path, "_blank");
  }

  updateSelectedCheckboxCount() {
    this.selectedCheckboxCount = this.samples.filter(sample => sample.checked).length;
    this.checkboxSelected = this.samples.some((sample) => sample.checked);

  }

  calculateSelectedCheckboxCount() {
    this.selectedCheckboxCount = this.samples.length;
  }

  filterSamplesByRubberType() {
    this.filteredSamples = this.samples.filter(sample => sample.rubberType === this.selectedRubberType);
  }

}

