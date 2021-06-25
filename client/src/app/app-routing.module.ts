import { AdminGuard } from './_guards/admin.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { RelicEditMemberComponent } from './relics/relic-edit-member/relic-edit-member.component';
import { DetailComponent } from './detail/detail.component';
import { RelicCreateComponent } from './relics/relic-create/relic-create.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members', component: MemberListComponent},
      {path: 'members/:username', component: MemberDetailComponent},
      {path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'relics/create', component: RelicCreateComponent},
      {path: 'relics/edit/:id', component: RelicEditMemberComponent},
      {path: 'errors', component: TestErrorComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
    
    ]
  },
  {path: 'detail/:id', component: DetailComponent},
  {path: 'detail/:name', component: DetailComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
