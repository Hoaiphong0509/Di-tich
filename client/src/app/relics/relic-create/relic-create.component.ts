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
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    if(localStorage.getItem('relic')) localStorage.removeItem('relic')
    this.initializeForm();
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
    this.router.navigateByUrl('/');
  }


  startCreate(){
    const relic = JSON.parse(localStorage.getItem('relic'))
    this.addRelicMode = !this.addPhotoMode;
  }

  editMode(): boolean{
    const relic = JSON.parse(localStorage.getItem('relic'))
    console.log(relic);
    console.log(this.relic);
    console.log(relic === this.relic)

    if(relic === this.relic){
      return true;
    }
    return false;
  }

  //Tinh nag xem truoc
  // view(){
  //   const relic: Relic = JSON.parse(localStorage.getItem('relic'))
  //   this.relicService.getRelic(relic.id).subscribe(() => {
  //     this.router.navigateByUrl('relics/' + relic.id)
  //   })
  // }
}
