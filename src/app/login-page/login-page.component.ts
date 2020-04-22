import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpConnectionService} from '../http-connection.service';
import Swal from "sweetalert2";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  username:string;
  password:string;

  constructor(private httpConnection:HttpConnectionService,
              private router:Router,
              private alertService: AlertService) {

  }
  onSubmit(){
    this.httpConnection.login(this.username,this.password).then(value=>{
      if (value===false){
        // alert('Login failed!');
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Login failed!'
        });
      } else {
        this.alertService.success('login successfully');
        this.router.navigateByUrl('/');
      }
    });
  }
  ngOnInit() {
    if (this.httpConnection.status=='login'){
      // alert('You already login');
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'You already login'
      });
      this.router.navigateByUrl('/');
    }
  }

}
