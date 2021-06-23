import { Router } from '@angular/router';
import { MemberService } from './../_services/member.service';
import { AccountService } from './../_services/account.service';
import { User } from './../_models/user';
import { take } from 'rxjs/operators';
import { Relic } from './../_models/relic';
import { Component, OnInit } from '@angular/core';
import { RelicService } from '../_services/relic.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Member } from '../_models/member';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  relic: Relic;
  user: User;
  member: Member;

  constructor(
    private relicService: RelicService,
    private AccountService: AccountService,
    private memberService: MemberService,
    private router: Router) {
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic)
    this.AccountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    if(this.user){
      this.memberService.getMember(this.user.username).subscribe(member => this.member = member);
    }

  }

  ngOnInit(): void {
    if(!localStorage.getItem('relic')){
      this.router.navigateByUrl('/not-found')
    }else{
      this.relic = JSON.parse(localStorage.getItem('relic'))
      this.loadRelic();
      this.initgallery()
    }

  }

  //#region  loadrelic
  initgallery() {
    this.galleryOptions = [
      {
        width: '400px',
        height: '300px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewDownload: true,
      }
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.relic.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadRelic() {
    this.relicService.getRelicClient(this.relic.id).subscribe(response => {
      this.relic = response;
    }, error => {
      console.log(error)
    })
  }
  //#endregion

  //#region execute 
  editRelic(relicId: number){
    this.router.navigateByUrl('relics/edit/' + relicId)
  }

  deleteRelic(relicId: number){
    this.relicService.deleteRelic(relicId).subscribe(() => {
      localStorage.removeItem('relic')
      this.router.navigateByUrl('/');
    })
  }
  //#endregion
}
