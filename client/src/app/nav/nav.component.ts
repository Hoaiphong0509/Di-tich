import { User } from 'src/app/_models/user';
import { AccountService } from './../_services/account.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Member } from '../_models/member';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent {
  user: User;

  constructor(public accountService: AccountService, private router: Router, private memberService: MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user)
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(() => {
      this.router.navigateByUrl("member/edit")
    })
  }

}
