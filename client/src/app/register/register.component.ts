import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  model: any ={};

  constructor(
    public accountService:AccountService, 
    private router: Router,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.setCurrentUser();
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', this.matchValues('password')]
    })

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  setCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accountService.setCurrentUser(user);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
        ? null : {isMatching: true}
    }
  }

  register(){
    console.log(this.registerForm.value)
    // this.accountService.register(this.model).subscribe(response => {
    //   console.log(response);
    //   this.router.navigateByUrl('/')
    // }, error => {
    //   console.log(error)
    // })
  }

  // registerToggle(){
  //   this.cancelRegister.emit(false);
  // }

}
