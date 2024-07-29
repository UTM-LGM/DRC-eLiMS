import { Component } from '@angular/core';
import { Staff } from '../../models/staff';
import { AuthService } from '../../services/auth/auth.service';
import { userDTO } from '../../models/userDTO';
import { ElimsService } from '../../services/elims.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Forwarder } from 'src/app/models/forwarder';
import { UserService } from '../user.service';
import { loginImporter } from 'src/app/models/loginImporters';

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.css']
})

export class FormProfileComponent {

  staff: Staff
  importer: loginImporter = {} as loginImporter
  user: userDTO
  username: any
  staffId: any
  loginAs: any
  role: any
  forwarder: Forwarder = {} as Forwarder
  unitList: any = ['UIP', 'UIPBKH']
  file: any | null
  roleForwarder: boolean;
  roleUip: boolean;
  roleImporter: boolean;
  
  constructor(
    private authService: AuthService,
    private elimsService: ElimsService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,

  ) { }

  ngOnInit(): void {
    // this.authService.currentUser.subscribe(res => {
    //   this.user = res
    //   // console.log(res)
    // })

    this.username = this.authService.getSessionUsername()
    // this.staffId = this.authService.getSessionId()
    this.role = this.authService.getSessionRole()


    if (this.role == 1) {
      this.userService.GetUserInfo(this.username).subscribe(x => {
        this.user = x
        this.authService.GetForwarderId(this.user.forwarderId).subscribe(x => {
          this.authService.changeUser(x);
          this.authService.changeIsLoggedIn(true);
          this.forwarder = x
          this.roleForwarder = true

        });
      });


    }
    else if (this.role == 2 || this.role == 4) {
      this.userService.GetStaffInfo(this.username).subscribe(x => {
        this.authService.changeUser(x);
        this.authService.changeIsLoggedIn(true);
        this.staff = x
        this.roleUip = true

      });
    }

    else if (this.role == 3) {
      this.userService.GetImporterInfo(this.username).subscribe(x => {
        this.authService.changeUser(x);
        this.authService.changeIsLoggedIn(true);
        this.importer = x
        this.roleImporter = true
      });

    }

  }


  updateProfile() {
    if (this.role == 1) {
        this.elimsService.PutForwarderProfile(this.forwarder.forwarderId, this.forwarder).subscribe(response => {
            if (response) {
                this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
                window.location.reload();
            } else {
                this.toastr.error('Profile gagal dikemaskini', 'Error');
            }
        });
    } else if (this.role == 2 || this.role == 4) {
        if (this.staff.newPassword !== this.staff.confirmPassword) {
            this.toastr.error('Kata laluan baru tidak sepadan', 'Error');
            return;
        }
        
        this.elimsService.updateStaffProfile(this.staff.staffId, this.staff).subscribe(response => {
            if (response) {
                this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
                window.location.reload();
            } else {
                this.toastr.error('Profile gagal dikemaskini', 'Error');
            }
        });
    } else if (this.role == 3) {
        this.elimsService.PutCompanyProfile(this.importer.companyId, this.importer).subscribe(response => {
            if (response) {
                this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
                window.location.reload();
            } else {
                this.toastr.error('Profile gagal dikemaskini', 'Error');
            }
        });
    }
  
    this.router.navigateByUrl('profile');
}


  // updateProfile() {
  //   if (this.role == 1) {
  //     this.elimsService.PutForwarderProfile(this.forwarder.forwarderId, this.forwarder).subscribe(response => {
  //       if (response) {
  //         this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
  //         window.location.reload();
  //       } else {
  //         this.toastr.error('Profile gagal dikemaskini', 'Error');
  //       }
  //     });
  //   }

  //   else if (this.role == 2) {
  //     this.elimsService.updateStaffProfile(this.staff.staffId, this.staff).subscribe(response => {
  //       if (response) {
  //         this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
  //         window.location.reload();
  //       } else {
  //         this.toastr.error('Profile gagal dikemaskini', 'Error');
  //       }
  //     });
  //   } 
  //    else if (this.role == 3) {
  //     this.elimsService.PutCompanyProfile(this.importer.companyId, this.importer).subscribe(response => {
  //       if (response) {
  //         this.toastr.success('Profil telah berjaya dikemaskini', 'Berjaya');
  //         window.location.reload();
  //       } else {
  //         this.toastr.error('Profile gagal dikemaskini', 'Error');
  //       }
  //     });
  //   }
    
  //   this.router.navigateByUrl('profile');

  // }

  // images
  handleFileInput(event: any) {
    this.file = event.target.files[0];
    this.staff.signature = event.target.files[0].name;
    console.log(this.file);
  }

}

