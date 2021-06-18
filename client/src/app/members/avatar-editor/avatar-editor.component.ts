import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Member } from 'src/app/_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.css']
})
export class AvatarEditorComponent implements OnInit {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.initializeUploader();

  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
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
        const photo = JSON.parse(response);
        this.member.avatar = photo;
        this.accountService.setCurrentUser(this.user);
        this.reload();
      }
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log("item uploaded" + response);
      this.reload()
    };
  }

  reload() {
    var currentUrl = this.router.url;
    var refreshUrl = currentUrl.indexOf('someRoute') > -1 ? '/someOtherRoute' : '/someRoute';
    this.router.navigateByUrl(refreshUrl).then(() => this.router.navigateByUrl(currentUrl));
  }
}
