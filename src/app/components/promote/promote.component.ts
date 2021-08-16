import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostData } from 'src/app/model/postData';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';


@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.scss']
})
export class PromoteComponent implements OnInit {

  public dropdownList: SocialDropDown[] = [];
  userSocialProfile: SocialProfile | undefined;

  selectedFilterSocailProfile: SocialDropDown[] = [];
  publishedPost: PostData[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: string | undefined;

  constructor(private twitterService: TwitterService,
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.twitterService.retrieveAllPublishedPost(false, true, false).subscribe(res => {
      //process Posts
      if (res.data && res.data.posts) {
        res.data.posts.forEach((postedPost: any) => {
          postedPost.tweetData.forEach((tweet: PostData) => {
            this.publishedPost.push({
              userName: tweet.userName,
              userId: tweet.userId,
              postStatus: tweet.postStatus,
              postId: tweet.postId,
              postDate: tweet.postDate,
              postData: postedPost.postData,
              socialName: 'twitter',
              mediaUrl: tweet.mediaUrl
            })
          });
          postedPost.fbpost.forEach((post: PostData) => {
            this.publishedPost.push({
              userName: post.userName,
              userId: post.userId,
              pageId: post.pageId,
              postStatus: post.postStatus,
              postId: post.postId,
              postDate: post.postDate,
              postData: postedPost.postData,
              socialName: 'facebook',
              mediaUrl: post.mediaUrl
            })
          });
        });
      }
      this.spinner.hide();
    })
  }

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.userSocialProfile = this.manageaccountService.userSocialProfile;
      this.processSocialDropdown();
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.userSocialProfile = res.data as SocialProfile;
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.processSocialDropdown();
      });
    }
  }

  processSocialDropdown() {
    this.dropdownList = [];
    this.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          this.dropdownList.push({ socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: fbpage.name });
        });
      } else if (scMedia.name == 'twitter') {
        this.dropdownList.push({ socialId: `twitter-${scMedia.userId}`, socialName: scMedia.screenName });
      }
    })
  }

}
