import { Component } from '@angular/core';
import { Batch } from '../models/batch';
import { ElimsService } from '../services/elims.service';
import { Sample } from '../models/sample';
import { K1Detail } from '../models/k1Detail';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../User/user.service';
import { AuthService } from '../services/auth/auth.service';
import { userDTO } from '../models/userDTO';
import { Staff } from '../models/staff';
import { CetakLabelService } from '../Cetak-Label/cetak-label.service';

@Component({
  selector: 'app-daftar-terima-sampel',
  templateUrl: './daftar-terima-sampel.component.html',
  styleUrls: ['./daftar-terima-sampel.component.css']
})
export class DaftarTerimaSampelComponent {

  batch: Batch = {} as Batch;
  samples: Sample[] = [];
  batches: Batch[] = [];
  k1Details: K1Detail[] = [];
  batchId: number;
  selectedBatchId: number;
  unregisteredSampleCount: number = 0;
  myForm: FormGroup;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  roleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff 
  customNosForm: FormGroup;

 additionalCustomNosData: string[] = [];
 username: string;

  constructor(
    private elimsService: ElimsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {  
    this.customNosForm = this.fb.group({
    customNos: this.fb.array([1]),
  });}

  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 3) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        console.log(res)
        this.authService.changeUser(res);
        this.staff = res
        // this.username = this.staff.username
        // console.log(this.username)
        // this.getElimsSamplesByUsername3(this.username)
        this.roleGtacr = true
      })
    }

    this.elimsService.GetElimsAllBatch().subscribe(data => {
      this.batches = data
    });

  }


  // getElimsSamplesByUsername3(username: string) {
  //   this.elimsService.GetElimsSamplesByUsername(username, 3).subscribe(data => {
  //     this.samples = data;
  //     console.log(this.samples)
  //   },
  //   )}


  // addSample1() {
  //   // const statusCodeId = 6;
  //   this.k1Detail.receivedOn = new Date();
  //   this.k1Detail.receivedBy = this.loginAs;

  //   // Console log the formatted date
  //   console.log('Received On:', this.k1Detail.receivedOn.toLocaleString());

  //   for (const sample of this.samples) {
  //     let id = sample.k1DetailId;
  //     if (this.k1Detail.customNo) {
  //     this.elimsService.PutDaftarTerimaSampel(id, this.k1Detail).subscribe(
  //       res => {})
  //   }}
  // }


  addSample() {

    console.log(this.additionalCustomNosData)
    this.k1Detail.receivedOn = new Date();
    this.k1Detail.receivedBy = this.loginAs;

    this.additionalCustomNosData.forEach(customNo => {
      const additionalSample = this.samples.find(sample => sample.customNo === customNo);
      if (additionalSample) {
  
        this.elimsService.PutDaftarTerimaSampel(additionalSample.k1DetailId, this.k1Detail)
          .subscribe(res => {
            console.log('Additional sample updated successfully.');
          });
      } else {
        console.error(`Additional custom no ${customNo} not found.`);
      }
    });
  }

  get customNos(): any {
    return this.customNosForm.get('customNos') as any;
  }

  addCustomNoField() {
    const control = this.fb.control('', Validators.required);
    this.customNos.push(control);
    this.additionalCustomNosData.push('');
  }



  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log(res)
      this.samples = res;
      this.calculateUnregisteredSampleCount();

    });
  }


  calculateUnregisteredSampleCount() {

    this.unregisteredSampleCount = this.samples.filter(sample => !sample.isRegistered).length;
  }

}
