import { AccountService } from 'src/app/_services/account.service';
import { User } from './../../_models/user';
import { Relic } from './../../_models/relic';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { RelicService } from 'src/app/_services/relic.service';

@Component({
  selector: 'app-relic-detail',
  templateUrl: './relic-detail.component.html',
  styleUrls: ['./relic-detail.component.css']
})

export class RelicDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  relic: Relic;
  user: User;

  constructor(
    private relicService: RelicService, 
    private router: Router,
    private accountService: AccountService) {
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic);
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if (!localStorage.getItem('relic')) { 
      this.router.navigateByUrl('/not-found')
    } else {
      this.relic = JSON.parse(localStorage.getItem('relic'));
      this.loadRelic();
      this.initgallery();
    }
    // this.loadRelic();

  }

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

  deleleRelic(relicId: number){
    this.relicService.deleteRelic(relicId).subscribe(() => {
      this.router.navigateByUrl('/')
    })
  }

  editRelic(relicId: number){
    this.router.navigateByUrl('relics/edit/' + relicId)
  }

}
