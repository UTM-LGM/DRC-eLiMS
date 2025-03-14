import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  router: any;
  username: any

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.authService.getSessionUsername()
  }


  logout() {
    console.log("keluar");
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userRoleId');
    sessionStorage.removeItem('roleName');
    location.reload();
  }


  ngAfterViewInit() {
    this.javaS();
  }


  javaS() {
    console.log("using script.js for toggle button");

    // Select the sidebar toggle button
    const sidebarToggle1 = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle1) {
      // Check localStorage for persisted toggle state
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.toggle('sb-sidenav-toggled');
      }

      // Add event listener to toggle sidebar on click
      sidebarToggle1.addEventListener('click', event => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        // Optionally persist the toggle state
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled').toString());
      });
    }
  }



}
