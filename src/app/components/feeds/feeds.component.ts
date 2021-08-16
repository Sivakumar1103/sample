import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {
  timePeriods = [
    'Twitter',
    'Facebook',
    'Instagram',
    'LinkedIn',
    'Youtube'
  ];
  timeline:any[] =[];

  public socialProfiles = [{ socialId: '', socialName: '' }];

  constructor(
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private twitterService: TwitterService) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timeline, event.previousIndex, event.currentIndex);
  }

  // scrollLeft(){
  //   $('#scrollContainer').scrollLeft -= 20;
  // }

  // scrollRight(){
  //   $('#scrollContainer').scrollLeft += 20;
  // }

  scrollRight(el: Element) {
    const animTimeMs = 400;
    const pixelsToMove = 315;
    const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
    interval(animTimeMs / 8)
      .pipe(
        takeWhile(value => value < 8),
        tap(value => el.scrollLeft += (pixelsToMove * stepArray[value])),
      )
      .subscribe();
  }

  scrollLeft(el: Element) {
    const animTimeMs = 400;
    const pixelsToMove = 315;
    const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
    interval(animTimeMs / 8)
      .pipe(
        takeWhile(value => value < 8),
        tap (value => el.scrollLeft -= (pixelsToMove * stepArray[value])),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.spinner.hide();
    this.timeline = [
      {heading: "My Tweets", data:[""] },
      {heading: "Facebook", data:[""] },
      {heading: "LinkedIn", data:[""] },
      {heading: "Whatsapp", data:[""] },
      {heading: "Youtube", data:[""] },
    ]
  }

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.processSocialMediaProfile();
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.processSocialMediaProfile();
      });
    }
  }

  processSocialMediaProfile() {
    this.socialProfiles = [];
    this.manageaccountService.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'twitter') {
        this.socialProfiles.push({ socialId: `${scMedia.userId}`, socialName: ''+scMedia.screenName });
      }
    })
  }


  retrieveTwitterTimeline(userId: string) {
    this.twitterService.retrieveTweets(userId).subscribe((res: any) => {
      console.log(res.data);
    })
  }
}
