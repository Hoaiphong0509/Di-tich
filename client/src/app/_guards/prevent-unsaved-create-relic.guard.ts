import { take } from 'rxjs/operators';
import { Relic } from 'src/app/_models/relic';
import { RelicService } from './../_services/relic.service';
import { RelicCreateComponent } from './../relics/relic-create/relic-create.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedCreateRelicGuard implements CanDeactivate<unknown> {
  relic: Relic;

  constructor(private relicService: RelicService){
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic);
  }

  canDeactivate(
    component: RelicCreateComponent): boolean {
      if(component.addRelicForm.dirty){
        if(component.addPhotoMode){
          if(confirm('Bạn có muốn tiếp tục? Những thao tác chưa được lưu sẽ mất!')){
            this.relicService.deleteRelic(this.relic.id)
            localStorage.removeItem('relic')
            return true;
          }
        }
        return true;
      }
      return true;
  }
  
}
