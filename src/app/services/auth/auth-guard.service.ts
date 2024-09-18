
// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   canActivate(): Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {

//     if (this.authService.isloggedin()) {
//       const userRole = this.authService.getSessionRole(); // Get user's role from session
//       console.log(userRole)
//       // Perform role-based authorization
//       if (userRole != null) {
//         // Allow access for Agen role
//         return true;
//       }
//       // Redirect unauthorized users to a default page
//       this.router.navigate(['unauthorized']);
//       return false;
//     }

//     // Redirect unauthenticated users to the login page
//     this.router.navigate(['login']);
//     return false;
//   }
// }



import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isloggedin()) {
      const userRole = this.authService.getSessionRole(); // Get user's role from session
      const expectedRoles = route.data['roles'] as Array<string>;

      // Check if all roles are allowed
      if (expectedRoles && expectedRoles.includes('*')) {
        return true;
      }

      if (userRole && expectedRoles.includes(userRole)) {
        return true;
      }

      // Redirect unauthorized users to a default page
      this.router.navigate(['unauthorized']);
      return false;
    }

    // Redirect unauthenticated users to the login page
    this.router.navigate(['login']);
    return false;
  }
}




// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     if (this.authService.isloggedin()) {
//       const userRole = this.authService.getSessionRole(); // Get user's role from session
//       const expectedRoles = route.data['roles'] as Array<string>;

//       if (userRole && expectedRoles.includes(userRole)) {
//         return true;
//       }

//       // Redirect unauthorized users to a default page
//       this.router.navigate(['unauthorized']);
//       return false;
//     }

//     // Redirect unauthenticated users to the login page
//     this.router.navigate(['login']);
//     return false;
//   }
// }

