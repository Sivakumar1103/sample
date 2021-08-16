import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { SocialMediaComponent } from '../../dialog/social-media/social-media.component';

@Component({
  selector: 'app-usersocialprofile',
  templateUrl: './usersocialprofile.component.html',
  styleUrls: ['./usersocialprofile.component.scss']
})
export class UsersocialprofileComponent implements OnInit {

  userId = '';

  public dropdownList: SocialDropDown[] = [];
  userSocialProfile: SocialProfile | undefined;

  selectedFilterSocailProfile: SocialDropDown[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(private route: ActivatedRoute,
    public profileService: ProfileService,
    private twitterService: TwitterService,
    private spinner: NgxSpinnerService,
    private manageaccountService: ManageaccountService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("userId") || '';
    console.log(this.userId)
    this.spinner.show();
    this.retrieveSocialMediProfile();
  }

  openSocialModal() {
    const modalRef = this.modalService.open(SocialMediaComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
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
      } else {
        this.dropdownList.push({ socialId: `${scMedia.name}-${scMedia.userId}`, socialName: scMedia.screenName });
      }


    })
    this.spinner.hide();
  }

}
