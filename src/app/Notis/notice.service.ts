import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Notice } from '../models/notice';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  baseApiUrl: string = environment.baseApiUrlElims;
  baseApiUrlLocal: string = environment.baseApiUrlElimsLocal;
  private selectedId: number;

  constructor(private http: HttpClient) { }

  GetNotices() {
    return this.http.get<any>(this.baseApiUrl + '/api/Notices/GetNotices');
  }

  PostNotice(notice: Notice): Observable<Notice> {
    return this.http.post<Notice>(this.baseApiUrl + '/api/Notices/PostNotice', notice);
  }

  // updateNotices(notices: Notice[]): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/notices`, notices);
  // }

  // PutNotice(ids: number[], notices: { id: number, isShow: boolean }[]): Observable<void> {
  //   return this.http.put<void>(`${this.baseApiUrl}/api/Notices/PutNotices`, notices, {
  //     params: {
  //       ids: ids.join(',')  // Convert the list of IDs to a comma-separated string
  //     }
  //   });
  // }
  
  PutNotice(notices: { id: number, isShow: boolean }[]): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/Notices/PutNotices`, notices);
  }
  
  

  // PutNotice(notice: Notice): Observable<void> {
  //   return this.http.put<void>(`${this.baseApiUrl}/api/Notices/${notice.id}`, notice);
  // }

  // PutNotice(notice: Notice): Observable<void> {
  //   return this.http.put<any>(`${this.baseApiUrl}/api/Notices/PutNotices/${notice.id}`, notice);
  // }


  // DeleteNotice(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.baseApiUrl}/api/Notices/DeleteNotice/${id}`);
  // }


  DeleteNotice(id: number): Observable<Notice> {
    return this.http.delete<Notice>(this.baseApiUrl + '/api/Notices/DeleteNotice/' + id);
  }

  GetSelectedNotices(){
    return this.http.get<any>(this.baseApiUrl + '/api/Notices/GetSelectedNotices');
  }

  PostFileAnnouncement(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file)
    return this.http.post(this.baseApiUrl + '/api/Notices/UploadAnnouncement' , formData);
  }

  PostFile(id: any, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file)
    return this.http.post(this.baseApiUrl + '/api/Notices/UploadFile/' + id , formData);
  }



}
