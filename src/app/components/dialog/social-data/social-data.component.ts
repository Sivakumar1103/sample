import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialProfile } from 'src/app/model/socialProfile';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { PostData } from 'src/app/model/postData';
import { SocialUpdateData } from 'src/app/model/socialMediaUpdateData';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';

@Component({
  selector: 'app-social-data',
  templateUrl: './social-data.component.html',
  styleUrls: ['./social-data.component.scss']
})
export class SocialDataComponent implements OnInit {
  socialMediaUpdateData = {};
  SocialUpdateData: {
    socialMedia: any;
    action: any;
    postId: any;
    userId: any;
  } | undefined;
  updateObej = { socialMedia: "twitter", action: "like", postId: "1424719222135918595", userId: "1407676449637617665" }

  userSocialProfile: SocialProfile | undefined;
  public dropdownList = [] as any;


  postData:
    {
      socialData: any;
      profileData: any;
    } | undefined;

  constructor(public modal: NgbActiveModal,
    private manageaccountService: ManageaccountService,
    private modalService: NgbModal,
    private twitterService: TwitterService) { }


  ngOnInit(): void {
    this.retrieveSocialMediProfile();
    console.log(this.postData)
    if (this.postData?.socialData?.conversations.includes && this.postData?.socialData?.conversations.includes.users) {
      this.postData?.socialData?.conversations.data.forEach((post: any) => {

        const userDetails = this.postData?.socialData?.conversations.includes.users.filter((user: any) => user.id == post.in_reply_to_user_id);
        if (userDetails && userDetails.length > 0) {
          post.userDetailName = userDetails[0].username
          post.userProfImage = userDetails[0].profile_image_url
        }

      });
    }


  }

  
  twitterLike(socialMedia: any, action: any, postId: any, userId: any) {
    //const modalRef = this.modalService.open(SocialDataComponent, { backdropClass: 'in', windowClass: 'in', size: 'lg', centered: true });

    this.twitterService.socialMediaUpdate(socialMedia, action, postId, userId).subscribe(res => {

      let socialProfile;
      if (socialMedia === 'twitter') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialMedia));
        console.log("socialProfile.....",socialProfile)
      } else if (socialMedia === 'facebook') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialMedia));
      } else if (socialMedia === 'linkedin') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialMedia));
      }
      this.postData =
      {
        socialData: res.data,
        profileData: socialProfile
      }
    }, err => {
      console.log("err....", err);
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
          this.dropdownList.push({ socialType: 'facebook', socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: fbpage.name, socialImage: fbpage.userProfileImage, pageId: fbpage.id });
        });
      } else {
        this.dropdownList.push({ socialType: scMedia.name, socialId: `${scMedia.name}-${scMedia.userId}`, socialName: scMedia.screenName, socialImage: scMedia.userProfileImage, userId: scMedia.userId });
      }
    })
  }

  get getItems() {
    return this.dropdownList.reduce((acc: any, curr: any) => {
      acc[curr.socialId] = curr;
      return acc;
    }, {});
  }

}
