import { PageParams } from './../../_models/pageParams';
import { Pagination } from './../../_models/pagination';
import { MemberService } from './../../_services/member.service';
import { Member } from 'src/app/_models/member';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  pageParams: PageParams = new PageParams();

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers(this.pageParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any){
    this.pageParams.pageNumber = event.page;
    this.loadMembers();
  }
}
