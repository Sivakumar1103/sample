import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shorturl',
  templateUrl: './shorturl.component.html',
  styleUrls: ['./shorturl.component.scss']
})
export class ShorturlComponent implements OnInit {
  tab = 1;
  public shortUrlIntegration = 'Rebrandly'
  constructor(
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (!this.profileService.userData.firstName) {
      this.profileService.retrieveUserProfile().subscribe(res => {
        this.profileService.userData = res.data;
        if (this.profileService.userData && this.profileService.userData.integration && this.profileService.userData.integration.surl) {
          console.log(this.profileService.userData.integration.surl)
          this.shortUrlIntegration = this.profileService.userData.integration.surl.name;
        }
        this.spinner.hide();
      });
    } else {
      if (this.profileService.userData && this.profileService.userData.integration && this.profileService.userData.integration.surl) {
        console.log(this.profileService.userData.integration.surl)
        this.shortUrlIntegration = this.profileService.userData.integration.surl.name;
      }
    }
    console.log(this.shortUrlIntegration);
  }

  updateSUrlIntegration() {
    console.log(this.shortUrlIntegration);
    if(this.shortUrlIntegration === 'Bitly') {
      window.open(environment.bitlyURL, 'bitlywin', 'width=500,height=500');
      window.close();
    } else {
      this.profileService.updateSUrlIntegration('Rebrandly').subscribe((res:any) => {
        this.toastr.success('URL Shortening domain updated');
      });
    }
  }

  @HostListener('window:message', ['$event']) onPostMessage(event: any) {
    if (event.data && event.data.origin && event.data.origin == 'bitly') {
      setTimeout(() => {
        this.profileService.retrieveUserProfile().subscribe(res => {
          this.profileService.userData = res.data;
        });
      }, 200)
    }
  }
  setTab(newTab: number){
    this.tab = newTab;
  }

 isSet(tabNum: number) {
    return this.tab === tabNum;
  };

}
