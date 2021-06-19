import { Member } from './../_models/member';
import { MemberService } from './member.service';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './../_models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Relic } from './../_models/relic';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { PageParams } from '../_models/pageParams';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelicService {
  baseUrl = environment.apiUrl;
  relics: Relic[];
  relicCache = new Map();
  member: Member;

  constructor(private http: HttpClient, private memberService: MemberService) {

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
    return this.http.post<Relic>(this.baseUrl + 'users/add-relic', model);
  }

  deleteRelic(relicId: number){
    return this.http.delete(this.baseUrl + 'users/delete-relic/' + relicId);
  }
  //#endregion
}
