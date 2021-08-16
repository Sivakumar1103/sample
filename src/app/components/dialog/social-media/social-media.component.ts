import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FacebookService, LoginResponse, LoginStatus } from 'ngx-facebook-fb';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { LinkedinService } from 'src/app/services/socialmedia/linkedin.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { PagesComponent } from '../facebookPages/pages/pages.component';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  userSocialProfile: SocialProfile | undefined;
  isTwitterAvailable = false;
  isFacebookAvailable = false;

  constructor(private twitterService: TwitterService,
    private fb: FacebookService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private manageaccountService: ManageaccountService,
    private facebookAKService: FacebookAKService,
    private linkedinService: LinkedinService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
  }

  connectTwitter() {
    this.spinner.show();
    this.manageaccountService.userSocialProfile = {};
    this.twitterService.requestToken().subscribe(res => {
      const urlParams = new URLSearchParams((res['data']));
      const oauth_token = urlParams.get('oauth_token');
      this.spinner.hide();
      //   const oauth_token_secret = urlParams.get('oauth_token_secret');
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}&force_login=1`;
    });
  }


  facebookLogin() {
    this.spinner.show();
    this.manageaccountService.userSocialProfile = {};
    this.fb.getLoginStatus().then((response: LoginStatus) => {
      console.log(response)

      if (response.status === 'connected') {
        this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
          console.log('FB account registered')
          this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
        });
      }
      else {
        this.fb.login({ scope: 'public_profile,email, pages_show_list,pages_manage_ads,pages_manage_cta,pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content,publish_to_groups' })
          .then((response: LoginResponse) => {
            this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
              console.log('FB account registered');
              this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
            });
          })
          .catch((error: any) => {
            this.spinner.hide();
            console.error(error);
          });
      }
    });
  }

  getFacebookAccountDetails(userId: String, accessToken: String) {
    this.manageaccountService.userSocialProfile = {};
    const fbArray = [];
    fbArray.push(this.fb.api(`${userId}/groups?access_token=${accessToken}`));
    fbArray.push(this.fb.api(`${userId}/accounts?fields=name,access_token&access_token=${accessToken}`));

    forkJoin(fbArray).subscribe((respData: any) => {
      let accntRes = [];
      let newRes = [];
      if (respData[0]) {
        accntRes = respData[0].data.map((item: any) => {
          return {
            category: item.privacy + ' Group',
            name: item.name,
            id: item.id
          }
        });
      }

      if (respData[1]) {
        newRes = respData[1].data.map((item: any) => {
          return {
            category: item.category,
            name: item.name,
            id: item.id
          }
        });
      }

      this.spinner.hide();

      const modalRef = this.modalService.open(PagesComponent, { backdropClass: 'in', windowClass: 'in' });
      modalRef.componentInstance.messageData = {
        facebookPages: newRes,
        facebookGroups: accntRes
      };

      modalRef.result
        .then((selectedPages) => {
          this.spinner.show();
          return this.facebookAKService.saveUserPages(userId, selectedPages).toPromise();
        })
        .then((response) => {
          if (response.status) {
            this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
              this.userSocialProfile = res.data as SocialProfile;
              this.manageaccountService.userSocialProfile = res.data as SocialProfile;
              this.spinner.hide();
              this.toastr.success(response.status);
              this.modalService.dismissAll();
            });
          } else {
            this.spinner.hide();
            this.toastr.success(response);
            this.modalService.dismissAll();
          }

        })
        .catch(() => {
          this.spinner.hide();
          this.toastr.error('Error in connecting your social account. Please contact helpdesk')
        });
    })
  }


  registerLinkedIn() {
    this.linkedinService.getRedirectUrl().subscribe(res => {
      window.location.href = res.data;
    })
  }

}
