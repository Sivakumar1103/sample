import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { HttpBackend } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient,
    private handler: HttpBackend) { }

  requestToken() {
    return this.http.get<any>(`${environment.socialMedia}/twr/twitterToken`);
  }

  generateAcessToken(accessDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/twr/twitterAccessToken`, accessDetails);
  }

  postSocial(postData: any) {
    return this.http.post<any>(`${environment.socialMedia}/postSocial`, { postData });
  }

  postTweet(userAccount: Array<any>, tweet: any) {
    return this.http.post<any>(`${environment.socialMedia}/twr/postTweet`, { userAccount, tweet });
  }

  saveDraftPost(draftPostData: any) {
    return this.http.post<any>(`${environment.socialMedia}/saveDraftPost`, { draftPostData });
  }

  schedulePost(schedulePostData: any) {
    return this.http.post<any>(`${environment.socialMedia}/scheduleSocialPost`, { schedulePostData });
  }

  socialMediaUpdate(socialMedia: string, action: string, postId: string, userId: string) {
    return this.http.post<ApiResponse>(`${environment.socialMedia}/socialMediaStatusUpdate`, { socialMedia, action, postId, userId });
  }
  socialMediaReply(socialMedia: string, action: string, postId: string, userId: string) {
    return this.http.post<any>(`${environment.socialMedia}/postSocial`, { socialMedia, action, postId, userId  });
  }

  retrieveAllPublishedPost(showdraft = false, showPublished = false, showScheduled = false) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveUserTimeline?draft=${showdraft}&publised=${showPublished}&scheduled=${showScheduled}`);            
  }

  retrieveAllSocialPost(showdraft = false, showPublished = false, showScheduled = false) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveAllPost?draft=${showdraft}&publised=${showPublished}&scheduled=${showScheduled}`);
  }

  retrieveSavedPost(postId: string, postStatus: string) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveSavedPost?postId=${postId}&postStatus=${postStatus}`);
  }

  deletePost(postIds: string[], postStatus: string) {
    return this.http.post<ApiResponse>(`${environment.socialMedia}/deletePost`, { postId: postIds, postType: postStatus });
  }

  // retreivePostFromWeb(socialMedia: string, postId: string) {
  //   return this.http.post<ApiResponse>(`${environment.socialMedia}/retrievePostWeb `, { socialMedia, postId });
  // }

  retreivePostFromWeb(socialMedia: string, postId: string, userId: string) {
    return this.http.post<ApiResponse>(`${environment.socialMedia}/retrievePostWeb `, { socialMedia, postId, userId });
  }


  retrieveTweets(twitterId: string) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/twr/retrieveTweets?userId=${twitterId}`);
  }

  deletePostFromWeb(requestData: any) {
    return this.http.post<ApiResponse>(`${environment.socialMedia}/deletePostWeb`, requestData);
  }

}
