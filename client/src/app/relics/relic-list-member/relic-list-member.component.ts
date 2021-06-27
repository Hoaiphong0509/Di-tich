import { Member } from 'src/app/_models/member';
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
  user: User;

  searchForm: FormGroup;

  constructor(
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService,
    private memberService: MemberService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.memberParams = this.memberService.getMemberParams();
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
    this.relicService.getRelicsByUsername(this.memberParams.currentUsername, this.searchForm.value.name).subscribe(response => {
      console.log(response)
      this.relics = response.result;
      this.pagination = response.pagination;
    });
  }

  refresh(){
    this.loadRelicsMember();
  }

  loadRelicsMember(){
    this.memberParams.pageSize = 7;
    this.relicService.getRelicByMember(this.memberParams).subscribe(response => {
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
    this.memberParams.pageNumber = event.page;
    this.loadRelicsMember();
  }


}
