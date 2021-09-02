import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FacebookService, LoginResponse, LoginStatus } from 'ngx-facebook-fb';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { ToastrService } from 'ngx-toastr';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { LinkedinService } from 'src/app/services/socialmedia/linkedin.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { PagesComponent } from '../../dialog/facebookPages/pages/pages.component';
import { SocialMediaComponent } from '../../dialog/social-media/social-media.component';

@Component({
  selector: 'app-manageaccount',
  templateUrl: './manageaccount.component.html',
  styleUrls: ['./manageaccount.component.scss']
})
export class ManageaccountComponent implements OnInit {
  public dropdownList: any[] = [];
  userSocialProfile: SocialProfile | undefined;
  isTwitterAvailable = false;
  facebookProfile: any;
  userId = '';

  selectedSocailProfile: SocialDropDown[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(private modalService: NgbModal,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FacebookService,
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private twitterService: TwitterService,
    private facebookAKService: FacebookAKService,
    private linkedinService: LinkedinService,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
  }

  retrieveSocialMediProfile() {
    this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
      this.userSocialProfile = res.data as SocialProfile;
      this.manageaccountService.userSocialProfile = res.data as SocialProfile;
      this.processSocialDropdown();
    });
  }

  processSocialDropdown() {
    this.dropdownList = [];
    this.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          this.dropdownList.push({ socialType: 'facebook', userId: scMedia.userId, pageId: fbpage.id, socialName: fbpage.name, socialImage: fbpage.userProfileImage, tagIcon:'facebook' });
        });
      } else if (scMedia.name == 'linkedin') {
        if (scMedia.linkedinProfile) {
          this.dropdownList.push({ socialType: scMedia.name, userId: scMedia.userId, socialName: scMedia.linkedinProfile.userName, socialImage: scMedia.linkedinProfile.userImage, tagIcon:'linkedin' });
        }
        if (scMedia.linkedinPages) {
          scMedia.linkedinPages?.forEach(lnPage => {
            this.dropdownList.push({ socialType: scMedia.name, pageId: lnPage.pageId || lnPage.userId, socialName: lnPage.pageName || lnPage.userName, socialImage:lnPage.pageImage?lnPage.pageImage:'../../../../assets/img/Linkedin.svg', tagIcon:'building' })
          })
        }
      } else {
        this.dropdownList.push({ socialType: scMedia.name, userId: scMedia.userId, socialName: scMedia.screenName, socialImage: scMedia.userProfileImage, tagIcon:'twitter' });
      }
    })
    this.spinner.hide();
  }

  removeAccount(socialData: any) {
    this.spinner.show();
    this.manageaccountService.removeSocialConnection(socialData.socialType, socialData.userId, socialData.pageId).subscribe(res => {
      this.spinner.hide();
      this.toastr.info(res.status);
      this.manageaccountService.userSocialProfile = {};
      this.retrieveSocialMediProfile();
    });
  }

  openSocialModal() {
    const modalRef = this.modalService.open(SocialMediaComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
  }

  reconnect(socialData: any) {
    if (socialData.socialType == 'twitter') {
      this.connectTwitter();
    } else if (socialData.socialType == 'twitter') {
      this.facebookLogin();
    } else if (socialData.socialType == 'linkedin') {
      this.registerLinkedIn();
    }
  }

  connectTwitter() {
    this.twitterService.requestToken().subscribe(res => {
      const urlParams = new URLSearchParams((res['data']));
      const oauth_token = urlParams.get('oauth_token');
      //   const oauth_token_secret = urlParams.get('oauth_token_secret');
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}&force_login=1`;
    });
  }

  registerLinkedIn() {
    this.linkedinService.getRedirectUrl().subscribe( res => {
      window.location.href = res.data;
    })
  }


  facebookLogin() {
    this.fb.getLoginStatus().then((response: LoginStatus) => {
      console.log(response)

      if (response.status === 'connected') {
        this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
          console.log('FB account registered')
          this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
        });

      }
      else {
        this.fb.login({ scope: 'public_profile,email, pages_show_list,pages_manage_ads,pages_manage_cta,pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content' })
          .then((response: LoginResponse) => {
            this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
              console.log('FB account registered');
              this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
            });
          })
          .catch((error: any) => console.error(error));
      }
    });
  }

  getFacebookAccountDetails(userId: String, accessToken: String) {
    this.fb.api(`${userId}/accounts?
          fields=name,access_token&
          access_token=${accessToken}`)
      .then(res => {
        const modalRef = this.modalService.open(PagesComponent, { backdropClass: 'in', windowClass: 'in' });
        const newRes = res.data.map((item: any) => {
          return {
            category: item.category,
            name: item.name,
            id: item.id
          }
        });
        modalRef.componentInstance.messageData = {
          facebookPages: newRes
        };

        modalRef.result
          .then((selectedPages) => {
            return this.facebookAKService.saveUserPages(userId, selectedPages).toPromise();
          })
          .then((response) => {
            this.toastr.success(response.status);
            this.modalService.dismissAll();
          })
          .catch(() => {
            this.toastr.error('Error in connecting your social account. Please contact helpdesk');
            this.modalService.dismissAll();
          });
      })
      .catch(e => console.log(e));
  }

}
