import { Component, OnInit } from '@angular/core';
import { loginDTO } from '../models/loginDTO';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';
import { Staff } from '../models/staff';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: loginDTO = {} as loginDTO;
  isProcess: boolean = false;
  userDetail: any
  staffRoles: any
  afterLogin: boolean = false
  selectedRole: number
  roles: any
  loginAs: any;
  roleId: any;
  roleForwarder: boolean
  roleUip: boolean
  staff: Staff = {} as Staff
  handleError: any;
  userObjects: any[] = []


  constructor(
    public authService: AuthService,
    private router: Router,
    public appComponent: AppComponent,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.authService.GetRolesForLogin().subscribe(data => {
      this.roles = data
      console.log(data)
    })

  }

  // login() {


  //   if (this.user.username && this.user.password) {
  //     this.isProcess = true;
  //     this.authService.login(this.user.username, this.user.password, this.selectedRole).subscribe(
  //       res => {
  //         console.log(res);
  //         this.userDetail = res;
  //         this.authService.getUserDto(this.userDetail.username, this.selectedRole);

  //         this.authService.GetRoleById(this.selectedRole).subscribe(
  //           roleData => {
  //             sessionStorage.setItem('roleId', roleData.roleId.toString());
  //             sessionStorage.setItem('roleName', roleData.role);
  //             this.isProcess = false;

  //             sessionStorage.setItem('username', this.userDetail.username);
  //             sessionStorage.setItem('role', this.selectedRole.toString());

  //             this.router.navigateByUrl('home');
  //             this.toastr.success('Login successful!');
  //           },
  //           roleError => {
  //             this.isProcess = false;
  //             console.error(roleError);
  //             this.toastr.error('Error fetching role information.');
  //           }
  //         );
  //       },
  //       error => {
  //         this.isProcess = false;
  //         console.error(error);
  //         this.toastr.error('Invalid username or password.');
  //       }
  //     );
  //   } else {
  //     this.toastr.warning('Please enter username and password.');
  //   }


  // }



  // login() {
  //   if (this.user.username && this.user.password) {
  //     this.isProcess = true;
  //     this.authService.login(this.user.username, this.user.password, this.selectedRole).subscribe(
  //       res => {
  //         console.log(res);
  //         this.userDetail = res;

  //         if (this.selectedRole == 1) {
  //           this.authService.getUserDto(this.userDetail.username, this.selectedRole);

  //           this.authService.GetRoleById(this.selectedRole).subscribe(
  //             roleData => {
  //               sessionStorage.setItem('roleId', roleData.roleId.toString());
  //               sessionStorage.setItem('roleName', roleData.role);
  //               this.isProcess = false;

  //               sessionStorage.setItem('username', this.userDetail.username);
  //               sessionStorage.setItem('role', this.selectedRole.toString());

  //               this.router.navigateByUrl('home');
  //               this.toastr.success('Login successful!');
  //             },
  //             roleError => {
  //               this.isProcess = false;
  //               console.error(roleError);
  //               this.toastr.error('Error fetching role information.');
  //             }
  //           );
  //         }


  //         this.authService.GetStaffRolebyStaffId(this.userDetail.staffId).subscribe(
  //           staffRoleData => {
  //             this.userObjects = staffRoleData;
  //             console.log(this.userObjects)
  //             const userRole2 = this.userObjects.filter((user) => user.staffRole === 2);
  //             const userRole3 = this.userObjects.filter((user) => user.staffRole === 3);


  //             if (userRole2.length != 0 && this.selectedRole == 2) {
  //               console.log("user 2 not null");
  //               this.authService.getUserDto(this.userDetail.username, this.selectedRole);
  //               this.authService.GetRoleById(this.selectedRole).subscribe(
  //                 roleData => {
  //                   sessionStorage.setItem('roleId', roleData.roleId.toString());
  //                   sessionStorage.setItem('roleName', roleData.role);
  //                   this.isProcess = false;
  //                   sessionStorage.setItem('username', this.userDetail.username);
  //                   sessionStorage.setItem('role', this.selectedRole.toString());
  //                   this.router.navigateByUrl('home');
  //                   this.toastr.success('Login successful!');
  //                 },
  //                 roleError => {
  //                   this.isProcess = false;
  //                   console.error(roleError);
  //                   this.toastr.error('Error fetching role information.');
  //                 }
  //               );
  //             } else {
  //               console.log("user 2 null");
  //             }


  //             if (userRole3.length != 0 && this.selectedRole == 3) {
  //               console.log("user 3 not null");
  //               this.authService.getUserDto(this.userDetail.username, this.selectedRole);

  //               this.authService.GetRoleById(this.selectedRole).subscribe(
  //                 roleData => {
  //                   sessionStorage.setItem('roleId', roleData.roleId.toString());
  //                   sessionStorage.setItem('roleName', roleData.role);
  //                   this.isProcess = false;
  //                   sessionStorage.setItem('username', this.userDetail.username);
  //                   sessionStorage.setItem('role', this.selectedRole.toString());
  //                   this.router.navigateByUrl('home');
  //                   this.toastr.success('Login successful!');
  //                 },
  //                 roleError => {
  //                   this.isProcess = false;
  //                   console.error(roleError);
  //                   this.toastr.error('Error fetching role information.');
  //                 }
  //               );

  //             } else {
  //               console.log("user 3 null");
  //               //this.toastr.error('Invalid username or password.');
  //             }

  //           },
  //         );
  //       },
  //     );
  //   }
  //   else {
  //     this.toastr.warning('Please enter username and password.');
  //   }

  // }


  login() {
    if (this.user.username && this.user.password) {
      this.isProcess = true;
      this.authService.login(this.user.username, this.user.password, this.selectedRole).subscribe(
        res => {
          console.log(res);
          this.userDetail = res;
          this.setSessionStorage();

          if (this.selectedRole == 1 ) {
            this.authService.getUserDto(this.userDetail.username, this.selectedRole);
            // this.setSessionStorage();
            
          } 
          
          else if ( this.selectedRole == 3){
            this.authService.getUserDto(this.userDetail.username, this.selectedRole);
          }       
          
          else if ( this.selectedRole == 2){
            this.authService.GetStaffRolebyStaffId(this.userDetail.staffId).subscribe(
              staffRoleData => {
                this.userObjects = staffRoleData;
                const userRole2 = this.userObjects.filter((user) => user.staffRole == 2);
                const userRole4 = this.userObjects.filter((user) => user.staffRole == 4);

                if (userRole2.length != 0 && this.selectedRole == 2) {
                  this.authService.getUserDto(this.userDetail.username, this.selectedRole);
                  // this.setSessionStorage();
                } else if (userRole4.length != 0 && this.selectedRole == 4) {
                  this.authService.getUserDto(this.userDetail.username, this.selectedRole);
                  // this.setSessionStorage();
                } else {
                  this.toastr.error('Nama pengguna dan kata laluan salah');
                }
              },
            );
          }

        },
        error => {
          console.error(error);
          this.toastr.error('Nama pengguna dan kata laluan salah');
        }
      );
    } else {
      this.toastr.warning('Masukkan nama pengguna dan kata laluan');
    }
  }

  setSessionStorage() {
    this.authService.GetRoleById(this.selectedRole).subscribe(
      roleData => {
        sessionStorage.setItem('roleId', roleData.roleId.toString());
        sessionStorage.setItem('roleName', roleData.role);
        this.isProcess = false;
        sessionStorage.setItem('username', this.userDetail.username);
        sessionStorage.setItem('role', this.selectedRole.toString());

      // window.location.reload();
      // setTimeout(() => {
        //   this.router.navigateByUrl('/home');
        // }, 100); 
              
        this.router.navigateByUrl('home').then(() => {
          // Reload the page once navigation is complete
          window.location.reload();
        })
      
        this.toastr.success('Log masuk berjaya!');
   
      },
      roleError => {
        this.isProcess = false;
        console.error(roleError);
        this.toastr.error('Error fetching role information.');
      }
    );
  }

  displayLogin(roleId: number) {
    this.afterLogin = true
    this.selectedRole = roleId
    console.log(this.selectedRole)
  }

}
