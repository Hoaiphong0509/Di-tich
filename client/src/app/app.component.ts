import { Relic } from 'src/app/_models/relic';
import { RelicService } from './_services/relic.service';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Di tích';

  constructor(
    private http: HttpClient, 
    private accountService: AccountService,
    private relicService: RelicService) { }
  ngOnInit() {
    this.setCurrentUser();
  }
 
  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }


}
