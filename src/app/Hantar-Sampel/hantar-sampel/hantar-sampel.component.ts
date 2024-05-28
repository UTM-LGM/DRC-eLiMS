import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrclimstrainingService } from '../../services/drclimstraining.service';
import { Sample } from '../../models/sample';
import { Batch } from '../../models/batch';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import 'jspdf-autotable';
import { GetahBongkahService } from '../../services/getah-bongkah.service';
import { ElimsService } from '../../services/elims.service';
import { environment } from '../../environments/environment';
import {  FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { UipRefRunNo } from 'src/app/models/uipRefRunNo';
import { UipbkhRefRunNo } from 'src/app/models/uipbkhRefRunNo';
import { UipbkhMemoRunNo } from 'src/app/models/uipbkhMemoRunNo';
import { UipMemoRunNo } from 'src/app/models/uipMemoRunNo';
import { UipSampleRunNo } from 'src/app/models/uipSampleRunNo';
import { UipbkhSampleRunNo } from 'src/app/models/uipbkhSampleRunNo';
import { HantarSampelService } from '../hantar-sampel.service';
import { UserService } from 'src/app/User/user.service';
import * as html2pdf from 'html2pdf.js';
import { loginImporter } from 'src/app/models/loginImporters';


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
  // sampleType: SampleType = {} as SampleType
  // sampleType: SampleType = {} as SampleType
  uipRefRunNoes: any
  thisyear: string
  role: any

  batches: Batch[] = [];
  samples: Sample[] = [];
  runNo: number
  // selectedSamples: any[] = [];
  selectedSamples: Sample[] = [];

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
  userRoleId: any;
  roleForwarder: boolean
  roleUip: boolean
  roleImporter: boolean
  generatedUipRegNo: string;

  selectedRubberType: string = ""; // Initialize with a default value
  checkboxSelected: boolean = false;
  
  filteredSamples: Sample[] = []; // Create a new array to store filtered samples
  filteredSamplesTemp: Sample[] = []; // Create a new array to store filtered samples

  uipSampleRunNoes: any
  uipbkhMemoRunNo: UipbkhMemoRunNo = {} as UipbkhMemoRunNo
  uipMemoRunNo: UipMemoRunNo = {} as UipMemoRunNo
  uipSampleRunNo: UipSampleRunNo = {} as UipSampleRunNo
  uipbkhSampleRunNo: UipbkhSampleRunNo = {} as UipbkhSampleRunNo
  year: string
  username: string
  statusCode: number
  sahPenghantaranClicked = false;
  companies: any
  selectedCompanyName: string = "";
  testMethods: any;
  showTestMethods: boolean = false
  showPdfLampiran: boolean = false;
  pdfGenerated: boolean = false; // Track whether the PDF is generated
  pdfSuratIringan: boolean = false;
  isLampiran: boolean = false;
  selectedBatchId: number;
  batchId: number
  lampiranVisible = false;
  isSuratIringan: boolean = false;
  groupedSamples: any[];
  resetcalculateSelectedCheckboxCount  : any[] = []
  importer: loginImporter = {} as loginImporter
  daftarClicked = false;
  
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
    private route: ActivatedRoute,

  ) {
  }

  ngOnInit() {
    //byusername 
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
        this.username = this.user.username
        this.getElimsSamplesByUsername2(this.username)
        this.roleForwarder = true
        this.roleUip = false
        this.statusCode = 3

      })
    }
    else if (this.userRoleId == 2) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res
        this.username = this.staff.username
        console.log(this.username)
        this.getElimsSamplesByUsername2(this.username)
        this.roleForwarder = false
        this.roleUip = true
        this.statusCode = 3
      })
    }

    
    if (this.userRoleId == 3) {
      this.userService.GetImporterInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.importer = res
        this.username = this.importer.username
        this.getElimsSamplesByUsername2(this.username)
        this.roleForwarder = false
        this.roleUip = false
        this.roleImporter = true
        this.statusCode = 3

      })
    }



    this.elimsService.GetElimsBankCodes().subscribe(data => {
      this.bankCodes = data
    });

    const defaultTestMethods = {
      'Lateks': 1,
      'Getah Bongkah': 7,
    };

    this.batch.testMethodId = defaultTestMethods[this.selectedRubberType];

    this.setDefaultTestMethod();

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
    
    for (const sample of this.samples) {
      if (sample.checked) {
        this.selectedSamples.push(sample);
      }
    }
    console.log(this.selectedSamples);
    // this.onTestMethodChange();
    this.calculateAmount();

    this.selectedOptionChanged();
  }

  displaySelected() {
    if (this.selectedOption === 'CEK') {
      if ((this.batch.bankCode == null || this.batch.bankCode == '') ||
        (this.batch.testMethodId == null) ||
        (this.batch.chequeNo == null || this.batch.chequeNo == '')) {
        this.toastr.warning('Sila isikan semua maklumat yang bertanda *');
        return false;
      }
    } else if (this.selectedOption === 'EFT') {
      if ((this.batch.bankCode == null || this.batch.bankCode == '') ||
        (this.batch.transactionNo == null || this.batch.transactionNo == '') ||
        (this.batch.testMethodId == null) ||
        (this.batch.date == null) ||
        (this.file == null || this.file == '')) {
        this.toastr.warning('Sila isikan semua maklumat yang bertanda *');
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
      // this.batch.chequeAmount = 0
      this.batch.chequeNo = ""
    }

    this.batch.letterPrinted = 'Y';

    // this.batchData.isFastTrack = true;
    this.hantarSampelService.PostElimsBatches(this.batch, this.username)
      .subscribe(
        res => {


          console.log(res.batchId);
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
          console.log("maklumat batchId2: ", this.batchId2);
          console.log("maklumat sample: ", this.sample);


          const requests = [];
          
          if (this.selectedRubberType == "Lateks") {
            this.drclimstrainingService.PostLtxBatches(this.batchId2, this.batch, this.username).subscribe(resLtxBatch => {
              console.log(resLtxBatch.batchId)
              this.sample.batchId = resLtxBatch.batchId
              for (const sample of this.samples) {
                let id = sample.k1DetailId;
                this.drclimstrainingService.PutLtxSampleBatchId(id, this.sample).subscribe(() => { })
              }
            })
          }


          else if (this.selectedRubberType == "Getah Bongkah") {
            this.getahBongkahService.PostBRBatches(this.batchId2, this.batch, this.username).subscribe(resBRBatch => {
              console.log(resBRBatch.batchId)
              this.sample.batchId = resBRBatch.batchId
              for (const sample of this.samples) {
                let id = sample.k1DetailId;
                this.getahBongkahService.PutBRSampleBatchId(id, this.sample).subscribe(() => { })
              }
            })
          }

          for (const sample of this.samples) {
            let id = sample.k1DetailId;

            // const rubberTypeId = sample.rubberTypeId
            console.log(sample.k1HeaderId)

            this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
              res => {
                this.mesYaTidak = "yes";
              }
            );


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

  // this.drclimstrainingService.PostLtxBatches(this.batchId2, this.batch, this.username).subscribe(() => { console.log("postLatex") })
  // console.log(this.sample)
  // this.drclimstrainingService.PutLtxSampleBatchId(id, this.sample)
  //   .subscribe(() => { console.log("putLatex") }, (error) => { console.log("error " + error) })


  onNoClick() {
    this.mesYaTidak = "tidak"
  }

  back() {
    this.hantarSampel = false
    this.router.navigate(['hantar-sampel'])
  }


  suratIringan(batchData: Batch) {

    this.selectedOptionChanged();
    for (const sample of this.samples) {
      let id = sample.k1DetailId;

      this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
        res => {
          this.mesYaTidak = "yes";
        }
      );

      // this.router.navigateByUrl("surat-iringan/" + batchData.batchId)
      this.generatePdfSuratIringan()
      // const suratIringanUrl = this.router.createUrlTree(["/Elims/surat-iringan/", batchData.batchId]).toString();
      // window.open(suratIringanUrl, '_blank'); // Open in a new tab
      this.isSuratIringan = true;
      this.isLampiran = false;
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

      this.generatePdf(batchData.batchId);


      this.isLampiran = true;
      this.isSuratIringan = false;
    }
  }

  @ViewChild('pdfLampiran', { static: true }) pdfLampiran: ElementRef | undefined;

  // print() {
  //   const printContents = this.pdfLampiran?.nativeElement.innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  // }

  generatePdf(batchId: number): void {
    const element = document.getElementById('pdfLampiran');
    console.log(element);

    // Introduce a slight delay (e.g., 500 milliseconds) to allow the content to render
    setTimeout(() => {
      const opt = {
        margin: 0.4,
        filename: `lampiran_${batchId}.pdf`, // Use batchId in the filename
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, scrollY: 0, scrollX: 0, windowWidth: document.body.scrollWidth, windowHeight: document.body.scrollHeight },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `lampiran_${batchId}.pdf`; // Use batchId in the download link
        downloadLink.click();
      });
      html2pdf(element, opt);
    }, 500); // Adjust the delay as needed
  }





  generatePdfSuratIringan(): void {
    const element = document.getElementById('suratIringan');
    console.log(element);

    // Introduce a slight delay (e.g., 500 milliseconds) to allow the content to render
    setTimeout(() => {
      const opt = {
        margin: 0.4,
        filename: 'lampiran.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, scrollY: 0, scrollX: 0, windowWidth: document.body.scrollWidth, windowHeight: document.body.scrollHeight },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      html2pdf().from(element).set(opt).outputPdf().then((pdfBlob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'lampiran.pdf';
        downloadLink.click();
      });
      html2pdf(element, opt);
    }, 500); // Adjust the delay as needed
  }



  memo(batchData: Batch) {
    
    this.daftarClicked = true;

    // if (this.staff.unit == "UIP") {
      
    //   // Iterate through sorted samples
    //   for (const sample of this.samples) {
    //     console.log(sample.k1DetailId);
    //     let id = sample.k1DetailId;
    //     console.log("ini maklumat sample loop : ", sample);
    //     ////////////PutUipSampleRunNo/////////////
    //     this.hantarSampelService.PutUipSampleRunNo(this.thisyear).subscribe(resUipRunNo => {
    //       console.log(resUipRunNo);
    //       this.k1Detail.sampleRunNo = "UIP/" + resUipRunNo.runNo + "/" + resUipRunNo.year;
    //       this.k1Detail.statusCodeId = 5;
    
    //       this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
    //         resBatch => {
    //           console.log(this.k1Detail);
    //           this.mesYaTidak = "yes";
    //           console.log(resBatch);
    //           this.hantarSampelService.PutUipMemoRunNo(this.thisyear).subscribe(res => {
    //             this.batch.uipRegNo = "LGM/BEPP/UIP/500-5/" + res.year + "(" + res.runNo + ")";
    //             this.hantarSampelService.PutBatchUipRefRunNo(batchData.batchId, this.batch).subscribe(res => { });
    //             console.log(res);
    //             this.router.navigateByUrl("memo/" + batchData.batchId)
    //               .then(() => {
    //               });
    //           });
    //         });
    //     });
    //   }
    // }


    if (this.staff.unit === "UIP") {
      // Sorting samples by k1DetailId
      this.samples.sort((a, b) => a.k1DetailId - b.k1DetailId);
    
      // Initialize promise chain with a resolved promise
      let promiseChain = Promise.resolve();
    
      // Iterate through sorted samples and chain HTTP requests
      this.samples.forEach(sample => {
        promiseChain = promiseChain.then(() => {
          return new Promise((resolve, reject) => {
            this.hantarSampelService.PutUipSampleRunNo(this.thisyear).subscribe(resUipRunNo => {
              console.log(resUipRunNo);
              this.k1Detail.sampleRunNo = "UIP/" + resUipRunNo.runNo + "/" + resUipRunNo.year;
              this.k1Detail.statusCodeId = 5;
    
              let id = sample.k1DetailId;
              this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
                resBatch => {
                  console.log(this.k1Detail);
                  this.mesYaTidak = "yes";
                  console.log(resBatch);
                  resolve(); // Resolve the promise to continue the chain
                },
                error => {
                  reject(error); // Reject the promise if an error occurs
                }
              );
            });
          });
        });
      });
    
      // After all HTTP requests are completed
      promiseChain.then(() => {
        this.hantarSampelService.PutUipMemoRunNo(this.thisyear).subscribe(res => {
          this.batch.uipRegNo = "LGM/BEPP/UIP/500-5/" + res.year + "(" + res.runNo + ")";
          this.hantarSampelService.PutBatchUipRefRunNo(batchData.batchId, this.batch).subscribe(res => { });
          console.log(res);
          this.router.navigateByUrl("memo/" + batchData.batchId)
            .then(() => {
              // Handle success
            })
            .catch(error => {
              // Handle error
            });
        });
      });
    }
  

    else if (this.staff.unit == "UIPBKH") {


        // Sorting samples by k1DetailId
        this.samples.sort((a, b) => a.k1DetailId - b.k1DetailId);
    
        // Initialize promise chain with a resolved promise
        let promiseChain = Promise.resolve();
      
        // Iterate through sorted samples and chain HTTP requests
        this.samples.forEach(sample => {
          promiseChain = promiseChain.then(() => {
            return new Promise((resolve, reject) => {
              this.hantarSampelService.PutUipbkhSampleRunNo(this.thisyear).subscribe(resUipbkhRunNo => {
                console.log(resUipbkhRunNo);
                this.k1Detail.sampleRunNo = "UIPBKH/" + resUipbkhRunNo.runNo + "/" + resUipbkhRunNo.year;
                this.k1Detail.statusCodeId = 5;
      
                let id = sample.k1DetailId;
                this.hantarSampelService.PutElimsSampleBatchId(id, this.k1Detail).subscribe(
                  resBatch => {
                    console.log(this.k1Detail);
                    this.mesYaTidak = "yes";
                    console.log(resBatch);
                    resolve(); // Resolve the promise to continue the chain
                  },
                  error => {
                    reject(error); // Reject the promise if an error occurs
                  }
                );
              });
            });
          });
        });
      
        // After all HTTP requests are completed
        promiseChain.then(() => {
          this.hantarSampelService.PutUipbkhMemoRunNo(this.thisyear).subscribe(res => {
            this.batch.uipRegNo = "LGM/BEPP/UIPBKH/500-5/" + res.year + "(" + res.runNo + ")";
            this.hantarSampelService.PutBatchUipRefRunNo(batchData.batchId, this.batch).subscribe(res => { });
            console.log(res);
            this.router.navigateByUrl("memo/" + batchData.batchId)
              .then(() => {
                // Handle success
              })
              .catch(error => {
                // Handle error
              });
          });
        });

    }
  }


  calculateAmount() {

    console.log('onTestMethodChange called');
    console.log('Selected testMethodId:', this.batch.testMethodId);

   this.batch.chequeAmount = 0;
    this.selectedSamples = this.samples.filter((sample) => sample.checked);

    for (let sample of this.selectedSamples) {
      let baseAmount = 0;



      if (this.userRoleId == 1 || this.userRoleId==3) {

        if (this.batch.testMethodId == 8) {
          this.batch.chequeAmount += 108;

          // If Fast Track is selected, double the amount and include SST
          this.batch.chequeAmount += this.batch.isFastTrack ? 108 : 0;
        } else if (this.batch.testMethodId == 7) {
          this.batch.chequeAmount += 162;

          // If Fast Track is selected, double the amount and include SST
          this.batch.chequeAmount += this.batch.isFastTrack ? 162 : 0;
        }

        else {
          if (sample.rubberType == 'Lateks') {
            baseAmount = 26;
          } else if (sample.rubberType == 'Getah Bongkah') {
            baseAmount = 55;
          }

          // Apply 6% SST
          const sstRate = 0.08;
          const sstAmount = baseAmount * sstRate;

          // If Fast Track is selected, double the amount and include SST
          this.batch.chequeAmount += this.batch.isFastTrack ? 2 * (baseAmount + sstAmount) : baseAmount + sstAmount;
        }
      }


      else {
        if (sample.rubberType == 'Lateks') {
          baseAmount = 26;
        } else if (sample.rubberType == 'Getah Bongkah') {
          baseAmount = 55;
        }

        // Apply 6% SST
        const sstRate = 0.08;
        const sstAmount = baseAmount * sstRate;

        // If Fast Track is selected, double the amount and include SST
        this.batch.chequeAmount += this.batch.isFastTrack ? 2 * (baseAmount + sstAmount) : baseAmount + sstAmount;
      }
    }

    this.batch.chequeAmount = parseFloat(this.batch.chequeAmount.toFixed(2));
  }


  setDefaultTestMethod() {
    const defaultTestMethods = {
      'Lateks': 1,
      'Getah Bongkah': 5,
    };

    this.batch.testMethodId = defaultTestMethods[this.selectedRubberType];
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

 

  filterSamplesByRubberType(e: any) {

    this.companies = new Set<string>();

    if (!this.samples || this.selectedRubberType === undefined || this.selectedRubberType === null) {
      // Handle the case when this.samples is undefined or null, or selectedRubberType is undefined or null
      return;
    }

    this.filteredSamples = this.filteredSamplesTemp = this.samples.filter(sample => sample.rubberType === this.selectedRubberType);
    console.log(this.filteredSamples);

    this.companies = new Set<string>();

    this.filteredSamples.forEach(element => {
      const key = (element.importerName || '');
      if (key.trim() !== '') {
        this.companies.add(key);
      }
    });

    console.log(Array.from(this.companies)); // Convert Set to Array for logging

    // Update the condition to match the values of your radio buttons
    if (this.selectedRubberType === "Lateks") {
      this.elimsService.GetRefTestMethodByRubberType(1).subscribe(data => {
        this.testMethods = data;
        console.log(data);
      });
    } else if (this.selectedRubberType === "Getah Bongkah") {
      this.elimsService.GetRefTestMethodByRubberType(2).subscribe(data => {
        this.testMethods = data;
        console.log(data);
      });
    }

    this.showTestMethods = true;

    this.setDefaultTestMethod();
  }

  filterSamplesByCompany(event: any) {

    this.batch.chequeAmount = 0;
    // Clear the selected checkboxes array when a new company name is chosen
    // this.checkboxSelected = false;
    for (let sample of this.samples) {
      sample.checked = false;
      this.selectedSamples = []
    }

    this.filteredSamples = this.filteredSamplesTemp.filter(sample => {
      return (
        (sample.importerName && sample.importerName.includes(event.target.value))
      );
    });

    // Uncheck all checkboxes when filtering by company
    this.filteredSamples.forEach(sample => sample.checked = false);
  
    console.log('Filtered samples:', this.filteredSamples);
}


  toggleLampiranVisibility(): void {
    this.lampiranVisible = !this.lampiranVisible;
  }



  showSuratIringan() {
    this.isSuratIringan = true;
    this.isLampiran = false;
  }

  showLampiran() {
    this.isLampiran = true;
    this.isSuratIringan = false;
  }
}

