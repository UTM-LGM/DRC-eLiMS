import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from 'src/app/User/user.service';
import { Staff } from 'src/app/models/staff';
import { staffRole } from 'src/app/models/staffRole';
import { ElimsService } from 'src/app/services/elims.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  userRoleId: string | null
  roleForwarder: boolean
  roleUip: boolean
  roleGtacr: boolean
  roleImporter: boolean
  roleApprove: boolean = false
  roles: any;
  // staffRole: any;
  staff: Staff = {} as Staff
  staffRole: staffRole = {} as staffRole

  loginAs: any;

  config = {
    selectedListFontColor: '#0b3cb8',

  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
 
  ) { }

  ngOnInit() {


    if (this.authService.isloggedin()) {
      this.loginAs = this.authService.getSessionUsername()
      this.userRoleId = this.authService.getSessionRole()
    }
    else {
      this.loginAs = '';
    }


    console.log(this.userRoleId)
    if (this.userRoleId == '1') {
      this.roleForwarder = true
      this.roleUip = false
    } else if (this.userRoleId == '2') {
      this.roleForwarder = false
      this.roleUip = true
    } else if (this.userRoleId === '4') {
      this.userService.GetStaffInfo(this.loginAs).subscribe(res => {
        // console.log(res);
        this.authService.changeUser(res);
        this.staff = res;
        this.roleGtacr = true;
        const staffRoleId = this.staff.staffRole;
        if (staffRoleId.includes(3)){
            this.roleApprove = true;
        }
      });
    }
    else if (this.userRoleId == '3') {
      this.roleImporter = true


    }
  }

  appitems = [
    {
      label: 'Laman Utama',
      icon: 'home',
      link: '/home'
    },
    {
      label: 'Daftar Sampel',
      icon: 'note_add',
      expanded: false,
      items: [
        {
          label: 'Daftar Sampel',
          icon: 'add',
          link: 'daftar-sampel'
        },
        {
          label: 'sunting/delete',
          icon: 'edit',
          link: 'sampel'
        },

      ]
    },


    {
      label: 'Cetak Label',
      icon: 'print',
      expanded: false,
      items: [
        {
          label: 'Cetak Label',
          icon: 'print',
          link: 'cetak-label'
        },
        {
          label: 'Ulang Cetak Label',
          icon: 'print',
          link: 'ulang-cetak-label'
        },
      ]
    },


    {
      label: 'Hantar Sampel',
      icon: 'send',
      expanded: false,
      items: [
        {
          label: 'Hantar Sampel',
          icon: 'send',
          link: 'hantar-sampel'

        },
        {
          label: 'Ulang Cetak Surat',
          icon: 'print',
          link: 'ulang-cetak-surat'

        },
        {
          label: 'Cetak Surat Kastam',
          icon: 'print',
          link: 'cetak-surat-kastam'
        },
      ]
    },

    {
      label: 'Keputusan Ujian',
      icon: 'menu',
      expanded: false,
      items: [
        {
          label: 'Keputusan Ujian',
          icon: 'print',
          link: 'keputusan-ujian'
        },
      ]
    },

    {
      label: 'Daftar Keluar',
      icon: 'view_module'
    },
  ]

}