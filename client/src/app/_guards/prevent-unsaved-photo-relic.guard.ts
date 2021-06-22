import { PhotoEditorComponent } from './../relics/photo-editor/photo-editor.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Relic } from '../_models/relic';
import { RelicService } from '../_services/relic.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedPhotoRelicGuard implements CanDeactivate<unknown> {
  relic: Relic;

  constructor(private relicService: RelicService){
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic);
  }

  canDeactivate(
    component: PhotoEditorComponent): boolean {
      if(component.initializeUploader){
        return confirm('Bạn có muốn tiếp tục? Những thao tác chưa được lưu sẽ mất!')
      }
      return true;
  }
  
}
