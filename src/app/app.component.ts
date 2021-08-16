import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { AuthService } from './services/usermanagement/auth.service';
import { ProfileService } from './services/usermanagement/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { FacebookService, InitParams } from 'ngx-facebook-fb';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ManageaccountService } from './services/manageaccount.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userSocialProfile: SocialProfile | undefined;
  isTwitterAvailable = false;
  isFacebookAvailable = false;
  tweetData = '';

  title = 'Aikyne Social Media Publisher';
  userData!: User;
  userId = '';
  public dropdownList: SocialDropDown[] = [];


  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(
    private router: Router,
    public authServiceAK: AuthService,
    public profileService: ProfileService,
    private twitterService: TwitterService,
    private manageaccountService: ManageaccountService,
    private fb: FacebookService,
    @Inject(PLATFORM_ID) private platformId: Object) { }


  ngOnInit(): void {
    // uncomment for prod deployment
    setTimeout(() => {
      this.facebookInit();
    }, 500);
    if (this.router.url.indexOf('socialManage/twitterSignUp') != -1) {
      const urlParams = new URLSearchParams(this.router.url);
      const retToken = urlParams.get('retToken');
      const oauth_token = urlParams.get('oauth_token');
      const oauth_verifier = urlParams.get('oauth_verifier');
      this.twitterService.generateAcessToken({ 'retToken': retToken, 'oauth_token': oauth_token, 'oauth_verifier': oauth_verifier }).subscribe(res => {
        this.router.navigate(['/'])
      });
    }
    if (!this.profileService.userData.firstName) {
      this.profileService.retrieveUserProfile().subscribe(res => {
        this.profileService.userData = res.data;
        this.retrieveSocialMediProfile();
      });
    } else {
      this.retrieveSocialMediProfile();
    }
  }

  isAuthenticated() {
    return this.authServiceAK.loggedIn();
  }

  facebookInit() {
    console.log('FB Init called')
    if (isPlatformBrowser(this.platformId)) {
      let initParams: InitParams = {
        appId: '173379087570136',
        xfbml: true,
        version: 'v2.8'
      };
      this.fb.init(initParams).then(res => { console.log('FB init completed') });
    }
  }

  retrieveSocialMediProfile() {
    this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
      this.userSocialProfile = res.data as SocialProfile;
      this.manageaccountService.userSocialProfile = res.data as SocialProfile;
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
    });
  }
}
