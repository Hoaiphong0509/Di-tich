import { LooadingInterceptor } from './_interceptors/looading.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { SharedModule } from './_modules/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { RelicCreateComponent } from './relics/relic-create/relic-create.component';
import { RelicListMemberComponent } from './relics/relic-list-member/relic-list-member.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AvatarEditorComponent } from './members/avatar-editor/avatar-editor.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { EditorInputComponent } from './_forms/editor-input/editor-input.component';
import { DetailComponent } from './detail/detail.component';
import { PhotoEditorComponent } from './relics/photo-editor/photo-editor.component';
import { RelicEditComponent } from './relics/relic-edit/relic-edit.component';
import { RelicEditMemberComponent } from './relics/relic-edit-member/relic-edit-member.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { RelicManagementComponent } from './admin/relic-management/relic-management.component';
import { RolesModalComponent } from './_modals/roles-modal/roles-modal.component';
import { ConfirmDialogComponent } from './_modals/confirm-dialog/confirm-dialog.component';
import { MemberRelicsListComponent } from './members/member-relics-list/member-relics-list.component';
import { MemberRelicsListUnapprovedComponent } from './members/member-relics-list-unapproved/member-relics-list-unapproved.component';
import { MemberRelicsListRejectComponent } from './members/member-relics-list-reject/member-relics-list-reject.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    RelicCreateComponent,
    RelicListMemberComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    AvatarEditorComponent,
    TextInputComponent,
    EditorInputComponent,
    DetailComponent,
    PhotoEditorComponent,
    RelicEditComponent,
    RelicEditMemberComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    RelicManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent,
    MemberRelicsListComponent,
    MemberRelicsListUnapprovedComponent,
    MemberRelicsListRejectComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LooadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
