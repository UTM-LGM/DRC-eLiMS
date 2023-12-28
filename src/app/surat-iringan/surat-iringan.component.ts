import { Component, ElementRef, ViewChild } from '@angular/core';
import { Batch } from '../models/batch';
import { UserService } from '../User/user.service';
import { HantarSampelService } from '../Hantar-Sampel/hantar-sampel.service';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ElimsService } from '../services/elims.service';
import { RubberType } from '../models/rubberType';
import { userDTO } from '../models/userDTO';

@Component({
  selector: 'app-surat-iringan',
  templateUrl: './surat-iringan.component.html',
  styleUrls: ['./surat-iringan.component.css']
})
export class SuratIringanComponent {

  batch: Batch = {} as Batch;
  loginAs: any;
  roleId: any;
  selectedCheckboxCount: number = 0;
  batchId: number;
  emailRecipient: any[]=[];
  rubberTypes: RubberType[]
  samples: any;
  user: userDTO = {} as userDTO

  constructor(
    private elimsService: ElimsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private hantarSampelService: HantarSampelService,
    private userService: UserService,

  ) {

  }



  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      // this.roleId = this.authService.getSessionRole()

    }
    else {
      this.loginAs = '';
    }

    this.userService.GetUserInfo(this.loginAs).subscribe(res => {
      console.log(res)
      this.authService.changeUser(res);
      this.user = res

      this.route.params.subscribe(param => {
        this.batchId = param['batchId'];

        console.log(this.batchId);


        this.elimsService.GetElimsSamplesByBatchId(this.batchId).subscribe(data => {
          this.samples = data;
          console.log(this.samples)
          this.selectedCheckboxCount = this.samples.length; // update the samples array with the response data
        });

      })


      this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
        this.batch = data
        console.log(this.batch)
      })
      
  })

  


  this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
    this.batch = data
    console.log(this.batch)
  })


  
  }

  @ViewChild('pdfContent', { static: true }) pdfContent: ElementRef | undefined;

  print() {
    const printContents = this.pdfContent?.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
}