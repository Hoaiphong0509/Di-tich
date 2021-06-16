import { User } from './../_models/user';
import { AccountService } from './../_services/account.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

  login(){
    this.accountService.login(this.model).subscribe(response => {
      console.log(response)

    }, error => {
      console.log(error)
    })
  }

  logout(){
    this.accountService.logout();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }
}
