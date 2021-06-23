import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member; 
  private currentMemberSource = new ReplaySubject<Member>(1)
  currentMember$ = this.currentMemberSource.asObservable()

  constructor() { }

  ngOnInit(): void {

  }

  setMemberUsername(member: Member){
    if(!localStorage.getItem('member')){
      localStorage.setItem('member', JSON.stringify(member));
      this.currentMemberSource.next(member);
    }

  }

}
