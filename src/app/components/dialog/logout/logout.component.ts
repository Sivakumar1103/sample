import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/usermanagement/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  userData: User = new User();

  constructor(private _router: Router,
    private _auth: AuthService, 
    public authServiceAK: AuthService, 
    private modalService: NgbModal,
    public modal: NgbActiveModal,) { token: String; }

  ngOnInit(): void {
  }
  
}
