import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostData } from 'src/app/model/postData';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { SocialDataComponent } from '../dialog/social-data/social-data.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { DatePipe } from '@angular/common';
import { SocialProfileUtil } from 'src/app/utility/socialprofile';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';



export interface MediaData {
  postDate: string;
  postData: string;
  publishedBy: string;
  View: string;
}

@Component({
  selector: 'app-publishedpost',
  templateUrl: './publishedpost.component.html',
  styleUrls: ['./publishedpost.component.scss']
})
export class PublishedpostComponent implements OnInit {

  displayedColumns: string[] = ['postDate', 'postData', 'PublishedBy', 'Icon'];
  mediaDatasource!: MatTableDataSource<MediaData>;


  @ViewChild(MatSort)
  sort!: MatSort;
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  public dropdownList = [] as any;
  userSocialProfile: SocialProfile | undefined;

  selectedFilterSocailProfile: SocialDropDown[] = [];
  public publishedPost!: any[];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: string | undefined;

  public max = new Date();

  public dateFilter: any | undefined;

  constructor(private twitterService: TwitterService,
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private dataTransferService: DataTransferService,
    private datePipe: DatePipe,
    private socialProfileUtil: SocialProfileUtil
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.retrievePublishedData();
  }


  retrievePublishedData() {
    this.twitterService.retrieveAllPublishedPost(false, true, false).subscribe(res => {
      //process Posts
      if (res.data && res.data.posts) {
        this.publishedPost = [];
        res.data.posts.forEach((postedPost: any) => {
          postedPost.postData.tweetData?.forEach((tweet: PostData) => {
            if (this.checkAccountLinked('twitter', tweet.userId)) {
              this.publishedPost.push({
                userName: tweet.userName,
                userId: tweet.userId,
                postStatus: tweet.postStatus,
                postId: tweet.postId,
                postDate: (!!tweet.postDate) ? new Date(tweet.postDate).toISOString() : '',
                postData: postedPost.postData.postData,
                socialName: 'twitter',
                mediaUrl: tweet.mediaUrl,
              })
            }
          });
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
              })
            }
          });
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
              })
            }
          });
        });
      }
      this.mediaDatasource = new MatTableDataSource(this.publishedPost);

      if (!!this.dataTransferService.socialMedia && this.dataTransferService.socialMedia != ''
        && !!this.dataTransferService.scheduleDate && this.dataTransferService.scheduleDate != '') {
        const dateReceived = (this.dataTransferService.scheduleDate as any).date;

        this.dataTransferService.scheduleDate = '';
        this.dateFilter = new Date(dateReceived).toDateString();
        this.dateFilter = this.datePipe.transform(new Date(dateReceived), 'yyyy-MM-dd');

        const filteredAccnts = this.dropdownList.filter((socialAccnts: any) => socialAccnts.socialType == this.dataTransferService.socialMedia);
        this.selectedFilterSocailProfile = filteredAccnts;
        this.dataTransferService.socialMedia = '';
        this.applyFilter();
        this.filterDate();

      }

      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
        this.mediaDatasource.paginator=this.paginator;
      });
      this.spinner.hide();
    })
  }


  duplicatePost(postData: string) {
    this.dataTransferService.postData = postData;
    this.router.navigate([`socialmedia/publishing/newpost`]);
  }


  applyFilter() {
    if (this.selectedFilterSocailProfile.length > 0) {
      const filterData = this.publishedPost.filter((item: any) => {
        if (item.pageId) {
          return (this.selectedFilterSocailProfile.some((e: any) => e.socialId.split('#')[e.socialId.split('#').length - 1] === item.pageId));
        } else if (item.userId) {
          return (this.selectedFilterSocailProfile.some((e: any) => e.socialId.split('#')[e.socialId.split('#').length - 1] === item.userId));
        } else {
          return false;
        }
      });
      this.mediaDatasource = new MatTableDataSource(filterData);
    } else {
      this.mediaDatasource = new MatTableDataSource(this.publishedPost);
    }
    setTimeout(() => {
      this.mediaDatasource.sort = this.sort;
      this.mediaDatasource.paginator=this.paginator;
    });
  }

  filterDate() {
    if (!!this.dateFilter) {
      const test = this.publishedPost.filter((item: any) => {
        return new Date(item.postDate).toLocaleDateString() === new Date('' + this.dateFilter).toLocaleDateString();
      });
      this.mediaDatasource = new MatTableDataSource(test);
    } else {
      this.mediaDatasource = new MatTableDataSource(this.publishedPost);
    }
    setTimeout(() => {
      this.mediaDatasource.sort = this.sort;
      this.mediaDatasource.paginator=this.paginator;
    });
  }

  resetDate() {
    if (this.dateFilter != '') {
      this.dateFilter = '';
      this.spinner.show();
      this.retrievePublishedData();
    }
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


  checkAccountLinked(socialType: string, userId = '') {
    if (socialType !== 'facebook') {
      const filterProf = this.dropdownList.filter((prof: any) => prof.userId == userId);
      if (filterProf && filterProf.length > 0) {
        return true;
      }
    } else {
      const filterProf = this.dropdownList.filter((prof: any) => prof.pageId == userId);
      if (filterProf && filterProf.length > 0) {
        return true;
      }
    }
    return false;
  }

  processSocialDropdown() {
    this.dropdownList = [];
    this.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          console.log(fbpage.image)
          this.dropdownList.push({ socialType: 'facebook', socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: fbpage.name, socialImage: fbpage.userProfileImage, pageId: fbpage.id, image: fbpage.image });
        });
      } else if (scMedia.name == 'linkedin') {
        if (scMedia.linkedinProfile) {
          this.dropdownList.push({ socialType: 'linkedin', socialId: `${scMedia.name}-${scMedia.linkedinProfile.userId}`, userId: scMedia.linkedinProfile.userId, socialName: scMedia.linkedinProfile.userName, socialImage: scMedia.linkedinProfile.userImage });
        }
        if (scMedia.linkedinPages) {
          scMedia.linkedinPages?.forEach(lkPage => {
            this.dropdownList.push({ socialType: 'linkedin', socialId: `${scMedia.name}-${lkPage.userId}`, userId: lkPage.userId, socialName: lkPage.userName, socialImage: lkPage.userImage });
          });
        }
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

  retreiveDetailedPost(socialName: string, pubPostId: string, userId: string ) {
    this.spinner.show();
    
    this.twitterService.retreivePostFromWeb(socialName, pubPostId, userId).subscribe((res: any) => {
      this.spinner.hide();
      const modalRef = this.modalService.open(SocialDataComponent, { backdropClass: 'in', windowClass: 'in', size: 'lg', centered: true });
      let socialProfile;
      if (socialName === 'twitter') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialName));
      } else if (socialName === 'facebook') {
        socialProfile = this.userSocialProfile?.socialMedia?.filter((profile: any) => (profile.userId == res.data.postInfo.userId && profile.name == socialName));
      }else if (socialName === 'linkedin') {
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
      this.retrievePublishedData();
    })
  }

}
