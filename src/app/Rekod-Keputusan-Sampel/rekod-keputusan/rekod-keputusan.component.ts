import { Component } from '@angular/core';
import { Batch } from '../../models/batch';
import { Sample } from '../../models/sample';
import { ElimsService } from '../../services/elims.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../User/user.service';
import { Staff } from '../../models/staff';
import { K1Detail } from '../../models/k1Detail';
import { RekodKeputusanService } from '../rekod-keputusan.service';
import { staffRole } from 'src/app/models/staffRole';


@Component({
  selector: 'app-rekod-keputusan',
  templateUrl: './rekod-keputusan.component.html',
  styleUrls: ['./rekod-keputusan.component.css']
})
export class RekodKeputusanComponent {

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
  statusCodeId: number = 0;

  roles: any;
  staffRole: number[];
  customNo: string;


  constructor(
    private elimsService: ElimsService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService

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
        this.staffRole = res.staffRole
        // this.getStaffElimsSamples(this.staff)
        this.staffRole.forEach(element => {
          console.log(element)
          this.rekodKeputusanService.GetStaffIdbyStaffRole(element).subscribe(data => {
            this.roles = data.filter(data => data.staffName != null);
            console.log(data)
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

    this.statusCodeId = 8;
    this.elimsService.GetElimsAllBatch(this.statusCodeId).subscribe(data => {
      this.batches = data;
      console.log(data)
    });

  }


  sampleList(batchId: number) {
    this.selectedBatchId = batchId;
    this.elimsService.GetElimsSamplesByBatchId(batchId).subscribe(res => {
      console.log('All Samples:', res);
      this.samples = res;
      // Filter samples based on statusCodeId == 6
      this.samples = res.filter(sample => sample.statusCodeId === 8);

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


  searchCustomNo() {
    this.lepassubmit = true
    this.samples = this.samples.filter(sample => sample.checked);
  }

  addRekodKeputusan(){
    
  }
}

