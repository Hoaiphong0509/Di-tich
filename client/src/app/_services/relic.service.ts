import { MemberParams } from 'src/app/_models/memberParams';
import { UserParams } from './../_models/userParams';
import { Member } from './../_models/member';
import { MemberService } from './member.service';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './../_models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Relic } from './../_models/relic';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { PageParams } from '../_models/pageParams';
import { of, ReplaySubject } from 'rxjs';
import { RelicParams } from '../_models/relicParams';

@Injectable({
  providedIn: 'root'
})
export class RelicService {
  baseUrl = environment.apiUrl;
  relics: Relic[];

  relicCache = new Map();
  member: Member;

  relicParams: RelicParams;

  private currentRelicSource = new ReplaySubject<Relic>(1)
  currentRelic$ = this.currentRelicSource.asObservable()

  constructor(private http: HttpClient, private memberService: MemberService) {
  }

  getRelicParams(){
    return this.relicParams;
  }

  setRelicParams(params: RelicParams){
    this.relicParams = params;
  }

  // resetRelicParams(){
  //   this.relicParams = new RelicParams(this.relic);
  //   return this.relicParams
  // }

  setCurrentRelic(relic: Relic){
    localStorage.setItem('relic', JSON.stringify(relic));
    this.currentRelicSource.next(relic);
  }

  getCurrentRelic(){
    const relic: Relic = JSON.parse(localStorage.getItem('relic'));
    this.setCurrentRelic(relic);
    return relic;
  }

  getRelic(relicId: number) {
    const relic = [...this.relicCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((relic: Relic) => relic.id === relicId);
    
    if(relic){
      return of(relic);
    }
    return this.http.get<Relic>(this.baseUrl + 'users/get-relic-by-id/' + relicId);
  }

  getRelicClient(relicId: number){
    return this.http.get<Relic>(this.baseUrl + 'relics/get-relic-by-id/' + relicId);
  }

  getRelics(pageParams: PageParams){
    var response = this.relicCache.get(Object.values(pageParams).join('-'));
    if(response){
      return of(response);
    }

    let params = this.getPaginationHeaders(pageParams.pageNumber, pageParams.pageSize);
    
    return this.getPaginatedResult<Relic[]>(this.baseUrl + 'relics', params).pipe(
      map(response => {
        this.relicCache.set(Object.values(pageParams).join('-'), response);
        return response;
      })
    )
  }

  getApprovedRelics(pageParams: PageParams){
    var response = this.relicCache.get(Object.values(pageParams).join('-'));
    if(response){
      return of(response);
    }

    let params = this.getPaginationHeaders(pageParams.pageNumber, pageParams.pageSize);
    
    return this.getPaginatedResult<Relic[]>(this.baseUrl + 'relics/get-relic-approved', params).pipe(
      map(response => {
        this.relicCache.set(Object.values(pageParams).join('-'), response);
        return response;
      })
    )
  }

  getAllRelic(){
    return this.http.get<Relic[]>(this.baseUrl + 'relics/get-relic-approved');
  }
  
  getRelicsByName(name: string){
    var response = this.relicCache.get(Object.values(name));
    if(response){
      return of(response);
    }

    const paginatedResult: PaginatedResult<Relic[]> = new PaginatedResult<Relic[]>();
    return this.http.get<Relic[]>(this.baseUrl + 'relics/' + name + '?pageNumber=1&pageSize=4', {observe: 'response'}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }
  
  getRelicsByUsername(username: string, name: string){
    var response = this.relicCache.get(Object.values(username));
    if(response){
      return of(response);
    }

    const paginatedResult: PaginatedResult<Relic[]> = new PaginatedResult<Relic[]>();
    return this.http.get<Relic[]>(this.baseUrl + 'relics/get-relic-by-username-name/?username=' + username +'&name=' + name + '&pageNumber=1&pageSize=7', {observe: 'response'}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }


  getRelicByUser(userParams: UserParams){
    var response = this.relicCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }

    let params = this.getPaginationMemberHeaders(userParams.pageNumber, userParams.pageSize, userParams.currentUsername);
    
    return this.getPaginatedResult<Relic[]>(this.baseUrl + 'users/get-relics-by-user', params).pipe(
      map(response => {
        this.relicCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )
  }

  getRelicByMember(memberParams: MemberParams){
    var response = this.relicCache.get(Object.values(memberParams).join('-'));
    if(response){
      return of(response);
    }

    let params = this.getPaginationMemberHeaders(memberParams.pageNumber, memberParams.pageSize, memberParams.currentUsername);
    
    return this.getPaginatedResult<Relic[]>(this.baseUrl + 'users/get-relics-by-user', params).pipe(
      map(response => {
        this.relicCache.set(Object.values(memberParams).join('-'), response);
        return response;
      })
    )
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

  private getPaginationMemberHeaders(pageNumber: number, pageSize: number, currentUsername: string) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('currentUsername', currentUsername);

    return params;
  }
  
  //#region relic
  createRelic(model: any){
    
    return this.http.post<Relic>(this.baseUrl + 'users/add-relic', model).pipe(
      map((relic: Relic) => {
        if (relic) {
          this.setCurrentRelic(relic);
        }
        return relic;
      })
    )
  }

  editRelic(model: any){
    return this.http.put<Relic>(this.baseUrl + 'users/edit-relic' , model).pipe(
      map((relic: Relic) => {
        if (relic) {
          this.setCurrentRelic(relic);
        }
        return relic;
      })
    )
  }

  setMainPhoto(relicId?: number, photoId?: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/?relicId=' + relicId + '&photoId=' + photoId, {})
  }

  deleteRelic(relicId: number){
    return this.http.delete(this.baseUrl + 'users/delete-relic/' + relicId);
  }

  deletePhoto(relicId: number, photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/?relicId=' + relicId + '&photoId=' + photoId)
  }
  //#endregion
}
