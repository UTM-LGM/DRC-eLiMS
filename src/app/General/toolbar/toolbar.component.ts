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
  username:any

  constructor(
    private toastr: ToastrService,
    private authService: AuthService
    ) { }

    ngOnInit (){
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
  
    
}
