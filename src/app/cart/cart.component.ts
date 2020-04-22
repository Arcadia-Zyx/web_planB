import { Component, OnInit } from '@angular/core';
import {HttpConnectionService, item, cartItem} from '../http-connection.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartList:item[]=[];
  totalPrice=0;
  temp:cartItem[]=[];
  qtyCheck={};
  address: string;

  constructor(private httpConnection:HttpConnectionService) { }
  ngOnInit() {
    this.temp=JSON.parse(sessionStorage.getItem('cart'));
    console.log(this.temp);
    this.httpConnection.getUserInfo().then(val=>{
      this.address = val.address;
    });

    if (this.temp==null) this.temp=[];
    this.fetchData();
  }

  async fetchData(){
    this.cartList=[];
    for (let i of this.temp){
      await this.httpConnection.getItemById(i._id).then(value => {
        let goods:item=value;
        if (goods!=null) {
          this.qtyCheck[goods._id]=goods.quantity;
          goods.quantity = i.quantity;
          this.cartList.push(goods);
        } else {
          alert("Error while fetching data");
        }
      });
    }
    this.totalPrice=0;
    for (let i of this.cartList){
      this.totalPrice+=i.quantity*i.price;
    }
  }

  removeItem(index:number){
    this.cartList.splice(index,1);
    this.temp.splice(index,1);
    sessionStorage.setItem('cart',JSON.stringify(this.temp));
    this.totalPrice=0;
    for (let i of this.cartList){
      this.totalPrice+=i.quantity*i.price;
    }
  }
  clearAll(){
    this.temp=[];
    this.cartList=[];
    this.totalPrice=0;
    sessionStorage.setItem('cart',JSON.stringify([]));
  }
  submitOrder() {
    if (this.cartList.length>0) {
      for (let i of this.cartList){
        if (this.qtyCheck[i._id]<i.quantity){
          alert("Sorry, the quantity of "+i.name+" exceed the limit!");
          return;
        }
      }
      this.httpConnection.placeOrder(this.cartList).then(val => {
        if (val) {
          this.clearAll();
          alert('Your order has been placed!');
        } else {
          alert('Submit order failed!');
        }
      });
    }
  }
}


