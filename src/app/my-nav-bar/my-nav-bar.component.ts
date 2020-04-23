import {Component, OnInit} from '@angular/core';
import {HttpConnectionService} from '../http-connection.service';
import {Router} from '@angular/router';
import {AlertService} from "../alert.service";
import {$} from 'protractor';
import Swal from "sweetalert2";

@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit {
  public isMenuCollapsed = true;
  menu = [{
    name: 'Home',
    address: '/'
  }, {
    name: 'Login',
    address: '/login'
  }, {
    name: 'Sign up',
    address: '/signup'
  }];

  constructor(private httpConnection: HttpConnectionService,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit() {
    if (this.httpConnection.status == 'login') {
      if (this.httpConnection.isAdmin) {
        this.menu = [{
          name: 'Home',
          address: '/'
        }, {
          name: 'Logout',
          address: ''
        }, {
          name: 'Dashboard',
          address: '/admin'
        }];
      } else {
        this.menu = [{
          name: 'Home',
          address: '/'
        }, {
          name: 'Logout',
          address: ''
        }, {
          name: 'myAccount',
          address: '/myAccount'
        }, {
          name: 'Cart',
          address: '/shoppingCart'
        }];
      }
    }

  }

  logout() {
    this.httpConnection.logout();
    // alert('Logout!');
    // this.alertService.success('You have logged out');
    // Swal.fire({
    //   type: 'success',
    //   title: 'Well Done!',
    //   text: 'You have logged out!'
    // });
    this.menu = [{
      name: 'Home',
      address: '/'
    }, {
      name: 'Login',
      address: '/login'
    }, {
      name: 'Sign up',
      address: '/signup'
    }];

    this.router.navigateByUrl('/').then(()=>{
      window.location.reload();
    });
  }

  navClick(address: string) {
    this.router.navigateByUrl(address);
  }

}
