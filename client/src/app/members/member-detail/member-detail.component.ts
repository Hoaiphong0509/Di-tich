import { Relic } from './../../_models/relic';
import { MemberService } from './../../_services/member.service';
import { Member } from 'src/app/_models/member';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelicService } from 'src/app/_services/relic.service';
import { Pagination } from 'src/app/_models/pagination';
import { PageParamsMember } from 'src/app/_models/pageParamsMember';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member: Member;
  pagination: Pagination;
  pageParamsMember: PageParamsMember = new PageParamsMember();
  relics: Relic[];

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private relicService: RelicService,
    private router: Router) {
    this.member = JSON.parse(localStorage.getItem('member'))
  }

  ngOnInit(): void {
    this.loadMember()
    this.loadRelicsMember();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('member')
  }

  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
      this.member = member;
    })
  }

  loadRelic(relicId: number) {
    this.relicService.getRelic(relicId).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('detail/' + relicId);
    })
  }

  loadRelicsMember() {
    this.pageParamsMember.pageSize = 7;
    this.pageParamsMember.currentUsername = this.member.username;
    this.relicService.getRelicByUser(this.pageParamsMember).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    }, error => {
      console.log(error)
    })
  }


  pageChanged(event: any) {
    this.pageParamsMember.pageNumber = event.page;
    this.loadRelicsMember();
  }
}
