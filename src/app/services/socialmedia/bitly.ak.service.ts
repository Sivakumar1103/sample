import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitlyAKService {
  shareDataSubject = new Subject<boolean>();
  storageURL: any[] = [];
  sharedDataUrls = new Subject<string>();
  constructor(private http: HttpClient) { }

  generateAcessToken(code: string) {
    return this.http.post<any>(`${environment.bitlyService}/getBitlyAccessToken`, { code: code });
  }

  storageURLS(){
    return this.storageURL;
  }
  replaceURLs(message: string) {
    if (!message) return;
    let that = this;
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    that.sharedDataUrls.next("");
    that.shareDataSubject.next(false);
    var indexloc = 0;
    return message.replace(urlRegex, function (url: string) {
      var hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      if (url.indexOf('bit.ly') == -1 || url.indexOf('storefri.es') == -1) {
        that.shareDataSubject.next(true);
      }
      if(indexloc===0)
      that.sharedDataUrls.next(hyperlink);
      
      return '<a style="color:blue;" href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
    });

  }

  replaceURLonClick(message: string) {
    if (!message) return;
    let that = this;
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, function (url: string) {
      var hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      return '<a style="color:blue;" href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
    });

  }

  async replaceAsync(str: any, short_url:string) {
    const promises: Array<any> = [];
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    str.replace(urlRegex, (url: string) => {
      if (url.indexOf('bit.ly') == -1  && url.indexOf('storefri.es') == -1) {
        var hyperlink = url;  
        if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
        }
        const promise = short_url=="Bitly"?this.generateBitlyLink(hyperlink):this.generateRebrandlyLink(hyperlink);
        promises.push(promise);
      } else {
        return;
      }
    });
    const data = await Promise.all(promises);
    return str.replace(urlRegex, (url:string) => {
      if (url.indexOf('bit.ly') == -1 && short_url=="Bitly") {
        const shortURL = data.shift().data.link;
        this.storageURL.push([url,shortURL]);
      return  shortURL
      } else if (url.indexOf('storefri.es') == -1  && short_url=="Rebrandly") {
        const shortUrl =  data.shift().message.shortUrl;
        this.storageURL.push([url,"https://"+ shortUrl]);
        return "https://"+ shortUrl
        } else {
        return url;
      }
    });
  }
  generateLinkPreview(long_url:string){
    return this.http.post<any>(`${environment.linkPreview}`,
    {url:long_url});
  }
  generateBitlyLink(long_url: String) {
    return this.http.post<any>(`${environment.bitlyService}/getBitlyAccessToken`,
      { "domain": "bit.ly", group_guid: 'bitlyGroup', long_url: long_url }).toPromise();
  }
  generateRebrandlyLink(long_url: String) {
    return this.http.post<any>(`${environment.rebrandly}`,
      {  url: long_url }).toPromise();
  }

}
