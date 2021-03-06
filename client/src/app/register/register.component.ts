import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    // this.setCurrentUser();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', this.matchValues('password')]
    })

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accountService.setCurrentUser(user);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/')
    }, error => {
      console.log(error)
    })
  }


}
