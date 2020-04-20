import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpConnectionService} from '../http-connection.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  username:string;
  password:string;

  constructor(private httpConnection:HttpConnectionService,
              private router:Router) {

  }
  onSubmit(){
    this.httpConnection.login(this.username,this.password).then(value=>{
      if (value===false){
        alert('Login failed!');
      } else {
        alert('Login successfully!');
        this.router.navigateByUrl('/');
      }
    });
  }
  ngOnInit() {
    if (this.httpConnection.status=='login'){
      alert('You already login');
      this.router.navigateByUrl('/');
    }
  }

}
