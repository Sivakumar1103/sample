import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NgxFileDropEntryAikyne } from 'src/app/model/FileUpload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentlibraryComponent } from '../../dialog/contentlibrary/contentlibrary.component';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { LibraryComponent } from '../../library/library.component';
import { LinkedinService } from 'src/app/services/socialmedia/linkedin.service';
import { base64ToBlob, blobToFile } from '../../common/utility';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { BitlyAKService } from 'src/app/services/socialmedia/bitly.ak.service';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FeedService } from 'src/app/services/feed.service';
import { faSmileBeam, faDesktop, faImage } from '@fortawesome/free-solid-svg-icons';
import { LinkedInPageComponent } from '../../dialog/linked-in-page/linked-in-page.component';
import { SocialProfileUtil } from 'src/app/utility/socialprofile';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  bitlyUrlEdit: boolean = true;
  preBitlyUrl: any = "";
  showBtn: any = "postNow";
  showBtnMenu = false
  faSmileBeam = faSmileBeam;
  faDesktop = faDesktop;
  faImage = faImage;
  selected_icon: any = "";

  public now: Date = new Date();
  scheduleTime = '';
  userId: any;
  linkedinUserId: any;
  linkToggle: boolean = false;
  public min = new Date();

  public showFacebookPreview: boolean = false;
  public showTwitterPreview: boolean = false;
  public showLinkedinPreview: boolean = false;
  linkPreviewList: Array<any> = [];
  enableLink: boolean = false;
  userSocialProfile: SocialProfile | undefined;
  facebookProfile: any;
  facebookLength = 2000;
  postingData = '';
  tweetLength = 280;
  isEmojiPickerVisible = false;
  displayTabName = '';
  storeURLS: Array<any> = [];
  postId = '';
  postStatus = '';

  selectedFile!: File;
  public showdrag: boolean = false;
  public showdragbox: boolean = true;

  public dropdownList: any[] = [];

  selectedSocailProfile: any[] = [];
  public windowRef: Window | null | undefined;

  Today = new Date();

  public files: NgxFileDropEntryAikyne[] = [];
  public twitterMediaId = [];
  public mediaData: Array<any> = [];
  rImageType = /data:(image\/.+);base64,/;

  dropdownSettings: IDropdownSettings =
    {
      singleSelection: false,
      idField: 'socialId',
      textField: 'socialName',
      enableCheckAll: false,
      itemsShowLimit: 5,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText: 'No Social Profiles connected'
    };

  constructor(private router: Router,
    private twitterService: TwitterService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private manageaccountService: ManageaccountService,
    private linkedinService: LinkedinService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private contentlibraryService: ContentLibraryService,
    private bitlyService: BitlyAKService,
    private socialProfileUtil: SocialProfileUtil,
    private dataTransferService: DataTransferService) {

  }

  ngOnInit(): void {
    this.initCanva();
    this.spinner.show();

    this.retrieveSocialMediProfile();

    this.userId = this.route.snapshot.paramMap.get("userId") || '';
    this.postId = this.route.snapshot.paramMap.get("postId") || '';
    this.postStatus = this.route.snapshot.paramMap.get("postStatus") || '';

    // Code for Twitter sign up token redirection
    if (this.router.url.indexOf('socialManage/twitterSignUp') != -1) {
      const urlParams = new URLSearchParams(this.router.url);
      const retToken = urlParams.get('retToken');
      const oauth_token = urlParams.get('oauth_token');
      const oauth_verifier = urlParams.get('oauth_verifier');
      this.twitterService.generateAcessToken({ 'retToken': retToken, 'oauth_token': oauth_token, 'oauth_verifier': oauth_verifier }).subscribe(res => {

        this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
          this.userSocialProfile = res.data as SocialProfile;
          this.manageaccountService.userSocialProfile = res.data as SocialProfile;
          this.toastr.success('Account added successfully');
          this.router.navigate(['/'])
        });


      });
    }

    // Code for LinkenIn sign up token redirection
    if (this.router.url.indexOf('socialManage/linkedInSignUp') != -1) {
      //      console.log(this.router.url)
      //      const urlParamsNew = new HttpParams({fromString: this.router.url.split('?')[this.router.url.split('?').length-1]});
      const urlParams = new URLSearchParams(this.router.url.split('?')[this.router.url.split('?').length - 1]);
      const code = urlParams.get('code');
      this.spinner.show();
      this.linkedinService.retrieveLinkedProfile({ 'authCode': code }).subscribe(res => {

        console.log("res.pro.............................file", res.profile)
        this.spinner.hide();
        const modalRef = this.modalService.open(LinkedInPageComponent, { backdropClass: 'in', windowClass: 'in' });
        modalRef.componentInstance.messageData = {
          linkedinProfile: res.profile,
          linkedinPages: res.orgArray
        };

        modalRef.result
          .then((selectedPages) => {
            if (selectedPages) {
              this.spinner.show();
              this.linkedinService.saveUserToken({ 'authCode': code, selectedPages, 'userId': res.userId }).subscribe(res => {
                console.log(res);
                this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
                  this.userSocialProfile = res.data as SocialProfile;
                  this.manageaccountService.userSocialProfile = res.data as SocialProfile;
                  this.dropdownList = this.socialProfileUtil.processSocialDropdown();
                  this.spinner.hide();
                });
              });
            } else {
              console.log('cancel the register');
              this.manageaccountService.removeSocialConnection('linkedin', res.userId, '').subscribe(res => {
                this.spinner.hide();
                this.retrieveSocialMediProfile();
              });
            }

          })
        //this.router.navigate(['/'])
      });
    }

    if (this.postId != '' && this.postStatus != '') {
      this.twitterService.retrieveSavedPost(this.postId, this.postStatus).subscribe(res => {

        if (res.data && res.data.length > 0) {
          const draftPost = res.data[0].draftPost ? res.data[0].draftPost : res.data[0].scheduledPost;
          console.log(draftPost);
          this.postingData = draftPost.postData;
          const draftProfiles: SocialDropDown[] = [];
          draftPost.tweetData.forEach((twtProfile: any) => {
            if (this.dropdownList.some(e => e.socialId === `twitter-${twtProfile.userId}`)) {
              const currentProfile: any = this.dropdownList.find(obj => {
                return obj.socialId === `twitter-${twtProfile.userId}`
              });
              draftProfiles.push({ socialId: `twitter-${twtProfile.userId}`, socialName: currentProfile.socialName });
            }
          });

          draftPost.fbpost.forEach((fbProfile: any) => {
            if (this.dropdownList.some(e => e.socialId === `facebook-${fbProfile.userId}-${fbProfile.pageId}`)) {
              const currentProfile: any = this.dropdownList.find(obj => {
                return obj.socialId === `facebook-${fbProfile.userId}-${fbProfile.pageId}`
              });
              draftProfiles.push({ socialId: `facebook-${fbProfile.userId}-${fbProfile.pageId}`, socialName: currentProfile.socialName });
            }

          });
          this.selectedSocailProfile = draftProfiles;
          this.scheduleTime = draftPost.scheduleTime;
          this.mediaData = draftPost.mediaData;
          if (this.mediaData && this.mediaData.length > 0) {
            this.showdrag = true;
          }
          this.showPreview();
        }
        this.spinner.hide();
      })
    } else {
      this.spinner.hide();
    }

    if (this.dataTransferService.mediaList && this.dataTransferService.mediaList.length > 0) {
      this.mediaData = this.dataTransferService.mediaList;
      this.dataTransferService.mediaList = [];
      this.showdrag = true;
      this.spinner.hide();
    }

    if (this.dataTransferService.postData && this.dataTransferService.postData != '') {
      this.postingData = this.dataTransferService.postData;
      this.dataTransferService.postData = '';
    }

    if (this.dataTransferService.scheduleDate && this.dataTransferService.scheduleDate != '') {
      this.scheduleTime = this.dataTransferService.scheduleDate;
      this.dataTransferService.scheduleDate = '';
    }
    this.bitlyService.shareDataSubject.subscribe((value: boolean) => {

      this.enableLink = value;
    })
    this.bitlyService.sharedDataUrls.pipe(debounceTime(500)).subscribe((value: string) => {
      console.log("VALUE====>", value);
      if (value !== "" && this.linkPreviewList.length < 1) {
        this.bitlyService.generateLinkPreview(value).pipe(distinctUntilChanged(), debounceTime(500)).subscribe((response: any) => {
          const filterdata = this.linkPreviewList.filter((value) => value.title === response.message.title)
          if (filterdata.length === 0 && this.linkPreviewList.length < 1) {
            response.message['link'] = value;
            this.linkPreviewList.push(response.message);
          }
        })
      } else if (value !== "") {
        this.storeURLS.push(value);
      } else if (value === "") {
        this.linkPreviewList = [];
      }
    })
    setInterval(() => {
      this.now = new Date();
    }, 1);

  }

  reset() {
    this.scheduleTime = '';
  }
  openLibraryModal() {
    const modalRef = this.modalService.open(LibraryComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
  }

  linkOpen() {
    let shortURL = 'Rebrandly';
    if (this.profileService.userData && this.profileService.userData.integration && this.profileService.userData.integration.surl) {
      shortURL = this.profileService.userData.integration.surl.name || 'Bitly'
    }
    const postingData = this.postingData;
    if (postingData) {
      const urlmap = new Map(this.bitlyService.storageURLS());
      let urlkeys: Array<any> = Array.from(urlmap.keys());
      let urlvalues = Array.from(urlmap.values());

      this.bitlyService.replaceAsync(postingData.replace(/(<([^>]+)>)/g, ""), shortURL).then((value: any) => {
        this.postingData = value;
        this.enableLink = false;
        if (this.linkToggle) {
          urlvalues.forEach((value: any, index: number) => {
            this.postingData = this.postingData.replace(value, urlkeys[index].toString());
          });

        }
        this.linkToggle = !this.linkToggle;
        this.postingData = this.bitlyService.replaceURLonClick(this.postingData) || '';
      });
    }
  }

  initCanva() {
    if (!(window as any).canvaApp) {
      (window as any).Canva.DesignButton.initialize({
        apiKey: 'BBVfWs7meS4eJB-BVGcRoGAZ',
      }).then((api: any) => {
        console.log(api);
        (window as any).canvaApp = api;
        // Use "api" object or save for later
      });
    }
  }

  createCanva(type: string, width: Number, height: Number) {
    if (!!(window as any).canvaApp) {

      (window as any).canvaApp.createDesign({
        design: {
          type
        },
        onDesignOpen: (designId: any) => {
          console.log(designId);
          // Triggered when editor finishes loading and opens a new design.
          // You can save designId for future use.
        },
        onDesignPublish: (exportUrl: any, designId: any) => {
          if (this.mediaData.length > 4) {
            this.toastr.error("Maximum of only 4 Media files can be uploaded");
            return;
          }

          const fileName = exportUrl.designTitle.replaceAll(' ', '');
          this.spinner.show();
          this.contentlibraryService.uploadImages('').subscribe((res: any) => {
            var request = new XMLHttpRequest();
            request.open('GET', exportUrl.exportUrl, true);
            request.responseType = 'blob';
            request.onload = () => {
              var reader = new FileReader();
              reader.readAsDataURL(request.response);
              reader.onload = (e: any) => {
                const blob = base64ToBlob(e.target.result);
                this.contentlibraryService.uploadActualImage(res.data, blobToFile(blob, 'testFile.jpeg')).subscribe(uploadres => {
                  if (uploadres && uploadres.message && uploadres.message == '100') {
                    this.mediaData.push(
                      {
                        'fileDisplayName': fileName,
                        'progressStatus': 'Done',
                        'fileKey': res.fileName,
                        'fileUrl': res.data.split('?')[0]
                      });
                    this.spinner.hide();
                    this.showdrag = true;
                    this.toastr.success('Template imported successfully');
                  }

                });
              };
            };
            request.send();
          });
        },
        onDesignClose: () => {
          console.log('canva designer is closed');
          // Triggered when editor is closed.
        },
      });
    }

  }


  showPreview() {
    console.log(this.selectedSocailProfile);
    this.displayTabName = '';
    this.showFacebookPreview = (this.selectedSocailProfile.length > 0) ? this.selectedSocailProfile.some(function (el) { return el.socialId?.startsWith('facebook') }) : false;
    this.showTwitterPreview = (this.selectedSocailProfile.length > 0) ? this.selectedSocailProfile.some(function (el) { return el.socialId?.startsWith('twitter') }) : false;
    this.showLinkedinPreview = (this.selectedSocailProfile.length > 0) ? this.selectedSocailProfile.some(function (el) { return el.socialId?.startsWith('linkedin') }) : false;

    if (this.showFacebookPreview) {
      this.displayTabName = 'facebook';
    } else if (!this.showFacebookPreview && this.showTwitterPreview) {
      this.displayTabName = 'twitter';
    } else if (!this.showFacebookPreview && !this.showTwitterPreview && this.showLinkedinPreview) {
      this.displayTabName = 'linkedin';
    }
  }

  addEmoji(event: any) {
    this.postingData = `${this.postingData}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile && this.manageaccountService.userSocialProfile.email) {
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
          this.dropdownList.push({ socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: `${fbpage.name}`, socialImage: fbpage.userProfileImage, pageId: fbpage.id , tagIcon:'facebook' });
        });
      } else if (scMedia.name == 'twitter') {
        this.dropdownList.push({ socialId: `twitter-${scMedia.userId}`, socialName: `${scMedia.screenName}`, socialImage: scMedia.userProfileImage, tagIcon:'twitter'  });
      }
      // else if (scMedia.name == 'linkedin') {
      // this.dropdownList.push({ socialId: `linkedin-${scMedia.userId}`, socialName: `${scMedia.screenName}`, socialImage: scMedia.userProfileImage });
      else if (scMedia.name == 'linkedin') {
        if (scMedia.linkedinProfile) {
          this.linkedinUserId = scMedia.userId;
          this.dropdownList.push({ socialId: `linkedin-${scMedia.userId}`, socialName: `${scMedia.linkedinProfile.userName}`,userId:scMedia.userId, socialImage: scMedia.linkedinProfile.userImage, tagIcon:'linkedin'  });
        }
        if (scMedia.linkedinPages) {
          scMedia.linkedinPages?.forEach(lnPage => {
            this.dropdownList.push({ socialId: `linkedin-${lnPage.pageId}`, pageId: lnPage.pageId, socialName: lnPage.pageName,userId:scMedia.userId, socialImage: lnPage.pageImage?lnPage.pageImage:'../../../../assets/img/Linkedin.svg', tagIcon:'building'   })

            // this.dropdownList.push({ socialId: `linkedin-${scMedia.pageId}`, socialName: `${lnPage.pageName || lnPage.userName}`, socialImage: scMedia.lnPage.pageImage || lnPage.userImage })
          })
        }
        console.log("this.dropdownList",this.dropdownList);
        
      } else {
        this.dropdownList.push({ socialType: scMedia.name, userId: scMedia.userId, socialName: scMedia.screenName, socialImage: scMedia.userProfileImage });
      }
    })
  }

  // processSocialDropdowns() {
  //   this.dropdownList = [];
  //   this.userSocialProfile?.socialMedia?.forEach(scMedia => {
  //     if (scMedia.name == 'facebook') {
  //       scMedia.fbpages?.forEach(fbpage => {
  //         this.dropdownList.push({ socialType: 'facebook', userId: scMedia.userId, pageId: fbpage.id, socialName: fbpage.name, socialImage: fbpage.userProfileImage });
  //       });
  //     } else if (scMedia.name == 'linkedin') {
  //       if (scMedia.linkedinProfile) {
  //         this.dropdownList.push({ socialType: scMedia.name, userId: scMedia.userId, socialName: scMedia.linkedinProfile.userName, socialImage: scMedia.linkedinProfile.userImage });
  //       }
  //       if (scMedia.linkedinPages) {
  //         scMedia.linkedinPages?.forEach(lnPage => {
  //           this.dropdownList.push({ socialType: scMedia.name, pageId: lnPage.pageId || lnPage.userId, socialImage: lnPage.pageImage || lnPage.userImage })
  //         })
  //       }
  //     } else {
  //       this.dropdownList.push({ socialType: scMedia.name, userId: scMedia.userId, socialName: scMedia.screenName, socialImage: scMedia.userProfileImage });
  //     }
  //   })
  //   this.spinner.hide();
  // }

  get getItems() {
    return this.dropdownList.reduce((acc: any, curr: any) => {
      acc[curr.socialId] = curr;
      return acc;
    }, {});
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0]
  }

  public dropped(files: any[]) {
    if (this.mediaData.length > 4 || (this.files.concat(files).length > 4)) {
      this.toastr.error("Maximum of only 4 Media files can be uploaded");
      return;
    }

    this.files = this.files.concat(files);
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (this.isFileSizeAllowed(file.size)) {
            // Here you can access the real file
            this.mediaData.push({ 'fileDisplayName': droppedFile.relativePath, 'progressStatus': '0' })
            this.contentlibraryService.uploadImages('', file.name.split('.').pop()).subscribe((res: any) => {
              this.contentlibraryService.uploadActualImage(res.data, file).subscribe(uploadres => {
                (droppedFile as any)['progressPercentage'] = (uploadres && uploadres.message) ? uploadres.message : 0;

                if (uploadres && uploadres.message && uploadres.message == '100') {
                  (droppedFile as any)['progressStatus'] = 'Done';
                  (droppedFile as any)['fileKey'] = res.fileName;

                  var foundIndex = this.mediaData.findIndex(fl => fl.fileDisplayName == droppedFile.relativePath);
                  const updatedFile = this.mediaData[foundIndex];
                  updatedFile['progressStatus'] = 'Done';
                  updatedFile['fileKey'] = res.fileName;
                  updatedFile['fileUrl'] = res.data.split('?')[0];
                  this.mediaData[foundIndex] = updatedFile;
                }
              });
            });

          }
          else {
            this.toastr.error("Please select a file less than 5MB.");
          }


        });

      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  isFileSizeAllowed(size: number) {
    let isFileSizeAllowed = false;
    if (size < 5000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;

  }

  removeMedia(fileKey: string) {
    if (fileKey.indexOf('/clib/') == -1) {
      this.contentlibraryService.removeMedia([fileKey]).subscribe(res => {
        console.log(res);
        this.files = this.files.filter((file: any) => file.fileKey != fileKey);
        this.mediaData = this.mediaData.filter((file: any) => file.fileKey != fileKey);
      })
    } else {
      this.files = this.files.filter((file: any) => file.fileKey != fileKey);
      this.mediaData = this.mediaData.filter((file: any) => file.fileKey != fileKey);
    }
  }

  postToSocialProfile() {

    console.log('Posting Immediately:::::::');
    const twitterProfile: Array<any> = [];
    const fbProfile: Array<any> = [];
    const linkedInProfile: Array<any> = [];
    let id = "";


    this.selectedSocailProfile.forEach(socialProfile => {
      this.spinner.show();
      if (socialProfile.socialId?.startsWith('facebook')) {
        fbProfile.push({ name: 'facebook', userId: socialProfile.socialId.split('-')[1], pageId: socialProfile.socialId.split('-')[2] });
      } else if (socialProfile.socialId?.startsWith('twitter')) {
        twitterProfile.push({ name: 'twitter', userId: socialProfile.socialId.split('-')[1] });
      } else if (socialProfile.socialId?.startsWith('linkedin')) {
        
        console.log("socialProfile.socialId", socialProfile.socialId);
        if (socialProfile.socialId.includes(':')) {
          // id = socialProfile.socialId.split('linkedin-')[1]
          linkedInProfile.push({ name: 'linkedin', pageId: socialProfile.socialId.split('linkedin-')[1],userId:this.linkedinUserId });
        } else {
          //linkedInProfile.push({ name: 'linkedin', pageId: socialProfile.socialId.split('-')[1] });
          linkedInProfile.push({ name: 'linkedin', userId: this.linkedinUserId });
        }
      }
    })

    const postData = {
      postData: this.postingData.replace(/<[^>]*>/g, ''),
      scheduleTime: '',
      postStatus: 'Posted',
      tweetData: twitterProfile,
      linkedInData: linkedInProfile,
      fbpost: fbProfile,
      mediaData: this.mediaData,
    };

    if (this.postingData == '') {
      this.toastr.error("Text field is empty")
      return;
    } else if (this.selectedSocailProfile.length === 0) {
      this.toastr.error("Select at least one social media profile")
      return;
    }

    const mediaArray = [];
    if (this.mediaData && this.mediaData.length > 0 && twitterProfile.length > 0) {
      mediaArray.push(this.contentlibraryService.uploadTwitterMedia({ fileNames: this.mediaData, twitterProfile }));
    }
    if (this.mediaData && this.mediaData.length > 0 && linkedInProfile.length > 0) {
      linkedInProfile.forEach(lkProf => {
        mediaArray.push(this.linkedinService.getUploadUrl(lkProf.userId, lkProf.pageId, this.mediaData));
      })
    }

    if (mediaArray.length > 0) {
      forkJoin(mediaArray).subscribe((respData: any) => {
        let respArrCnt = 0;
        if (twitterProfile.length > 0) {
          console.log(respData[respArrCnt]);

          twitterProfile.forEach(profile => {
            console.log("respData[respArrCnt]...........", respData[respArrCnt]);
            console.log("profile...........", profile);
            profile['mediaUrl'] = respData[respArrCnt].mediaIdArr.flatMap((fileUrl: any) => {
              if (fileUrl.userId == profile.userId) {
                return fileUrl.mediaIds;
              } else {
                return [];
              }
            })
            //profile['mediaUrl'] = respData[respArrCnt].mediaId;
          })
          console.log("twitterProfile", twitterProfile);
          respArrCnt = respArrCnt + 1;
        }

        if (linkedInProfile.length > 0) {
          linkedInProfile.forEach(lkProf => {
            lkProf['mediaUrl'] = respData[respArrCnt].uploadedAssets;
            respArrCnt = respArrCnt + 1;
          })
        }

        console.log("postData", postData);


        this.twitterService.postSocial(postData).subscribe(res => {
          this.spinner.hide();
          console.log(res)
          this.toastr.success(res.status);
          this.router.navigate([`socialmedia/publishing/publishedpost`]);
        });


      });
    } else {
      console.log("postData jgvfygvgv......", postData);
      this.twitterService.postSocial(postData).subscribe(res => {
        this.spinner.hide();
        console.log(res)
        this.toastr.success(res.status);
        this.router.navigate([`socialmedia/publishing/publishedpost`]);
      });
    }
  }

  openContentLibraryDialog() {
    const modalRef = this.modalService.open(ContentlibraryComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
    modalRef.result.then((selectedImageList: any) => {
      if (!!selectedImageList) {
        if ((this.mediaData.length + selectedImageList.length) <= 4) {
          selectedImageList.forEach((selectedImage: any) => {
            this.mediaData.push(
              {
                'fileDisplayName': selectedImage.Key,
                'progressStatus': 'Done',
                'fileKey': selectedImage.Key,
                //'fileUrl': `https://dhuhkrmpnuqm.cloudfront.net/${selectedImage.Key}`,
                'fileUrl': `https://aikyne-mediafiles.s3.ap-south-1.amazonaws.com/${selectedImage.Key}`,
              });
          })
        }
        else {
          this.toastr.error("Maximum of only 4 Media files can be uploaded")
        }
        this.showdrag = true;
      }

      this.spinner.hide();
    })
      .catch(() => {
        // NOP
      });
  }

  saveAsDraft() {
    console.log('Saving the Post as Draft:::::::');
    const twitterProfile: Array<any> = [];
    const fbProfile: Array<any> = [];
    const linkedInProfile: Array<any> = [];

    this.selectedSocailProfile.forEach(socialProfile => {
      this.spinner.show();
      if (socialProfile.socialId?.startsWith('facebook')) {
        fbProfile.push({
          userId: socialProfile.socialId.split('-')[1],
          pageId: socialProfile.socialId.split('-')[2],
          userName: socialProfile.socialName
        });
      } else if (socialProfile.socialId?.startsWith('twitter')) {
        twitterProfile.push({
          userId: socialProfile.socialId.split('-')[1],
          userName: socialProfile.socialName
        });
      } else if (socialProfile.socialId?.startsWith('linkedin')) {
        linkedInProfile.push({
          userId: socialProfile.socialId.split('-')[1],
          userName: socialProfile.socialName
        });
      }

    })

    let draftScheduleTime = '';
    if (this.scheduleTime != '') {
      var d = new Date(this.scheduleTime).setSeconds(0);
      d = new Date(d).setMilliseconds(0);
      draftScheduleTime = new Date(d).toISOString();
    }


    const draftPostData = {
      draftPostId: this.postId,
      postData: this.postingData,
      scheduleTime: draftScheduleTime,
      postStatus: 'Draft',
      tweetData: twitterProfile,
      linkedInData: linkedInProfile,
      fbpost: fbProfile,
      mediaData: this.mediaData,
      previousStatus: this.postStatus
    };

    this.twitterService.saveDraftPost(draftPostData).subscribe(res => {
      this.spinner.hide();
      this.toastr.success(res.status)
      console.log(res)
      this.router.navigate([`socialmedia/publishing/draft`]);
    });

  }

  schedulePost() {
    if (this.selectedSocailProfile.length == 0) {
      this.toastr.error("Select atleast one social profile")
    }
    if (this.selectedSocailProfile.length > 0) {
      console.log('Scheduling the Post as Draft:::::::');
      const twitterProfile: Array<any> = [];
      const fbProfile: Array<any> = [];
      const linkedInProfile: Array<any> = [];

      this.selectedSocailProfile.forEach(socialProfile => {
        this.spinner.show();
        if (socialProfile.socialId?.startsWith('facebook')) {
          fbProfile.push({
            userId: socialProfile.socialId.split('-')[1],
            pageId: socialProfile.socialId.split('-')[2],
            userName: socialProfile.socialName
          });
        } else if (socialProfile.socialId?.startsWith('twitter')) {
          twitterProfile.push({
            userId: socialProfile.socialId.split('-')[1],
            userName: socialProfile.socialName
          });
        } else if (socialProfile.socialId?.startsWith('linkedin')) {
          // linkedInProfile.push({
          //   userId: socialProfile.socialId.split('linkedin-')[1],
          //   userName: socialProfile.socialName
          // });
          if (socialProfile.socialId.includes(':')) {
            // id = socialProfile.socialId.split('linkedin-')[1]
            linkedInProfile.push({ userName: socialProfile.socialName, pageId: socialProfile.socialId.split('linkedin-')[1],userId:this.linkedinUserId });
          } else {
            //linkedInProfile.push({ name: 'linkedin', pageId: socialProfile.socialId.split('-')[1] });
            linkedInProfile.push({ userName:socialProfile.socialName, userId: this.linkedinUserId });
          }
        }
      })

      var d = new Date(this.scheduleTime).setSeconds(0);
      d = new Date(d).setMilliseconds(0);

      const schedulePost = {
        scheduledPostId: this.postId,
        postData: this.postingData,
        scheduleTime: new Date(d).toISOString(),
        postStatus: 'Scheduled',
        tweetData: twitterProfile,
        linkedInData: linkedInProfile,
        fbpost: fbProfile,
        mediaData: this.mediaData,
        previousStatus: this.postStatus
      };


      const mediaArray = [];
      if (this.mediaData && this.mediaData.length > 0 && twitterProfile.length > 0) {
        mediaArray.push(this.contentlibraryService.uploadTwitterMedia({ fileNames: this.mediaData, twitterProfile }));
      }
      if (this.mediaData && this.mediaData.length > 0 && linkedInProfile.length > 0) {
        linkedInProfile.forEach(lkProf => {
          mediaArray.push(this.linkedinService.getUploadUrl(lkProf.userId, lkProf.pageId, this.mediaData));
        })
      }





      if (mediaArray.length > 0) {
        forkJoin(mediaArray).subscribe((respData: any) => {
          let respArrCnt = 0;
          if (twitterProfile.length > 0) {
            twitterProfile.forEach(profile => {
              profile['mediaUrl'] = respData[respArrCnt].mediaIdArr.flatMap((fileUrl: any) => {
                if (fileUrl.userId == profile.userId) {
                  return fileUrl.mediaIds;
                } else {
                  return [];
                }
              })
              //profile['mediaUrl'] = respData[respArrCnt].mediaId;
            })
            respArrCnt = respArrCnt + 1;
          }

          if (linkedInProfile.length > 0) {
            linkedInProfile.forEach(lkProf => {
              lkProf['mediaUrl'] = respData[respArrCnt].uploadedAssets;
              respArrCnt = respArrCnt + 1;
            })
          }

          this.twitterService.schedulePost(schedulePost).subscribe(res => {
            this.spinner.hide();
            this.toastr.success(res.status)
            console.log(res)
            this.router.navigate([`socialmedia/publishing/calendar`]);
          });
        });
      } else {

        this.twitterService.schedulePost(schedulePost).subscribe(res => {
          this.spinner.hide();
          this.toastr.success(res.status)
          console.log(res)
          this.router.navigate([`socialmedia/publishing/calendar`]);
        });
      }
    }
  }
  editBitlyUrl(url: any) {
    if (!this.bitlyUrlEdit) {
      this.postingData = this.postingData.replace(this.preBitlyUrl, url);
      this.bitlyUrlEdit = !this.bitlyUrlEdit;
    } else {
      this.preBitlyUrl = url;
      this.bitlyUrlEdit = !this.bitlyUrlEdit;
    }
  }
  getdefaultImg(id:any){
    console.log(id);
    
  }
}
