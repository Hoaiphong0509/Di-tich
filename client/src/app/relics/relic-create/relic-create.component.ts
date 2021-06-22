import { User } from './../../_models/user';
import { AccountService } from './../../_services/account.service';
import { environment } from 'src/environments/environment';
import { RelicService } from './../../_services/relic.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, ElementRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Relic } from 'src/app/_models/relic';


@Component({
  selector: 'app-relic-create',
  templateUrl: './relic-create.component.html',
  styleUrls: ['./relic-create.component.css']
})
export class RelicCreateComponent implements OnInit {
  @Input() autosize: boolean = true;
  showFiller = false;
  addRelicForm: FormGroup;

  model: any = {};
  addRelicMode = false;
  addPhotoMode = false;

  relic: Relic;
  relicId: number;

  user: User;

  baseUrl = environment.apiUrl;
  apiTinyMCE = environment.apiTinyMCE;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private relicService: RelicService,
    private fb: FormBuilder) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.initializeForm();
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    // this.configuracoesEditor = configuracaoPadraoEditor(false, false, '285px');
    // this.reload()
  }

  initializeForm() {
    this.addRelicForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    })
  }

  addRelic() {
    this.relicService.createRelic(this.addRelicForm.value).subscribe(response => {
      this.addPhotoMode = true;
      this.relicService.setCurrentRelic(response)
      this.relic = response;
    }, error => {
      console.log(error)
    })
  }

  cancel() {
    if (this.relicService.getCurrentRelic().id) {
      this.deleteRelic(this.relicService.getCurrentRelic().id)
      this.router.navigateByUrl('/');
    }
    this.router.navigateByUrl('/');
  }

  deleteRelic(relicId: number) {
    this.relicService.deleteRelic(relicId).subscribe(() => {
      localStorage.removeItem('relic')
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error)
    })
  }

  startCreate(){
    console.log(Object.values(this.addRelicMode))
    console.log("truoc" + this.addRelicMode)
    this.addRelicMode = !this.addPhotoMode;
    console.log("sau" + this.addRelicMode)
    if(this.addRelicMode){

    }
    // this.reload()
  }

  reload() {
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('someRoute') > -1 ? '/someOtherRoute' : '/someRoute';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }
}
