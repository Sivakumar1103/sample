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
          dropdownList.push({socialType: 'facebook',   userId: scMedia.userId, socialId: `facebook#${scMedia.userId}#${fbpage.id}`, socialName: `${fbpage.name}`, socialImage: fbpage.userProfileImage, pageId: fbpage.id });
        });
      } else if (scMedia.name == 'twitter') {
        dropdownList.push({socialType: 'twitter',userId: scMedia.userId,  socialId: `twitter#${scMedia.userId}`, socialName: `${scMedia.screenName}`, socialImage: scMedia.userProfileImage });
      } else if (scMedia.name == 'linkedin') {
        if (scMedia.linkedinProfile) {
          dropdownList.push({socialType: 'linkedin', socialId: `${scMedia.name}#${scMedia.linkedinProfile.userId}`, userId: scMedia.linkedinProfile.userId, socialName: scMedia.linkedinProfile.userName, socialImage: scMedia.linkedinProfile.userImage });
        }
        if (scMedia.linkedinPages) {
          scMedia.linkedinPages?.forEach(lkPage => {
           dropdownList.push({ socialType: 'linkedin', socialId: `${scMedia.name}#${scMedia.userId}-${lkPage.userId}`, userId: scMedia.userId, socialName: lkPage.userName, socialImage: lkPage.userImage, pageId: lkPage.userId});
          });
        }
      }
    });
    return dropdownList;
  }
}
