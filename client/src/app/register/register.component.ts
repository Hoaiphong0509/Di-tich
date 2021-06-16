import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = {} as FormGroup;
  model: any ={};

  constructor(public accountService:AccountService, private router: Router) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accountService.setCurrentUser(user);
  }

  register(){
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/')
    }, error => {
      console.log(error)
    })
  }

  registerToggle(){
    this.cancelRegister.emit(false);
  }

}
