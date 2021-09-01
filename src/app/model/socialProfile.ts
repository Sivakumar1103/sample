export class SocialProfile {
  email?: string;
  socialMedia?: SocialMediDetails[]
}


export class linkedinProfile {
  userId?: String;
  userName?: String;
  userImage?: String;
  pageId!: String;
  pageName!: String;
  pageImage!: String;
}
export class SocialMediDetails {
  name?: string;
  fbpages?: FBPageDetails[];
  linkedinPages?: linkedinProfile[];
  linkedinProfile?: linkedinProfile;
  screenName?: String;
  userProfileImage?: String;
  userId?: String;
  pageId: any;
  lnPage: any;
  pageName: any;
  userName: any;
  pageImage: any;
  userImage: any;
}
export class FBPageDetails {
  name?: String;
  category?: String;
  access_token?: String;
  userProfileImage?: String;
  id?: String;
  image?: String;
}

export class SocialDropDown {
  socialId?: String;
  socialImage?: String;
  userId?: String;
  socialName?: String;
  socialType?: String;
}
