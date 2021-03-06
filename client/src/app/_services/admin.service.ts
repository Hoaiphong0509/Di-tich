import { User } from 'src/app/_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Relic } from '../_models/relic';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/user-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }

  getRelicForApproval() {
    return this.http.get<Relic[]>(this.baseUrl + 'admin/relics-to-moderate'); 
  }
 
    
  approveRelic(relicId: number) {
    return this.http.post(this.baseUrl + 'admin/approve-relic/' + relicId, {});
  }

  rejectRelic(relicId: number) {
    return this.http.post(this.baseUrl + 'admin/reject-relic/' + relicId, {});
  }
    
  
}
