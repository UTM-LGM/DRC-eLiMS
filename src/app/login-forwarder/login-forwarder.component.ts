import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';
import { loginDTO } from '../models/loginDTO';

@Component({
  selector: 'app-login-forwarder',
  templateUrl: './login-forwarder.component.html',
  styleUrls: ['./login-forwarder.component.css']
})
export class LoginForwarderComponent implements OnInit{ 

  user: loginDTO = {} as loginDTO;
  isProcess: boolean = false;

  constructor(
  public authService: AuthService, 
  private router: Router, 
  public appComponent: AppComponent,
  private toastr: ToastrService
  ) { }


  ngOnInit(): void {}

  login() {
    // if (this.user.username && this.user.password) {
    //   this.isProcess = true;
  
    //   this.authService.login(this.user.username, this.user.password).subscribe(
    //     res => {
    //       this.isProcess = false;

    //       sessionStorage.setItem('username',this.user.username);

    //       this.router.navigateByUrl('home');
    //       this.toastr.success('Login successful!');
    //     },
    //     error => {
    //       this.isProcess = false;
    //       console.error(error);
    //       this.toastr.error('Invalid username or password.');
    //     }
    //   );
    // } else {
    //   this.toastr.warning('Please enter username and password.');
    // }
  }

}
