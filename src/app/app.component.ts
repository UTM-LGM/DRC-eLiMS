import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { staffRole } from './models/staffRole';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { Batch } from './models/batch';
import { filter } from 'rxjs/operators';
import { HantarSampelService } from './Hantar-Sampel/hantar-sampel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DRC-eLiMS';

  isLoggin: boolean = false;
  loginPage: boolean = true;
  registerPage: boolean = false
  staffrole:any
  isPrintMemoRoute: boolean = false;
  isLampiran: boolean = false;

  batches: Batch[] = [];
  batchId: number;
  batch: Batch = {} as Batch;

  constructor(private authService: AuthService, private router: Router,private route:ActivatedRoute,  private hantarSampelService: HantarSampelService,){
     this.authService.currentLoggedIn.subscribe(res => this.isLoggin = res)
  }

  ngOnInit():void {
     //Subscribe to router events to check the route dynamically
     this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPrintMemoRoute = event.url.includes('print-memo');
     
    });
    
    // this.route.params.subscribe(param => {
    //   this.batchId = param['batchId'];
    //   console.log(param)
    //   this.hantarSampelService.GetElimsBatchById(this.batchId).subscribe(data => {
    //     console.log(data)
    //     this.batch = data
    //   })
    // })

    if (this.authService.isloggedin()) {
      this.isLoggin = true
      this.staffrole  = this.authService.getSessionRole()
      console.log(this.staffrole)
      //panggil api stafrole listkan stafrole utk stafid


    }
    else {
      this.isLoggin = false
    }

    
  }



  
}
