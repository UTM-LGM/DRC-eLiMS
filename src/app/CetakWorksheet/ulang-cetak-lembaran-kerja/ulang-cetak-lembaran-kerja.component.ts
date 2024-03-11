import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/User/user.service';
import { Batch} from 'src/app/models/batch';
import { K1Detail } from 'src/app/models/k1Detail';
import { Staff } from 'src/app/models/staff';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ElimsService } from 'src/app/services/elims.service';
import { CetakWorksheetService } from '../cetak-worksheet.service';
import { Sample } from 'src/app/models/sample';
import { userDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-ulang-cetak-lembaran-kerja',
  templateUrl: './ulang-cetak-lembaran-kerja.component.html',
  styleUrls: ['./ulang-cetak-lembaran-kerja.component.css']
})
export class UlangCetakLembaranKerjaComponent {


  batches: Batch[] = [];
  samples: Sample[] = [];
  selectedBatchId: number;
  loginAs: any;
  roleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  statusCode: number
  k1Detail: K1Detail = {} as K1Detail;
  username: string
  checkAll: boolean = false
  lepassubmit: boolean = false
  user: userDTO = {} as userDTO
  mesYaTidak: any
  statusCodeId : number = 0 ;

  constructor(
    private elimsService: ElimsService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private cetakWorksheet: CetakWorksheetService,
  ) { }
  
  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        // this.username = this.staff.username
        // console.log(this.username)
        // this.getElimsSamplesByUsername6(this.username)
        this.roleGtacr = true
 
     
      })
    }

    this.statusCodeId = 7 ;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(data)
    })


  }



  


  // getElimsSamplesByUsername6(username: string) {
  //   this.elimsService.GetElimsSamplesByUsername(username, 6).subscribe(data => {
  //     this.samples = data;
  //     console.log(this.samples)
  //   },
  //   )
  // }


  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log('All Samples:', res);
      this.samples = res;
      // Filter samples based on statusCodeId == 6
      this.samples = res.filter(sample => sample.statusCodeId === 7);

      console.log('Filtered Samples:', this.samples);
    });
  }
  


  checkAllChanged() {
    if (this.checkAll) {
      for (let sample of this.samples) {
        sample.checked = true;
      }
      console.log(this.samples);
    } else {
      for (let sample of this.samples) {
        sample.checked = false;
      }
      console.log("All unchecked.");
    }
  }


  checkSingleChanged() {
    const selectedSamples: Sample[] = [];
    for (const sample of this.samples) {
      if (sample.checked) {
        selectedSamples.push(sample);
      }
    }
    console.log(selectedSamples);
  }


  displaySelected() {
    this.lepassubmit = true
    this.samples = this.samples.filter(sample => sample.checked);
  }

  generatePDF() {

    this.router.navigateByUrl("cetak-worksheet/" + this.k1Detail.k1DetailId)


  }


  onYesClick() {
    this.k1Detail.labelTestedOn = new Date();
    this.k1Detail.labelTestedBy = this.loginAs;

    for (const sample of this.samples) {
      let id = sample.k1DetailId;
      // const rubberTypeId = sample.rubberTypeId
      if (this.checkAll || sample.checked) {

        this.cetakWorksheet.PutUlangCetakLembaranKerja(id, this.k1Detail).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

      }
    }
  }

  
  onNoClick() {
    this.mesYaTidak = "tidak"
  }



}