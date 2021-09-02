import { Component, Pipe } from '@angular/core';
import { ChangeDetectionStrategy, ViewChild, TemplateRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, isSameMinute } from 'date-fns';
import { Subject } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarMonthViewDay, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { ToastrService } from 'ngx-toastr';
import { DisableCalendarTooltip } from './disableCalendarTooltip';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { MatTooltip } from '@angular/material/tooltip';
import { SocialProfileUtil } from 'src/app/utility/socialprofile';
import { PostData } from 'src/app/model/postData';
import { DatePipe } from '@angular/common';
import { SocialDataComponent } from 'src/app/components/dialog/social-data/social-data.component';

interface EventGroupMeta {
  type: string;
}

export interface MediaData {
  postDate: string;
  postData: string;
  publishedBy: string;
  View: string;
}

const colors: any =
{
  draft:
  {
    primary: '#f5f3a9',
    secondary: '#f0ed60',
  },
  published:
  {
    primary: '#59bd4a',
    secondary: '#ffffff',
  },
  scheduled:
  {
    primary: '#4dabff',
    secondary: '#ffffff',
  }
};

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: DisableCalendarTooltip,
    }
  ]
})



export class ScheduleComponent {
  person = "man";
  nav_position: any = 'end';
  publishedPost!: any[];
  modelData!: any[];
  mediaUrl!: any[];

  onTogglePosition(position: string) {
    this.nav_position == 'end';

  }


  public showFacebookPreview: boolean = false;
  public showTwitterPreview: boolean = false;
  public dropdownList: any[] = [];
  images = [] as any;
  userSocialProfile: SocialProfile | undefined;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: string | undefined;

  showMarker = true;
  viewName = 'Month';
  // just for the purposes of the demo so it all fits in one screen
  dayStartHour = 23;

  dayEndHour = 0;

  selectedSocailProfile: SocialDropDown[] = [];
  selectedFilterSocailProfile: SocialDropDown[] = [];


  scheduledCheck = true;
  publishedCheck = true;

  public dateFilter: any | undefined;

  postData:
    {
      socialData: any;
      profileData: any;
    } | undefined;

  constructor(private modal: NgbModal,
    private toastr: ToastrService,
    private twitterService: TwitterService,
    public route: ActivatedRoute,
    private router: Router,
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private dataTransferService: DataTransferService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private socialProfileUtil: SocialProfileUtil) { }


  eventsOriginal: CalendarEvent[] = [];
  events: CalendarEvent[] = [];
  groupedSimilarEvents: CalendarEvent[] = [];

