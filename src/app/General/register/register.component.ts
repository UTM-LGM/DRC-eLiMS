import { Component } from '@angular/core';
import { register } from '../../models/register';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Forwarder } from '../../models/forwarder';
import { UserService } from 'src/app/User/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  regUser: register = {} as register;
  repeatPassword: string | null = null;
  forwarders: any
  isProcess: boolean = false;
  forwarder: Forwarder = {} as Forwarder
  roles: any

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    public appComponent: AppComponent,
    public userService: UserService
  ) { }

  ngOnInit(): void {

    this.authService.GetForwarder().subscribe(data => {
      this.forwarders = data.filter(data => data.name != null);
    })
  }

  register() {

    if (!this.valid()) {
      this.toastr.warning('Fill in the required information')
    }
    if (!this.passwordMatch()) {
      this.toastr.warning('Password does not match')
    }
    if (this.valid() && this.passwordMatch()) {
      this.isProcess = true;
      this.authService.userRegister(this.regUser).subscribe(
        res => {
          this.reset();
          this.isProcess = false;
          this.toastr.success('Information has been registered', 'Please login', { timeOut: 6000 });
          this.router.navigate(['login']);
        },
        err => {
          this.isProcess = false;
          this.toastr.warning(err.error);
        }
      );
    }

  }

  valid() {
    if (
      this.regUser.forwarderId == null ||
      this.regUser.code == null ||
      this.regUser.code === "" ||
      this.regUser.username == null ||
      this.regUser.username === "" ||
      this.regUser.password == null ||
      this.regUser.password === "" ||
      this.repeatPassword == null ||
      this.repeatPassword === ""
    ) {
      return false;
    } else {
      return true;
    }
  }


  passwordMatch(): boolean {
    if (this.regUser.password !== this.repeatPassword) {
      return false;
    }
    return true;
  }


  reset() {
    this.regUser = {} as register;
    this.repeatPassword = null;
  }
}