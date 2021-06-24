import { Member } from 'src/app/_models/member';
import { ConfirmService } from './../../_services/confirm.service';
import { MemberService } from './../../_services/member.service';
import { UserParams } from './../../_models/userParams';
import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { Pagination } from './../../_models/pagination';
import { Router } from '@angular/router';
import { RelicService } from './../../_services/relic.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Relic } from 'src/app/_models/relic';

@Component({
  selector: 'app-relic-list-member',
  templateUrl: './relic-list-member.component.html',
  styleUrls: ['./relic-list-member.component.css']
})
export class RelicListMemberComponent implements OnInit {
  @Input() relics : Relic[] = [];
  @Input() pagination: Pagination;
  userParams: UserParams;
  member: Member;
  user: User;

  constructor(
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService,
    private confirmService: ConfirmService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      if(localStorage.getItem('member')){
        this.member = JSON.parse(localStorage.getItem('member'))
      }
      this.userParams = new UserParams(this.user);
  }

  ngOnInit(): void {
  }

  loadRelicsMySefl(){
    this.userParams.pageSize = 7;
    this.relicService.getRelicByUser(this.userParams).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
  }

  loadRelic(relicid: number){
    this.relicService.getRelic(relicid).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('detail/'+relicid)
    })
  }

  editRelic(relicId: number){
    this.relicService.getRelic(relicId).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('relics/edit/'+ relicId);
    })
  }

  deleteRelic(relicId: number){
    this.confirmService.confirm('Bạn có muốn xóa bài viết này?', 'Thao tác này không thể hoàn tác').subscribe(result => {
      if(result){
        this.relicService.deleteRelic(relicId).subscribe(() => {
          this.relics = this.relics.filter(x => x.id != relicId);
        })
      }
    })
  }
  
  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.loadRelicsMySefl();
  }


}
