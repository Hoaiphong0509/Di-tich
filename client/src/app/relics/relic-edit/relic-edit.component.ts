import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RelicService } from './../../_services/relic.service';
import { Component, Input, OnInit } from '@angular/core';
import { Relic } from 'src/app/_models/relic';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-relic-edit',
  templateUrl: './relic-edit.component.html',
  styleUrls: ['./relic-edit.component.css']
})
export class RelicEditComponent implements OnInit {
  @Input() relic: Relic;
  editRelicForm: FormGroup;


  constructor(
    private relicService: RelicService,
    private router: Router,
    private fb: FormBuilder) {
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic)
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  cancel() {
    const relic: Relic = JSON.parse(localStorage.getItem('relic'))
    this.relicService.deleteRelic(relic.id).subscribe(() => {
      localStorage.removeItem('relic')
      this.router.navigateByUrl('/');
    })
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
      this.relicService.setCurrentRelic(response)
      this.relic = response;
      this.router.navigateByUrl('/')
    }, error => {
      console.log(error)
    })
    this.relicService.setCurrentRelic(this.relic);
  }

}
