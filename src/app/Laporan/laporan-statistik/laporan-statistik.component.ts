import { Component } from '@angular/core';
import { LaporanService } from '../laporan.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { RekodKeputusanService } from 'src/app/Rekod-Keputusan-Sampel/rekod-keputusan.service';
import { ToastrService } from 'ngx-toastr';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-laporan-statistik',
  templateUrl: './laporan-statistik.component.html',
  styleUrls: ['./laporan-statistik.component.css']
})
export class LaporanStatistikComponent {

  fromDate: Date | undefined = new Date(); // Initialize with current date
  toDate: Date | undefined = new Date(); // Initialize with current date
  staffCounts: any[] = [];
  customOffices: any[] = [];
  sampleApproval: any[] = [];
  forwarders: any[] = [];
  totalCounts: any;
  sampleCounts: any;
  loginAs: any;
  userRoleId: any;
  roleGtacr: boolean
  roles: any;
  staffRole: number[];
  staff: Staff = {} as Staff

  constructor(
    private laporanService: LaporanService,
    private authService: AuthService,
    private userService: UserService,
    private rekodKeputusanService: RekodKeputusanService,
    private toastr: ToastrService,
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


  searchSample(): void {
    // Determine which parameters to include based on the selected criteria
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    startDate = this.fromDate;
    endDate = this.toDate;

    // Call the API with the selected parameters
    this.laporanService.CountSamplesByTesterName(startDate, endDate).subscribe(
      (data) => {
        this.sampleCounts = data;
        // console.log(this.sampleCounts);
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );


    // Call the API with the selected parameters
    this.laporanService.CountSamplesByForwarder(startDate, endDate).subscribe(
      (data) => {
        this.forwarders = data.forwarderCounts; // Assign forwarder counts
        this.totalCounts = data.totalCounts; // Assign total counts
        // console.log(this.forwarders);
        // console.log(this.totalCounts); // Check if total counts are received properly
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );


    // Call the API with the selected parameters
    this.laporanService.CountSamplesByCustomOffice(startDate, endDate).subscribe(
      (data) => {
        this.customOffices = data;
        // console.log(this.customOffices);
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );


    // Call the API with the selected parameters
    this.laporanService.CountSamplesByApproval(startDate, endDate).subscribe(
      (data) => {
        this.sampleApproval = data;
        // console.log(this.sampleApproval);
      },
      (error) => {
        console.error('Error fetching sample counts:', error);
      }
    );
  }


}
