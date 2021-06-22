import { RelicService } from './../_services/relic.service';
import { Relic } from 'src/app/_models/relic';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateRelicResolver implements Resolve<Relic> {
  constructor(private relicService: RelicService, private router: Router){

  }

  resolve(route: ActivatedRouteSnapshot): Observable<Relic> {
    return this.relicService.getRelic(route.params['id'])
  }
}
