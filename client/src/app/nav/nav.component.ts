import { RelicService } from 'src/app/_services/relic.service';
import { AccountService } from './../_services/account.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
}


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent {

  constructor(public accountService: AccountService, private router: Router, private relicService: RelicService) {
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
