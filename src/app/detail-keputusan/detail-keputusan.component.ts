import { Component, Input } from '@angular/core';
import { Result } from '../models/result';
import { AuthService } from '../services/auth/auth.service';
import { RekodKeputusanService } from '../Rekod-Keputusan-Sampel/rekod-keputusan.service';
import { UserService } from '../User/user.service';
import { Staff } from '../models/staff';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { RekodKelulusanService } from '../Kelulusan/rekod-kelulusan.service';
import { Directive, HostListener, ElementRef} from '@angular/core';

@Component({
  selector: 'app-detail-keputusan',
  templateUrl: './detail-keputusan.component.html',
  styleUrls: ['./detail-keputusan.component.css']
})
export class DetailKeputusanComponent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
    private toastr: ToastrService,
    private rekodKelulusanService: RekodKelulusanService,
    private el: ElementRef

  ) { }

  @Input() k1Detail: any;
  @Input() sample: any;
  @Input() result: any = {};
  @Input() inputDisable: any;
  @Input() inputKelulusan: any;

  estimate1: number = 0;
  estimate2: number = 0;
  average: number = 0;
  showForm: boolean = false;
  // k1Detail: K1Detail = {} as K1Detail;
  // result: Result = {} as Result;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  roles: any;
  staffRole: number[];
  staff: Staff = {} as Staff
  inputResult: Result = {} as Result;
  inputEstimate1: number = 0;
  inputEstimate2: number = 0;
  inputAverage: number = 0;
  file: any | null;
  buttonClicked: boolean = false;
  limitValue: string = '';
  dateFormat: string = 'dd/MM/yyyy';
  formattedDate: string;
  formattedInLabDate:string;
  formattedVerifiedDate:string;


  ngOnInit() {
    console.log(this.inputDisable)
    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    this.calculateAverage()

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        this.roleGtacr = true
        this.staffRole = res.staffRole
        // this.getStaffElimsSamples(this.staff)
        this.staffRole.forEach(element => {
          // console.log(element)
          this.rekodKeputusanService.GetStaffIdbyStaffRole(element).subscribe(data => {
            this.roles = data.filter(data => data.staffName != null);
            // console.log(data)
            // Sort the stationCodes by kodstesen
            this.roles.sort((a: { staffName: any; }, b: { staffName: any; }) => {
              const roleA = a.staffName;
              const roleB = b.staffName;
              // Compare the kodStesen values
              if (roleA < roleB) {
                return -1;
              } else if (roleA > roleB) {
                return 1;
              } else {
                return 0;
              }
            });
          });

        })
      })
    }
   this.formatDate();
  
   
  }



  addRekodKeputusan() {

    this.buttonClicked = true;

    this.result.result1 = this.average;

    this.k1Detail.testedBy = this.staff.username;
    this.result.k1DetailId = this.k1Detail.k1DetailId;
    this.result.testMethod = this.k1Detail.testMethodId;

    console.log(this.k1Detail)
    console.log(this.result)

    this.rekodKeputusanService.PostResult(this.result).subscribe(res1 => {
      console.log(res1)
      this.toastr.success('Rekod Keputusan berjaya disimpan', 'Berjaya');
      this.rekodKeputusanService.PutResult(this.k1Detail.k1DetailId, this.k1Detail).subscribe(
        res2 => { console.log(res2) }
      );

      this.rekodKeputusanService.PostProve(res1.k1DetailId, this.file).subscribe(() => {
        console.log('File uploaded successfully');
      },
        error => {
          console.error('Error uploading file:', error);
        })

    })
  }



  // calculateAverageFirst() {

  //   const dry1 = this.inputResult.dry1;
  //   const wet1 = this.inputResult.wet1;
  //   const dry2 = this.inputResult.dry2;
  //   const wet2 = this.inputResult.wet2;


  //   if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
  //     this.inputEstimate1 = (dry1 / wet1) * 100;
  //     this.inputEstimate1 = parseFloat(this.inputEstimate1.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.inputEstimate1 = 0;
  //   }

  //   if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
  //     this.inputEstimate2 = (dry2 / wet2) * 100;
  //     this.inputEstimate2 = parseFloat(this.inputEstimate2.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.inputEstimate2 = 0;
  //   }

  //   this.inputAverage = (this.inputEstimate1 + this.inputEstimate2) / 2;
  // }



  // calculateAverageFirst() {

  //   const dry1 = this.result.dry1;
  //   const wet1 = this.result.wet1;
  //   const dry2 = this.result.dry2;
  //   const wet2 = this.result.wet2;


  //   if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
  //     this.estimate1 = (dry1 / wet1) * 100;
  //     this.estimate1 = parseFloat(this.estimate1.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.estimate1 = 0;
  //   }

  //   if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
  //     this.estimate2 = (dry2 / wet2) * 100;
  //     this.estimate2 = parseFloat(this.estimate2.toFixed(2)); // Round to two decimal places
  //   } else {
  //     this.inputEstimate2 = 0;
  //   }

  //   this.average = (this.estimate1 + this.estimate2) / 2;

  //   this.getLimitValue();

  // }


  formatDate() {
    if (this.k1Detail.inLabOn) {
        const inLabDateObj = new Date(this.k1Detail.inLabOn);
        const inLabDay = inLabDateObj.getDate().toString().padStart(2, '0');
        const inLabMonth = (inLabDateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const inLabYear = inLabDateObj.getFullYear();
        this.formattedInLabDate = `${inLabDay}-${inLabMonth}-${inLabYear}`;
    } else {
        this.formattedInLabDate = ''; // Handle empty date case
    }

    if (this.k1Detail.verifiedOn) {
        const verifiedDateObj = new Date(this.k1Detail.verifiedOn);
        const verifiedDay = verifiedDateObj.getDate().toString().padStart(2, '0');
        const verifiedMonth = (verifiedDateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const verifiedYear = verifiedDateObj.getFullYear();
        this.formattedVerifiedDate = `${verifiedDay}-${verifiedMonth}-${verifiedYear}`;
    } else {
        this.formattedVerifiedDate = ''; // Handle empty date case
    }
}


calculateAverage() {
  this.result.testMethod = this.k1Detail.testMethodId;

  const dry1 = this.result.dry1;
  const wet1 = this.result.wet1;
  const dry2 = this.result.dry2;
  const wet2 = this.result.wet2;

  // RS-1/1
  if (this.result.testMethod == 8) {
    this.average = parseFloat(((wet1 + wet2) / 2).toFixed(2)); // Convert string to number

  } else {
    if (!isNaN(dry1) && !isNaN(wet1) && wet1 !== 0) {
      this.estimate1 = (dry1 / wet1) * 100;
      this.estimate1 = parseFloat(this.estimate1.toFixed(2)); // Round to two decimal places
    } else {
      this.estimate1 = 0;
    }

    if (!isNaN(dry2) && !isNaN(wet2) && wet2 !== 0) {
      this.estimate2 = (dry2 / wet2) * 100;
      this.estimate2 = parseFloat(this.estimate2.toFixed(2)); // Round to two decimal places
    } else {
      this.estimate2 = 0;
    }

    this.average = parseFloat(((this.estimate1 + this.estimate2) / 2).toFixed(2)); // Round to two decimal places

    this.result.result1 = this.average;
  }

  this.getLimitValue();
}



  getLimitValue() {

    // Calculate tolerance value
    const tolerance = Math.abs(this.estimate1 - this.estimate2);
    const tolerance1 = Math.abs(((this.estimate1 - this.estimate2) / this.average) * 100);
    // UPB/L/001
    if (this.result.testMethod == 1) {

      if (tolerance > 0.2) {
        this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
        return; // Abort saving if tolerance > 0.25
      }
    }

    // MS 281*
    else if (this.result.testMethod == 2) {
      if (tolerance > 0.1) {
        this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
        return;
      }
    }
    // ISO 126*
    else if (this.result.testMethod == 3) {
      if (tolerance1 > 0.1) {
        this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
        return;
      }
    }
    // MS 466*
    else if (this.result.testMethod == 4) {
      if (tolerance > 0.2) {
        this.limitValue = `Nilai purata melebihi > 0.2 (${tolerance}), sampel perlu diuji semula.`;
        return;
      }
    }
    // UPB/R/007
    else if (this.result.testMethod == 5) {
      if (tolerance > 0.1) {
        this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
        return;
      }
    }
    // MS 2531**
    else if (this.result.testMethod == 6) {
      if (tolerance1 < 0.001) {
        this.limitValue = `Nilai purata melebihi < 0.001 (${tolerance1}), sampel perlu diuji semula.`;
        return;
      }
    }
    // LGM/GTACR/R/01
    else if (this.result.testMethod == 7) {

      if (tolerance > 0.1) {
        this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance}), sampel perlu diuji semula.`;
        return;
      }
    }
    // RS 1-1**
    else if (this.result.testMethod == 8) {
      if (tolerance1 > 0.1) {
        this.limitValue = `Nilai purata melebihi > 0.1 (${tolerance1}), sampel perlu diuji semula.`;
        return;
      }
    }

  }



  
  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.result.prove = event.target.files[0].name;
    console.log(this.result.prove);
  }

  viewFile(path: string): void {
    window.open(environment.baseApiUrlElimsProve + this.result.k1DetailId + "_" + path, "_blank");
  }



formatDecimal(field: string, event: any, finalize: boolean = false) {
    const inputElement: HTMLInputElement = event.target;
    let inputValue: string = inputElement.value;
    const originalCaretPosition = inputElement.selectionStart;

    // Remove any non-numeric characters except the decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Split input into integer and decimal parts
    let [integerPart, decimalPart] = inputValue.split('.');

    // Ensure integer part is not empty
    // integerPart = integerPart || '0';

    // If no decimal part exists, initialize it
    decimalPart = decimalPart || '';

    // Ensure no more than four decimal places
    decimalPart = decimalPart.substring(0, 4);

    // Combine integer and decimal parts, always showing the decimal point
    inputValue = integerPart + '.' + decimalPart.padEnd(4, '0');

    if (finalize) {
        // If finalizing (on blur), ensure the number has exactly four decimal places
        inputValue = parseFloat(inputValue).toFixed(4);
    }

    // Update the input value
    inputElement.value = inputValue;

    // Update the ngModel with the formatted value
    this.result[field] = parseFloat(inputValue);

    // Restore the caret position
    if (!finalize && originalCaretPosition !== null) {
        const newPosition = originalCaretPosition <= inputElement.value.length ? originalCaretPosition : inputElement.value.length;
        inputElement.setSelectionRange(newPosition, newPosition);
    }
}



}
