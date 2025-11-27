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
  }

}
