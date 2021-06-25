import { UserParams } from './../../_models/userParams';
import { Pagination } from './../../_models/pagination';
import { MemberService } from './../../_services/member.service';
import { Member } from 'src/app/_models/member';
import { Component, OnInit } from '@angular/core';
import { MemberParams } from 'src/app/_models/memberParams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  member: Member;
  pagination: Pagination;
  userParams: UserParams;

  constructor(private memberService: MemberService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    }, error => {
      console.log(error)
    })
  }



  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
}
