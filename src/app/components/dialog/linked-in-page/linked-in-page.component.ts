import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-linked-in-page',
  templateUrl: './linked-in-page.component.html',
  styleUrls: ['./linked-in-page.component.scss']
})
export class LinkedInPageComponent implements OnInit {

  messageData: {
    linkedinProfile: any,
    linkedinPages: any
  } | undefined;

  constructor(public modal: NgbActiveModal) { }
  
  ngOnInit(): void {

    console.log("messageData",this.messageData);
  }

  

}
