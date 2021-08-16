import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './utility/auth.guard';
import { ForgotComponent } from './components/usermanagement/forgot/forgot.component';
import { LoginComponent } from './components/usermanagement/login/login.component';
import { RegisterComponent } from './components/usermanagement/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './components/usermanagement/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PasswordupdateComponent } from './components/usermanagement/passwordupdate/passwordupdate.component';
import { PrivacypolicyComponent } from './components/common/privacypolicy/privacypolicy.component';
import { PublishedpostComponent } from './components/publishedpost/publishedpost.component';
import { SavedpostComponent } from './components/savedpost/savedpost.component';
import { ManageaccountComponent } from './components/usermanagement/manageaccount/manageaccount.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { BillingComponent } from './components/usermanagement/billing/billing.component';
import { AddmemberComponent } from './components/usermanagement/addmember/addmember.component';
import { AccountsettingsComponent } from './components/usermanagement/accountsettings/accountsettings.component';
import { BillinginformationComponent } from './components/usermanagement/billinginformation/billinginformation.component';
import { NewtemplateComponent } from './components/template/newtemplate/newtemplate.component';
import { InsightsComponent } from './components/insights/insights.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { TaskComponent } from './components/task/task.component';
import { LibraryComponent } from './components/library/library.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { NotificationComponent } from './components/usermanagement/notification/notification.component';
import { OverviewComponent } from './components/usermanagement/overview/overview.component';
import { PromoteComponent } from './components/promote/promote.component';
import { EmailconfirmationComponent } from './components/usermanagement/emailconfirmation/emailconfirmation.component';
import { BitlySuccessComponent } from './components/bitly-success/bitly-success.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'bitlysuccess',  component: BitlySuccessComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'emailconfirmation', component: EmailconfirmationComponent },
  { path: 'message', component: MessageComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'home/:userId/dashboard', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'socialmedia/publishing/calendar', canActivate: [AuthGuard], component: ScheduleComponent },
  { path: 'manageaccount', canActivate: [AuthGuard], component: ManageaccountComponent },
  { path: 'billing', canActivate: [AuthGuard], component: BillingComponent },
  { path: 'passwordupdate', canActivate: [AuthGuard], component: PasswordupdateComponent },
  { path: 'addmember', canActivate: [AuthGuard], component: AddmemberComponent },

  { path: 'socialmedia/engagement/feeds', canActivate: [AuthGuard], component: FeedsComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'socialmedia/publishing/publishedpost', canActivate: [AuthGuard], component: PublishedpostComponent },
  { path: 'socialmedia/publishing/draft', canActivate: [AuthGuard], component: SavedpostComponent },
  { path: 'socialmedia/publishing/newpost', canActivate: [AuthGuard], component: DashboardComponent },

  { path: 'socialmedia/publishing/newpost/:postId/:postStatus', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountsettingsComponent },
  { path: 'account/profile', component: ProfileComponent },
  { path: 'account/billinginformation', component: BillinginformationComponent },
  { path: 'socialManage/twitterSignUp', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'socialManage/linkedInSignUp', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'socialmedia/creative/imageeditor', canActivate: [AuthGuard],canDeactivate:[AuthGuard], component: NewtemplateComponent },
  { path: 'socialmedia/dashboard/insights', canActivate: [AuthGuard], component: InsightsComponent },
  { path: 'socialmedia/publishing/discover', canActivate: [AuthGuard], component: DiscoverComponent },
  { path: 'socialmedia/engagement/task', canActivate: [AuthGuard], component: TaskComponent },
  { path: 'socialmedia/creative/library', canActivate: [AuthGuard], component: LibraryComponent },
  { path: 'socialmedia/engagement/conversation', canActivate: [AuthGuard], component: ConversationComponent },
  { path: 'socialmedia/engagement/notification', canActivate: [AuthGuard], component: NotificationComponent },
  { path: 'socialmedia/analytics/overview', canActivate: [AuthGuard], component: OverviewComponent },
  { path: 'socialmedia/promote', canActivate: [AuthGuard], component: PromoteComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
