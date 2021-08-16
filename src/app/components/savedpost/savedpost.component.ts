import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PostData } from 'src/app/model/postData';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';


export interface MediaData {
  postDate: string;
  postData: string;
  id: string;
  createdTime: string;
  updatedTime: string;
  mediaData: Array<any>;
  socialData: Array<any>;
}

@Component({
  selector: 'app-savedpost',
  templateUrl: './savedpost.component.html',
  styleUrls: ['./savedpost.component.scss']
})
export class SavedpostComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'createdTime', 'postData', 'createdFor', 'options'];
  mediaDatasource!: MatTableDataSource<MediaData>;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public delete: boolean = false;
  public selectAllModel: boolean = false;
  public dropdownList = [] as any;
  userSocialProfile: SocialProfile | undefined;

  selectedFilterSocailProfile: SocialDropDown[] = [];
  public publishedPost!: any[];

  public max = new Date();

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: any;

  constructor(private twitterService: TwitterService,
    public profileService: ProfileService,
    private router: Router,
    private manageaccountService: ManageaccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    //this.spinner.show();
    this.retrieveSocialMediProfile();
    this.retrieveDraftPost();
  }

  enable() {
    const count = this.publishedPost?.filter((file: any) => !!file.checked);
    if (count) {
      if (count.length >= 1) {
        this.delete = true;
      }
      if (count.length == 0) {
        this.delete = false;
      }
    }

    if (count.length === this.publishedPost?.length) {
      this.selectAllModel = true;
    } else {
      this.selectAllModel = false;
    }

  }

  selectAll() {
    this.publishedPost?.forEach(media => {
      if (this.selectAllModel) {
        media.checked = true;
        this.delete = true
      } else {
        media.checked = false;
        this.delete = false
      }
    });
  }

  /*deletesSelected() {
    const deleteKey = new Array<string>();
    this.publishedPost?.forEach((mediaFile: any) => {
      if (mediaFile.checked) {
        deleteKey.push(mediaFile.Key);
      }
    });
    this.removeMedia(deleteKey);
  }*/

  filterImageExt(event: any) {
    console.log(event)
  }



  retrieveDraftPost() {
    this.spinner.show();
    this.twitterService.retrieveAllSocialPost(true, false, false).subscribe(res => {
      //process drafts
      this.publishedPost = [];
      if (res.data && res.data.drafts) {
        res.data.drafts.forEach((postedPost: any) => {

          const draftData = {
            id: postedPost.draftPost._id,
            createdTime: (new Date(postedPost.draftPost.createdTime).toLocaleDateString() + '' + new Date(postedPost.draftPost.createdTime).toLocaleTimeString()),
            updatedTime: (new Date(postedPost.draftPost.updatedTime).toLocaleDateString() + '' + new Date(postedPost.draftPost.updatedTime).toLocaleTimeString()),
            postData: postedPost.draftPost.postData,
            mediaData: postedPost.draftPost.mediaData,
            socialData: new Array<any>()
          };

          postedPost.draftPost.tweetData.forEach((tweet: PostData) => {
            draftData.socialData.push({
              socialName: 'twitter',
              userName: tweet.userName,
              userId: tweet.userId
            })
          });
          postedPost.draftPost.linkedInData?.forEach((linkedIn: PostData) => {
            draftData.socialData.push({
              socialName: 'linkedin',
              userName: linkedIn.userName,
              userId: linkedIn.userId
            })
          });
          postedPost.draftPost.fbpost.forEach((post: PostData) => {
            draftData.socialData.push({
              socialName: 'facebook',
              userName: post.userName,
              pageId: post.pageId,
              userId: post.userId
            })
          });
          this.publishedPost.push(draftData)
        });
      }

      this.mediaDatasource = new MatTableDataSource(this.publishedPost);
      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
        this.mediaDatasource.paginator=this.paginator;
      });

      this.spinner.hide();
    })
  }

  applyFilter() {
    if (this.selectedFilterSocailProfile.length > 0) {
      const test = this.publishedPost.filter((item: any) => {
        return item.socialData.some((socialData: any) => {
          if (socialData.pageId) {
            return (this.selectedFilterSocailProfile.some((e: any) => e.socialId.split('-')[e.socialId.split('-').length - 1] === socialData.pageId));
          } else if (socialData.userId) {
            return (this.selectedFilterSocailProfile.some((e: any) => e.socialId.split('-')[e.socialId.split('-').length - 1] === socialData.userId));
          } else {
            return false;
          }
        });

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
        this.dropdownList.push({ socialId: `${scMedia.name}-${scMedia.userId}`, socialName: scMedia.screenName, socialImage: scMedia.userProfileImage, userId: scMedia.userId });
      }
    })
  }

  get getItems() {
    return this.dropdownList.reduce((acc: any, curr: any) => {
      acc[curr.socialId] = curr;
      return acc;
    }, {});
  }

  deleteMultiples() {
    this.spinner.show();
    const checkedPost = this.publishedPost.filter((drafts: any) => !!drafts.checked);
    const draftArr: string[]= [];
    if(checkedPost) {
      checkedPost.forEach((checkedDrafts: any) => {
        draftArr.push(checkedDrafts.id);
      });
      this.twitterService.deletePost(draftArr, 'draft').subscribe(res => {
        this.retrieveDraftPost();
        this.delete = false;
        this.toastr.info(res.status);
      });
    }
  }

  deletePost(postId: string) {
    this.spinner.show();
    this.twitterService.deletePost([postId], 'draft').subscribe(res => {
      this.retrieveDraftPost();
      this.toastr.info(res.status);
    });
  }



  navigatePost(id: string) {
    this.router.navigate([`socialmedia/publishing/newpost/${id}/draft`]);
  }


}
