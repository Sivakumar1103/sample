import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialAdsComponent } from '../../dialog/social-ads/social-ads.component';
import { SocialMediaComponent } from '../../dialog/social-media/social-media.component';
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  block:any=false;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    if(!localStorage.getItem('canupdate')){
      this.block = true;
    }
  }

  faPhotoVideo = faPhotoVideo;


  openSocialModal(){
    const modalRef = this.modalService.open(SocialMediaComponent, { backdropClass: 'in', windowClass: 'in', size:'xl', centered: true  });
  }

  openSocialAdsModal(){
    const modalRef = this.modalService.open(SocialAdsComponent, { backdropClass: 'in', windowClass: 'in', size:'xl', centered: true  });
  }

}
