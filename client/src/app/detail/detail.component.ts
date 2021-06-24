import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Relic } from './../_models/relic';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RelicService } from '../_services/relic.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { ConfirmService } from '../_services/confirm.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  relic: Relic;
  check: boolean = false;

  constructor(
    private relicService: RelicService,
    private router: Router,
    private confirmService: ConfirmService) {
    this.relicService.currentRelic$.pipe(take(1)).subscribe(relic => this.relic = relic);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('relic')
  }


  ngOnInit(): void {
    this.loadRelic();
    this.initgallery()
  }

  loadRelic() {
    this.relicService.getRelicClient(this.relic.id).subscribe(response => {
      this.relic = response;
    }, error => {
      console.log(error)
    })
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



  //#endregion

  //#region execute 
  editRelic(relicId: number) {
    this.router.navigateByUrl('relics/edit/' + relicId)
  }

  deleteRelic(relicId: number) {
    this.confirmService.confirm('Bạn có muốn xóa bài viết này?', 'Thao tác này không thể hoàn tác').subscribe(result => {
      if (result) {
        this.relicService.deleteRelic(relicId).subscribe(() => {
          localStorage.removeItem('relic')
          this.router.navigateByUrl('/');
        })
      }
    })
  }
  //#endregion
}
