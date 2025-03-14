import { Component, OnInit } from '@angular/core';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { Forwarder } from '../../models/forwarder';
import { DatePipe } from '@angular/common';
import { ElimsService } from '../../services/elims.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import { Company } from 'src/app/models/company';
import { ToastrService } from 'ngx-toastr';
import { loginImporter } from 'src/app/models/loginImporters';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: userDTO = {} as userDTO;
  staff: Staff = {} as Staff
  forwarder: Forwarder = {} as Forwarder
  company: Company = {} as Company
  pipe = new DatePipe('en-US');
  today = new Date();
  changedDate = '';
  username: any
  loginAs: any
  userRoleId: any
  roleForwarder: boolean
  roleUip: boolean
  roleGtacr: boolean
  roleImporter : boolean
  role: any
  importer: loginImporter = {} as loginImporter
  isEmailVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private elimsService: ElimsService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername();
      this.userRoleId = this.authService.getSessionRole();
    } else {
      this.loginAs = '';
    }

    if (this.userRoleId == 1) {
      this.username = this.authService.getSessionUsername();
      this.authService.getUser(this.username).subscribe(res => {
        this.authService.changeUser(res);
        this.authService.changeIsLoggedIn(true);
        this.forwarder = res;
        this.roleForwarder = true;
      });
    } else if (this.userRoleId == 3) {
      this.username = this.authService.getSessionUsername();
      this.authService.getImporter(this.username).subscribe(res => {
        this.authService.changeUser(res);
        this.authService.changeIsLoggedIn(true);
        this.importer = res;
        this.roleImporter = true;
      });
    } else if (this.userRoleId == 2 || this.userRoleId == 4) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res;
        this.roleForwarder = false;
        this.roleUip = true;
      });
    }
  }

  updateProfile() {
    if (this.roleForwarder) {
      this.elimsService.PutForwarderProfile(this.forwarder.forwarderId, this.forwarder).subscribe(response => {
        if (response) {
          this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
          this.isEmailVisible = true; // Show email section on success
        } else {
          this.toastr.error('Profile gagal dikemaskini', 'Error');
        }
        this.reloadPageWithDelay();
      });
    } else if (this.roleUip || this.roleGtacr) {
      if (this.staff.newPassword !== this.staff.confirmPassword) {
        this.toastr.error('Kata laluan baru tidak sepadan', 'Error');
        return;
      }
      
      this.elimsService.updateStaffProfile(this.staff.staffId, this.staff).subscribe(response => {
        if (response) {
          this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
          this.isEmailVisible = true; // Show email section on success
        } else {
          this.toastr.error('Profile gagal dikemaskini', 'Error');
        }
        this.reloadPageWithDelay();
      });
    } else if (this.roleImporter) {
      this.elimsService.PutCompanyProfile(this.importer.companyId, this.importer).subscribe(response => {
        if (response) {
          this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
          this.isEmailVisible = true; // Show email section on success
        } else {
          this.toastr.error('Profile gagal dikemaskini', 'Error');
        }
        this.reloadPageWithDelay();
      });
    }
  }

  reloadPageWithDelay() {
    setTimeout(() => {
      window.location.reload();
      this.router.navigateByUrl('home');
    }, 2000); 
  }
}
