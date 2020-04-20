import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {SignupComponent} from './signup/signup.component';

const routes: Routes = [
  {
    path:'',
    component: HomepageComponent
  },{
    path:'myAccount',
    component: AccountComponent
  },{
    path:'shoppingCart',
    component: CartComponent
  },{
    path:'login',
    component: LoginPageComponent
  },{
    path:'signup',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
