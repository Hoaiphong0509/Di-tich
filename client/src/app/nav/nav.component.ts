import { AccountService } from './../_services/account.service';
import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public accountService: AccountService) { 
    
  }

  ngOnInit(): void {
  }

  logout(){
    this.accountService.logout();
  }
}
