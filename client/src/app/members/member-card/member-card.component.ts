import { Router } from '@angular/router';
import { MemberParams } from 'src/app/_models/memberParams';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ReplaySubject } from 'rxjs';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member = {} as Member;
  memberParams: MemberParams;

  constructor(private memberService: MemberService, private router: Router) {

  
  }

  ngOnInit(): void {

  }

  loadMember(){
    this.memberParams = new MemberParams(this.member)  
    this.memberService.setMemberParams(this.memberParams);
  }

}
