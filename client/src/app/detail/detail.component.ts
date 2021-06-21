import { take } from 'rxjs/operators';
import { Relic } from './../_models/relic';
import { Component, OnInit } from '@angular/core';
import { RelicService } from '../_services/relic.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  relic: Relic;

  constructor(private relicService: RelicService) {
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => {
      this.relic = relic;
    })
  }

  ngOnInit(): void {
    this.loadRelic();
    this.initgallery()
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

}
