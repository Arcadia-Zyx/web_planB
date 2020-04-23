import { Component, OnInit } from '@angular/core';
import {HttpConnectionService,userInfo} from '../http-connection.service';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {AlertService} from "../alert.service";

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
              private router:Router,
              private alertService: AlertService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.httpConnection.signup(this.myAccount).then(value=>{
      if (value){
        // alert("Sign up successfully!");
        // this.alertService.success('login successfully');
        Swal.fire({
          type: 'success',
          title: 'Well Done!',
          text: 'login successfully!'
        });
        this.router.navigateByUrl('/');
      } else {
        // alert("Sign up failed!");
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Sign up failed!'
        });
      }
    });
  }
}
