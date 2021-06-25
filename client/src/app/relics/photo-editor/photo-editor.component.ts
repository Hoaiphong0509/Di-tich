import { Router } from '@angular/router';
import { Relic } from './../../_models/relic';
import { AccountService } from 'src/app/_services/account.service';
import { User } from './../../_models/user';
import { RelicService } from './../../_services/relic.service';
import { FileUploader } from 'ng2-file-upload';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit, OnDestroy {
  @Input() relic: Relic;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;


  constructor(
    private relicService: RelicService,
    private accountService: AccountService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic);
  }

  ngOnDestroy(): void {
    if (localStorage.getItem('photos')) {
      localStorage.removeItem('photos')
    }
  }

  ngOnInit(): void {
    // this.relic = JSON.parse(localStorage.getItem('relic'))
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo-relic/' + this.relic.id,
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
        console.log(response)
        const photo: Photo = JSON.parse(response);
        this.relic.photos.push(photo)
        if (photo.isMain) {
          this.relic.photoUrl = photo.url;
          this.relicService.setCurrentRelic(this.relic);
        }
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.relicService.setMainPhoto(this.relic.id, photo.id).subscribe(() => {
      this.relic.photoUrl = photo.url;
      this.relicService.setCurrentRelic(this.relic);
      this.relic.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  }
  deletePhoto(photoId: number) {
    this.relicService.deletePhoto(this.relic.id, photoId).subscribe(() => {
      this.relic.photos = this.relic.photos.filter(x => x.id != photoId)
    })
  }

}
