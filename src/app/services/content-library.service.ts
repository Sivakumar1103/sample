import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ContentLibraryService {

  constructor(private http: HttpClient) { }



  uploadImages(folderName = '', extension = 'jpg', fileName = '') {
    return this.http.get<ApiResponse>(`${environment.contentManagement}/uploadMedia?ext=${extension}&folder=${folderName}&fName=${fileName}`);
  }

  retrieveImages(folderName = 'tempFolder', searchQuery = null, filterQuery = null) {
    const searchString = searchQuery ? `&q=${searchQuery}` : ''
    const filterString = filterQuery ? `&filterBy=${filterQuery}` : ''
    return this.http.get<ApiResponse>(`${environment.contentManagement}/retrieveMediaList?folder=${folderName}${searchString}${filterString}`);
  }

  uploadActualImage(uri: string, file: File) {
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

  uploadTwitterMedia(bodyObj: any) {
    return this.http.post<any>(`${environment.contentManagement}/uploadTwitterMedia`, bodyObj);
  }

  removeMedia(mediaKey: string[]) {
    return this.http.post<any>(`${environment.contentManagement}/removeMedia`, {mediaKey});
  }

}
