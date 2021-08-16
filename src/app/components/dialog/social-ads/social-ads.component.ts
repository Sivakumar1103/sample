import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-social-ads',
  templateUrl: './social-ads.component.html',
  styleUrls: ['./social-ads.component.scss']
})
export class SocialAdsComponent implements OnInit {

  constructor(public modal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

}
