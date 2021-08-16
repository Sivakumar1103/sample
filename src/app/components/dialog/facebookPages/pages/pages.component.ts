import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  messageData: {
    facebookPages: any;
    facebookGroups: any;
  } | undefined;

  constructor(public modal: NgbActiveModal,
    private manageaccountService: ManageaccountService,) { }

  ngOnInit(): void {
    //this.retrieveSocialMediProfile();
  }

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.manageaccountService.userSocialProfile.socialMedia?.forEach(scMedia => {
        if (scMedia.name == 'facebook') {
          scMedia.fbpages?.forEach(fbpage => {
            if(this.messageData && this.messageData.facebookPages) {
              var foundIndex = this.messageData.facebookPages.findIndex((pages: any) => pages.id == fbpage.id);
              this.messageData.facebookPages[foundIndex].selected = true;
            }
          });
        }
      });
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.manageaccountService.userSocialProfile.socialMedia?.forEach(scMedia => {
          if (scMedia.name == 'facebook') {
            scMedia.fbpages?.forEach(fbpage => {
              if(this.messageData && this.messageData.facebookPages) {
                var foundIndex = this.messageData.facebookPages.findIndex((pages: any) => pages.id == fbpage.id);
                this.messageData.facebookPages[foundIndex].selected = true;
              }
            });
          }
        });
      });
    }
  }

}
