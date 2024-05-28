import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Forwarder } from 'src/app/models/forwarder';
import { loginForwarder } from 'src/app/models/loginForwarder';
import { loginImporter } from 'src/app/models/loginImporters';
import { register } from 'src/app/models/register';
import { Role } from 'src/app/models/role';
import { staffRole } from 'src/app/models/staffRole';
import { userDTO } from 'src/app/models/userDTO';
import { userRole } from 'src/app/models/userRole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getImporterInfo() {
    throw new Error('Method not implemented.');
  }
  setRedirectUrl(url: any) {
    throw new Error('Method not implemented.');
  }

  baseApiUrl = environment.baseApiUrlElims;

  private userSource = new BehaviorSubject<userDTO>(new userDTO());
  currentUser = this.userSource.asObservable();

  private loggedInSource = new BehaviorSubject(false);
  currentLoggedIn = this.loggedInSource.asObservable();
  selectedRole: number;


  constructor(private httpclient: HttpClient) { }

  changeIsLoggedIn(val: boolean) {
    this.loggedInSource.next(val)
  }

  changeUser(val: userDTO) {
    this.userSource.next(val)
  }

  GetCustomOffice(id: number) {
    return this.httpclient.get(this.baseApiUrl + '/api/CustomOffices/GetCustomOffice/' + id)
  }

  login(username: string, password: string, selectedRole: number) {
    if (selectedRole == 1) {
      const url = `${this.baseApiUrl}/api/LoginForwarders/Post/Login`;
      const requestBody = { username: username, password: password };
      return this.httpclient.post(url, requestBody);
    }
    
    else if (selectedRole == 3){

      const url = `${this.baseApiUrl}/api/LoginImporters/Post/Login`;
      const requestBody = { username: username, password: password };
      return this.httpclient.post(url, requestBody);
      
    }

    else if (selectedRole == 2 || 3) {
      const url = `${this.baseApiUrl}/api/Staffs/Post/Login`;
      const requestBody = { username: username, password: password };
      return this.httpclient.post(url, requestBody);
    } 
    
    

      
    else {
      // Handle other cases or throw an error
      throw new Error('Invalid selectedRole');
    }

  }


  getUserDto(username: string, selectedRole: number) {
    if (selectedRole == 1) {
      this.httpclient.get<userDTO>(this.baseApiUrl + '/api/LoginForwarders/GetLoginForwarderByUsername/' + username).subscribe(x => {
        console.log(x);
        this.changeUser(x);
        this.changeIsLoggedIn(true);
      });
    }


        else if (selectedRole == 3){

      this.httpclient.get<userDTO>(this.baseApiUrl + '/api/LoginImporters/GetLoginImporterByUsername/' + username).subscribe(x => {
        console.log(x);
        this.changeUser(x);
        this.changeIsLoggedIn(true);
      });

    }

    else if (selectedRole == 2 || selectedRole == 3) {
      this.httpclient.get<userDTO>(this.baseApiUrl + '/api/Staffs/GetStaffByUsername/' + username).subscribe(x => {
        console.log(x);
        this.changeUser(x);
        this.changeIsLoggedIn(true);
      });
    }
    


  }


  // getUserDto(username: string, selectedRole: number, roleId: number) {
  //   selectedRole = roleId
  //   this.httpclient.get<userDTO>(this.baseApiUrl + '/api/LoginForwarders/GetLoginForwarderByUsername/' + username).subscribe(x => {
  //     console.log(x);
  //     this.changeUser(x);
  //     this.changeIsLoggedIn(true);
  //   });
  // }



  //     login(username: string, password: string, roleId: number) {
  //       const url = `${this.baseApiUrl}/api/LoginForwarders/Post/Login`;
  //       const requestBody = {
  //         username: username,
  //         password: password,
  //         role: roleId 
  //       };

  //       if (roleId == 1) {

  //         return this.httpclient.post(url, requestBody);
  //       } else if (roleId == 2) {

  //         const uipUrl = `${this.baseApiUrl}/api/LoginUIP/Post/LoginUIP`;

  //         return this.httpclient.post(uipUrl, requestBody);
  //       } else {

  //         throw new Error('Invalid roleId');
  //       }
  //     }


  // getUserDto(username: string, staffId:number, roleId: string) {
  //   let apiUrl = '';

  //   if (roleId == '1') {
  //     apiUrl = this.baseApiUrl + '/api/LoginForwarders/GetLoginForwarderByUsername/' + username;
  //   } else if (roleId == '2') {
  //     apiUrl = this.baseApiUrl + '/api/StaffRoles/GetStaffRoleByStaffId/' + staffId;
  //   }

  //   if (apiUrl) {
  //     this.httpclient.get<userDTO>(apiUrl).subscribe(
  //       x => {
  //         console.log(x);
  //         this.changeUser(x);
  //         this.changeIsLoggedIn(true);
  //       },
  //       error => {
  //         console.error(error);
  //         this.toastr.error('Error retrieving user data.');
  //       }
  //     );
  //   }
  // }



  userRegister(object: register) {
    var body = JSON.stringify(object);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpclient.post<userDTO>(this.baseApiUrl + '/api/LoginForwarders/Register/', body, httpOptions)
  }

  getUser(username: string) {
    return this.httpclient.get<any>(this.baseApiUrl + '/api/LoginForwarders/GetLoginForwarderByUsername/' + username)
  }

  getImporter(username: string) {
    return this.httpclient.get<any>(this.baseApiUrl + '/api/LoginImporters/GetLoginImporterByUsername/' + username)
  }

  GetForwarderId(forwarderId: number) {
    return this.httpclient.get<any>(this.baseApiUrl + '/api/Forwarders/GetForwarderId/' + forwarderId)
  }

  isloggedin() {
    return sessionStorage.getItem('username') != null;
  }

  getSessionUsername() {
    return sessionStorage.getItem('username')
  }

  getSessionRole() {
    return sessionStorage.getItem('userRoleId')
  }

  GetForwarder(): Observable<Forwarder> {
    return this.httpclient.get<Forwarder>(this.baseApiUrl + '/api/Forwarders/GetForwarders');
  }

  // GetRoleById(roleId: number): Observable<Role> {
  //   return this.httpclient.get<Role>(this.baseApiUrl + '/api/Roles/GetRoleById/' + roleId);
  // }

  GetRoleById(roleId: number): Observable<userRole> {
    return this.httpclient.get<userRole>(this.baseApiUrl + '/api/UserRoles/GetRoleById/' + roleId);
  }


  GetRolesForLogin(): Observable<userRole> {
    return this.httpclient.get<userRole>(this.baseApiUrl + '/api/UserRoles/GetRolesForLogin');
  }

  GetStaffRolebyStaffId(staffId: number): Observable<staffRole[]> {
    return this.httpclient.get<staffRole[]>(this.baseApiUrl + '/api/StaffRoles/GetStaffRolebyStaffId/' + staffId);
  }


  GetImporterRole(username: string): Observable<loginImporter> {
    return this.httpclient.get<loginImporter>(this.baseApiUrl + '/api/LoginImporter/GetLoginImporterByUsername/' + username);
  }

}
