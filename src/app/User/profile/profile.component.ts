import { Component, OnInit } from '@angular/core';
import { Staff } from '../../models/staff';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { ElimsService } from '../../services/elims.service';
import { Route, Router } from '@angular/router';
import { Forwarder } from '../../models/forwarder';
import { UserService } from '../user.service';
import { environment } from 'src/app/environments/environment';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  importer: loginImporter
  staff: Staff
  user: userDTO
  username: any
  staffId: any
  loginAs: any
  role: any
  forwarder: Forwarder = {} as Forwarder
  file: any | null

  // baseApiUrlElimsSign = environment.baseApiUrlElimsSign;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,

  ) { }

  ngOnInit() {

    this.username = this.authService.getSessionUsername()
    // this.staffId = this.authService.getSessionId()
    this.role = this.authService.getSessionRole()

    if (this.role == '1') {
      this.userService.GetUserInfo(this.username).subscribe(x => {
        this.user = x
        console.log (this.user)
        this.authService.GetForwarderId(this.user.forwarderId).subscribe(x => {
          this.authService.changeUser(x);
          this.authService.changeIsLoggedIn(true);
          this.forwarder = x
          console.log(this.forwarder)
  
        });
      });


    }
    else if (this.role == '2' || this.role == '4') {
      this.userService.GetStaffInfo(this.username).subscribe(res => {
        this.authService.changeUser(res);
        this.authService.changeIsLoggedIn(true);
        this.staff = res
        console.log(res)
      });

      // this.userService.GetStaffInfo(this.staffId).subscribe(x => {
      //   this.authService.changeUser(x);
      //   this.authService.changeIsLoggedIn(true);
      // });


    }

    else if (this.role == '3') {
      this.userService.GetImporterInfo(this.username).subscribe(res => {
        this.authService.changeUser(res);
        this.authService.changeIsLoggedIn(true);
        this.importer = res
        console.log(res)
      });

    }

  }

  updateProfile() {

      this.router.navigate(['/form-profile']);

  }

    viewSign(path: string): void {
      window.open(environment.baseApiUrlElimsSign +path, "_blank");
    }

    
}
