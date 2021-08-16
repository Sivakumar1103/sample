import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-emailconfirmation',
  templateUrl: './emailconfirmation.component.html',
  styleUrls: ['./emailconfirmation.component.scss']
})
export class EmailconfirmationComponent implements OnInit {

  public userEmailId = '';
  constructor(
    private router: Router,
    private dataTransferService: DataTransferService
  ) { }

  ngOnInit(): void {
    if (this.dataTransferService.userEmail == '') {
      this.router.navigate([`emailconfirmation`]);
    }
    this.userEmailId = this.dataTransferService.userEmail;
    this.dataTransferService.userEmail = '';
  }

}
