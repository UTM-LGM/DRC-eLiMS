import { Component } from '@angular/core';
import { RekodKeputusanService } from 'src/app/Rekod-Keputusan-Sampel/rekod-keputusan.service';
import { UserService } from 'src/app/User/user.service';
import { K1Detail } from 'src/app/models/k1Detail';
import { Staff } from 'src/app/models/staff';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LaporanService } from '../laporan.service';

@Component({
  selector: 'app-laporan-penguji',
  templateUrl: './laporan-penguji.component.html',
  styleUrls: ['./laporan-penguji.component.css']
})
export class LaporanPengujiComponent {

  roles: any;
  k1Detail: K1Detail = {} as K1Detail;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  staff: Staff = {} as Staff
  staffRole: number[];
  fromDate: Date | undefined;
  toDate: Date | undefined;
  sampleCounts: any;
  isSearched: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
    private laporanService: LaporanService,
  ) { }


  ngOnInit() {

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res)
        this.authService.changeUser(res);
        this.staff = res;
        this.roleGtacr = true;
        this.staffRole = res.staffRole;
        // console.log(this.staffRole);

        this.rekodKeputusanService.GetStaffIdbyStaffRole(4).subscribe(data => {

          this.roles = data.filter(data => data.staffName != null);

          this.roles.sort((a: { staffName: any; }, b: { staffName: any; }) => {
            const roleA = a.staffName;
            const roleB = b.staffName;
            if (roleA < roleB) {
              return -1;
            } else if (roleA > roleB) {
              return 1;
            } else {
              return 0;
            }
          });

        })
      })
    }
  }


  // searchSample(): void {
  //   // Determine which parameters to include based on the selected criteria
  //   let startDate: Date | undefined;
  //   let endDate: Date | undefined;
  //   let rubberTypeId: number | undefined;
  //   let typeCodeId: number | undefined;
  
  //     startDate = this.fromDate;
  //     endDate = this.toDate;
  

  
  //   // Call the API with the selected parameters
  //   this.laporanService.GetSampleCount(startDate, endDate, rubberTypeId, typeCodeId).subscribe(
  //     (data) => {
  //       this.sampleCounts = data;
  //       console.log(this.sampleCounts);
  //       this.isSearched = true; 
  //     },
  //     (error) => {
  //       console.error('Error fetching sample counts:', error);
  //     }
  //   );
  // }
  
  searchSample(): void {
    let startDate: Date | undefined = this.fromDate;
    let endDate: Date | undefined = this.toDate;
    let tester: string | undefined = this.k1Detail.inLabBy;
  
    this.laporanService.CountSamplesByInLabOn(startDate, endDate, tester).subscribe(
      (data) => {
        this.sampleCounts = data;
        // console.log(this.sampleCounts);
        this.isSearched = true; 
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );
  }



}