  dataSource = this.eventsOriginal;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.retrieveScheduledEvents();
    if (this.postData?.socialData?.conversations && this.postData?.socialData?.conversations.includes && this.postData?.socialData?.conversations.includes.users) {
      this.postData?.socialData?.conversations.data.forEach((post: any) => {
        const userDetails = this.postData?.socialData?.conversations.includes.users.filter((user: any) => user.id == post.in_reply_to_user_id);
        if (userDetails && userDetails.length > 0) {
          post.userDetailName = userDetails[0].username
          post.userProfImage = userDetails[0].profile_image_url
        }

      });
    }
  }
  retrieveScheduledEvents() {
    this.events = [];
    this.twitterService.retrieveAllSocialPost(false, true, true).subscribe(res => {
      // process scheduled
      if (res.data && res.data.scheduled) {
        res.data.scheduled.forEach((scheduled: any) => {
          let startDate = new Date(Date.parse(scheduled.scheduledPost.scheduleTime));
          startDate.setHours(0);
          startDate.setMinutes(0);
          startDate.setSeconds(0);

          const events = this.constructCalendarTile(scheduled.scheduledPost, 'scheduled');
          events.forEach((evnt: any) => {
            this.events.push({
              id: scheduled.scheduledPost._id,
              meta: {
                fbpost: scheduled.scheduledPost.fbpost,
                tweetData: scheduled.scheduledPost.tweetData,
                linkedInData: scheduled.scheduledPost.linkedInData,
                postData: scheduled.scheduledPost.postData,
                mediaData: scheduled.scheduledPost.mediaData,
                postType: 'scheduled',
                type: evnt.title.indexOf('fab fa-facebook') !== -1 ? 'scheduled-facebook' : (evnt.title.indexOf('fab fa-twitter') !== -1 ? 'scheduled-twitter' : (evnt.title.indexOf('fab fa-linkedin') !== -1 ? 'scheduled-linkedin' : '')),
                social: evnt.social.social,
                userId: evnt.social.userId,
                timeData: (new Date(Date.parse(scheduled.scheduledPost.scheduleTime))).toLocaleTimeString()
              },
              start: startDate,
              title: evnt.title,
              color: colors.scheduled,
              actions: this.scheduledActions,
              allDay: true,
            })
          });

        });
      }

      // process published
      if (res.data && res.data.posts) {
        res.data.posts.forEach((post: any) => {
          let startDate = new Date(post.postData.postTime);
          startDate.setHours(0);
          startDate.setMinutes(0);
          startDate.setSeconds(0);

          const events = this.constructCalendarTile(post.postData, 'published');
          events.forEach((evnt: any) => {


            this.events.push({
              id: post.postData._id,
              meta: {
                fbpost: post.postData.fbpost,
                tweetData: post.postData.tweetData,
                linkedInData: post.postData.linkedInData,
                postData: post.postData.postData,
                mediaData: evnt.social.mediaImages,
                postType: 'published',
                type: evnt.title.indexOf('fab fa-facebook') !== -1 ? 'published-facebook' : (evnt.title.indexOf('fab fa-twitter') !== -1 ? 'published-twitter' : (evnt.title.indexOf('fab fa-linkedin') !== -1 ? 'published-linkedin' : '')),
                social: evnt.social.social,
                userId: evnt.social.userId,
                timeData: (new Date(Date.parse(post.postData.postTime))).toLocaleTimeString()
              },
              start: startDate,
              title: evnt.title,
              color: colors.published,
              actions: this.publishedActions,
              allDay: true,
            })
          });
        });
      }
      this.eventsOriginal = JSON.parse(JSON.stringify(this.events));


      this.groupedSimilarEvents = [];
      const processedEvents = new Set();
      this.events.forEach((event: any) => {
        if (processedEvents.has(event)) {
          return;
        }
        const similarEvents = this.events.filter((otherEvent: any) => {
          return (
            otherEvent !== event &&
            !processedEvents.has(otherEvent) &&
            isSameMinute(otherEvent.start, event.start) &&
            (isSameMinute(otherEvent.end, event.end) ||
              (!otherEvent.end && !event.end)) &&
            otherEvent.color.primary === event.color.primary &&
            otherEvent.color.secondary === event.color.secondary
          );
        });
        processedEvents.add(event);
        similarEvents.forEach((otherEvent) => {
          processedEvents.add(otherEvent);
        });
        if (similarEvents.length > 0) {
          this.groupedSimilarEvents.push({
            title: `${similarEvents.length + 1} events`,
            color: event.color,
            start: event.start,
            end: event.end,
            meta: {
              groupedEvents: [event, ...similarEvents],
            },
          });
        } else {
          this.groupedSimilarEvents.push(event);
        }
      });

      this.refresh.next();
      this.spinner.hide();
    })

  }
  resetDate() {
    if (this.dateFilter != '') {
      this.dateFilter = '';
      this.spinner.show();
      // this.retrievePublishedData();
    }
  }


  beforeMonthViewRender({
    body,
  }: {
    body: CalendarMonthViewDay<EventGroupMeta>[];
  }): void {
    // month view has a different UX from the week and day view so we only really need to group by the type
    body.forEach((cell: any) => {
      const groups: any = {};
      cell.events.forEach((event: any) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  generateMediaImage(mediaData: any) {
    if (mediaData && mediaData.length >= 1) {
      if (mediaData.length > 1) {
        if (!!mediaData[0].fileUrl) {
          return `<span class='imageBorder'><span class="blurImage"><img height="100px" src='${mediaData[0].fileUrl}' alt="Published Image" class="publishedImageCalendar"></span><span class="lengthPosition"><span class="textBg">+${mediaData.length - 1}</span></span></span>`;
        } else {
          return `<span class='imageBorder'><span class="blurImage"><img height="100px" src='${mediaData[0]}' alt="Published Image" class="publishedImageCalendar"></span><span class="lengthPosition"><span class="textBg">+${mediaData.length - 1}</span></span></span>`;
        }
      } else {
        if (!!mediaData[0].fileUrl) {
          return `<span class='imageBorder'><span class="imageShow"><img height="100px" src='${mediaData[0].fileUrl}' alt="Published Image" class="publishedImageCalendar"></span></span>`;
        } else {
          return `<span class='imageBorder'><span class="imageShow"><img height="100px" src='${mediaData[0]}' alt="Published Image" class="publishedImageCalendar"></span></span>`;
        }
      }
    } else {
      return '';
    }
  }

  constructCalendarTile(postData: any, type: string) {
    const eventArray: any[] = [];
    let mediaImages = '';

    if (postData.mediaData && postData.mediaData.length > 0) {
      mediaImages = this.generateMediaImage(postData.mediaData);
    }
    const socialIcons = this.generateSocialIcons(postData);
    socialIcons.forEach((social: any) => {
      if (type == 'scheduled') {
        eventArray.push({
          title: `<div class="calendarTile"><div class="calendarHeader ${type}"><i class="fal fa-clock"></i><div class="calTime">${(new Date(Date.parse(postData.scheduleTime))).toLocaleTimeString()}</div></div><div class="calendarBody">${social.social}<div class="postDataCnt">${postData.postData}</div><div class='imagePublished'>${mediaImages}</div></div></div>`,
          social
        });
      } else {
        eventArray.push({
          title: `<div class="calendarTile"><div class="calendarHeader ${type}"><i class="far fa-calendar-check"></i><div class="calTime">${(new Date(Date.parse(postData.postTime))).toLocaleTimeString()}</div></div><div class="calendarBody">${social.social}<div class="postDataCnt">${postData.postData}</div><div class='imagePublished'>${social.mediaImages}</div></div></div>`,
          social
        });
      }
    });
    return eventArray;
  }

  scheduledActions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editPost('' + event.id);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deletePost('' + event.id);
      },
    }
  ]

  publishedActions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-eye"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.viewPost('' + event.id);
      },
    },
    {
      label: '<i class="fas fa-fw fa-copy"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.copyPostText('' + event.meta.postData);
      },
    }
  ]

  editPost(postId: string) {
    this.router.navigate([`socialmedia/publishing/newpost/${postId}/scheduled`]);
  }

  openMonthViewModal(day: any, socialMedia: string) {
    this.modelData = [];
    console.log("..............................................",);
    console.log("day socialMedia", day);
    console.log(socialMedia);
    let postData
    if (socialMedia.includes('scheduled')) {
      console.log('scheduled')
      this.twitterService.retrieveAllSocialPost(false, false, true).subscribe(res => {
        //process Posts
        this.publishedPost = [];
        if (res.data && res.data.scheduled) {
          res.data.scheduled.forEach((postedPost: any) => {
            if(socialMedia.includes('twitter'))
            postedPost.scheduledPost.tweetData?.forEach((tweet: PostData) => {
              if (this.checkAccountLinked('twitter', tweet.userId)) {
                this.publishedPost.push({
                  userName: tweet.userName,
                  userId: tweet.userId,
                  pageId:'',
                  postStatus: postedPost.scheduledPost.postStatus,
                  postId: postedPost.scheduledPost._id,
                  postDate: (!!postedPost.scheduledPost.scheduleTime) ? new Date(postedPost.scheduledPost.scheduleTime).toISOString() : '',
                  postData: postedPost.scheduledPost.postData,
                  socialName: 'twitter',
                  mediaUrl: postedPost.scheduledPost.mediaData,
                  type: 'scheduled'
                })
              }
            });
            if(socialMedia.includes('linkedin'))
            postedPost.scheduledPost.linkedInData?.forEach((linkedIn: PostData) => {
              if (this.checkAccountLinked('linkedIn', linkedIn.userId)) {
                this.publishedPost.push({
                  userName: linkedIn.userName,
                  userId: linkedIn.userId,
                  postStatus: postedPost.scheduledPost.postStatus,
                  postId: postedPost.scheduledPost._id,
                  pageId: linkedIn.pageId?linkedIn.pageId:'',
                  postDate: (!!postedPost.scheduledPost.scheduleTime) ? new Date(postedPost.scheduledPost.scheduleTime).toISOString() : '',
                  postData: postedPost.scheduledPost.postData,
                  socialName: 'linkedin',
                  mediaUrl: postedPost.scheduledPost.mediaData,
                  type: 'scheduled'
                })
              }
            });
            if(socialMedia.includes('facebook'))
            postedPost.scheduledPost.fbpost?.forEach((post: PostData) => {
              if (this.checkAccountLinked('facebook', post.pageId)) {
                this.publishedPost.push({
                  userName: post.userName,
                  userId: post.userId,
                  pageId: post.pageId,
                  postStatus: postedPost.scheduledPost.postStatus,
                  postId: postedPost.scheduledPost._id,
                  postDate: (!!postedPost.scheduledPost.scheduleTime) ? new Date(postedPost.scheduledPost.scheduleTime).toISOString() : '',
                  postData: postedPost.scheduledPost.postData,
                  socialName: 'facebook',
                  mediaUrl: postedPost.scheduledPost.mediaData,
                  type: 'scheduled'
                })
              }
            });
          });
          // if (socialMedia.split("-")[0] == 'published') {
          //   this.dataTransferService.socialMedia = socialMedia.split("-")[1];
          //   this.dataTransferService.scheduleDate = day;
          //   //this.router.navigate([`socialmedia/publishing/publishedpost`]);

          // }
          // if (socialMedia.split("-")[0] == 'scheduled') {
          //   this.dataTransferService.socialMedia = socialMedia.split("-")[1];
          //   this.dataTransferService.scheduleDate = day;
          //   this.view = CalendarView.Day;
          //   console.log(this.viewDate)
          //   console.log(day)
          //   console.log(new Date(day))
          //   this.viewDate = new Date(day.date);
          //   this.viewName = 'Scheduled';
          // }
        }
        this.spinner.hide();
        this.dateFilter = new Date(day.date).toDateString();

        this.dateFilter = this.datePipe.transform(new Date(this.dateFilter), 'yyyy-MM-dd');
        console.log(this.publishedPost);

        this.modelData = this.publishedPost.filter((item: any) => {
          return new Date(item.postDate).toLocaleDateString() === new Date('' + this.dateFilter).toLocaleDateString();
        });
        console.log("modelData", this.modelData);
      })
    } else {
      console.log('published')

      this.twitterService.retrieveAllPublishedPost(false, true, false).subscribe(res => {
        //process Posts
        this.publishedPost = [];
        if (res.data && res.data.posts) {
          res.data.posts.forEach((postedPost: any) => {
            if(socialMedia.includes('twitter'))
            postedPost.postData.tweetData?.forEach((tweet: PostData) => {
              if (this.checkAccountLinked('twitter', tweet.userId)) {
                this.publishedPost.push({
                  userName: tweet.userName,
                  userId: tweet.userId,
                  pageId:'',
                  postStatus: tweet.postStatus,
                  postId: tweet.postId,
                  postDate: (!!tweet.postDate) ? new Date(tweet.postDate).toISOString() : '',
                  postData: postedPost.postData.postData,
                  socialName: 'twitter',
                  mediaUrl: tweet.mediaUrl,
                  type: 'published'
                })
              }
            });
            if(socialMedia.includes('linkedin'))
            postedPost.postData.linkedInData?.forEach((linkedIn: PostData) => {
              if (this.checkAccountLinked('linkedIn', linkedIn.userId)) {
                this.publishedPost.push({
                  userName: linkedIn.userName,
                  userId: linkedIn.userId,
                  postStatus: linkedIn.postStatus,
                  postId: linkedIn.postId,
                  pageId: linkedIn.pageId,
                  postDate: (!!linkedIn.postDate) ? new Date(linkedIn.postDate).toISOString() : '',
                  postData: postedPost.postData.postData,
                  socialName: 'linkedin',
                  mediaUrl: linkedIn.mediaUrl,
                  type: 'published'
                })
              }
            });
            if(socialMedia.includes('facebook'))
            postedPost.postData.fbpost?.forEach((post: PostData) => {
              if (this.checkAccountLinked('facebook', post.pageId)) {
                this.publishedPost.push({
                  userName: post.userName,
                  userId: post.userId,
                  pageId: post.pageId,
                  postStatus: post.postStatus,
                  postId: post.postId,
                  postDate: (!!post.postDate) ? new Date(post.postDate).toISOString() : '',
                  postData: postedPost.postData.postData,
                  socialName: 'facebook',
                  mediaUrl: post.mediaUrl,
                  type: 'published'
                })
              }
            });
          });
          // if (socialMedia.split("-")[0] == 'published') {
          //   this.dataTransferService.socialMedia = socialMedia.split("-")[1];
          //   this.dataTransferService.scheduleDate = day;
          //   //this.router.navigate([`socialmedia/publishing/publishedpost`]);

          // }
          // if (socialMedia.split("-")[0] == 'scheduled') {
          //   this.dataTransferService.socialMedia = socialMedia.split("-")[1];
          //   this.dataTransferService.scheduleDate = day;
          //   this.view = CalendarView.Day;
          //   console.log(this.viewDate)
          //   console.log(day)
          //   console.log(new Date(day))
          //   this.viewDate = new Date(day.date);
          //   this.viewName = 'Scheduled';
          // }
        }
        this.spinner.hide();
        this.dateFilter = new Date(day.date).toDateString();
        console.log(this.publishedPost);

        this.dateFilter = this.datePipe.transform(new Date(this.dateFilter), 'yyyy-MM-dd');
        this.modelData = this.publishedPost.filter((item: any) => {
          return new Date(item.postDate).toLocaleDateString() === new Date('' + this.dateFilter).toLocaleDateString();
        });
        console.log("modelData", this.modelData);
      })
    }
  }



  checkAccountLinked(socialType: string, userId = '') {
    if (socialType !== 'facebook') {
      const filterProf = this.dropdownList.filter((prof: any) => prof.userId == userId);
      if (filterProf && filterProf.length > 0) {
        return true;
      } else {
        const filterProf1 = this.dropdownList.filter((prof: any) => prof.pageId == userId);
        if (filterProf1 && filterProf1.length > 0) {
          return true;
        }
      }
    } else {
      const filterProf = this.dropdownList.filter((prof: any) => prof.pageId == userId);
      if (filterProf && filterProf.length > 0) {
        return true;
      }
    }
    return false;
  }

  copyPostText(postData: string) {
    this.dataTransferService.postData = postData;
    this.router.navigate([`socialmedia/publishing/newpost`]);
  }

  get getItems() {
    return this.dropdownList.reduce((acc: any, curr: any) => {
      acc[curr.socialId] = curr;
      return acc;
    }, {});
  }

  getSocialName(id: any) {
    let socialname = this.dropdownList.filter((prof: any) => prof.userId == id);
    // console.log(socialname);
    
    if (socialname && socialname.length > 0) {
      return socialname[0].socialName;
    } else {
      let socialname1 = this.dropdownList.filter((prof: any) => prof.pageId == id);
      if (socialname1) {
        return socialname1[0].socialName;
      }
    }
  }

  generateSocialIcons(postData: any) {
    const socialIcons: any[] = [];
    if (postData.fbpost && postData.fbpost.length > 0) {
      postData.fbpost.forEach((fbPost: any) => {
        const socialProfile = (this.dropdownList.filter((socialProf: any) => socialProf.pageId === fbPost.pageId));
        const mediaImages = this.generateMediaImage(fbPost.mediaUrl);
        if (socialProfile && socialProfile.length > 0) {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #4064ac;" class="fab fa-facebook fa-lg circle-icon side-spacing fbColor"> </i> @' + socialProfile[0].socialName + ' </span>',
            userId: fbPost.pageId,
            mediaImages: mediaImages
          });
        } else {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #4064ac;" class="fab fa-facebook fa-lg circle-icon side-spacing fbColor"></i> Facebook </span>',
            userId: fbPost.pageId,
            mediaImages: mediaImages
          });
        }

      })

    }
    if (postData.tweetData && postData.tweetData.length > 0) {
      postData.tweetData.forEach((fbPost: any) => {
        const socialProfile = (this.dropdownList.filter((socialProf: any) => socialProf.userId === fbPost.userId));
        const mediaImages = this.generateMediaImage(fbPost.mediaUrl);
        if (socialProfile && socialProfile.length > 0) {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #4c9bef;" class="fab fa-twitter fa-lg circle-icon side-spacing twrColor"> </i> @' + socialProfile[0].socialName + '</span>',
            userId: fbPost.userId,
            mediaImages
          });
        } else {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #4c9bef;" class="fab fa-twitter fa-lg circle-icon side-spacing twrColor"></i> Twitter </span>',
            userId: fbPost.userId,
            mediaImages
          });
        }
      })

    }

    if (postData.linkedInData && postData.linkedInData.length > 0) {
      postData.linkedInData.forEach((fbPost: any) => {
        const socialProfile = (this.dropdownList.filter((socialProf: any) => socialProf.userId === fbPost.userId));
        const mediaImages = this.generateMediaImage(fbPost.mediaUrl);
        if (socialProfile && socialProfile.length > 0) {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #0A66C2;" class="fab fa-linkedin fa-lg circle-icon side-spacing lkColor"> </i> @' + socialProfile[0].socialName + ' </span>',
            userId: fbPost.userId,
            mediaImages
          });
        } else {
          socialIcons.push({
            social: '<span class="socialImage"><i style="color: #0A66C2;" class="fab fa-linkedin fa-lg circle-icon side-spacing lkColor"></i> LinkedIn </span>',
            userId: fbPost.userId,
            mediaImages
          });
        }
      })
    }

    return socialIcons;
  }

  deletePost(postId: string) {
    this.spinner.show();
    this.twitterService.deletePost([postId], 'scheduled').subscribe(res => {
      this.toastr.info(res.status);
      this.retrieveScheduledEvents();
    });
  }

  viewPost(postId: string) {
    console.log('view published post data')
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView, viewName: string) {
    this.view = view;
    this.viewName = viewName;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.userSocialProfile = this.manageaccountService.userSocialProfile;
      this.dropdownList = this.socialProfileUtil.processSocialDropdown();
      this.spinner.hide();
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.userSocialProfile = res.data as SocialProfile;
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.dropdownList = this.socialProfileUtil.processSocialDropdown();
        this.spinner.hide();
      });
    }
  }

  createPost(date: any) {
    this.dataTransferService.scheduleDate = date;
    this.router.navigate([`socialmedia/publishing/newpost`]);
  }

  filterCalendar() {
    const eventsFilter = JSON.parse(JSON.stringify(this.eventsOriginal));
    const filterSocial: string[] = [];
    this.dropdownList.forEach(socialProfile => {
      if (socialProfile.checked) {
        filterSocial.push(socialProfile.pageId || socialProfile.userId);
      }
    })
    if (filterSocial.length > 0) {
      this.events = eventsFilter.filter((event: any) => {
        let filter = false;
        if (filterSocial.indexOf(event.meta.userId) != -1) {
          filter = true;
        }
        return filter;
      });
    } else {
      this.events = eventsFilter;
    }

    this.events.forEach(event => {
      event.start = startOfDay(new Date(event.start));
      if (event.end) {
        event.end = startOfDay(new Date(event.end));
      }
    })
    this.refresh.next();
  }


  filterEvents() {
    let eventsFilter = JSON.parse(JSON.stringify(this.eventsOriginal));
    if (!this.scheduledCheck) {
      eventsFilter = eventsFilter.filter((event: any) => {
        return (event.meta.postType !== 'scheduled');
      })
    }
    if (!this.publishedCheck) {
      eventsFilter = eventsFilter.filter((event: any) => {
        return (event.meta.postType !== 'published');
      })
    }


    this.events = eventsFilter;

    this.events.forEach(event => {
      event.start = startOfDay(new Date(event.start));
      if (event.end) {
        event.end = startOfDay(new Date(event.end));
      }
    })
    this.refresh.next();

  }

  retreiveDetailedPost(socialName: string, pubPostId: string, userId: string) {
    this.spinner.show();

    this.twitterService.retreivePostFromWeb(socialName, pubPostId, userId).subscribe((res: any) => {
      this.spinner.hide();
      const modalRef = this.modalService.open(SocialDataComponent, { backdropClass: 'in', windowClass: 'in', size: 'lg', centered: true });
      let socialProfile;
      if (socialName === 'twitter') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialName));
      } else if (socialName === 'facebook') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialName));
      } else if (socialName === 'linkedin') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialName));
      }
      modalRef.componentInstance.postData =
      {
        socialData: res.data,
        profileData: socialProfile
      }
    })
  }
  deletePostWeb(postId: string, social: string, userId: string, pageId: any) {
    this.spinner.show();
    this.twitterService.deletePostFromWeb({ postId, social, userId, pageId }).subscribe((res: any) => {
      //console.log(res);
      this.spinner.hide();
      // this.retrievePublishedData();
    })
  }

}

