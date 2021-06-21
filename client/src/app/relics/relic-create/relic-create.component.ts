import { User } from './../../_models/user';
import { AccountService } from './../../_services/account.service';
import { environment } from 'src/environments/environment';
import { RelicService } from './../../_services/relic.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, NgForm, FormControl, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Relic } from 'src/app/_models/relic';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-relic-create',
  templateUrl: './relic-create.component.html',
  styleUrls: ['./relic-create.component.css']
})
export class RelicCreateComponent implements OnInit {
  addRelicForm: FormGroup;
  model: any = {};
  addPhotoMode = false;
  relic: Relic;
  relicId: number;

  user: User;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
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
    if (this.relic) {
      console.log(this.relic)
      this.initializeUploader();
    }
  }

  initializeForm() {
    this.addRelicForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    })

  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'add-photo-relic/' + this.relic.id,
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response)
        this.relic.photos.push(photo)
        if (photo.isMain) {
          this.relic.photoUrl = photo.url;
        }
      }
    }
  }

  addRelic() {
    this.relicService.createRelic(this.addRelicForm.value).subscribe(response => {
      this.addPhotoMode = true;
      // console.log(response)
    }, error => {
      console.log(error)
    })
  }

  cancel() {
    // console.log(this.addRelicForm.touched)
    console.log(this.relicService.getCurrentRelic().id)
    if (this.relicService.getCurrentRelic().id) {
      this.deleteRelic(this.relicService.getCurrentRelic().id)
      this.router.navigateByUrl('/');
    }

    this.router.navigateByUrl('/');

  }

  deleteRelic(relicId: number) {
    this.relicService.deleteRelic(relicId).subscribe(() => {
      this.router.navigateByUrl('/');
    }, error => {
      console.log(error)
    })
  }

}
