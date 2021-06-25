import { MemberParams } from 'src/app/_models/memberParams';
import { UserParams } from './../_models/userParams';
import { User } from 'src/app/_models/user';
import { PaginatedResult } from './../_models/pagination';
import { map, take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})


export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();

  user: User;

  userParams: UserParams;
  memberParams: MemberParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }
  
  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams
  }

  getMemberParams(){
    return this.memberParams;
  }

  setMemberParams(params: MemberParams){
    this.memberParams = params;
  }

  // resetMemberParams(){
  //   this.userParams = new MemberParams(this.member);
  //   return this.userParams
  // }

  //#region member
  getMembers(userParams: UserParams) {
    var response  = this.memberCache.get(Object.values(userParams).join('-'));

    if(response){
      return of(response)
    }

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);
    
    if(member){
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  //#endregion

}
