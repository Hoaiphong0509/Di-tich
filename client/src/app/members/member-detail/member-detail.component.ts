import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Relic } from './../../_models/relic';
import { MemberService } from './../../_services/member.service';
import { Member } from 'src/app/_models/member';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelicService } from 'src/app/_services/relic.service';
import { Pagination } from 'src/app/_models/pagination';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MemberParams } from 'src/app/_models/memberParams';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs') memberTabs: TabsetComponent
  member: Member;
  pagination: Pagination;

  relics: Relic[] = [];
  user: User;


  memberParmas: MemberParams;

  activeTab: TabDirective;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.memberParmas = this.memberService.getMemberParams()
  }

  ngOnDestroy(): void {
    localStorage.removeItem('member')
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    });

    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username'))
      .subscribe(member => {
        this.member = member;
      })
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Bài viết' && this.relics != null) {
      this.memberParmas.pageSize = 7;
      this.relicService.getRelicByUser(this.memberParmas).subscribe(response => {
        this.relics = response.result;
        this.pagination = response.pagination;
      }, error => {
        console.log(error)
      })
    }
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

}
