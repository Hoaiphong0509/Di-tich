import { Member } from './../_models/member';
import { MemberService } from './member.service';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './../_models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Relic } from './../_models/relic';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { PageParams } from '../_models/pageParams';
import { of, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelicService {
  baseUrl = environment.apiUrl;
  relics: Relic[];

  relicCache = new Map();
  member: Member;

  private currentRelicSource = new ReplaySubject<Relic>(1)
  currentRelic$ = this.currentRelicSource.asObservable()

  constructor(private http: HttpClient, private memberService: MemberService) {
    
  }

  setCurrentRelic(relic: Relic){
    localStorage.setItem('relic', JSON.stringify(relic));
    this.currentRelicSource.next(relic);
  }

  getRelicId(): number{
    let relicId: number;

    this.currentRelicSource.subscribe(response => {
      relicId = response.id;
    })
    return relicId;
  }

  getCurrentRelic(){
    const relic: Relic = JSON.parse(localStorage.getItem('relic'));
    this.setCurrentRelic(relic);
    console.log(relic);
    return relic;
  }

  // getRelic(){
  //   return this.http.get<Relic>(this.baseUrl + 'users/get-relic-by-id/' + this.getRelicId());
  // }
  
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
    const id = this.getRelicId();
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
    model.id = this.getCurrentRelic().id;
    console.log("goi sua: " + model)
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
  //#endregion
}
