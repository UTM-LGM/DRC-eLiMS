import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{
  roleId : string | null
  roleForwarder:boolean
  roleUip:boolean
  roleGtacr:boolean
  config = {
    // paddingAtStart: true,
    // interfaceWithRoute: true,
    // classname:'menu-nav',
    // listBackgroundColor: 'white',
    // fontColor: `#000000`,
    // backgroundColor: '#F8F8F8',
    selectedListFontColor: '#0b3cb8',
    // highlightOnSelect: true,
    // collapseOnSelect: false,
    // useDividers: true,
    // rtlLayout: false,
  };

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.roleId = this.authService.getSessionRole()
    console.log(this.roleId)
    if (this.roleId == '1'){
      this.roleForwarder = true
      this.roleUip = false
    }else if (this.roleId == '2'){
      this.roleForwarder = false
      this.roleUip = true
    }else if (this.roleId == '3'){
      this.roleForwarder = false
      this.roleGtacr = true
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