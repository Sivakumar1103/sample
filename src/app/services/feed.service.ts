import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) { }

  getFeedData(searchParam = '') {
    if (searchParam != '') {
      return this.http.get(`${environment.feedUrl}/retrieve?q=${searchParam}`);
    } else {
      return this.http.get(`${environment.feedUrl}/retrieve`);
    }

  }

}
