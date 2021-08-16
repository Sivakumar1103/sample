import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialProfile } from 'src/app/model/socialProfile';
import { User } from 'src/app/model/user';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userId = '';

  constructor(private route: ActivatedRoute,
    public profileService: ProfileService,
    private manageaccountService: ManageaccountService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("userId") || '';
    console.log(this.userId)
    this.spinner.show();
    if (!this.profileService.userData.firstName) {
      this.profileService.retrieveUserProfile().subscribe(res => {
        this.profileService.userData = res.data;
        this.retrieveSocialMediProfile();
        this.spinner.hide();
      });
    } else {
      this.retrieveSocialMediProfile();
      this.spinner.hide();
    }

  }

  retrieveSocialMediProfile() {
    this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
      this.manageaccountService.userSocialProfile = res.data as SocialProfile
    });
  }


}
