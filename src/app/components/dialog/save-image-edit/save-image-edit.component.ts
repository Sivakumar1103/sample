import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-save-image-edit',
  templateUrl: './save-image-edit.component.html',
  styleUrls: ['./save-image-edit.component.scss']
})
export class SaveImageEditComponent implements OnInit {


  messageData = {
    fileName: 'sample',
    fileExt: 'jpeg'
  }

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
