import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { Pagination } from './../../_models/pagination';
import { Router } from '@angular/router';
import { RelicService } from './../../_services/relic.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Relic } from 'src/app/_models/relic';
import { PageParamsMember } from 'src/app/_models/pageParamsMember';

@Component({
  selector: 'app-relic-list-member',
  templateUrl: './relic-list-member.component.html',
  styleUrls: ['./relic-list-member.component.css']
})
export class RelicListMemberComponent implements OnInit {
  pagination: Pagination;
  pageParamsMember: PageParamsMember = new PageParamsMember();
  user: User;
  relics: Relic[];

  constructor(
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user)
  }

  ngOnInit(): void {
    this.loadRelicsMySefl();
  }

  loadRelicsMySefl(){
    this.pageParamsMember.currentUsername = this.user.username;
    this.pageParamsMember.pageSize = 7;
    this.relicService.getRelicByUser(this.pageParamsMember).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
  }

  loadRelic(relicId: number){
    this.relicService.getRelic(relicId).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('/relics/detail');
    })
  }

  editRelic(relicId: number){
    this.relicService.getRelic(relicId).subscribe(response => {
      this.relicService.setCurrentRelic(response);
      this.router.navigateByUrl('relics/edit/'+ relicId);
    })
  }

  deleteRelic(relicId: number){
    this.relicService.deleteRelic(relicId).subscribe(() => {
      // this.relic = this.relic.filter(x => x.id != photoId)
      this.relics = this.relics.filter(x => x.id != relicId);
    })
  }

  pageChanged(event: any){
    this.pageParamsMember.pageNumber = event.page;
    this.loadRelicsMySefl();
  }

}
