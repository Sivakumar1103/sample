import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification.service';

export interface MediaData {
  notificationText: string;
  createdDate: string;

}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'notification', 'date', 'symbol'];
  public delete: boolean = false;
  public selectAllModel: boolean = false;
  public media: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  public notificationArr: any[] = [{ notificationText: '', status: '', createdDate: '', _id: '' }];

  mediaDatasource!: MatTableDataSource<MediaData>;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadNotifications();

  }

  loadNotifications() {
    this.spinner.show();
    this.notificationService.retrieveNotifications().subscribe((res: any) => {
      this.notificationArr = res.data;
      this.mediaDatasource = new MatTableDataSource(this.notificationArr);
      setTimeout(() => {
        this.mediaDatasource.sort = this.sort;
      });
      this.spinner.hide();
    })
  }

  enable() {
    const count = this.notificationArr?.filter((file: any) => !!file.checked);
    if (count) {
      if (count.length >= 1) {
        this.delete = true;

      }
      if (count.length == 0) {
        this.delete = false;
      }
    }

    if (count.length === this.notificationArr?.length) {
      this.selectAllModel = true;
    } else {
      this.selectAllModel = false;
    }

  }

  selectAll() {
    this.notificationArr.forEach(media => {
      if (this.selectAllModel) {
        media.checked = true;
        this.delete = true
      } else {
        media.checked = false;
        this.delete = false
      }
    });
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


  deleteSelected() {
    const count = this.notificationArr?.filter((file: any) => !!file.checked);
    if (count) {
      this.spinner.show();
      const notifId: string[] = [];
      count.forEach((item: any) => {
        notifId.push(item._id);
      });
      this.notificationService.updateNotification({ notifArr: notifId, action: 'delete' }).subscribe((res: any) => {
        this.spinner.hide();
        this.delete = false;
        this.loadNotifications();
      })
    }

  }

  deleteAll() {
    this.spinner.show();
    const notifId: string[] = [];
    this.notificationArr.forEach((item: any) => {
      notifId.push(item._id);
    });
    this.notificationService.updateNotification({ notifArr: notifId, action: 'delete' }).subscribe((res: any) => {
      this.spinner.hide();
      this.delete = false;
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

}
