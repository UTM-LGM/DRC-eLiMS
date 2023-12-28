import { Component, ElementRef, ViewChild } from '@angular/core';
import { Batch } from '../../models/batch';
import { UserService } from '../../User/user.service';
import { HantarSampelService } from '../hantar-sampel.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ElimsService } from '../../services/elims.service';
import { RubberType } from '../../models/rubberType';
import { userDTO } from '../../models/userDTO';

@Component({
  selector: 'app-lampiran',
  templateUrl: './lampiran.component.html',
  styleUrls: ['./lampiran.component.css']
})
export class LampiranComponent {

  batch: Batch = {} as Batch;
  loginAs: any;
  roleId: any;
  selectedCheckboxCount: number = 0;
  batchId: number;
  emailRecipient: any[]=[];
  rubberTypes: RubberType[]
  samples: any;
  users: any;

  user: userDTO = {} as userDTO
  companies: any

  
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
          // this.sampleCode = data.rub.sampleCode
          // this.sampleCategory = data.rub.sampleCategory
          
          console.log(this.samples)
          this.selectedCheckboxCount = this.samples.length; // update the samples array with the response data
          //this.selectedRubberType = this.samples[0].rubberType
        });

      })


      // this.hantarSampelService.GetBatchByBatchId(this.batchId).subscribe(data => {
      //   this.batch = data
      //   // this.staff = resBatchStaff.staff
      //   console.log(this.batch)
      // })



    this.elimsService.GetRefRubberTypes().subscribe(data => {
      this.rubberTypes = data
      console.log(this.rubberTypes)
    })

  })

  
  this.elimsService.GetCompanies(this.user.forwarderId).subscribe(data => {
    this.companies = data;
  });

  // this.elimsService.GetAllCompanies().subscribe(data => {
  //   this.companies = data
  //   console.log(this.companies)
  // })

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
