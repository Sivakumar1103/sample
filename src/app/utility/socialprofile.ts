import { Injectable } from '@angular/core';
import { ManageaccountService } from '../services/manageaccount.service';

@Injectable({
  providedIn: 'root'
})
export class SocialProfileUtil {

  constructor(
    private manageaccountService: ManageaccountService,
  ) {}

  processSocialDropdown() {
    const dropdownList: any[] = [];
    this.manageaccountService.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          dropdownList.push({socialType: 'facebook',   userId: scMedia.userId, socialId: `facebook#${scMedia.userId}#${fbpage.id}`, socialName: `${fbpage.name}`, socialImage: fbpage.userProfileImage, pageId: fbpage.id, tagIcon:'facebook' });
        });
      } else if (scMedia.name == 'twitter') {
        dropdownList.push({socialType: 'twitter',userId: scMedia.userId,  socialId: `twitter#${scMedia.userId}`, socialName: `${scMedia.screenName}`, socialImage: scMedia.userProfileImage, tagIcon:'twitter' });
      } else if (scMedia.name == 'linkedin') {
        if (scMedia.linkedinProfile) {
          dropdownList.push({socialType: 'linkedin', socialId: `${scMedia.name}#${scMedia.linkedinProfile.userId}`, userId: scMedia.linkedinProfile.userId, socialName: scMedia.linkedinProfile.userName, socialImage: scMedia.linkedinProfile.userImage, tagIcon:'linkedin' });
        }
        if (scMedia.linkedinPages) {
          scMedia.linkedinPages?.forEach(lkPage => {
           dropdownList.push({ socialType: 'linkedin', socialId: `${scMedia.name}#${scMedia.userId}-${lkPage.pageId}`, userId: scMedia.userId, socialName: lkPage.pageName, socialImage: lkPage.pageImage?lkPage.pageImage:'../../../../assets/img/Linkedin.svg' , tagIcon:'building', pageId: lkPage.pageId});
          });
        }
      }
    });
    console.log(dropdownList);
    return dropdownList;
  }
}
