import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerMode = false;
  model: any ={};


  constructor(public accountService:AccountService) { }

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
      this.cancel();
    }, error => {
      console.log(error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

}
