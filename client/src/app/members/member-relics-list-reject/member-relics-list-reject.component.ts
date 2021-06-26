import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { Relic } from 'src/app/_models/relic';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { RelicService } from 'src/app/_services/relic.service';

@Component({
  selector: 'app-member-relics-list-reject',
  templateUrl: './member-relics-list-reject.component.html',
  styleUrls: ['./member-relics-list-reject.component.css']
})
export class MemberRelicsListRejectComponent implements OnInit {
  @Input() relics : Relic[] = [];
  @Input() pagination: Pagination;
  userParams: UserParams;
  member: Member;
  user: User;

  searchForm: FormGroup;

  constructor(
    private relicService: RelicService,
    private router: Router,
    private accountService: AccountService,
    private confirmService: ConfirmService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.userParams = new UserParams(this.user);
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
    this.relicService.getRelicsByUsername(this.user.username, this.searchForm.value.name).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    });
  }

  refresh(){
    this.loadRelicsMember();
  }

  loadRelicsMember(){
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
    this.loadRelicsMember();
  }


}
