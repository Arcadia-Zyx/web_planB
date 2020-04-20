import { Component, OnInit } from '@angular/core';
import {HttpConnectionService,userInfo} from '../http-connection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  myAccount:userInfo={
    username:'',
    password:'',
    lastName:'',
    firstName:'',
    phonenumber:null,
    address:'',
    role:'User'
  };

  constructor(private httpConnection:HttpConnectionService,
              private router:Router) { }

  ngOnInit() {
  }

  onSubmit(){
    this.httpConnection.signup(this.myAccount).then(value=>{
      if (value){
        alert("Sign up successfully!");
        this.router.navigateByUrl('/');
      } else {
        alert("Sign up failed!");
      }
    });
  }
}
