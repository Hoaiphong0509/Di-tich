import { Pagination } from 'src/app/_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { RelicService } from 'src/app/_services/relic.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../_services/account.service';
import { MemberService } from './../../_services/member.service';
import { User } from './../../_models/user';
import { Member } from 'src/app/_models/member';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Relic } from 'src/app/_models/relic';
import { UserParams } from 'src/app/_models/userParams';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  member: Member;
  user: User;
  account: any = {};
  totalRelic: number = 0;

  userParams: UserParams;
  relics: Relic[] = [];
  pagination: Pagination;

  activeTab: TabDirective;

  constructor(
    private memberService: MemberService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private relicService: RelicService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user)
    this.userParams = new UserParams(this.user);
  }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
      this.member.relics.forEach(relic => {
        if(relic.isApproved){
          this.totalRelic++;
        }
      });

    })
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Lưu hồ sơ thành công')
      this.editForm.reset(this.member);
    }, error => {
      console.log(error)
      this.toastr.error('Lưu hồ sơ thất bại!')
    })
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if ((this.activeTab.heading === 'Bài viết' 
        || this.activeTab.heading === 'Chờ duyệt' 
        || this.activeTab.heading === 'Bài viết bị từ chối') 
        && this.relics != null) {
      this.loadRelicsMySefl();
    }
  }

  loadRelicsMySefl() {
    this.userParams.pageSize = 2;
    this.relicService.getRelicByUser(this.userParams).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
    this.relics = this.member.relics;
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

}
