import { UserParams } from 'src/app/_models/userParams';
import { Member } from 'src/app/_models/member';
import { ConfirmService } from './../../_services/confirm.service';
import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { Pagination } from './../../_models/pagination';
import { Router } from '@angular/router';
import { RelicService } from './../../_services/relic.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Relic } from 'src/app/_models/relic';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MemberParams } from 'src/app/_models/memberParams';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-relic-list-member',
  templateUrl: './relic-list-member.component.html',
  styleUrls: ['./relic-list-member.component.css']
})
export class RelicListMemberComponent implements OnInit, OnDestroy {
  @Input() relics : Relic[] = [];
  @Input() pagination: Pagination;
  memberParams: MemberParams;
  userParams: UserParams;
  member: Member;
  user: User;

  searchForm: FormGroup;

  constructor(
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService,
    private confirmService: ConfirmService,
    private memberService: MemberService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      if(localStorage.getItem('member')){
        this.member = JSON.parse(localStorage.getItem('member'))
      }
      // this.memberParams = new MemberParams(this.member);
      this.userParams = this.memberService.getUserParams();
  }
  ngOnDestroy(): void {
    localStorage.removeItem('member')
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.searchForm = new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }

  search(){
    this.relicService.getRelicsByUsername(this.member.username, this.searchForm.value.name).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    });
  }

  refresh(){
    this.loadRelicsMember();
  }

  loadRelicsMember(){
    this.userParams.pageSize = 7;
    this.relicService.getRelicByMember(this.userParams).subscribe(response => {
      this.relics = response.result;
      console.log(response.result)
      this.pagination = response.pagination;
    })
  }

  loadRelic(relicid: number){
    this.relicService.getRelic(relicid).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('detail/'+relicid)
    })
  }
  
  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.loadRelicsMember();
  }


}
