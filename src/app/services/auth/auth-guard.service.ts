
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (this.authService.isloggedin()) {
      const userRole = this.authService.getSessionRole(); // Get user's role from session
      console.log(userRole)
      // Perform role-based authorization
      if (userRole != null) {
        // Allow access for Agen role
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
