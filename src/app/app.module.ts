import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FacebookModule } from 'ngx-facebook-fb';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { LightboxModule } from 'ngx-lightbox';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';


import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';

import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/usermanagement/register/register.component';
import { LoginComponent } from './components/usermanagement/login/login.component';
import { TokenInterceptorService } from './utility/token-interceptor.service';
import { ForgotComponent } from './components/usermanagement/forgot/forgot.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './components/usermanagement/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PasswordupdateComponent } from './components/usermanagement/passwordupdate/passwordupdate.component';
import { PagesComponent } from './components/dialog/facebookPages/pages/pages.component';
import { PrivacypolicyComponent } from './components/common/privacypolicy/privacypolicy.component';
import { HeaderComponent } from './components/common/header/header.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { SocialMediaComponent } from './components/dialog/social-media/social-media.component';
import { SocialAdsComponent } from './components/dialog/social-ads/social-ads.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { PublishedpostComponent } from './components/publishedpost/publishedpost.component';
import { SavedpostComponent } from './components/savedpost/savedpost.component';
import { PostfilterPipe } from './filter/posts.filter';
import { ManageaccountComponent } from './components/usermanagement/manageaccount/manageaccount.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { BillingComponent } from './components/usermanagement/billing/billing.component';
import { AddmemberComponent } from './components/usermanagement/addmember/addmember.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ContentlibraryComponent } from './components/dialog/contentlibrary/contentlibrary.component';
import { AccountsettingsComponent } from './components/usermanagement/accountsettings/accountsettings.component';
import { BillinginformationComponent } from './components/usermanagement/billinginformation/billinginformation.component';
import { PersonalinformationComponent } from './components/usermanagement/personalinformation/personalinformation.component';
import { UsersocialprofileComponent } from './components/usermanagement/usersocialprofile/usersocialprofile.component';
import { NewtemplateComponent } from './components/template/newtemplate/newtemplate.component';
import { InsightsComponent } from './components/insights/insights.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { TaskComponent } from './components/task/task.component';
import { LibraryComponent } from './components/library/library.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { NotificationComponent } from './components/usermanagement/notification/notification.component';
import { OverviewComponent } from './components/usermanagement/overview/overview.component';
import { PromoteComponent } from './components/promote/promote.component';
import { SocialDataComponent } from './components/dialog/social-data/social-data.component';
import { FileExtfilterPipe } from './filter/file.ext.filter';
import { SaveImageEditComponent } from './components/dialog/save-image-edit/save-image-edit.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EmailconfirmationComponent } from './components/usermanagement/emailconfirmation/emailconfirmation.component';
import { BitlySuccessComponent } from './components/bitly-success/bitly-success.component';
import { ContentEditableFormDirective } from './directive/content-editable-form.directive';
import { CalPopupComponent } from './components/dialog/cal-popup/cal-popup.component';
import { ShorturlComponent } from './components/usermanagement/shorturl/shorturl.component';
import {MatPaginatorModule} from '@angular/material/paginator';



import { MatSelectModule } from '@angular/material/select';
import { CategoryfilterPipe } from './filter/category.filter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LinkedInPageComponent } from './components/dialog/linked-in-page/linked-in-page.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { DeletusermessageComponent } from './deletusermessage/deletusermessage.component';




const fbLoginOptions = {
  scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  //scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list',
  return_scopes: true,
  enable_profile_selector: true,
  version: "v2.11" // this line added.
};



const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,

    ContentEditableFormDirective,
    LoginComponent,
    ForgotComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    MessageComponent,

    ScheduleComponent,
    PasswordupdateComponent,
    PagesComponent,
    PrivacypolicyComponent,
    HeaderComponent,
    SidebarComponent,
    SocialMediaComponent,
    SocialAdsComponent,
    LogoutComponent,
    PublishedpostComponent,
    SavedpostComponent,
    PostfilterPipe,
    CategoryfilterPipe,
    ManageaccountComponent,
    FeedsComponent,
    BillingComponent,
    AddmemberComponent,
    ContentlibraryComponent,
    AccountsettingsComponent,
    BillinginformationComponent,
    PersonalinformationComponent,
    UsersocialprofileComponent,
    NewtemplateComponent,
    InsightsComponent,
    DiscoverComponent,
    TaskComponent,
    LibraryComponent,
    ConversationComponent,
    NotificationComponent,
    OverviewComponent,
    PromoteComponent,
    SocialDataComponent,
    FileExtfilterPipe,
    SaveImageEditComponent,
    EmailconfirmationComponent,
    BitlySuccessComponent,
    CalPopupComponent,
    LinkedInPageComponent,
    ShorturlComponent,
    DeletusermessageComponent
  ],
  imports: [
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    PickerModule,
    LightboxModule,
    BrowserModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDatepickerModule,
    HttpClientModule,
    Ng2TelInputModule,
    NgxIntlTelInputModule,
    MatFormFieldModule,
MatInputModule,
A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
MatNativeDateModule,
MatButtonModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    CommonModule,
    NgbModalModule,
    SocialLoginModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FacebookModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxFileDropModule,
    ColorPickerModule,
    NgxBootstrapSliderModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    FontAwesomeModule,
    NgbModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '814985497024-6o8eqc4t2gad22hbdq4akn2ani4aukc3.apps.googleusercontent.com', googleLoginOptions
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('125112632754235', fbLoginOptions)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    DatePipe
    //CookieService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
