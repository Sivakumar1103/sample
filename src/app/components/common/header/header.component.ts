import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../../dialog/logout/logout.component';
import { SocialMediaComponent } from '../../dialog/social-media/social-media.component';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { faWallet, faNetworkWired } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(private modalService: NgbModal,
    public profileService: ProfileService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService) { }

  public notificationArr = [{ notificationText: '', status: '', createdDate: '', _id: '' }];
  public notifCount = 0;
  public notifUnreadCount = 0;

  faWallet = faWallet;
  faNetworkWired = faNetworkWired;

  ngOnInit(): void {
    this.loadNotifications();
  }


  loadNotifications() {
    this.spinner.show();
    this.notificationService.retrieveNotifications().subscribe((res: any) => {
      this.notificationArr = res.data;
      if (this.notificationArr) {
        this.notifCount = this.notificationArr.length;
        this.notificationArr = this.notificationArr.slice(Math.max(this.notificationArr.length - 3, 0));
        const unreadNotif = (this.notificationArr.filter((notif: any)=> notif.status == 'unread'));
        if(!!unreadNotif && unreadNotif.length >0) {
          this.notifUnreadCount = unreadNotif.length;
        }

      }
      this.spinner.hide();
    })
  }

  markAsread(notifyId: string) {
    this.spinner.show();
    this.notificationService.updateNotification({ notifId: notifyId, action: 'read' }).subscribe((res: any) => {
      this.spinner.hide();
      this.loadNotifications();
    })
  }


  removeNotify(notifyId: string) {
    this.spinner.show();
    this.notificationService.updateNotification({ notifId: notifyId, action: 'delete' }).subscribe((res: any) => {
      this.spinner.hide();
      this.loadNotifications();
    })
  }

  markAllAsread() {
    this.spinner.show();
    this.notificationService.updateNotification({ notifId: '', action: 'allread' }).subscribe((res: any) => {
      this.spinner.hide();
      this.loadNotifications();
    })
  }

  openLogoutModal() {
    const modalRef = this.modalService.open(LogoutComponent, { backdropClass: 'in', centered: true });
  }

  openSocialModal() {
    const modalRef = this.modalService.open(SocialMediaComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
  }
}
