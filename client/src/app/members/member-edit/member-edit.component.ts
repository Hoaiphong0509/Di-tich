import { Pagination } from './../../_models/pagination';
import { RelicService } from 'src/app/_services/relic.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../_services/account.service';
import { MemberService } from './../../_services/member.service';
import { User } from './../../_models/user';
import { Member } from 'src/app/_models/member';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    if (this.activeTab.heading === 'Bài viết' && this.relics != null) {
      this.relics.forEach(element => {
        console.log(element.name)
      });
        this.userParams.pageSize = 7;
        this.relicService.getRelicByUser(this.userParams).subscribe(response => {
        this.relics = response.result;
        this.pagination = response.pagination;
      })
      // this.loadRelicsMySefl();
    }
  }

  loadRelicsMySefl() {
    this.userParams.pageSize = 7;
    this.relicService.getRelicByUser(this.userParams).subscribe(response => {
      this.relics = response.result;
      this.pagination = response.pagination;
    })
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

}
