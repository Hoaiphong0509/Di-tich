import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs'
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { EditorModule } from "@tinymce/tinymce-angular";
import { NgDompurifyModule} from '@tinkoff/ng-dompurify';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    }),
    TabsModule.forRoot(),
    FileUploadModule,
    PaginationModule.forRoot(),
    EditorModule,
    NgDompurifyModule,
    NgxGalleryModule,
    MatSidenavModule
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    FileUploadModule,
    PaginationModule,
    EditorModule,
    NgDompurifyModule,
    NgxGalleryModule,
    MatSidenavModule
  ]
})
export class SharedModule { }