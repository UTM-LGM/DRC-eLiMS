import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userDTO } from '../models/userDTO';
import { environment } from '../environments/environment';
import { loginImporter } from '../models/loginImporters';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseApiUrl: string = environment.baseApiUrlElims;
  constructor(private http: HttpClient) { }


  GetUserInfo(username: string) {
    return this.http.get<userDTO>(this.baseApiUrl + '/api/LoginForwarders/GetLoginForwarderByUsername/' + username)

  }

  GetImporterInfo(username: string) {
    return this.http.get<any>(this.baseApiUrl + '/api/LoginImporters/GetLoginImporterByUsername/' + username)

  }

  GetStaffInfo(username: string) {
    return this.http.get<any>(this.baseApiUrl + '/api/Staffs/GetStaffByUsername/' + username)

  }

  UploadSignature(staffId: any, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(staffId)
    return this.http.post(this.baseApiUrl + '/api/staffs/UploadSignature/' + staffId, formData);
  }


}
