import { Component, OnInit } from '@angular/core';
import { userDTO } from '../../models/userDTO';
import { AuthService } from '../../services/auth/auth.service';
import { Forwarder } from '../../models/forwarder';
import { DatePipe } from '@angular/common';
import { ElimsService } from '../../services/elims.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: userDTO = {} as userDTO;
  staff: Staff = {} as Staff
  forwarder: Forwarder = {} as Forwarder
  pipe = new DatePipe('en-US');
  today = new Date();
  changedDate = '';
  username: any
  loginAs: any
  roleId: any
  roleForwarder: boolean
  roleUip: boolean
  roleGtacr: boolean


  constructor(
    private authService: AuthService,
    private elimsService: ElimsService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // this.authService.currentUser.subscribe(res => {
    //   this.user = res
    //   // console.log(res)
    // })

    // this.roleId = this.authService.getSessionRole()

    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.roleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }

    if (this.roleId == 1) {
      this.username = this.authService.getSessionUsername()
      this.authService.getUser(this.username).subscribe(res => {
        this.authService.changeUser(res);
        this.authService.changeIsLoggedIn(true);
        this.forwarder = res
      })
    }
    else if (this.roleId == 2 || 3) {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        this.authService.changeUser(res);
        this.staff = res
        this.roleForwarder = false
        this.roleUip = true
      })
    }

  }

}
