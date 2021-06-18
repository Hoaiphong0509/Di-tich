import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../_services/account.service';
import { MemberService } from './../../_services/member.service';
import { User } from './../../_models/user';
import { Member } from 'src/app/_models/member';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { AbstractControl, FormGroup, NgForm, ValidatorFn, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @ViewChild('editAccountForm') editAccountForm: NgForm;
  member: Member;
  user: User;
  account: any = {};
  loginForm: FormGroup;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private memberService: MemberService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user
    });
  }

  ngOnInit(): void {
    this.loadMember()
    this.initializeForm();
  }


  initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', this.matchValues('password')]
    })

    this.loginForm.controls.password.valueChanges.subscribe(() => {
      this.loginForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }
  
  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member
    })
  }

  loadAccount() {
    this.accountService.currentUser$
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Lưu hồ sơ thành công')
      this.editForm.reset(this.member);
    }, error => {
      console.log(error)
      this.toastr.error('Lưu hồ sơ thất bại!')
    })
  }

  updateAccount() {
    this.accountService.updateAccount(this.account).subscribe(() => {
      this.toastr.success('Lưu tài khoản thành công')
      this.editAccountForm.reset(this.account);
    }, error => {
      console.log(error)
      this.toastr.error('Lưu tài khoản thất bại!')
    })
  }

}
