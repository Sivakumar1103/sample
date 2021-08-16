import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LinkedinService {

  constructor(private http: HttpClient) { }

  getRedirectUrl() {
    return this.http.get<any>(`${environment.socialMedia}/lkin/getRedirectUrl `);
  }

  retrieveLinkedProfile(tokenDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/lkin/retreiveLinkedInProfile`, tokenDetails);
  }
  
  saveUserToken(tokenDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/lkin/saveUserToken`, tokenDetails);
  }

  saveAccessToken(tokenDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/lkin/saveUserToken  `, tokenDetails);
  }

  /* getUploadUrl(userId: String, file: any) {
    return this.http.post<any>(`${environment.socialMedia}/lkin/getUploadUrl`, { userId, fileNames: file });
  } */
  getUploadUrl(userId: string, pageId: string, file: any) {
    return this.http.post<any>(`${environment.socialMedia}/lkin/getUploadUrl`, { userId, pageId,fileNames: file });
  }


  uploadActualImage(uri: string, file: File) {
    console.log(uri)
    const headers = new HttpHeaders({ 'Content-Type': file.type });
    return this.http.put<any>(uri, file, {
      reportProgress: true,
      observe: 'events',
      headers: headers
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }

    })
    );
  }
}
