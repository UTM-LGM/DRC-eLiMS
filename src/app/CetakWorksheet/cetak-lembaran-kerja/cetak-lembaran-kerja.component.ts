import { Component } from '@angular/core';
import { Batch } from '../../models/batch';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../User/user.service';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { CetakWorksheetService } from '../cetak-worksheet.service';

@Component({
  selector: 'app-cetak-lembaran-kerja',
  templateUrl: './cetak-lembaran-kerja.component.html',
  styleUrls: ['./cetak-lembaran-kerja.component.css']
})
export class CetakLembaranKerjaComponent {

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
  statusCodeId : number = 0 ;

  mesYaTidak: any

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
        this.roleGtacr = true
        // this.getStaffElimsSamples(this.staff)

      })
    }

    this.statusCodeId = 6 ;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(data)
    });

  }


  // getStaffElimsSamples(staff: Staff) {
  //   console.log(staff.username)
  //   this.elimsService.GetElimsBatchesWithSamplesStatusCode6(staff.username, 6).subscribe(data => {
  //     this.batches = data;
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
      this.samples = res.filter(sample => sample.statusCodeId === 6);

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

        this.cetakWorksheet.PutCetakLembaranKerja(id, this.k1Detail).subscribe(
          res => { this.mesYaTidak = "yes" }
        );

      }
    }
  }


  onNoClick() {
    this.mesYaTidak = "tidak"
  }



}
