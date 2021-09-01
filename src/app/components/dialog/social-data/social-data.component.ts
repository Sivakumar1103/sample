import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialProfile } from 'src/app/model/socialProfile';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { PostData } from 'src/app/model/postData';
import { SocialUpdateData } from 'src/app/model/socialMediaUpdateData';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import { LinkedinService } from 'src/app/services/socialmedia/linkedin.service';
import { roundToNearestMinutesWithOptions } from 'date-fns/fp';



@Component({
  selector: 'app-social-data',
  templateUrl: './social-data.component.html',
  styleUrls: ['./social-data.component.scss']
})
export class SocialDataComponent implements OnInit {
  condition = true;
  show = false;
  socialMediaUpdateData = {};
  SocialUpdateData: {
    socialMedia: any;
    action: any;
    postId: any;
    userId: any;
  } | undefined;
 

  userSocialProfile: SocialProfile | undefined;
  public dropdownList = [] as any;
  selectedSocailProfile: any[] = [];
  postingData = '';
  public mediaData: Array<any> = [];

  postData:
    {
      socialData: any;
      profileData: any;
    } | undefined;

  constructor(public modal: NgbActiveModal,
    private linkedinService: LinkedinService,
    private manageaccountService: ManageaccountService,
    private modalService: NgbModal,
    private router: Router,
    private twitterService: TwitterService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private contentlibraryService: ContentLibraryService,



  ) { }

  visible(){
    this.show = true;
  }
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
        console.log("socialProfile.....", socialProfile)
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
  CommentReply(postInfo: any) {
       

    console.log('Posting Immediately:::::::',postInfo);

    const twitterProfile: Array<any> = [];
    const fbProfile: Array<any> = [];
    const linkedInProfile: Array<any> = [];
    let id = "";
    let tweetData: any[] = [];


    let tweetPro = {
      name: "twitter",
      postId: postInfo.postId,
      userId: postInfo.userId
    }

    tweetData.push(tweetPro)


    const postData = {
      postData: this.postingData,
      scheduleTime: '',
      postStatus: 'Posted',
      linkedInData: [],
      fbpost: [],
      tweetData: tweetData,
      mediaData: this.mediaData,

    };

    
    
  
    if (this.postingData == '') {
      this.toastr.error("Text field is empty")
      return;
    } 
    this.condition = false;
    const mediaArray = [];
    if (this.mediaData && this.mediaData.length > 0 && twitterProfile.length > 0) {
      mediaArray.push(this.contentlibraryService.uploadTwitterMedia({ fileNames: this.mediaData, twitterProfile }));
    }
    if (this.mediaData && this.mediaData.length > 0 && linkedInProfile.length > 0) {
      linkedInProfile.forEach(lkProf => {
        mediaArray.push(this.linkedinService.getUploadUrl(lkProf.userId, lkProf.pageId, this.mediaData));
      })
    }

    if (mediaArray.length > 0) {
      forkJoin(mediaArray).subscribe((respData: any) => {
        let respArrCnt = 0;
        if (twitterProfile.length > 0) {
          console.log(respData[respArrCnt]);
          twitterProfile.forEach(profile => {
            profile['mediaUrl'] = respData[respArrCnt].mediaId;
          })
          respArrCnt = respArrCnt + 1;
        }

        if (linkedInProfile.length > 0) {
          linkedInProfile.forEach(lkProf => {
            lkProf['mediaUrl'] = respData[respArrCnt].uploadedAssets;
            respArrCnt = respArrCnt + 1;
          })
        }

        this.twitterService.postSocial(postData).subscribe(res => {
          this.spinner.hide();
          console.log(res)
          this.toastr.success(res.status);
        });
      });
    } else {
      this.twitterService.postSocial(postData).subscribe(res => {
        this.spinner.hide();
        console.log(res)
        this.toastr.success(res.status);
      });
    }
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
