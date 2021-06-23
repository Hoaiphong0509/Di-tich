import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Relic } from 'src/app/_models/relic';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { RelicService } from 'src/app/_services/relic.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-relic-edit-member',
  templateUrl: './relic-edit-member.component.html',
  styleUrls: ['./relic-edit-member.component.css']
})
export class RelicEditMemberComponent implements OnInit {
  showFiller = false;
  editRelicForm: FormGroup;

  model: any = {};
  relic: Relic;
  editRelicMode = false;
  editPhotoMode = false;
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
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic)
  }

  ngOnInit(): void {
    if (!localStorage.getItem('relic')) { 
      this.router.navigateByUrl('/not-found')
    } else {
      this.relic = JSON.parse(localStorage.getItem('relic'));
      this.initializeForm();
    }
    this.initializeForm();
  }

  initializeForm() {
    this.editRelicForm = this.fb.group({
      id: [this.relic.id, Validators.required],
      name: [this.relic.name, Validators.required],
      title: [this.relic.title, Validators.required],
      content: [this.relic.content, Validators.required],
    })
  }

  editRelic() {
    this.relicService.editRelic(this.editRelicForm.value).subscribe(response => {
      this.editPhotoMode = true;
      this.relicService.setCurrentRelic(response)
      this.router.navigateByUrl('/')
    }, error => {
      console.log(error)
    })
  }

  cancel() {
    this.router.navigateByUrl('member/edit');
  }

  deleteRelic(relicId: number) {
    this.relicService.deleteRelic(relicId).subscribe(() => {
      localStorage.removeItem('relic')
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error)
    })
  }

  startEdit(){
    this.editRelicMode = !this.editRelicMode;
  }

}
