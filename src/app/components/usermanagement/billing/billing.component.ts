import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  public show:boolean = true;
  public show2:boolean = false;
  public show3:boolean = false;

  public showtext:boolean = true;
  public showtext2:boolean = false;
  public showtext3:boolean = false;

  public showbutton:boolean = false;

  userId = '';

  constructor(public profileService: ProfileService) { }

  toggle()
  {
    this.show = true;
    this.show2 = false;
    this.show3 = false;
    this.showtext = true;
    this.showtext2 = false;
    this.showtext3 = false;
    this.showbutton = false;
  }

  toggle2()
  {
    this.show = true;
    this.show2 = true;
    this.show3 = false;
    this.showtext = false;
    this.showtext2 = true;
    this.showtext3 = false;
    this.showbutton = true;
  }

  toggle3()
  {
    this.show = true;
    this.show2 = true;
    this.show3 = true;
    this.showtext = false;
    this.showtext2 = false;
    this.showtext3 = true;
    this.showbutton = true;
  }

  ngOnInit(): void {
  }

}
