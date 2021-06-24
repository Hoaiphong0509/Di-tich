import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountService, private toast: ToastrService){

  }

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(user.roles.includes('Admin') || user.roles.includes('Moderator')){
          return true;
        }
        this.toast.error("Bạn không đủ quyền để vào mục này"); 
        return false
      })
    )
  }
  
}
