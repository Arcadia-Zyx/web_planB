import { Component, OnInit } from '@angular/core';
import {HttpConnectionService} from '../http-connection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit {

  menu=[{
    name:'Home',
    address:'/'
  },{
    name:'Login',
    address:'/login'
  },{
    name:'Sign up',
    address:'/signup'
  }];

  constructor(private httpConnection:HttpConnectionService,
              private router:Router) { }

  ngOnInit() {
    if (this.httpConnection.status=='login'){
      this.menu=[{
        name:'Home',
        address:'/'
      },{
        name:'Logout',
        address:''
      },{
        name:'myAccount',
        address:'/myAccount'
      },{
        name:'Cart',
        address:'/shoppingCart'
      }];
    }
  }

  logout(){
    this.httpConnection.logout();
    alert("Logout!");
    this.menu=[{
      name:'Home',
      address:'/'
    },{
      name:'Login',
      address:'/login'
    }];
    this.router.navigateByUrl('/');
  }

}
